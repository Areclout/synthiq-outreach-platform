#!/usr/bin/env python3
"""
Synthiq Business Research Engine
Deep-researches a business before site build.
Extracts: logo, colors, fonts, photos, reviews, services, social links, owner, story, hours, awards
"""

import os, sys, json, urllib.request, urllib.parse, urllib.error, re, time

API_KEY = os.environ.get("GOOGLE_MAPS_API_KEY", "")

def google_search(query, num=5):
    try:
        q = urllib.parse.urlencode({"q": query})
        req = urllib.request.Request(
            f"https://www.google.com/search?{q}&num={num}",
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120"}
        )
        with urllib.request.urlopen(req, timeout=8) as r:
            return r.read().decode("utf-8", errors="ignore")
    except:
        return ""

def scrape_url(url, timeout=8, max_bytes=50000):
    try:
        if not url.startswith("http"):
            url = "https://" + url
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15"
        })
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read(max_bytes).decode("utf-8", errors="ignore")
    except:
        return ""

def extract_emails(text):
    emails = re.findall(r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}', text)
    skip = ["google","schema","example","sentry","w3","goo.gl","googleapis","base44","facebook",
            "yelp","jquery","bootstrap","cloudflare","amazonaws","apple","wix","squarespace",
            "godaddy","wordpress","adobe","instagram","twitter"]
    return [e for e in emails if not any(x in e.lower() for x in skip) and len(e) < 60]

def extract_phones(text):
    phones = re.findall(r'[\+\(]?\d[\d\s\-\(\)\.]{7,}\d', text)
    return [p.strip() for p in phones[:5] if len(p.strip()) >= 10]

def extract_colors_from_css(text):
    """Extract hex colors and rgb values from CSS/HTML"""
    hex_colors = re.findall(r'#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b', text)
    rgb_colors = re.findall(r'rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)', text)
    
    # Filter out pure white/black/grey
    filtered = []
    for c in hex_colors:
        if len(c) == 3:
            c = c[0]*2 + c[1]*2 + c[2]*2
        r, g, b = int(c[0:2],16), int(c[2:4],16), int(c[4:6],16)
        # Skip near-white, near-black, near-grey
        if not (r > 240 and g > 240 and b > 240):  # not white
            if not (r < 20 and g < 20 and b < 20):   # not black
                if not (abs(r-g) < 15 and abs(g-b) < 15 and abs(r-b) < 15 and r > 100 and r < 200):  # not grey
                    filtered.append(f"#{c}")
    return list(dict.fromkeys(filtered))[:6]  # deduplicate, take top 6

def extract_fonts_from_css(text):
    """Extract Google Fonts or font-family declarations"""
    google_fonts = re.findall(r'fonts\.googleapis\.com/css[^"\']*family=([^"\'&]+)', text)
    font_families = re.findall(r'font-family\s*:\s*["\']?([A-Za-z][A-Za-z\s]+)["\']?', text)
    
    fonts = []
    for gf in google_fonts:
        # Parse "Playfair+Display:wght@400" -> "Playfair Display"
        name = gf.split(":")[0].split("|")[0].replace("+", " ").strip()
        if name and len(name) > 2:
            fonts.append(name)
    for ff in font_families[:5]:
        ff = ff.strip().strip("'\"")
        if ff and ff.lower() not in ["serif","sans-serif","monospace","inherit","initial","arial","helvetica"]:
            fonts.append(ff)
    return list(dict.fromkeys(fonts))[:4]

def extract_logo(html, base_url=""):
    """Try to find logo image URL"""
    patterns = [
        r'<img[^>]+(?:class|id|alt)=["\'][^"\']*logo[^"\']*["\'][^>]+src=["\']([^"\']+)["\']',
        r'<img[^>]+src=["\']([^"\']+)["\'][^>]+(?:class|id|alt)=["\'][^"\']*logo[^"\']*["\']',
        r'(?:logo|brand)[^<]*<img[^>]+src=["\']([^"\']+)["\']',
    ]
    for p in patterns:
        m = re.search(p, html, re.IGNORECASE)
        if m:
            src = m.group(1)
            if src.startswith("//"):
                src = "https:" + src
            elif src.startswith("/") and base_url:
                domain = re.match(r'https?://[^/]+', base_url)
                if domain:
                    src = domain.group(0) + src
            if src.startswith("http") and any(ext in src.lower() for ext in [".png",".jpg",".svg",".webp",".jpeg"]):
                return src
    return ""

