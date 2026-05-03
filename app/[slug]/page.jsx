import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ── CATEGORY DNA ─────────────────────────────────────────────────────────────
const DNA = {
  'Nail Salon': {
    bg: '#0d0810', accent: '#c9a96e', accent2: '#e8c99a', light: '#f7f0e8',
    heroImg: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1600&q=80',
    heroImg2: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1600&q=80',
    font: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
    displayFont: '"Cormorant Garamond", Georgia, serif',
    headline: 'Where beauty\nbecomes art.',
    sub: 'Precision nail care for the woman who demands the best.',
    cta: 'Book Your Appointment',
    badge: 'PREMIUM NAIL STUDIO',
    overlay: 'linear-gradient(110deg, rgba(13,8,16,0.97) 0%, rgba(13,8,16,0.85) 45%, rgba(13,8,16,0.4) 100%)',
    accentStyle: 'italic',
  },
  'Barbershop': {
    bg: '#080c10', accent: '#c9972a', accent2: '#e8b84b', light: '#f5ede0',
    heroImg: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1600&q=80',
    font: '"Bebas Neue", "Oswald", Impact, sans-serif',
    displayFont: '"Bebas Neue", "Oswald", sans-serif',
    headline: 'SHARP CUTS.\nREAL RESPECT.',
    sub: 'Augusta\'s finest barbershop experience.',
    cta: 'Book a Cut',
    badge: 'PREMIUM BARBERSHOP',
    overlay: 'linear-gradient(110deg, rgba(8,12,16,0.98) 0%, rgba(8,12,16,0.88) 50%, rgba(8,12,16,0.3) 100%)',
    accentStyle: 'normal',
  },
  'Restaurant': {
    bg: '#0a0600', accent: '#e8a020', accent2: '#f5c040', light: '#fff8f0',
    heroImg: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80',
    font: '"Playfair Display", Georgia, serif',
    displayFont: '"Playfair Display", Georgia, serif',
    headline: 'Authentic flavors,\nevery visit.',
    sub: 'Made fresh. Served with heart. Remembered forever.',
    cta: 'Reserve a Table',
    badge: 'LOCAL FAVORITE',
    overlay: 'linear-gradient(110deg, rgba(10,6,0,0.97) 0%, rgba(10,6,0,0.85) 50%, rgba(10,6,0,0.35) 100%)',
    accentStyle: 'italic',
  },
  'HVAC': {
    bg: '#060c18', accent: '#2d8bff', accent2: '#60aaff', light: '#eef4ff',
    heroImg: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&q=80',
    font: '"Inter", system-ui, sans-serif',
    displayFont: 'system-ui, sans-serif',
    headline: 'Comfort you\ncan count on.',
    sub: 'Fast, reliable HVAC service — licensed, insured, and local.',
    cta: 'Get a Free Quote',
    badge: 'CERTIFIED HVAC PROS',
    overlay: 'linear-gradient(110deg, rgba(6,12,24,0.97) 0%, rgba(6,12,24,0.88) 50%, rgba(6,12,24,0.3) 100%)',
    accentStyle: 'normal',
  },
  'Pest Control': {
    bg: '#050f05', accent: '#4caf50', accent2: '#81c784', light: '#f1f8f1',
    heroImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
    font: 'system-ui, sans-serif',
    displayFont: 'system-ui, sans-serif',
    headline: 'Your home,\nprotected.',
    sub: 'Fast, safe, and guaranteed pest elimination.',
    cta: 'Get Free Inspection',
    badge: 'LICENSED & CERTIFIED',
    overlay: 'linear-gradient(110deg, rgba(5,15,5,0.97) 0%, rgba(5,15,5,0.88) 50%, rgba(5,15,5,0.3) 100%)',
    accentStyle: 'normal',
  },
  'Pressure Washing': {
    bg: '#020d1a', accent: '#00b4d8', accent2: '#48cae4', light: '#e8f7fb',
    heroImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
    font: 'system-ui, sans-serif',
    displayFont: 'system-ui, sans-serif',
    headline: 'Like new.\nEvery time.',
    sub: 'Professional pressure washing that transforms your property.',
    cta: 'Get a Quote',
    badge: 'FULLY INSURED',
    overlay: 'linear-gradient(110deg, rgba(2,13,26,0.97) 0%, rgba(2,13,26,0.88) 50%, rgba(2,13,26,0.3) 100%)',
    accentStyle: 'normal',
  },
  'Auto Repair': {
    bg: '#0a0a0a', accent: '#ff6000', accent2: '#ff8533', light: '#fff3ee',
    heroImg: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&q=80',
    font: 'system-ui, sans-serif',
    displayFont: 'system-ui, sans-serif',
    headline: 'Your car is in\ngood hands.',
    sub: 'Honest diagnostics. Fair prices. Done right the first time.',
    cta: 'Schedule Service',
    badge: 'ASE CERTIFIED',
    overlay: 'linear-gradient(110deg, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.88) 50%, rgba(10,10,10,0.3) 100%)',
    accentStyle: 'normal',
  },
  'Contractor': {
    bg: '#0a0806', accent: '#f0900a', accent2: '#f5b042', light: '#fdf5e8',
    heroImg: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80',
    font: 'system-ui, sans-serif',
    displayFont: 'system-ui, sans-serif',
    headline: 'Built right.\nBuilt to last.',
    sub: 'Licensed contractors delivering quality craftsmanship.',
    cta: 'Get a Free Quote',
    badge: 'LICENSED & BONDED',
    overlay: 'linear-gradient(110deg, rgba(10,8,6,0.97) 0%, rgba(10,8,6,0.88) 50%, rgba(10,8,6,0.3) 100%)',
    accentStyle: 'normal',
  },
  'Landscaping': {
    bg: '#040c04', accent: '#5a9e3a', accent2: '#7bc95a', light: '#f0f8ee',
    heroImg: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&q=80',
    font: '"Playfair Display", Georgia, serif',
    displayFont: '"Playfair Display", Georgia, serif',
    headline: 'Beautiful spaces\nstart here.',
    sub: 'Expert landscaping that transforms your outdoor living.',
    cta: 'Get a Free Quote',
    badge: 'TRUSTED LANDSCAPERS',
    overlay: 'linear-gradient(110deg, rgba(4,12,4,0.96) 0%, rgba(4,12,4,0.85) 50%, rgba(4,12,4,0.2) 100%)',
    accentStyle: 'italic',
  },
  'Cleaning Service': {
    bg: '#020e10', accent: '#00c4a0', accent2: '#00e8bc', light: '#e8fbf8',
    heroImg: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80',
    font: 'system-ui, sans-serif',
    displayFont: 'system-ui, sans-serif',
    headline: 'Spotless.\nEvery time.',
    sub: 'Professional cleaning services you can trust completely.',
    cta: 'Book a Cleaning',
    badge: 'FULLY INSURED',
    overlay: 'linear-gradient(110deg, rgba(2,14,16,0.97) 0%, rgba(2,14,16,0.88) 50%, rgba(2,14,16,0.3) 100%)',
    accentStyle: 'normal',
  },
  'Plumber': {
    bg: '#04091a', accent: '#3a8fff', accent2: '#6aaeff', light: '#eef4ff',
    heroImg: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1600&q=80',
    font: 'system-ui, sans-serif',
    displayFont: 'system-ui, sans-serif',
    headline: 'Fixed fast.\nDone right.',
    sub: 'Licensed plumbers, available when you need us most.',
    cta: 'Call Now',
    badge: 'LICENSED PLUMBERS',
    overlay: 'linear-gradient(110deg, rgba(4,9,26,0.97) 0%, rgba(4,9,26,0.88) 50%, rgba(4,9,26,0.3) 100%)',
    accentStyle: 'normal',
  },
  'Electrician': {
    bg: '#0f0c00', accent: '#f5c400', accent2: '#ffe040', light: '#fffde8',
    heroImg: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&q=80',
    font: 'system-ui, sans-serif',
    displayFont: 'system-ui, sans-serif',
    headline: 'Power you\ncan rely on.',
    sub: 'Licensed electricians with fast response and honest pricing.',
    cta: 'Call Now',
    badge: 'LICENSED ELECTRICIAN',
    overlay: 'linear-gradient(110deg, rgba(15,12,0,0.97) 0%, rgba(15,12,0,0.88) 50%, rgba(15,12,0,0.3) 100%)',
    accentStyle: 'normal',
  },
  'Painter': {
    bg: '#0c0818', accent: '#a855f7', accent2: '#c084fc', light: '#f5f0ff',
    heroImg: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1600&q=80',
    font: '"Playfair Display", Georgia, serif',
    displayFont: '"Playfair Display", Georgia, serif',
    headline: 'Color that\ntransforms.',
    sub: 'Expert painting with flawless, long-lasting results.',
    cta: 'Get a Free Quote',
    badge: 'EXPERT PAINTERS',
    overlay: 'linear-gradient(110deg, rgba(12,8,24,0.97) 0%, rgba(12,8,24,0.88) 50%, rgba(12,8,24,0.3) 100%)',
    accentStyle: 'italic',
  },
  'Roofer': {
    bg: '#0c0806', accent: '#e85520', accent2: '#f07848', light: '#fef2ee',
    heroImg: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=1600&q=80',
    font: 'system-ui, sans-serif',
    displayFont: 'system-ui, sans-serif',
    headline: 'Your roof.\nOur reputation.',
    sub: 'Licensed roofers with proven results and guaranteed work.',
    cta: 'Get Free Estimate',
    badge: 'LICENSED ROOFERS',
    overlay: 'linear-gradient(110deg, rgba(12,8,6,0.97) 0%, rgba(12,8,6,0.88) 50%, rgba(12,8,6,0.3) 100%)',
    accentStyle: 'normal',
  },
}
const DEFAULT = DNA['Contractor']

