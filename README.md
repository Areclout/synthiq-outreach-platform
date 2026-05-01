# 🏢 Synthiq — Automated Local Business Outreach Platform

> Built by **Ly** · Synthiq Web Design · Augusta, Georgia

---

## 🧠 What This Is

Synthiq is a fully automated pipeline that finds local businesses with no websites, builds them a personalized demo site, and cold emails them a pitch — all without manual work.

**The core loop:**
1. **Find** → Search Google Maps for local businesses in Augusta, GA that have no website
2. **Research** → Scrape their Google Maps listing, Facebook, Yelp for real photos, reviews, hours, logo, and brand colors
3. **Build** → Generate a unique, high-converting demo site tailored to their exact business category and branding
4. **Pitch** → Send a personalized cold email from Synthiq101@gmail.com with a direct link to their demo
5. **Track** → Monitor replies, manage leads, and convert prospects from a command-center dashboard

---

## 🏗️ Architecture

```
synthiq-outreach-platform/
├── pages/                    # React frontend (Base44 mini-app)
│   ├── Dashboard.jsx         # Lead command center — filter, email, track status
│   ├── BusinessSite.jsx      # Dynamic demo site renderer (all categories)
│   ├── ElegantNailsSite.jsx  # Bespoke site — Elegant Nails & Spa (showcase)
│   └── Home.jsx              # Landing page
│
├── functions/                # Deno backend functions (serverless)
│   ├── getLeads.ts           # Fetch all leads (bypasses RLS via service role)
│   ├── getLeadBySlug.ts      # Fetch single lead by demo site slug
│   ├── sendPitchEmail.ts     # Send cold email via Gmail API
│   └── handleGmailReply.ts  # Detect and log reply emails
│
├── skills/                   # Reusable AI agent scripts
│   ├── find_businesses/      # Google Maps scraper — finds no-website businesses
│   ├── research_business/    # Deep business research (photos, reviews, logo, colors)
│   └── send_pitch_email/     # Email dispatch skill
│
├── entities/
│   └── BusinessLead.json     # Database schema for leads
│
└── docs/
    └── site_design_intelligence.md  # Design system rules for all site builds
```

---

## 🎯 The Business Model

**Target:** Local businesses near Augusta, GA (Evans, Martinez, Grovetown, North Augusta)  
**Categories:** Nail salons, barbershops, restaurants, pest control, pressure washing, HVAC, auto repair, landscaping, contractors, cleaning services

**Value proposition:**
- We build a FREE demo site for the business before asking for anything
- The demo uses their real photos, real reviews, real branding
- Cold email shows them the demo — they can see the value immediately
- Convert to a paid client: custom domain, live site, ongoing management

---

## 💡 Site Generation System

Every demo site is built with a **category-aware design system** (`docs/site_design_intelligence.md`):

- **12+ business categories** each with their own color palette, font pairing, hero layout, and section order
- **10 hero layout types** — never the same layout twice
- **Real data only** — real photos from Google Maps, verbatim reviews, actual hours, clickable phone numbers
- **Mobile-first** — sticky nav, click-to-call, large tap targets
- **Trust signals baked in** — star ratings, review counts, years in business, guarantees

---

## 📊 Lead Database Schema

Each `BusinessLead` record tracks the full lifecycle:

| Field | Description |
|---|---|
| `business_name` | Business name |
| `category` | Business type (Nail Salon, Barbershop, etc.) |
| `phone` | Click-to-call phone |
| `email` | Contact email for outreach |
| `address` / `city` | Location |
| `google_rating` / `review_count` | Google data |
| `photo_urls` | Real photos scraped from Google |
| `google_reviews_full` | Verbatim reviews with author + rating |
| `demo_site_slug` | URL slug for the demo site |
| `demo_site_url` | Full URL to their personalized demo |
| `email_sent` / `email_sent_date` | Outreach tracking |
| `email_replied` / `email_reply_text` | Response tracking |
| `status` | Pipeline stage: found → site_built → contacted → replied → converted |
| `approved` | Manual approval before emailing |
| `notes` | Internal notes |

---

## 🔄 Pipeline Stages

```
found → site_built → approved → contacted → replied → converted
```

- **found** — scraped from Google Maps, no action yet
- **site_built** — demo site generated and live
- **approved** — manually reviewed and cleared for outreach
- **contacted** — cold email sent
- **replied** — business replied (triggers alert on dashboard)
- **converted** — signed as a paying client 💰

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React (JSX), inline styles, Base44 mini-app |
| Backend | Deno (TypeScript), Base44 serverless functions |
| Database | Base44 entities (JSON schema, RLS) |
| Email | Gmail API via OAuth connector |
| Business Data | Google Maps / Places API |
| Automation | Base44 scheduled + connector automations |
| Agent | Base44 Superagent (AI orchestration layer) |

---

## 📧 Cold Email Strategy

**Subject:** `I built a free website for [Business Name] — take a look`

**Approach:**
- Personal, not corporate — signed from "Ly" not "Synthiq Marketing Team"
- No ask upfront — just "I built this for free, take a look"
- Demo URL is the CTA — let the site sell itself
- Reply = automatic detection → dashboard alert → follow up

---

## 🚀 How to Extend This

- **Scale to new cities** → Update the `find_businesses` skill with a new location
- **Add new business categories** → Extend the design rules in `docs/site_design_intelligence.md`
- **Add automated follow-ups** → Scheduled automation to re-email non-openers after 5 days
- **Add a pricing page** → Build a `/Pricing` page businesses land on after the demo CTA
- **Add Stripe** → Collect deposits directly from interested businesses via the demo site

---

## 📍 Current Status

- ✅ 40+ leads scraped across Augusta area
- ✅ 10 bespoke demo sites built (Elegant Nails, GoForth Pest Control, Like New Pressure Washing, etc.)
- ✅ Cold email system live (Gmail API)
- ✅ Reply detection running (automated watcher)
- ✅ Dashboard operational
- 🔄 Active outreach in progress

---

*Synthiq — We build the site first. You decide after.*