def search_google_maps(business_name, city):
    """Use Places API to get full business details"""
    if not API_KEY:
        return {}
    try:
        url = "https://places.googleapis.com/v1/places:searchText"
        payload = json.dumps({
            "textQuery": f"{business_name} {city}",
            "maxResultCount": 1,
        }).encode()
        req = urllib.request.Request(url, data=payload, headers={
            "Content-Type": "application/json",
            "X-Goog-Api-Key": API_KEY,
            "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.rating,places.userRatingCount,places.websiteUri,places.photos,places.regularOpeningHours,places.editorialSummary,places.priceLevel,places.googleMapsUri,places.businessStatus"
        }, method="POST")
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
        places = data.get("places", [])
        if not places:
            return {}
        place = places[0]
        
        # Get reviews separately
        place_id = place.get("id","")
        reviews = []
        if place_id:
            rev_req = urllib.request.Request(
                f"https://places.googleapis.com/v1/places/{place_id}",
                headers={
                    "X-Goog-Api-Key": API_KEY,
                    "X-Goog-FieldMask": "reviews,photos"
                }
            )
            with urllib.request.urlopen(rev_req, timeout=10) as r:
                rev_data = json.loads(r.read())
            for rv in rev_data.get("reviews", [])[:8]:
                txt = rv.get("text", {}).get("text", "")
                if txt and len(txt) > 20:
                    reviews.append({
                        "text": txt[:500],
                        "author": rv.get("authorAttribution", {}).get("displayName", "Customer"),
                        "rating": rv.get("rating", 5),
                        "time": rv.get("relativePublishTimeDescription", "")
                    })
            # Extra photos
            extra_photos = [p["name"] for p in rev_data.get("photos", [])]
        else:
            extra_photos = []
        
        # Photo URLs
        all_photos = [p["name"] for p in place.get("photos", [])] + extra_photos
        all_photos = list(dict.fromkeys(all_photos))[:12]
        photo_urls = [f"https://places.googleapis.com/v1/{p}/media?maxWidthPx=1600&key={API_KEY}" for p in all_photos]
        
        # Hours
        hours = place.get("regularOpeningHours", {}).get("weekdayDescriptions", [])
        
        return {
            "name": place.get("displayName", {}).get("text", business_name),
            "address": place.get("formattedAddress", ""),
            "phone": place.get("nationalPhoneNumber", ""),
            "rating": place.get("rating", 0),
            "review_count": place.get("userRatingCount", 0),
            "website": place.get("websiteUri", ""),
            "editorial": place.get("editorialSummary", {}).get("text", ""),
            "maps_url": place.get("googleMapsUri", ""),
            "hours": hours,
            "photo_urls": photo_urls,
            "reviews": reviews,
        }
    except Exception as e:
        print(f"  Maps API error: {e}", file=sys.stderr)
        return {}

def scrape_yelp(business_name, city):
    """Search Yelp for business info"""
    try:
        q = urllib.parse.urlencode({"find_desc": business_name, "find_loc": city})
        html = scrape_url(f"https://www.yelp.com/search?{q}", max_bytes=30000)
        if not html:
            return {}
        
        # Try to find Yelp listing URL
        links = re.findall(r'href="(/biz/[^"?]+)"', html)
        if not links:
            return {}
        
        biz_html = scrape_url(f"https://www.yelp.com{links[0]}", max_bytes=50000)
        
        # Extract rating
        rating_m = re.search(r'"ratingValue"\s*:\s*([\d.]+)', biz_html)
        rating = float(rating_m.group(1)) if rating_m else 0
        
        # Extract reviews
        review_texts = re.findall(r'"text"\s*:\s*\{"localizedValue"\s*:\s*"([^"]{30,400})"', biz_html)[:5]
        
        # Extract photos
        photo_urls = re.findall(r'https://s3-media\d+\.fl\.yelpcdn\.com/bphoto/[^"\']+(?:o\.jpg|o\.jpeg|o\.png)', biz_html)[:8]
        
        # Extract categories
        cats = re.findall(r'"title"\s*:\s*"([^"]+)".*?"alias"\s*:\s*"[^"]*"', biz_html)[:3]
        
        return {
            "yelp_rating": rating,
            "yelp_reviews": review_texts,
            "yelp_photos": photo_urls,
            "yelp_categories": cats,
        }
    except Exception as e:
        print(f"  Yelp scrape error: {e}", file=sys.stderr)
        return {}

