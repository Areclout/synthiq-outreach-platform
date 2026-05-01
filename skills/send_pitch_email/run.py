#!/usr/bin/env python3
"""
Synthiq - High-converting cold pitch email for a business lead
"""

import os
import sys
import json
import base64
import urllib.request

GMAIL_TOKEN = os.environ.get("GMAIL_ACCESS_TOKEN", "")
FROM_EMAIL = "Synthiq101@gmail.com"
APP_BASE_URL = "https://the-bank-app-53a5c1b7.base44.app"

def send_email(to_email, subject, body_html):
    import email.mime.multipart
    import email.mime.text
    msg = email.mime.multipart.MIMEMultipart("alternative")
    msg["From"] = f"Synthiq Web Design <{FROM_EMAIL}>"
    msg["To"] = to_email
    msg["Subject"] = subject
    part = email.mime.text.MIMEText(body_html, "html")
    msg.attach(part)
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    payload = json.dumps({"raw": raw}).encode()
    req = urllib.request.Request(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        data=payload,
        headers={"Authorization": f"Bearer {GMAIL_TOKEN}", "Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read())

lead_json = sys.argv[1] if len(sys.argv) > 1 else sys.stdin.read()
lead = json.loads(lead_json)

business_name = lead.get("business_name", "")
city          = lead.get("city", "Augusta")
category      = lead.get("category", "business")
rating        = lead.get("google_rating", "")
review_count  = lead.get("review_count", 0)
demo_slug     = lead.get("demo_site_slug", "")
to_email      = lead.get("email", "")
demo_url      = f"{APP_BASE_URL}/BusinessSite?slug={demo_slug}"

if not to_email:
    print(json.dumps({"error": "No email address for this lead"}))
    sys.exit(1)

# ─── Dynamic personalization ───────────────────────────────────────────────────
cat_lower = category.lower()

# Category-specific benefit line
cat_benefits = {
    "nail salon":   ("bring in new clients every week from Google Search — people searching "right now" for nails in your area", "nail clients book online. A website with a booking form means you fill your chair without ever answering another cold call."),
    "restaurant":   ("get discovered on Google every single day — people searching 'best food near me' RIGHT NOW", "diners check a restaurant's website before they walk in. No website = lost tables, every single night."),
    "barber shop":  ("book out your chairs automatically — clients can book online 24/7 without calling", "people search 'barber near me' on their phone constantly. Without a website, they're booking with your competitor instead."),
    "auto repair":  ("build trust before they even call you — customers research mechanics online before choosing one", "people facing car trouble Google for help immediately. A professional website is the difference between their call going to you or someone else."),
    "lawn care":    ("generate leads on autopilot — homeowners searching for lawn services book online", "seasonal leads are gold. A website with a quote form captures them before they scroll past you."),
    "pest control": ("capture emergency leads — people with pest problems search and call the first business they trust", "pest problems are urgent. A polished website with reviews = the first business they call. That's you."),
}
benefit_hook, benefit_why = cat_benefits.get(cat_lower, (
    f"get found on Google by customers in {city} searching RIGHT NOW",
    "97% of people search online before visiting a local business. No website = invisible to almost everyone."
))

# Stars visual
stars_html = ""
if rating:
    full = int(float(rating))
    stars_html = "⭐" * full + ("½" if float(rating) - full >= 0.5 else "")

# Review urgency hook
review_line = ""
if review_count and float(str(review_count)) > 0:
    review_line = f"<p style='margin:0 0 12px;font-size:15px;color:#444;'>You've already got <strong>{stars_html} {rating} stars from {review_count} happy customers</strong>. That social proof is gold — but right now it's just sitting on Google where new customers can't easily find it. A website puts that front and center, 24/7.</p>"
else:
    review_line = f"<p style='margin:0 0 12px;font-size:15px;color:#444;'>Building reviews is one of the fastest ways to grow trust — and we include an <strong>automated review request system</strong> so your happy customers actually leave feedback without you having to ask every time.</p>"

subject = f"I already built a website for {business_name} — take a look 👀"

body_html = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header bar -->
  <tr>
    <td style="background:linear-gradient(135deg,#1a0030,#3b0060);border-radius:16px 16px 0 0;padding:28px 40px;text-align:center;">
      <p style="margin:0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#c9a84c;font-weight:600;">Synthiq Web Design</p>
      <h1 style="margin:10px 0 0;font-size:26px;color:#ffffff;font-weight:300;letter-spacing:-0.5px;">
        We built something for you,<br/>
        <span style="font-style:italic;color:#c9a84c;font-weight:400;">{business_name}.</span>
      </h1>
    </td>
  </tr>

  <!-- Demo site preview banner -->
  <tr>
    <td style="background:#2d004d;padding:0;text-align:center;">
      <div style="padding:20px 40px;background:rgba(201,168,76,0.08);border-bottom:1px solid rgba(201,168,76,0.2);">
        <p style="margin:0 0 12px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.5);">Your free demo site is live right now</p>
        <a href="{demo_url}" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#e8c96a);color:#0a0805;font-size:15px;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:16px 36px;border-radius:4px;text-decoration:none;">
          👁 VIEW YOUR WEBSITE →
        </a>
        <p style="margin:12px 0 0;font-size:11px;color:rgba(255,255,255,0.35);">{demo_url}</p>
      </div>
    </td>
  </tr>

  <!-- Main body -->
  <tr>
    <td style="background:#ffffff;padding:40px 40px 32px;border-radius:0 0 0 0;">

      <!-- Opening hook -->
      <p style="margin:0 0 18px;font-size:16px;color:#1a1a2e;font-weight:700;line-height:1.4;">
        Hi {business_name} — I was searching for {cat_lower}s in {city} and noticed you don't have a website yet.
      </p>
      <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">
        So I built one for you — <strong>completely free, no strings attached.</strong> Take a look, and if it excites you even a little, know that <strong>everything you see is fully negotiable</strong>: the price, the timeline, the features. This demo is just a starting point — the real version gets built <em>around you</em>, to your exact vision.
      </p>
      <div style="background:#f0f9ff;border-left:3px solid #7b3fe4;border-radius:4px;padding:14px 20px;margin:0 0 20px;">
        <p style="margin:0;font-size:14px;color:#1a1a2e;line-height:1.7;">
          🎨 <strong>Don't like the colors? Want a different layout? Need a booking system, a price menu, a loyalty program?</strong> Just say the word. We customize everything — and we won't stop until you're proud to show it off.
        </p>
      </div>

      <!-- The opportunity -->
      <div style="background:#f9f5ff;border-left:3px solid #c9a84c;border-radius:4px;padding:16px 20px;margin:0 0 20px;">
        <p style="margin:0;font-size:15px;color:#2d004d;line-height:1.7;font-weight:500;">
          💡 Right now, people in {city} are searching Google for exactly what you offer — and without a website, they're finding your competitors instead.
        </p>
      </div>

      <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">
        A professional website lets you <strong>{benefit_hook}.</strong>
      </p>
      <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.7;">
        Here's the real talk: <strong>{benefit_why}</strong>
      </p>

      <!-- Divider -->
      <hr style="border:none;border-top:1px solid #f0e8ff;margin:0 0 24px;"/>

      <!-- What your site includes -->
      <p style="margin:0 0 14px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#c9a84c;font-weight:700;">What's already built for you</p>
      <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
        {"".join([f"""
        <tr>
          <td style="padding:7px 0;font-size:14px;color:#333;vertical-align:top;">
            <span style="color:#c9a84c;font-weight:700;margin-right:8px;">{icon}</span>{point}
          </td>
        </tr>""" for icon, point in [
            ("✅", f"Your business name, phone & address — click-to-call on mobile"),
            ("✅", f"Professional design built specifically for a {cat_lower} in {city}"),
            ("✅", f"Your real Google reviews shown front and center"),
            ("✅", f"Photo gallery showcasing your work"),
            ("✅", f"Online contact/booking form — customers can reach you 24/7"),
            ("✅", f"Fully mobile-responsive — looks great on every phone"),
            ("✅", f"SEO-ready — Google can start finding you right away"),
        ]])}
      </table>

      <!-- Reviews section -->
      <hr style="border:none;border-top:1px solid #f0e8ff;margin:0 0 24px;"/>
      <p style="margin:0 0 14px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#c9a84c;font-weight:700;">Your reviews = your biggest asset</p>
      {review_line}
      <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.7;">
        We also offer an <strong>automated review request system</strong> — after every appointment or visit, your customers automatically receive a friendly text or email asking them to leave a Google review. More 5-star reviews = more trust = more customers. It runs itself.
      </p>
      <div style="background:#fffbf0;border:1px solid #f0d580;border-radius:8px;padding:14px 18px;margin:0 0 24px;">
        <p style="margin:0;font-size:14px;color:#7a5c00;line-height:1.6;">
          ⭐ <strong>Businesses with 10+ reviews get 3.5× more website clicks</strong> than those with fewer. We make getting those reviews automatic.
        </p>
      </div>

      <!-- What we can add / customization -->
      <hr style="border:none;border-top:1px solid #f0e8ff;margin:0 0 24px;"/>
      <p style="margin:0 0 14px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#c9a84c;font-weight:700;">We build it your way</p>
      <p style="margin:0 0 12px;font-size:15px;color:#444;line-height:1.7;">
        This demo is just the start. Tell us what you want and we'll make it happen:
      </p>
      <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
        {"".join([f"""
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#333;vertical-align:top;">
            <span style="color:#9b59b6;margin-right:8px;">→</span>{item}
          </td>
        </tr>""" for item in [
            "Online booking system integrated directly into your site",
            "Your own custom domain (e.g. ElegantNailsSpa.com)",
            "Special offers, promotions & seasonal deals page",
            "Loyalty program or gift card section",
            "Social media feed (Instagram, Facebook) embedded live",
            "Live chat widget so customers can message you instantly",
            "Menu / price list / service catalog with photos",
            "Staff profiles & bios to build personal connection",
            "Anything else you have in mind — seriously, just ask",
        ]])}
      </table>

      <!-- Pricing / negotiation -->
      <div style="background:linear-gradient(135deg,#1a0030,#2d004d);border-radius:12px;padding:24px 28px;margin:0 0 24px;text-align:center;">
        <p style="margin:0 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#c9a84c;font-weight:700;">Flexible Pricing — Let's Talk</p>
        <p style="margin:0 0 14px;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.7;">
          We're not a big agency with a fixed price sheet. We're a local team and we work with your budget. One-time build, monthly plan, payment plan — whatever works for you. <strong style="color:#c9a84c;">Let's figure it out together.</strong>
        </p>
        <a href="{demo_url}" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#e8c96a);color:#0a0805;font-size:14px;font-weight:800;letter-spacing:1px;padding:14px 32px;border-radius:4px;text-decoration:none;">
          SEE YOUR SITE + LET'S TALK PRICE →
        </a>
      </div>

      <!-- Social proof stat -->
      <div style="background:#f9fffe;border:1px solid #c3eed6;border-radius:8px;padding:14px 18px;margin:0 0 24px;">
        <p style="margin:0;font-size:14px;color:#1a5e3a;line-height:1.6;">
          📈 <strong>Businesses that go from no website to a professional site see an average 30–40% increase in new customer inquiries within the first 90 days.</strong>
        </p>
      </div>

      <!-- CTA / close -->
      <hr style="border:none;border-top:1px solid #f0e8ff;margin:0 0 24px;"/>
      <p style="margin:0 0 12px;font-size:16px;color:#1a1a2e;font-weight:700;">Here's all I'm asking:</p>
      <p style="margin:0 0 12px;font-size:15px;color:#444;line-height:1.7;">
        Take 60 seconds and <a href="{demo_url}" style="color:#7b3fe4;font-weight:700;">look at your free website</a>. Tell me what you think. Tell me what you'd change. Tell me what you'd add.
      </p>
      <p style="margin:0 0 20px;font-size:15px;color:#444;line-height:1.7;">
        I want you to be <strong>proud of the final product</strong> — and I'll work with you until you are. Just reply to this email and let's talk.
      </p>

      <p style="margin:0 0 4px;font-size:15px;color:#333;">Talk soon,</p>
      <p style="margin:0 0 2px;font-size:16px;color:#1a1a2e;font-weight:700;">Ly</p>
      <p style="margin:0 0 2px;font-size:14px;color:#7b3fe4;font-weight:600;">Synthiq Web Design</p>
      <p style="margin:0;font-size:13px;color:#999;"><a href="mailto:{FROM_EMAIL}" style="color:#c9a84c;">{FROM_EMAIL}</a></p>

    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#1a0030;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
      <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.3);letter-spacing:1px;">
        SYNTHIQ WEB DESIGN · AUGUSTA, GEORGIA
      </p>
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);">
        You're receiving this because your business was found without a website on Google Maps. Reply "remove" to unsubscribe.
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>"""

result = send_email(to_email, subject, body_html)
print(json.dumps({"success": True, "message_id": result.get("id"), "to": to_email, "demo_url": demo_url}))