export async function generateMetadata({ params }) {
  const { data } = await db.from('business_leads')
    .select('business_name,category,city,google_rating,review_count')
    .eq('slug', params.slug).single()
  if (!data) return { title: 'Demo Site — Synthiq' }
  return {
    title: `${data.business_name} — ${data.category} in ${data.city}, GA`,
    description: `${data.business_name} — top-rated ${data.category} in ${data.city}, GA. ${data.review_count} Google reviews, ${data.google_rating}★ average.`,
  }
}

export default async function DemoSite({ params }) {
  const { data: lead } = await db.from('business_leads').select('*').eq('slug', params.slug).single()
  if (!lead) notFound()

  const d = DNA[lead.category] || DEFAULT
  const reviews = (lead.google_reviews || []).filter(r => {
    const t = typeof r === 'string' ? r : r.text || ''
    return t.length > 5
  })
  const services = lead.services || []
  const rating = lead.google_rating || 4.8
  const reviewCount = lead.review_count || 0
  const heroLines = d.headline.split('\n')

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Bebas+Neue&family=Oswald:wght@300;400;600;700&family=Inter:wght@300;400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{font-family:${d.font};background:${d.bg};color:#fff;overflow-x:hidden;-webkit-font-smoothing:antialiased}
    ::selection{background:${d.accent};color:#000}
    ::-webkit-scrollbar{width:3px}
    ::-webkit-scrollbar-thumb{background:${d.accent}66;border-radius:2px}

    /* NAV */
    .nav{position:fixed;top:0;left:0;right:0;z-index:200;padding:0 6%;height:72px;display:flex;align-items:center;justify-content:space-between;transition:all 0.4s}
    .nav.scrolled{background:${d.bg}ee;backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.06)}
    .nav-brand{display:flex;align-items:center;gap:12px}
    .nav-monogram{width:38px;height:38px;border-radius:50%;background:${d.accent};display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#000;font-family:${d.displayFont};flex-shrink:0}
    .nav-name{font-size:15px;font-weight:600;letter-spacing:0.3px;color:#fff;font-family:${d.font}}
    .nav-links{display:flex;gap:36px}
    .nav-links a{font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,0.6);text-decoration:none;transition:color 0.2s;font-family:system-ui}
    .nav-links a:hover{color:${d.accent}}
    .nav-btn{background:${d.accent};color:#000;padding:11px 26px;border-radius:3px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;transition:all 0.25s;font-family:system-ui;white-space:nowrap}
    .nav-btn:hover{background:${d.accent2};transform:translateY(-1px);box-shadow:0 6px 24px ${d.accent}55}

    /* HERO */
    .hero{position:relative;height:100vh;min-height:680px;display:flex;align-items:center;overflow:hidden}
    .hero-img{position:absolute;inset:0;background-image:url(${d.heroImg});background-size:cover;background-position:center;transform:scale(1.05);transition:transform 8s ease}
    .hero-overlay{position:absolute;inset:0;background:${d.overlay}}
    .hero-content{position:relative;z-index:2;width:100%;padding:0 6%;max-width:1200px;margin:0 auto}
    .hero-eyebrow{display:inline-flex;align-items:center;gap:14px;margin-bottom:28px}
    .hero-line{width:50px;height:1px;background:${d.accent}}
    .hero-badge{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:${d.accent};font-family:system-ui;font-weight:600}
    .hero-h1{font-size:clamp(52px,7.5vw,100px);font-weight:${d.font.includes('Bebas') ? '400' : '700'};line-height:0.95;letter-spacing:${d.font.includes('Bebas') ? '2px' : '-2px'};color:#fff;margin-bottom:6px;font-family:${d.displayFont}}
    .hero-h1 .italic{font-style:${d.accentStyle};color:${d.accent}}
    .hero-sub{font-size:clamp(14px,1.8vw,18px);color:rgba(255,255,255,0.6);line-height:1.7;max-width:480px;margin:24px 0 40px;font-family:system-ui;font-weight:300;letter-spacing:0.2px}
    .hero-actions{display:flex;gap:16px;align-items:center;flex-wrap:wrap}
    .btn-hero{background:${d.accent};color:#000;padding:16px 38px;border-radius:3px;font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;text-decoration:none;transition:all 0.25s;font-family:system-ui;display:inline-block}
    .btn-hero:hover{background:${d.accent2};transform:translateY(-2px);box-shadow:0 10px 40px ${d.accent}50}
    .btn-ghost{color:rgba(255,255,255,0.7);padding:16px 38px;border-radius:3px;font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;text-decoration:none;transition:all 0.25s;font-family:system-ui;display:inline-block;border:1px solid rgba(255,255,255,0.2)}
    .btn-ghost:hover{color:#fff;border-color:rgba(255,255,255,0.5);background:rgba(255,255,255,0.05)}
    .hero-rating{display:inline-flex;align-items:center;gap:14px;padding:14px 24px;border:1px solid rgba(255,255,255,0.1);border-radius:4px;background:rgba(255,255,255,0.04);backdrop-filter:blur(10px);margin-top:48px}
    .hero-stars{color:${d.accent};font-size:16px;letter-spacing:3px}
    .hero-rating-info{font-family:system-ui;font-size:13px;color:rgba(255,255,255,0.7)}
    .hero-rating-info strong{color:#fff}
    .hero-scroll{position:absolute;bottom:36px;left:6%;display:flex;align-items:center;gap:14px;opacity:0.4}
    .hero-scroll span{font-size:10px;letter-spacing:3px;text-transform:uppercase;font-family:system-ui}
    .hero-scroll-line{width:60px;height:1px;background:#fff}

    /* STATS */
    .stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06)}
    .stat{padding:44px 32px;text-align:center;border-right:1px solid rgba(255,255,255,0.06);position:relative}
    .stat:last-child{border-right:none}
    .stat::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:1px;height:3px;background:${d.accent}}
    .stat-n{font-size:clamp(32px,4vw,52px);font-weight:700;color:${d.accent};line-height:1;margin-bottom:8px;font-family:${d.displayFont}}
    .stat-l{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.35);font-family:system-ui}

    /* SECTIONS */
    .section{padding:100px 6%;max-width:1200px;margin:0 auto}
    .section-full{padding:100px 6%}
    .section-eyebrow{display:flex;align-items:center;gap:16px;margin-bottom:20px}
    .section-line{width:40px;height:1px;background:${d.accent}}
    .section-tag{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:${d.accent};font-family:system-ui;font-weight:600}
    .section-title{font-size:clamp(30px,4vw,54px);font-weight:700;color:#fff;line-height:1.1;letter-spacing:-0.5px;font-family:${d.displayFont}}
    .section-sub{font-size:16px;color:rgba(255,255,255,0.45);line-height:1.8;max-width:540px;margin-top:16px;font-family:system-ui;font-weight:300}

    /* SERVICES */
    .services-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1px;margin-top:56px;border:1px solid rgba(255,255,255,0.06)}
    .service-item{padding:36px 32px;background:rgba(255,255,255,0.02);transition:background 0.3s;position:relative;overflow:hidden}
    .service-item::after{content:'';position:absolute;top:0;left:0;width:3px;height:0;background:${d.accent};transition:height 0.3s}
    .service-item:hover{background:rgba(255,255,255,0.04)}
    .service-item:hover::after{height:100%}
    .service-num{font-size:11px;color:${d.accent};font-family:system-ui;letter-spacing:2px;margin-bottom:16px;opacity:0.7}
    .service-name{font-size:17px;font-weight:500;color:#fff;line-height:1.3;font-family:${d.font}}

    /* REVIEWS */
    .reviews-bg{background:rgba(255,255,255,0.015);border-top:1px solid rgba(255,255,255,0.05);border-bottom:1px solid rgba(255,255,255,0.05)}
    .reviews-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:24px;margin-top:56px}
    .review-card{padding:36px;border:1px solid rgba(255,255,255,0.07);border-radius:2px;position:relative;background:rgba(255,255,255,0.02);transition:border-color 0.3s}
    .review-card:hover{border-color:${d.accent}44}
    .review-quote{font-size:64px;line-height:0.6;color:${d.accent};opacity:0.25;margin-bottom:20px;font-family:Georgia,serif;font-weight:900}
    .review-text{font-size:15px;color:rgba(255,255,255,0.75);line-height:1.8;font-style:italic;margin-bottom:24px;font-family:${d.font}}
    .review-footer{display:flex;align-items:center;gap:12px}
    .review-avatar{width:36px;height:36px;border-radius:50%;background:${d.accent}22;border:1px solid ${d.accent}44;display:flex;align-items:center;justify-content:center;font-size:14px;color:${d.accent};font-weight:700;font-family:system-ui;flex-shrink:0}
    .review-author{font-size:12px;font-weight:600;color:${d.accent};letter-spacing:1px;text-transform:uppercase;font-family:system-ui}
    .review-source{font-size:10px;color:rgba(255,255,255,0.3);font-family:system-ui;letter-spacing:1px}
    .review-stars{color:${d.accent};font-size:12px;letter-spacing:2px;margin-bottom:16px}

    /* PRICING */
    .pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin-top:56px;border:1px solid rgba(255,255,255,0.06)}
    .price-card{padding:48px 36px;background:rgba(255,255,255,0.02);position:relative;transition:background 0.3s}
    .price-card:hover{background:rgba(255,255,255,0.04)}
    .price-card.featured{background:${d.accent}12;border:1px solid ${d.accent}33}
    .price-badge{position:absolute;top:-1px;left:36px;background:${d.accent};color:#000;font-size:9px;font-weight:700;letter-spacing:2.5px;padding:5px 14px;font-family:system-ui;text-transform:uppercase}
    .price-tier{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,0.35);font-family:system-ui;margin-bottom:20px}
    .price-amount{font-size:clamp(40px,5vw,60px);font-weight:700;color:#fff;line-height:1;font-family:${d.displayFont}}
    .price-per{font-size:14px;font-weight:300;color:rgba(255,255,255,0.35);font-family:system-ui}
    .price-deposit{font-size:11px;color:rgba(255,255,255,0.3);margin:8px 0 28px;font-family:system-ui}
    .price-divider{height:1px;background:rgba(255,255,255,0.07);margin-bottom:28px}
    .price-features{list-style:none;margin-bottom:36px}
    .price-features li{font-size:13px;color:rgba(255,255,255,0.55);padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;gap:12px;font-family:system-ui;line-height:1.4}
    .price-features li::before{content:'→';color:${d.accent};flex-shrink:0;font-size:12px;margin-top:1px}
    .price-card.featured .price-features li{color:rgba(255,255,255,0.7)}
    .price-btn{display:block;text-align:center;padding:14px 24px;font-size:10px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;font-family:system-ui;text-decoration:none;transition:all 0.25s;border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.6)}
    .price-btn:hover{border-color:${d.accent};color:${d.accent}}
    .price-card.featured .price-btn{background:${d.accent};color:#000;border-color:transparent}
    .price-card.featured .price-btn:hover{background:${d.accent2};transform:translateY(-1px)}

    /* CTA */
    .cta-section{padding:120px 6%;text-align:center;background:linear-gradient(180deg,transparent 0%,${d.accent}08 50%,transparent 100%);border-top:1px solid rgba(255,255,255,0.05)}
    .cta-title{font-size:clamp(36px,5vw,72px);font-weight:700;color:#fff;line-height:1.05;letter-spacing:-1px;margin-bottom:20px;font-family:${d.displayFont}}
    .cta-title span{color:${d.accent};font-style:${d.accentStyle}}
    .cta-sub{font-size:17px;color:rgba(255,255,255,0.45);max-width:520px;margin:0 auto 52px;line-height:1.7;font-family:system-ui;font-weight:300}
    .cta-contact{display:flex;justify-content:center;gap:40px;flex-wrap:wrap;margin-top:60px;padding-top:60px;border-top:1px solid rgba(255,255,255,0.06)}
    .contact-block{text-align:center}
    .contact-label{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.3);font-family:system-ui;margin-bottom:10px}
    .contact-value{font-size:16px;color:rgba(255,255,255,0.8);font-family:system-ui;font-weight:400}
    .contact-value a{color:rgba(255,255,255,0.8);text-decoration:none;transition:color 0.2s}
    .contact-value a:hover{color:${d.accent}}

    /* FOOTER */
    .footer{padding:32px 6%;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.05)}
    .footer-left{font-size:12px;color:rgba(255,255,255,0.2);font-family:system-ui;line-height:1.8}
    .footer-synthiq{font-size:12px;color:rgba(255,255,255,0.15);font-family:system-ui}
    .footer-synthiq span{color:${d.accent}66}

    @media(max-width:900px){
      .nav-links{display:none}
      .stats{grid-template-columns:repeat(2,1fr)}
      .pricing-grid{grid-template-columns:1fr}
      .price-card.featured{border:none;background:${d.accent}10}
      .cta-contact{gap:28px}
      .footer{flex-direction:column;gap:12px;text-align:center}
      .hero-h1{font-size:clamp(42px,11vw,72px)}
    }
    @media(max-width:600px){
      .section{padding:72px 5%}
      .services-grid{grid-template-columns:1fr}
      .reviews-grid{grid-template-columns:1fr}
      .hero-actions{flex-direction:column;align-items:flex-start}
      .btn-hero,.btn-ghost{padding:14px 28px}
    }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── NAV ── */}
      <nav className="nav" id="top-nav">
        <div className="nav-brand">
          <div className="nav-monogram">{lead.business_name[0]}</div>
          <span className="nav-name">{lead.business_name}</span>
        </div>
        <div className="nav-links">
          {['Services','Reviews','Pricing','Contact'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}>{l}</a>
          ))}
        </div>
        <a href={`tel:${lead.phone}`} className="nav-btn">{d.cta}</a>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-img" id="hero-img" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-eyebrow">
            <div className="hero-line" />
            <span className="hero-badge">{d.badge}</span>
          </div>
          <h1 className="hero-h1">
            {heroLines.map((line, i) => (
              <span key={i} style={{ display:'block' }}>
                {i === 1 ? <span className="italic">{line}</span> : line}
              </span>
            ))}
          </h1>
          <p className="hero-sub">{d.sub}</p>
          <div className="hero-actions">
            <a href={`tel:${lead.phone}`} className="btn-hero">{d.cta}</a>
            <a href="#reviews" className="btn-ghost">Read Reviews</a>
          </div>
          {reviewCount > 0 && (
            <div className="hero-rating">
              <span className="hero-stars">{'★'.repeat(Math.round(rating))}</span>
              <span className="hero-rating-info">
                <strong>{rating}</strong> · {reviewCount.toLocaleString()} Google Reviews
              </span>
            </div>
          )}
        </div>
        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="stats">
        {[
          { n: `${rating}★`, l: 'Google Rating' },
          { n: reviewCount > 0 ? reviewCount.toLocaleString() : '—', l: 'Reviews' },
          { n: lead.city, l: 'Location' },
          { n: lead.category, l: 'Specialty' },
        ].map(s => (
          <div className="stat" key={s.l}>
            <div className="stat-n">{s.n}</div>
            <div className="stat-l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── SERVICES ── */}
      {services.length > 0 && (
        <div id="services">
          <div className="section">
            <div className="section-eyebrow">
              <div className="section-line" />
              <span className="section-tag">What we offer</span>
            </div>
            <h2 className="section-title">Our Services</h2>
            <p className="section-sub">Everything you need, delivered with expertise.</p>
            <div className="services-grid">
              {services.map((svc, i) => {
                const name = typeof svc === 'string' ? svc : svc.name || ''
                return (
                  <div className="service-item" key={i}>
                    <div className="service-num">0{i+1}</div>
                    <div className="service-name">{name}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── REVIEWS ── */}
      {reviews.length > 0 && (
        <div className="reviews-bg" id="reviews">
          <div className="section">
            <div className="section-eyebrow">
              <div className="section-line" />
              <span className="section-tag">Real customers</span>
            </div>
            <h2 className="section-title">What people say</h2>
            <p className="section-sub">Verified reviews from real customers on Google.</p>
            <div className="reviews-grid">
              {reviews.slice(0,6).map((rev, i) => {
                const text = typeof rev === 'string' ? rev : rev.text || rev.review_text || ''
                const author = typeof rev === 'string' ? `Customer` : rev.author_name || rev.author || 'Customer'
                if (!text) return null
                return (
                  <div className="review-card" key={i}>
                    <div className="review-stars">★★★★★</div>
                    <div className="review-quote">"</div>
                    <p className="review-text">{text}</p>
                    <div className="review-footer">
                      <div className="review-avatar">{author[0]}</div>
                      <div>
                        <div className="review-author">{author}</div>
                        <div className="review-source">Google Review</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── PRICING ── */}
      <div id="pricing">
        <div className="section">
          <div className="section-eyebrow">
            <div className="section-line" />
            <span className="section-tag">Simple pricing</span>
          </div>
          <h2 className="section-title">No surprises.<br />No long-term contracts.</h2>
          <p className="section-sub">This demo was built free. If you love it, choose a plan — live in 7 days.</p>
          <div className="pricing-grid">
            {[
              {
                tier:'Starter', price:'$47', per:'/mo',
                features:['Site on synthiq subdomain','Mobile-first design','Click-to-call button','Google reviews displayed','Basic SEO setup'],
              },
              {
                tier:'Standard', price:'$97', per:'/mo', featured:true,
                features:['Your own custom domain','Everything in Starter','Monthly content updates','Google Analytics setup','Priority support & edits'],
              },
              {
                tier:'Pro', price:'$197', per:'/mo',
                features:['Everything in Standard','Online booking integration','Automated review requests','Local SEO optimization','Social media feed embedded'],
              },
            ].map(p => (
              <div className={`price-card${p.featured?' featured':''}`} key={p.tier}>
                {p.featured && <div className="price-badge">Most Popular</div>}
                <div className="price-tier">{p.tier}</div>
                <div>
                  <span className="price-amount">{p.price}</span>
                  <span className="price-per">{p.per}</span>
                </div>
                <div className="price-deposit">$200 deposit · cancel anytime</div>
                <div className="price-divider" />
                <ul className="price-features">
                  {p.features.map((f,i) => <li key={i}>{f}</li>)}
                </ul>
                <a href="mailto:ly@synthiqdesigns.com" className="price-btn">Get Started</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="cta-section" id="contact">
        <div className="section-eyebrow" style={{justifyContent:'center'}}>
          <div className="section-line" />
          <span className="section-tag">Ready to go live?</span>
          <div className="section-line" />
        </div>
        <h2 className="cta-title">
          Let's make it<br /><span>officially yours.</span>
        </h2>
        <p className="cta-sub">
          This demo was built free by Synthiq. Reply to the email you received and we'll have your real site live within 7 days. Everything is negotiable.
        </p>
        <div className="hero-actions" style={{justifyContent:'center'}}>
          <a href="mailto:ly@synthiqdesigns.com?subject=I want to go live — ${lead.business_name}" className="btn-hero">
            Email Ly Now
          </a>
          {lead.phone && (
            <a href={`tel:${lead.phone}`} className="btn-ghost">{lead.phone}</a>
          )}
        </div>
        <div className="cta-contact">
          {lead.phone && (
            <div className="contact-block">
              <div className="contact-label">Phone</div>
              <div className="contact-value"><a href={`tel:${lead.phone}`}>{lead.phone}</a></div>
            </div>
          )}
          {lead.address && (
            <div className="contact-block">
              <div className="contact-label">Address</div>
              <div className="contact-value">{lead.address}</div>
            </div>
          )}
          <div className="contact-block">
            <div className="contact-label">Built by</div>
            <div className="contact-value"><a href="mailto:ly@synthiqdesigns.com">ly@synthiqdesigns.com</a></div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-left">
          © 2026 {lead.business_name} · {lead.city}, GA<br />
          <span style={{fontSize:11,opacity:0.6}}>Demo website — not yet live. Built free by Synthiq Web Design.</span>
        </div>
        <div className="footer-synthiq">synth<span>iq</span></div>
      </footer>

      <script dangerouslySetInnerHTML={{ __html: `
        // Subtle parallax on hero image
        const img = document.getElementById('hero-img');
        window.addEventListener('scroll', () => {
          const y = window.scrollY;
          if(img) img.style.transform = 'scale(1.05) translateY(' + (y * 0.15) + 'px)';
        }, {passive:true});
        // Nav scroll effect
        const nav = document.getElementById('top-nav');
        window.addEventListener('scroll', () => {
          if(window.scrollY > 60) nav.classList.add('scrolled');
          else nav.classList.remove('scrolled');
        }, {passive:true});
      `}} />
    </>
  )
}