def scrape_facebook(business_name, city):
    """Search for Facebook page"""
    try:
        html = google_search(f'"{business_name}" {city} site:facebook.com')
        fb_links = re.findall(r'https?://(?:www\.)?facebook\.com/(?:pages/)?([a-zA-Z0-9.\-_/]+)', html)
        # Filter out generic FB pages
        skip = ["groups","events","marketplace","login","signup","help"]
        fb_links = [l for l in fb_links if not any(s in l.lower() for s in skip)]
        
        if not fb_links:
            return {}
        
        fb_url = f"https://www.facebook.com/{fb_links[0]}"
        fb_html = scrape_url(fb_url, max_bytes=40000)
        
        # Extract description/about
        desc = ""
        desc_m = re.search(r'"description"\s*:\s*"([^"]{20,500})"', fb_html)
        if desc_m:
            desc = desc_m.group(1)
        
        # Extract cover/profile photos
        fb_photos = re.findall(r'https://[^"\']+fbcdn\.net/[^"\']+(?:\.jpg|\.jpeg|\.png)[^"\']*', fb_html)[:6]
        
        return {
            "facebook_url": fb_url,
            "facebook_description": desc,
            "facebook_photos": fb_photos,
        }
    except Exception as e:
        print(f"  Facebook scrape error: {e}", file=sys.stderr)
        return {}

def scrape_existing_website(url):
    """Scrape existing website for brand data: colors, fonts, logo, copy"""
    if not url:
        return {}
    try:
        html = scrape_url(url, max_bytes=60000)
        if not html:
            return {}
        
        colors = extract_colors_from_css(html)
        fonts = extract_fonts_from_css(html)
        logo = extract_logo(html, url)
        emails = extract_emails(html)
        phones = extract_phones(html)
        
        # Extract tagline / hero text
        taglines = []
        for tag in ["h1","h2"]:
            matches = re.findall(rf'<{tag}[^>]*>([^<]{{10,120}})</{tag}>', html, re.IGNORECASE)
            taglines.extend([re.sub(r'\s+', ' ', m).strip() for m in matches[:3]])
        
        # Extract meta description
        meta_desc = ""
        m = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']', html, re.IGNORECASE)
        if m:
            meta_desc = m.group(1)[:300]
        
        # Extract about/story text
        about_matches = re.findall(r'(?:about|our story|who we are)[^<]*</[^>]+>\s*<[^>]+>([^<]{50,400})', html, re.IGNORECASE)
        about_text = about_matches[0] if about_matches else ""
        
        return {
            "brand_colors": colors,
            "brand_fonts": fonts,
            "logo_url": logo,
            "existing_emails": emails[:2],
            "existing_phones": phones[:2],
            "taglines": taglines[:4],
            "meta_description": meta_desc,
            "about_text": about_text[:400],
        }
    except Exception as e:
        print(f"  Website scrape error: {e}", file=sys.stderr)
        return {}

def find_instagram(business_name, city):
    """Find Instagram handle and recent posts"""
    try:
        html = google_search(f'"{business_name}" {city} instagram.com')
        ig_links = re.findall(r'https?://(?:www\.)?instagram\.com/([a-zA-Z0-9._]+)/?', html)
        skip = ["p","reel","stories","explore","accounts","instagram","reels"]
        ig_handles = [h for h in ig_links if h.lower() not in skip and len(h) > 2]
        if not ig_handles:
            return {}
        handle = ig_handles[0]
        return {
            "instagram_handle": handle,
            "instagram_url": f"https://www.instagram.com/{handle}",
        }
    except:
        return {}

