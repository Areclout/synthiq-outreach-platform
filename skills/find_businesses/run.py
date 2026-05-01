#!/usr/bin/env python3
"""
Synthiq Lead Scraper v2 — Smart 3-Layer Strategy
Layer 1: No website on Google Maps
Layer 2: Has website listed but it 404s / is broken / unreachable
Layer 3: Has a website but it's outdated (no mobile, no contact form, ancient design)

Also scrapes: all available photos, social links, hours, reviews, emails
"""

import os, sys, json, urllib.request, urllib.parse, urllib.error, re, time, socket

API_KEY = os.environ.get("GOOGLE_MAPS_API_KEY", "")

# ─── CATEGORIES ───────────────────────────────────────────────────────────────
CATEGORIES = [
    "nail salon", "barbershop", "restaurant", "mexican restaurant",
    "auto repair", "mechanic", "contractor", "plumber", "electrician",
    "roofer", "landscaping", "pest control", "pressure washing",
    "cleaning service", "painter", "hvac", "tree service", "flooring",
    "daycare", "dentist", "massage", "tattoo shop", "gym", "car wash",
    "pizza", "chinese restaurant", "hair salon", "laundromat", "storage",
]

LOCATIONS = [
    ("Augusta, Georgia",      33.4735, -82.0105),
    ("Evans, Georgia",        33.5371, -82.1321),
    ("Martinez, Georgia",     33.5182, -82.0977),
    ("Grovetown, Georgia",    33.4540, -82.1968),
    ("Harlem, Georgia",       33.4151, -82.3157),
    ("Thomson, Georgia",      33.4718, -82.5057),
    ("Waynesboro, Georgia",   33.0898, -82.0146),
    ("Aiken, South Carolina", 33.5604, -81.7196),
    ("North Augusta, SC",     33.5051, -81.9646),
    ("Edgefield, SC",         33.7891, -81.9296),
]

CATEGORY_THEMES = {
    "nail salon":          {"palette": "rose-champagne",  "emoji": "💅", "hero": "luxury"},
    "barbershop":          {"palette": "black-gold",       "emoji": "✂️",  "hero": "bold"},
    "restaurant":          {"palette": "burgundy-gold",    "emoji": "🍽️", "hero": "warm"},
    "mexican restaurant":  {"palette": "red-amber",        "emoji": "🌮",  "hero": "vibrant"},
    "auto repair":         {"palette": "red-gunmetal",     "emoji": "🚗",  "hero": "industrial"},
    "mechanic":            {"palette": "red-gunmetal",     "emoji": "🔩",  "hero": "industrial"},
    "contractor":          {"palette": "slate-amber",      "emoji": "🏗️", "hero": "professional"},
    "plumber":             {"palette": "blue-steel",       "emoji": "🔧",  "hero": "clean"},
    "electrician":         {"palette": "yellow-dark",      "emoji": "⚡",  "hero": "bold"},
    "roofer":              {"palette": "charcoal-red",     "emoji": "🏠",  "hero": "professional"},
    "landscaping":         {"palette": "green-earth",      "emoji": "🌿",  "hero": "outdoor"},
    "pest control":        {"palette": "green-brown",      "emoji": "🛡",  "hero": "clean"},
    "pressure washing":    {"palette": "blue-steel",       "emoji": "💦",  "hero": "clean"},
    "cleaning service":    {"palette": "teal-white",       "emoji": "✨",  "hero": "fresh"},
    "painter":             {"palette": "warm-cream",       "emoji": "🎨",  "hero": "creative"},
    "hvac":                {"palette": "blue-orange",      "emoji": "❄️",  "hero": "professional"},
    "tree service":        {"palette": "green-earth",      "emoji": "🌳",  "hero": "outdoor"},
    "flooring":            {"palette": "walnut-cream",     "emoji": "🪵",  "hero": "warm"},
    "daycare":             {"palette": "orange-sky",       "emoji": "🧒",  "hero": "friendly"},
    "dentist":             {"palette": "mint-white",       "emoji": "🦷",  "hero": "clean"},
    "massage":             {"palette": "purple-gold",      "emoji": "💆",  "hero": "luxury"},
    "tattoo shop":         {"palette": "black-crimson",    "emoji": "🎨",  "hero": "bold"},
    "gym":                 {"palette": "black-neon",       "emoji": "💪",  "hero": "energy"},
    "car wash":            {"palette": "blue-steel",       "emoji": "🚿",  "hero": "clean"},
    "pizza":               {"palette": "red-cream",        "emoji": "🍕",  "hero": "warm"},
    "chinese restaurant":  {"palette": "red-gold",         "emoji": "🥡",  "hero": "warm"},
    "hair salon":          {"palette": "purple-rose",      "emoji": "💇",  "hero": "luxury"},
    "laundromat":          {"palette": "blue-white",       "emoji": "🫧",  "hero": "clean"},
    "storage":             {"palette": "slate-amber",      "emoji": "📦",  "hero": "professional"},
}

