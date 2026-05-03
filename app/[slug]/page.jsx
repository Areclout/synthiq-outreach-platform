import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Category DNA — fallbacks when enrichment hasn't run yet
const DNA = {
  'Nail Salon':       { bg:'#0d0810',grad:'135deg,#2d0a2e,#0d0810',accent:'#d4a0c0',accent2:'#e8c8d8',textAccent:'#f0d0e0',ctaCol:'#1a0818',italic:true,badge:'PREMIUM NAIL STUDIO',headline:'Where beauty\nbecomes art.',sub:'Precision nail care crafted for women who deserve the best.',cta:'Book Appointment',fallback:'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1600&q=80',displayFont:'Cormorant Garamond',bodyFont:'Lato' },
  'Barbershop':       { bg:'#080c10',grad:'135deg,#0a1520,#080c10',accent:'#c9972a',accent2:'#e8b84b',textAccent:'#f0d080',ctaCol:'#080c10',italic:false,badge:'PREMIUM BARBERSHOP',headline:'Sharp cuts.\nReal respect.',sub:"Augusta's most trusted barbershop experience.",cta:'Book a Cut',fallback:'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1600&q=80',displayFont:'Oswald',bodyFont:'Barlow' },
  'Restaurant':       { bg:'#0a0600',grad:'135deg,#1a0800,#0a0600',accent:'#e8a020',accent2:'#f5c040',textAccent:'#f5d080',ctaCol:'#000',italic:true,badge:'LOCAL FAVORITE',headline:'Authentic flavors,\nevery visit.',sub:'Made fresh. Served with heart. Remembered forever.',cta:'Reserve a Table',fallback:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80',displayFont:'Playfair Display',bodyFont:'Nunito' },
  'HVAC':             { bg:'#060c18',grad:'135deg,#0a1830,#060c18',accent:'#4a9eff',accent2:'#70b8ff',textAccent:'#90ccff',ctaCol:'#060c18',italic:false,badge:'CERTIFIED HVAC PROS',headline:'Comfort you\ncan count on.',sub:'Fast reliable HVAC service — licensed insured and local.',cta:'Free Quote',fallback:'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&q=80',displayFont:'Rajdhani',bodyFont:'Open Sans' },
  'Pest Control':     { bg:'#050f05',grad:'135deg,#0a1e0a,#050f05',accent:'#5cb85c',accent2:'#7dd47d',textAccent:'#9ee09e',ctaCol:'#050f05',italic:false,badge:'LICENSED & CERTIFIED',headline:'Your home,\nprotected.',sub:'Fast safe guaranteed pest elimination.',cta:'Free Inspection',fallback:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',displayFont:'Exo 2',bodyFont:'Open Sans' },
  'Pressure Washing': { bg:'#020d1a',grad:'135deg,#041830,#020d1a',accent:'#00c4d8',accent2:'#30d8e8',textAccent:'#60e8f4',ctaCol:'#020d1a',italic:false,badge:'FULLY INSURED',headline:'Like new.\nEvery time.',sub:'Professional pressure washing that transforms your property.',cta:'Get a Quote',fallback:'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1600&q=80',displayFont:'Barlow Condensed',bodyFont:'Barlow' },
  'Auto Repair':      { bg:'#0a0a0a',grad:'135deg,#1a1008,#0a0a0a',accent:'#ff6800',accent2:'#ff8833',textAccent:'#ffaa66',ctaCol:'#fff',italic:false,badge:'ASE CERTIFIED',headline:'Your car is in\ngood hands.',sub:'Honest diagnostics. Fair prices. Done right.',cta:'Schedule Service',fallback:'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&q=80',displayFont:'Barlow Condensed',bodyFont:'Barlow' },
  'Contractor':       { bg:'#0a0806',grad:'135deg,#1a1208,#0a0806',accent:'#f09010',accent2:'#f8b040',textAccent:'#fcc870',ctaCol:'#000',italic:false,badge:'LICENSED & BONDED',headline:'Built right.\nBuilt to last.',sub:'Licensed contractors delivering quality craftsmanship.',cta:'Free Quote',fallback:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80',displayFont:'Oswald',bodyFont:'Source Sans Pro' },
  'Landscaping':      { bg:'#040c04',grad:'135deg,#081808,#040c04',accent:'#6ab840',accent2:'#88d060',textAccent:'#a8e080',ctaCol:'#040c04',italic:true,badge:'TRUSTED LANDSCAPERS',headline:'Beautiful spaces\nstart here.',sub:'Expert landscaping that transforms your outdoor living.',cta:'Free Estimate',fallback:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&q=80',displayFont:'Playfair Display',bodyFont:'Lato' },
  'Cleaning Service': { bg:'#020e10',grad:'135deg,#041820,#020e10',accent:'#00d4a8',accent2:'#20e8c0',textAccent:'#60f0d8',ctaCol:'#020e10',italic:false,badge:'FULLY INSURED',headline:'Spotless.\nEvery time.',sub:'Professional cleaning services you can trust.',cta:'Book Cleaning',fallback:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80',displayFont:'Poppins',bodyFont:'Open Sans' },
  'Plumber':          { bg:'#04091a',grad:'135deg,#081428,#04091a',accent:'#4090ff',accent2:'#60a8ff',textAccent:'#88c0ff',ctaCol:'#04091a',italic:false,badge:'LICENSED PLUMBERS',headline:'Fixed fast.\nDone right.',sub:'Licensed plumbers available when you need us most.',cta:'Call Now',fallback:'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1600&q=80',displayFont:'Oswald',bodyFont:'Roboto' },
  'Electrician':      { bg:'#0f0c00',grad:'135deg,#201800,#0f0c00',accent:'#f5c800',accent2:'#ffe040',textAccent:'#ffec80',ctaCol:'#0f0c00',italic:false,badge:'LICENSED ELECTRICIAN',headline:'Power you\ncan rely on.',sub:'Licensed electricians with fast response.',cta:'Call Now',fallback:'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&q=80',displayFont:'Exo 2',bodyFont:'Roboto' },
  'Painter':          { bg:'#0c0818',grad:'135deg,#180c2a,#0c0818',accent:'#b060f8',accent2:'#cc88ff',textAccent:'#e0b0ff',ctaCol:'#fff',italic:true,badge:'EXPERT PAINTERS',headline:'Color that\ntransforms.',sub:'Expert painting with flawless long-lasting results.',cta:'Free Quote',fallback:'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1600&q=80',displayFont:'Playfair Display',bodyFont:'Raleway' },
  'Roofer':           { bg:'#0c0806',grad:'135deg,#1c1008,#0c0806',accent:'#e85020',accent2:'#f07040',textAccent:'#f89870',ctaCol:'#fff',italic:false,badge:'LICENSED ROOFERS',headline:'Your roof.\nOur reputation.',sub:'Licensed roofers with proven results and guaranteed work.',cta:'Free Estimate',fallback:'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=1600&q=80',displayFont:'Oswald',bodyFont:'Source Sans Pro' },
}
const DEFAULT_DNA = DNA['Contractor']

export async function generateMetadata({ params }) {
  const { data } = await db.from('business_leads').select('business_name,category,city,google_rating,review_count').eq('slug', params.slug).single()
  if (!data) return { title: 'Demo Site — Synthiq' }
  return {
    title: `${data.business_name} — ${data.category} in ${data.city}, GA`,
    description: `${data.business_name} is a top-rated ${data.category} in ${data.city}, GA with ${data.review_count} Google reviews averaging ${data.google_rating}★.`,
  }
}

export default async function DemoSite({ params }) {
  const { data: lead } = await db.from('business_leads').select('*').eq('slug', params.slug).single()
  if (!lead) notFound()

  const d = DNA[lead.category] || DEFAULT_DNA

  // Use AI-enriched data if available
  const brandContent = lead.brand_content ? JSON.parse(lead.brand_content) : null
  const displayFont = lead.font_display || d.displayFont
  const bodyFont = lead.font_body || d.bodyFont
  const bg = lead.primary_color || d.bg
  const accentColor = lead.secondary_color || d.accent

  // Build gradient from bg
  const gradParts = d.grad.split(',')
  const gradDir = gradParts[0]
  const grad = `linear-gradient(${gradDir}, ${bg}ee 0%, ${bg} 60%)`

  // Headlines — AI first, fallback to DNA
  const rawHeadline = brandContent?.hero_headline_line1 && brandContent?.hero_headline_line2
    ? `${brandContent.hero_headline_line1}\n${brandContent.hero_headline_line2}`
    : d.headline
  const heroLines = rawHeadline.split('\n')
  const heroSub = brandContent?.hero_subtext || d.sub
  const tagline = lead.tagline || brandContent?.tagline || ''
  const ctaText = brandContent?.cta_text || d.cta

  const photos = lead.photo_urls || []
  const heroPhoto = photos[0] || d.fallback
  const galleryPhotos = photos.length > 1 ? photos.slice(1, 7) : []
  const reviews = (lead.google_reviews || []).filter(r => {
    const t = typeof r === 'string' ? r : r.text || ''
    return t.length > 10
  })
  const services = lead.services || []
  const rating = lead.google_rating || 4.8
  const reviewCount = lead.review_count || 0

  // Font import URL
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(displayFont)}:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=${encodeURIComponent(bodyFont)}:wght@300;400;500;600&display=swap`

  const css = `
    @import url('${fontUrl}');
    *{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{background:${bg};color:#fff;font-family:'${bodyFont}',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
    ::selection{background:${accentColor};color:#000}
    ::-webkit-scrollbar{width:3px}
    ::-webkit-scrollbar-thumb{background:${accentColor}55;border-radius:2px}
    a{text-decoration:none;color:inherit}
    .df{font-family:'${displayFont}',Georgia,serif}

    /* NAV */
    .nav{position:fixed;top:0;left:0;right:0;z-index:200;height:68px;padding:0 6%;display:flex;align-items:center;justify-content:space-between;transition:all 0.4s}
    .nav.stuck{background:${bg}f2;backdrop-filter:blur(24px);border-bottom:1px solid rgba(255,255,255,0.07)}
    .nav-brand{display:flex;align-items:center;gap:12px}
    .nav-icon{width:38px;height:38px;border-radius:50%;background:${accentColor};color:${d.ctaCol};display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;font-family:'${displayFont}',Georgia,serif;flex-shrink:0}
    .nav-title{font-size:14px;font-weight:600;color:#fff;letter-spacing:0.2px;font-family:'${bodyFont}',system-ui}
    .nav-links{display:flex;gap:32px}
    .nav-links a{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.5);transition:color 0.2s;font-family:'${bodyFont}',system-ui;font-weight:500}
    .nav-links a:hover{color:${accentColor}}
    .nav-cta{background:${accentColor};color:${d.ctaCol};padding:10px 24px;border-radius:2px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-family:'${bodyFont}',system-ui;transition:all 0.2s;white-space:nowrap}
    .nav-cta:hover{opacity:0.85;transform:translateY(-1px)}

    /* HERO */
    .hero{position:relative;height:100vh;min-height:640px;display:flex;align-items:center;overflow:hidden;background:${grad}}
    .hero-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;opacity:0.42;transform:scale(1.08);transition:transform 14s ease}
    .hero-ov1{position:absolute;inset:0;background:linear-gradient(105deg,${bg}fc 0%,${bg}c0 48%,${bg}50 100%)}
    .hero-ov2{position:absolute;inset:0;background:linear-gradient(to top,${bg} 0%,transparent 45%)}
    .hero-body{position:relative;z-index:3;padding:0 6%;width:100%;max-width:1200px;margin:0 auto}
    .hero-eyebrow{display:flex;align-items:center;gap:16px;margin-bottom:22px}
    .eline{width:50px;height:1px;background:${accentColor};opacity:0.7}
    .etag{font-size:9px;letter-spacing:4.5px;text-transform:uppercase;color:${accentColor};font-family:'${bodyFont}',system-ui;font-weight:600}
    .hero-h1{font-size:clamp(48px,7.8vw,98px);font-weight:700;line-height:0.95;letter-spacing:-1.5px;color:#fff;font-family:'${displayFont}',Georgia,serif}
    .hero-h1 em{font-style:${d.italic ? 'italic' : 'normal'};color:${accentColor}}
    .hero-tagline{font-size:clamp(13px,1.5vw,17px);color:rgba(255,255,255,0.5);line-height:1.75;max-width:450px;margin:22px 0 38px;font-weight:300;letter-spacing:0.2px}
    .hero-btns{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
    .btn-p{display:inline-block;background:${accentColor};color:${d.ctaCol};padding:15px 36px;border-radius:2px;font-size:10px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;font-family:'${bodyFont}',system-ui;transition:all 0.25s}
    .btn-p:hover{opacity:0.88;transform:translateY(-2px);box-shadow:0 8px 28px ${accentColor}44}
    .btn-s{display:inline-block;color:rgba(255,255,255,0.6);padding:15px 36px;border-radius:2px;font-size:10px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;font-family:'${bodyFont}',system-ui;transition:all 0.25s;border:1px solid rgba(255,255,255,0.18)}
    .btn-s:hover{color:#fff;border-color:rgba(255,255,255,0.55)}
    .hero-rating{display:inline-flex;align-items:center;gap:14px;margin-top:42px;padding:12px 20px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);border-radius:3px;backdrop-filter:blur(6px)}
    .stars-hero{color:${accentColor};font-size:14px;letter-spacing:2.5px}
    .rating-info{font-size:13px;color:rgba(255,255,255,0.6);font-family:'${bodyFont}',system-ui}
    .rating-info strong{color:#fff}
    .hero-scroll{position:absolute;bottom:28px;left:6%;display:flex;align-items:center;gap:12px;opacity:0.3;z-index:3}
    .hero-scroll-l{width:44px;height:1px;background:#fff}
    .hero-scroll span{font-size:9px;letter-spacing:3px;text-transform:uppercase;font-family:'${bodyFont}',system-ui}

    /* STATS */
    .stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid rgba(255,255,255,0.07);border-bottom:1px solid rgba(255,255,255,0.07)}
    .stat{padding:38px 24px;text-align:center;border-right:1px solid rgba(255,255,255,0.07);position:relative}
    .stat:last-child{border-right:none}
    .stat::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:1px;height:3px;background:${accentColor}}
    .stat-v{font-size:clamp(26px,3.2vw,42px);font-weight:700;color:${accentColor};line-height:1;margin-bottom:6px;font-family:'${displayFont}',Georgia,serif}
    .stat-k{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.28);font-family:'${bodyFont}',system-ui}

    /* SHARED SECTION STYLES */
    .sec{padding:92px 6%;max-width:1200px;margin:0 auto}
    .sec-full{padding:92px 6%;border-top:1px solid rgba(255,255,255,0.05);border-bottom:1px solid rgba(255,255,255,0.05);background:rgba(255,255,255,0.018)}
    .eyebrow{display:flex;align-items:center;gap:14px;margin-bottom:16px}
    .ey-l{width:34px;height:1px;background:${accentColor}}
    .ey-t{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:${accentColor};font-family:'${bodyFont}',system-ui;font-weight:600}
    .stitle{font-size:clamp(26px,3.6vw,48px);font-weight:700;color:#fff;line-height:1.1;letter-spacing:-0.5px;font-family:'${displayFont}',Georgia,serif}
    .ssub{font-size:15px;color:rgba(255,255,255,0.38);line-height:1.8;max-width:500px;margin-top:12px;font-weight:300}

    /* GALLERY */
    .gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin-top:48px}
    .gitem{aspect-ratio:4/3;overflow:hidden;background:rgba(255,255,255,0.05);position:relative}
    .gitem img{width:100%;height:100%;object-fit:cover;transition:transform 0.6s ease;display:block}
    .gitem:hover img{transform:scale(1.07)}
    .gitem::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,${bg}55,transparent 50%)}
    .gitem:first-child{grid-column:span 2;aspect-ratio:16/9}

    /* SERVICES */
    .svcs{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:1px;margin-top:48px;border:1px solid rgba(255,255,255,0.06)}
    .svc{padding:30px 26px;background:rgba(255,255,255,0.02);transition:background 0.3s;position:relative;overflow:hidden}
    .svc::before{content:'';position:absolute;left:0;top:0;width:2px;height:0;background:${accentColor};transition:height 0.35s ease}
    .svc:hover{background:rgba(255,255,255,0.05)}
    .svc:hover::before{height:100%}
    .svc-n{font-size:9px;color:${accentColor};font-family:'${bodyFont}',system-ui;letter-spacing:2px;margin-bottom:10px;opacity:0.55}
    .svc-name{font-size:16px;font-weight:500;color:#fff;line-height:1.35;font-family:'${displayFont}',Georgia,serif}

    /* REVIEWS */
    .revs{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:18px;margin-top:48px}
    .rev{padding:30px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.025);position:relative;transition:border-color 0.3s,transform 0.3s}
    .rev:hover{border-color:${accentColor}44;transform:translateY(-3px)}
    .rev-q{font-size:52px;line-height:0.5;color:${accentColor};opacity:0.12;margin-bottom:16px;font-family:'${displayFont}',Georgia,serif;font-weight:900}
    .rev-stars{color:${accentColor};font-size:12px;letter-spacing:2px;margin-bottom:12px}
    .rev-text{font-size:14px;color:rgba(255,255,255,0.68);line-height:1.8;font-style:italic;margin-bottom:20px;font-family:'${displayFont}',Georgia,serif}
    .rev-foot{display:flex;align-items:center;gap:10px}
    .rev-av{width:30px;height:30px;border-radius:50%;background:${accentColor}28;border:1px solid ${accentColor}44;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:${accentColor};font-family:'${bodyFont}',system-ui;flex-shrink:0}
    .rev-auth{font-size:10px;font-weight:600;color:${accentColor};letter-spacing:1px;text-transform:uppercase;font-family:'${bodyFont}',system-ui}
    .rev-src{font-size:9px;color:rgba(255,255,255,0.2);font-family:'${bodyFont}',system-ui}

    /* PRICING */
    .price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin-top:48px;border:1px solid rgba(255,255,255,0.07)}
    .pc{padding:40px 30px;background:rgba(255,255,255,0.025);position:relative;transition:background 0.3s}
    .pc:hover{background:rgba(255,255,255,0.04)}
    .pc.hot{background:${accentColor}14;border:1px solid ${accentColor}35}
    .pc-badge{position:absolute;top:-1px;left:30px;background:${accentColor};color:${d.ctaCol};font-size:9px;font-weight:700;letter-spacing:2.5px;padding:4px 14px;font-family:'${bodyFont}',system-ui;text-transform:uppercase}
    .pc-tier{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,0.28);font-family:'${bodyFont}',system-ui;margin-bottom:16px}
    .pc-price{font-size:clamp(36px,4.2vw,52px);font-weight:700;color:#fff;line-height:1;font-family:'${displayFont}',Georgia,serif}
    .pc-per{font-size:13px;font-weight:300;color:rgba(255,255,255,0.28);font-family:'${bodyFont}',system-ui}
    .pc-dep{font-size:9px;color:rgba(255,255,255,0.22);margin:7px 0 24px;font-family:'${bodyFont}',system-ui}
    .pc-div{height:1px;background:rgba(255,255,255,0.07);margin-bottom:24px}
    .pc-feats{list-style:none;margin-bottom:30px}
    .pc-feats li{font-size:12px;color:rgba(255,255,255,0.48);padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;gap:10px;font-family:'${bodyFont}',system-ui;line-height:1.4}
    .pc-feats li::before{content:'→';color:${accentColor};flex-shrink:0;font-size:10px;margin-top:2px}
    .pc.hot .pc-feats li{color:rgba(255,255,255,0.62)}
    .pc-btn{display:block;text-align:center;padding:12px;font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;font-family:'${bodyFont}',system-ui;border:1px solid rgba(255,255,255,0.14);color:rgba(255,255,255,0.45);transition:all 0.25s}
    .pc-btn:hover{background:${accentColor};color:${d.ctaCol};border-color:transparent}
    .pc.hot .pc-btn{background:${accentColor};color:${d.ctaCol};border-color:transparent}

    /* CTA */
    .cta-sec{padding:108px 6%;text-align:center;position:relative;overflow:hidden}
    .cta-sec::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:700px;border-radius:50%;background:${accentColor};opacity:0.035;filter:blur(100px);pointer-events:none}
    .cta-sec::after{content:'';position:absolute;inset:0;border-top:1px solid rgba(255,255,255,0.05);pointer-events:none}
    .cta-title{font-size:clamp(32px,5vw,66px);font-weight:700;color:#fff;line-height:1.05;letter-spacing:-1px;margin-bottom:16px;font-family:'${displayFont}',Georgia,serif;position:relative;z-index:1}
    .cta-title span{color:${accentColor};font-style:${d.italic ? 'italic' : 'normal'}}
    .cta-sub{font-size:16px;color:rgba(255,255,255,0.38);max-width:490px;margin:0 auto 44px;line-height:1.8;font-weight:300;position:relative;z-index:1}
    .cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;position:relative;z-index:1}
    .contact-strip{display:flex;justify-content:center;gap:48px;flex-wrap:wrap;margin-top:60px;padding-top:60px;border-top:1px solid rgba(255,255,255,0.06);position:relative;z-index:1}
    .cs{text-align:center}
    .cs-l{font-size:8px;letter-spacing:3.5px;text-transform:uppercase;color:rgba(255,255,255,0.2);font-family:'${bodyFont}',system-ui;margin-bottom:8px}
    .cs-v{font-size:14px;color:rgba(255,255,255,0.7);font-family:'${bodyFont}',system-ui}
    .cs-v a{color:rgba(255,255,255,0.7);transition:color 0.2s}
    .cs-v a:hover{color:${accentColor}}

    /* FOOTER */
    .footer{padding:26px 6%;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.05)}
    .foot-l{font-size:11px;color:rgba(255,255,255,0.16);font-family:'${bodyFont}',system-ui;line-height:1.9}
    .foot-r{font-size:12px;color:rgba(255,255,255,0.1);font-family:'${bodyFont}',system-ui}
    .foot-r span{color:${accentColor}55}

    @media(max-width:900px){
      .nav-links{display:none}
      .stats{grid-template-columns:repeat(2,1fr)}
      .price-grid{grid-template-columns:1fr}
      .gallery{grid-template-columns:1fr 1fr}
      .gitem:first-child{grid-column:span 2;aspect-ratio:16/9}
      .contact-strip{gap:28px}
      .footer{flex-direction:column;gap:10px;text-align:center}
    }
    @media(max-width:600px){
      .sec{padding:68px 5%}
      .sec-full{padding:68px 5%}
      .svcs{grid-template-columns:1fr 1fr}
      .revs{grid-template-columns:1fr}
      .hero-btns{flex-direction:column;align-items:flex-start}
      .gallery{grid-template-columns:1fr}
      .gitem:first-child{grid-column:span 1;aspect-ratio:4/3}
      .cta-btns{flex-direction:column;align-items:center}
    }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <nav className="nav" id="sitenav">
        <div className="nav-brand">
          <div className="nav-icon">{lead.business_name[0]}</div>
          <span className="nav-title">{lead.business_name}</span>
        </div>
        <div className="nav-links">
          {['Gallery','Services','Reviews','Pricing','Contact'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}>{l}</a>
          ))}
        </div>
        <a href={`tel:${lead.phone}`} className="nav-cta">{ctaText}</a>
      </nav>

      <section className="hero">
        <img src={heroPhoto} alt={lead.business_name} className="hero-photo" id="heroPhoto" />
        <div className="hero-ov1" />
        <div className="hero-ov2" />
        <div className="hero-body">
          <div className="hero-eyebrow">
            <div className="eline" />
            <span className="etag">{d.badge} · {lead.city.toUpperCase()}, GA</span>
          </div>
          <h1 className="hero-h1 df">
            {heroLines.map((line, i) => (
              <span key={i} style={{ display:'block' }}>
                {i === 1 ? <em>{line}</em> : line}
              </span>
            ))}
          </h1>
          {tagline && (
            <p style={{ fontSize:'clamp(11px,1.2vw,14px)', letterSpacing:'3px', textTransform:'uppercase', color:accentColor, fontFamily:`'${bodyFont}',system-ui`, fontWeight:500, marginTop:18, opacity:0.75 }}>
              {tagline}
            </p>
          )}
          <p className="hero-tagline">{heroSub}</p>
          <div className="hero-btns">
            <a href={`tel:${lead.phone}`} className="btn-p">{ctaText}</a>
            <a href="#reviews" className="btn-s">Read Reviews</a>
          </div>
          {reviewCount > 0 && (
            <div className="hero-rating">
              <span className="stars-hero">{'★'.repeat(Math.round(rating))}</span>
              <span className="rating-info"><strong>{rating}</strong> · {reviewCount.toLocaleString()} Google Reviews</span>
            </div>
          )}
        </div>
        <div className="hero-scroll">
          <div className="hero-scroll-l" />
          <span>Explore</span>
        </div>
      </section>

      <div className="stats">
        {[
          { v:`${rating}★`, k:'Google Rating' },
          { v:reviewCount > 0 ? reviewCount.toLocaleString() : '—', k:'Reviews' },
          { v:lead.city, k:'Location' },
          { v:lead.category, k:'Specialty' },
        ].map(s => (
          <div className="stat" key={s.k}>
            <div className="stat-v df">{s.v}</div>
            <div className="stat-k">{s.k}</div>
          </div>
        ))}
      </div>

      {galleryPhotos.length > 0 && (
        <div id="gallery">
          <div className="sec">
            <div className="eyebrow"><div className="ey-l"/><span className="ey-t">Our work</span></div>
            <h2 className="stitle df">See for yourself.</h2>
            <div className="gallery">
              {galleryPhotos.map((url, i) => (
                <div className="gitem" key={i}>
                  <img src={url} alt={`${lead.business_name} ${i+1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {services.length > 0 && (
        <div className="sec-full" id="services">
          <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
            <div className="eyebrow"><div className="ey-l"/><span className="ey-t">What we offer</span></div>
            <h2 className="stitle df">Our Services</h2>
            <p className="ssub">Everything you need, delivered with expertise.</p>
            <div className="svcs">
              {services.map((svc, i) => (
                <div className="svc" key={i}>
                  <div className="svc-n">0{i+1}</div>
                  <div className="svc-name df">{typeof svc === 'string' ? svc : svc.name || ''}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <div id="reviews">
          <div className="sec">
            <div className="eyebrow"><div className="ey-l"/><span className="ey-t">Real customers</span></div>
            <h2 className="stitle df">What people say.</h2>
            <p className="ssub">Verified reviews directly from Google.</p>
            <div className="revs">
              {reviews.slice(0,6).map((rev, i) => {
                const text = typeof rev === 'string' ? rev : rev.text || rev.review_text || ''
                const author = typeof rev === 'string' ? 'Customer' : rev.author_name || rev.author || 'Customer'
                if (!text) return null
                return (
                  <div className="rev" key={i}>
                    <div className="rev-q">"</div>
                    <div className="rev-stars">★★★★★</div>
                    <p className="rev-text">{text}</p>
                    <div className="rev-foot">
                      <div className="rev-av">{author[0]}</div>
                      <div>
                        <div className="rev-auth">{author}</div>
                        <div className="rev-src">Google Review</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="sec-full" id="pricing">
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div className="eyebrow"><div className="ey-l"/><span className="ey-t">Simple pricing</span></div>
          <h2 className="stitle df">No surprises. No contracts.</h2>
          <p className="ssub">This demo was built free. If you love it, choose a plan — live in 7 days.</p>
          <div className="price-grid">
            {[
              { tier:'Starter', price:'$47', per:'/mo', feats:['Site on synthiq subdomain','Mobile-first design','Click-to-call button','Google reviews featured','Basic SEO setup'] },
              { tier:'Standard', price:'$97', per:'/mo', hot:true, feats:['Your own custom domain','Everything in Starter','Monthly updates','Google Analytics','Priority support'] },
              { tier:'Pro', price:'$197', per:'/mo', feats:['Everything in Standard','Online booking','Automated review requests','Local SEO','Social media feed'] },
            ].map(p => (
              <div className={`pc${p.hot?' hot':''}`} key={p.tier}>
                {p.hot && <div className="pc-badge">Most Popular</div>}
                <div className="pc-tier">{p.tier}</div>
                <div><span className="pc-price df">{p.price}</span><span className="pc-per">{p.per}</span></div>
                <div className="pc-dep">$200 deposit · cancel anytime</div>
                <div className="pc-div"/>
                <ul className="pc-feats">{p.feats.map((f,i) => <li key={i}>{f}</li>)}</ul>
                <a href="mailto:ly@synthiqdesigns.com" className="pc-btn">Get Started</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="cta-sec" id="contact">
        <div className="eyebrow" style={{ justifyContent:'center' }}>
          <div className="ey-l"/><span className="ey-t">Ready to go live?</span><div className="ey-l"/>
        </div>
        <h2 className="cta-title df">Let's make it<br /><span>officially yours.</span></h2>
        <p className="cta-sub">This demo was built free by Synthiq. Reply to the email you received and we'll have your real site live within 7 days. Price, features, timeline — all negotiable.</p>
        <div className="cta-btns">
          <a href={`mailto:ly@synthiqdesigns.com?subject=I want to go live — ${lead.business_name}`} className="btn-p">Email Ly Now</a>
          {lead.phone && <a href={`tel:${lead.phone}`} className="btn-s">{lead.phone}</a>}
        </div>
        <div className="contact-strip">
          {lead.phone && <div className="cs"><div className="cs-l">Phone</div><div className="cs-v"><a href={`tel:${lead.phone}`}>{lead.phone}</a></div></div>}
          {lead.address && <div className="cs"><div className="cs-l">Address</div><div className="cs-v" style={{fontSize:13}}>{lead.address}</div></div>}
          {lead.hours && Object.keys(lead.hours).length > 0 && (
            <div className="cs">
              <div className="cs-l">Hours</div>
              <div className="cs-v" style={{fontSize:12,lineHeight:2}}>
                {Object.entries(lead.hours).slice(0,3).map(([day,hrs]) => (
                  <div key={day}><span style={{color:'rgba(255,255,255,0.3)',fontSize:9,letterSpacing:'1.5px'}}>{day.slice(0,3).toUpperCase()}</span>&nbsp;&nbsp;{hrs}</div>
                ))}
              </div>
            </div>
          )}
          <div className="cs"><div className="cs-l">Built by</div><div className="cs-v"><a href="mailto:ly@synthiqdesigns.com">ly@synthiqdesigns.com</a></div></div>
        </div>
      </section>

      <footer className="footer">
        <div className="foot-l">
          © 2026 {lead.business_name} · {lead.city}, GA<br/>
          <span style={{opacity:0.55,fontSize:10}}>Demo website built free by Synthiq · not yet live</span>
        </div>
        <div className="foot-r">synth<span>iq</span></div>
      </footer>

      <script dangerouslySetInnerHTML={{ __html: `
        var nav=document.getElementById('sitenav'),ph=document.getElementById('heroPhoto');
        window.addEventListener('scroll',function(){
          var y=window.scrollY;
          if(y>60)nav.classList.add('stuck');else nav.classList.remove('stuck');
          if(ph)ph.style.transform='scale(1.08) translateY('+(y*0.1)+'px)';
        },{passive:true});
      `}} />
    </>
  )
}