def detect_brand_vibe(name, category, reviews, description):
    """Analyze collected data to suggest brand direction"""
    text = f"{name} {description} {' '.join(r.get('text','') for r in reviews[:5])}".lower()
    
    vibes = []
    if any(w in text for w in ["luxury","premium","upscale","elegant","sophisticated","high-end","exclusive"]):
        vibes.append("luxury")
    if any(w in text for w in ["family","friendly","welcoming","community","local","neighborhood"]):
        vibes.append("family")
    if any(w in text for w in ["authentic","traditional","original","classic","heritage","since","years"]):
        vibes.append("authentic")
    if any(w in text for w in ["modern","new","fresh","trendy","cool","aesthetic","vibe","instagram"]):
        vibes.append("modern")
    if any(w in text for w in ["bold","strong","powerful","best","top","#1","number one"]):
        vibes.append("bold")
    
    return vibes if vibes else ["professional"]

# ─── MAIN ─────────────────────────────────────────────────────────────────────
business_name = sys.argv[1] if len(sys.argv) > 1 else "Business"
city          = sys.argv[2] if len(sys.argv) > 2 else "Augusta, Georgia"

print(f"\n🔬 Synthiq Research Engine", file=sys.stderr)
print(f"   Business: {business_name} | City: {city}", file=sys.stderr)

result = {
    "business_name": business_name,
    "city": city,
    "research_timestamp": time.strftime("%Y-%m-%d %H:%M"),
}

# 1. Google Maps / Places API
print("  [1/5] Google Maps...", file=sys.stderr)
maps_data = search_google_maps(business_name, city)
result.update(maps_data)
time.sleep(0.5)

# 2. Existing website scrape
website = maps_data.get("website", "")
if website:
    print(f"  [2/5] Scraping website: {website[:60]}...", file=sys.stderr)
    site_data = scrape_existing_website(website)
    result.update(site_data)
    time.sleep(0.5)
else:
    print("  [2/5] No website to scrape", file=sys.stderr)
    result["brand_colors"] = []
    result["brand_fonts"] = []
    result["logo_url"] = ""

# 3. Yelp
print("  [3/5] Yelp...", file=sys.stderr)
yelp_data = scrape_yelp(business_name, city)
result.update(yelp_data)
time.sleep(0.5)

# 4. Facebook
print("  [4/5] Facebook...", file=sys.stderr)
fb_data = scrape_facebook(business_name, city)
result.update(fb_data)
time.sleep(0.5)

# 5. Instagram
print("  [5/5] Instagram...", file=sys.stderr)
ig_data = find_instagram(business_name, city)
result.update(ig_data)

# 6. Brand vibe detection
reviews = result.get("reviews", [])
desc = result.get("editorial", "") + " " + result.get("facebook_description", "")
result["brand_vibes"] = detect_brand_vibe(business_name, "", reviews, desc)

# Consolidate all photos
all_photos = (
    result.get("photo_urls", []) +
    result.get("yelp_photos", []) +
    result.get("facebook_photos", [])
)
result["all_photos"] = list(dict.fromkeys(all_photos))[:16]

# Summary
print(f"\n✅ Research Complete:", file=sys.stderr)
print(f"   📸 Photos: {len(result['all_photos'])}", file=sys.stderr)
print(f"   ⭐ Reviews: {len(result.get('reviews', []))}", file=sys.stderr)
print(f"   🎨 Brand colors: {result.get('brand_colors', [])}", file=sys.stderr)
print(f"   🔤 Fonts: {result.get('brand_fonts', [])}", file=sys.stderr)
print(f"   🏷  Logo: {'found' if result.get('logo_url') else 'not found'}", file=sys.stderr)
print(f"   💬 Vibe: {result.get('brand_vibes', [])}", file=sys.stderr)
print(f"   📘 Facebook: {'found' if result.get('facebook_url') else 'not found'}", file=sys.stderr)
print(f"   📸 Instagram: {'found' if result.get('instagram_url') else 'not found'}", file=sys.stderr)

print(json.dumps(result))