# ─── LAYER 2: CHECK IF WEBSITE IS BROKEN ─────────────────────────────────────
def is_website_broken(url, timeout=6):
    """
    Returns (is_broken: bool, reason: str)
    Broken = 404, connection refused, timeout, SSL error, redirect loop, etc.
    """
    if not url:
        return False, ""
    try:
        # Clean URL
        if not url.startswith("http"):
            url = "https://" + url
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15"
        })
        with urllib.request.urlopen(req, timeout=timeout) as r:
            code = r.getcode()
            content = r.read(8000).decode("utf-8", errors="ignore").lower()
            # Check for 404 page content even on 200 response
            if any(x in content for x in ["404", "page not found", "this site can't be reached", "coming soon", "under construction", "parked domain", "domain for sale", "buy this domain"]):
                return True, "404_content"
            if code >= 400:
                return True, f"http_{code}"
            return False, ""
    except urllib.error.HTTPError as e:
        return True, f"http_{e.code}"
    except urllib.error.URLError as e:
        return True, f"url_error: {str(e.reason)[:60]}"
    except socket.timeout:
        return True, "timeout"
    except Exception as e:
        return True, f"error: {str(e)[:60]}"

# ─── LAYER 3: CHECK IF WEBSITE IS OUTDATED ───────────────────────────────────
def is_website_outdated(url, timeout=8):
    """
    Returns (is_outdated: bool, reasons: list)
    Outdated signals: no viewport meta, no https, no contact form, tables for layout, 
    copyright year < 2020, no phone link, flash/java references
    """
    if not url:
        return False, []
    try:
        if not url.startswith("http"):
            url = "https://" + url
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        with urllib.request.urlopen(req, timeout=timeout) as r:
            content = r.read(15000).decode("utf-8", errors="ignore").lower()

        reasons = []
        if 'name="viewport"' not in content and "viewport" not in content:
            reasons.append("not_mobile_friendly")
        if not url.startswith("https"):
            reasons.append("no_https")
        if not any(x in content for x in ['<form', 'contact', 'email us', 'send message']):
            reasons.append("no_contact_form")
        if any(x in content for x in ['<table', '<td', '<tr']) and 'class=' not in content[:3000]:
            reasons.append("table_layout")
        if any(f"© {y}" in content or f"copyright {y}" in content for y in ["2015","2016","2017","2018","2019"]):
            reasons.append("outdated_copyright")
        if any(x in content for x in ['flash', 'shockwave', 'java plugin']):
            reasons.append("uses_flash")
        if 'tel:' not in content and 'phone' not in content:
            reasons.append("no_click_to_call")

        is_outdated = len(reasons) >= 2
        return is_outdated, reasons
    except:
        return False, []

# ─── GOOGLE PLACES API ────────────────────────────────────────────────────────
def search_places(query, lat, lng, limit=20):
    url = "https://places.googleapis.com/v1/places:searchText"
    payload = json.dumps({
        "textQuery": query,
        "maxResultCount": min(limit, 20),
        "locationBias": {
            "circle": {
                "center": {"latitude": lat, "longitude": lng},
                "radius": 20000.0
            }
        }
    }).encode()
    req = urllib.request.Request(url, data=payload, headers={
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.rating,places.userRatingCount,places.websiteUri,places.photos,places.types,places.regularOpeningHours,places.businessStatus,places.googleMapsUri"
    }, method="POST")
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())

def get_place_details(place_id):
    """Get full details including reviews, hours, editorial summary"""
    url = f"https://places.googleapis.com/v1/places/{place_id}"
    req = urllib.request.Request(url, headers={
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "reviews,editorialSummary,regularOpeningHours,photos,priceLevel"
    })
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())

def get_photo_url(photo_name, max_width=1600):
    return f"https://places.googleapis.com/v1/{photo_name}/media?maxWidthPx={max_width}&key={API_KEY}"

# ─── EMAIL SCRAPER ────────────────────────────────────────────────────────────
def find_email_from_website(website_url, timeout=6):
    """Scrape emails directly from business website"""
    if not website_url:
        return ""
    try:
        if not website_url.startswith("http"):
            website_url = "https://" + website_url
        req = urllib.request.Request(website_url, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        with urllib.request.urlopen(req, timeout=timeout) as r:
            content = r.read(30000).decode("utf-8", errors="ignore")
        emails = re.findall(r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}', content)
        skip = ["google","schema","example","sentry","w3.org","goo.gl","googleapis","base44","facebook","yelp","jquery","bootstrap","cloudflare","amazonaws","apple"]
        filtered = [e for e in emails if not any(x in e.lower() for x in skip) and len(e) < 60]
        return filtered[0] if filtered else ""
    except:
        return ""

def find_email_google(business_name, city, website=None):
    """Try Google search for email, then fallback to website scrape"""
    if website:
        email = find_email_from_website(website)
        if email:
            return email
    try:
        q = urllib.parse.urlencode({"q": f'"{business_name}" {city} email contact site:facebook.com OR site:yelp.com OR site:yellowpages.com'})
        req = urllib.request.Request(
            f"https://www.google.com/search?{q}",
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        )
        with urllib.request.urlopen(req, timeout=6) as r:
            content = r.read().decode("utf-8", errors="ignore")
        emails = re.findall(r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}', content)
        skip = ["google","schema","example","sentry","w3.org","goo.gl","googleapis","base44","facebook","yelp","jquery","bootstrap"]
        filtered = [e for e in emails if not any(x in e.lower() for x in skip) and len(e) < 60]
        return filtered[0] if filtered else ""
    except:
        return ""

# ─── SOCIAL LINK SCRAPER ─────────────────────────────────────────────────────
def find_social_links(business_name, city):
    """Find Facebook/Instagram links for business"""
    socials = {}
    try:
        q = urllib.parse.urlencode({"q": f'"{business_name}" {city} facebook instagram'})
        req = urllib.request.Request(
            f"https://www.google.com/search?{q}",
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        )
        with urllib.request.urlopen(req, timeout=6) as r:
            content = r.read().decode("utf-8", errors="ignore")
        fb = re.findall(r'https?://(?:www\.)?facebook\.com/[a-zA-Z0-9./?=_\-]+', content)
        ig = re.findall(r'https?://(?:www\.)?instagram\.com/[a-zA-Z0-9./?=_\-]+', content)
        if fb: socials["facebook"] = fb[0]
        if ig: socials["instagram"] = ig[0]
    except:
        pass
    return socials

# ─── SLUG ─────────────────────────────────────────────────────────────────────
def slugify(name):
    slug = re.sub(r'[^a-zA-Z0-9\s]', '', name)
    slug = re.sub(r'\s+', '', slug.title())
    return slug[:60]

# ─── HOURS FORMATTER ─────────────────────────────────────────────────────────
def format_hours(opening_hours):
    if not opening_hours:
        return []
    return opening_hours.get("weekdayDescriptions", [])

# ─── MAIN ─────────────────────────────────────────────────────────────────────
category  = sys.argv[1] if len(sys.argv) > 1 else "restaurant"
loc_input = sys.argv[2] if len(sys.argv) > 2 else "Augusta, Georgia"
limit     = int(sys.argv[3]) if len(sys.argv) > 3 else 10
mode      = sys.argv[4] if len(sys.argv) > 4 else "all"  # "no_website" | "broken" | "outdated" | "all"

loc = next((l for l in LOCATIONS if l[0].lower() == loc_input.lower()), LOCATIONS[0])
loc_name, lat, lng = loc
city_name = loc_name.split(",")[0].strip()

print(f"\n🔍 Synthiq Lead Scraper v2", file=sys.stderr)
print(f"   Category: {category} | Location: {loc_name} | Mode: {mode} | Limit: {limit}", file=sys.stderr)
print(f"   Strategy: Layer 1 (no website) + Layer 2 (broken site) + Layer 3 (outdated)", file=sys.stderr)

try:
    search_result = search_places(f"{category} in {loc_name}", lat, lng, 20)
except Exception as e:
    print(f"❌ Search failed: {e}", file=sys.stderr)
    print("[]"); sys.exit(1)

places = search_result.get("places", [])
print(f"   Found {len(places)} raw places to analyze...", file=sys.stderr)

results = []
seen = set()

for place in places:
    if len(results) >= limit:
        break

    place_id = place.get("id")
    if not place_id or place_id in seen:
        continue
    seen.add(place_id)

    # Skip permanently closed
    if place.get("businessStatus") == "CLOSED_PERMANENTLY":
        continue

    biz_name = place.get("displayName", {}).get("text", "")
    if not biz_name:
        continue

    website = place.get("websiteUri", "")
    
    # ── DETERMINE LEAD LAYER ──────────────────────────────────────────────────
    lead_layer = None
    lead_reason = ""
    
    if not website:
        # Layer 1: No website at all
        if mode in ("all", "no_website"):
            lead_layer = 1
            lead_reason = "No website listed on Google Maps"
    else:
        # Check Layer 2: Website exists but is broken
        if mode in ("all", "broken"):
            broken, reason = is_website_broken(website)
            if broken:
                lead_layer = 2
                lead_reason = f"Website broken: {reason}"
                print(f"  💀 {biz_name} — broken site ({reason})", file=sys.stderr)
        
        # Check Layer 3: Website exists but is outdated
        if lead_layer is None and mode in ("all", "outdated"):
            outdated, reasons = is_website_outdated(website)
            if outdated:
                lead_layer = 3
                lead_reason = f"Outdated website: {', '.join(reasons)}"
                print(f"  📟 {biz_name} — outdated site ({', '.join(reasons)})", file=sys.stderr)

    if lead_layer is None:
        print(f"  ⏭  {biz_name} — skipped (good website or no match)", file=sys.stderr)
        continue

    # ── ENRICH WITH FULL DETAILS ──────────────────────────────────────────────
    print(f"  ✓ [{lead_layer}] {biz_name} | ⭐{place.get('rating',0)} | {lead_reason[:50]}", file=sys.stderr)

    # Get reviews + editorial summary
    reviews_data = []
    editorial = ""
    opening_hours = place.get("regularOpeningHours", {})
    
    try:
        details = get_place_details(place_id)
        for rv in details.get("reviews", [])[:6]:
            txt = rv.get("text", {}).get("text", "")
            if txt and len(txt) > 20:
                reviews_data.append({
                    "text": txt[:400],
                    "author": rv.get("authorAttribution", {}).get("displayName", "Customer"),
                    "rating": rv.get("rating", 5)
                })
        ed = details.get("editorialSummary", {})
        editorial = ed.get("text", "")
        if not opening_hours:
            opening_hours = details.get("regularOpeningHours", {})
        # Also pick up more photos from details
        detail_photos = details.get("photos", [])
    except Exception as e:
        detail_photos = []

    # Photos — combine from search + detail call, deduplicate
    search_photos = place.get("photos", [])
    all_photo_names = list({p["name"] for p in search_photos + detail_photos})
    photo_urls = [get_photo_url(p, 1600) for p in all_photo_names[:12]]  # Up to 12 photos

    # Email — try website first, then Google
    email = find_email_google(biz_name, city_name, website if lead_layer > 1 else None)

    # Social links
    socials = find_social_links(biz_name, city_name)

    # Hours
    hours_list = format_hours(opening_hours)

    # Theme
    cat_key = category.lower()
    theme = CATEGORY_THEMES.get(cat_key, {"palette": "slate-indigo", "emoji": "⭐", "hero": "professional"})

    biz = {
        "business_name": biz_name,
        "phone": place.get("nationalPhoneNumber", ""),
        "email": email,
        "address": place.get("formattedAddress", ""),
        "city": city_name,
        "category": category.title(),
        "google_rating": place.get("rating", 0),
        "review_count": place.get("userRatingCount", 0),
        "has_website": bool(website),
        "website_url": website,
        "demo_site_slug": slugify(biz_name),
        "google_reviews": [r["text"] for r in reviews_data],
        "google_reviews_full": reviews_data,
        "photo_urls": photo_urls,
        "theme_palette": theme["palette"],
        "theme_hero": theme["hero"],
        "theme_emoji": theme["emoji"],
        "editorial_summary": editorial,
        "opening_hours": hours_list,
        "social_facebook": socials.get("facebook", ""),
        "social_instagram": socials.get("instagram", ""),
        "google_maps_url": place.get("googleMapsUri", ""),
        "lead_layer": lead_layer,         # 1=no site, 2=broken, 3=outdated
        "lead_reason": lead_reason,        # why we flagged them
        "status": "found",
    }
    results.append(biz)
    time.sleep(0.4)

print(f"\n✅ Total leads found: {len(results)}", file=sys.stderr)
print(json.dumps(results))
