import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const DNA = {
  'Nail Salon': {
    bg: '#0d0810', grad: 'linear-gradient(135deg,#2d0a2e 0%,#0d0810 60%)',
    accent: '#d4a0c0', accent2: '#e8c8d8', textAccent: '#f0d0e0',
    font: '"Cormorant Garamond","Playfair Display",Georgia,serif',
    displayFont: '"Cormorant Garamond",Georgia,serif',
    headline: 'Where beauty\nbecomes art.',
    sub: 'Precision nail care crafted for women who deserve the best.',
    cta: 'Book Appointment', badge: 'PREMIUM NAIL STUDIO',
    accentStyle: 'italic', ctaTextColor: '#1a0a1a',
    fallbackImg: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1600&q=80',
  },
  'Barbershop': {
    bg: '#080c10', grad: 'linear-gradient(135deg,#0a1520 0%,#080c10 60%)',
    accent: '#c9972a', accent2: '#e8b84b', textAccent: '#f0d080',
    font: '"Oswald","Bebas Neue",system-ui,sans-serif',
    displayFont: '"Oswald",system-ui,sans-serif',
    headline: 'Sharp cuts.\nReal respect.',
    sub: "Augusta's most trusted barbershop experience.",
    cta: 'Book a Cut', badge: 'PREMIUM BARBERSHOP',
    accentStyle: 'normal', ctaTextColor: '#000',
    fallbackImg: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1600&q=80',
  },
  'Restaurant': {
    bg: '#0a0600', grad: 'linear-gradient(135deg,#1a0800 0%,#0a0600 60%)',
    accent: '#e8a020', accent2: '#f5c040', textAccent: '#f5d080',
    font: '"Playfair Display",Georgia,serif',
    displayFont: '"Playfair Display",Georgia,serif',
    headline: 'Authentic flavors,\nevery visit.',
    sub: 'Made fresh. Served with heart. Remembered forever.',
    cta: 'Reserve a Table', badge: 'LOCAL FAVORITE',
    accentStyle: 'italic', ctaTextColor: '#000',
    fallbackImg: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80',
  },
  'HVAC': {
    bg: '#060c18', grad: 'linear-gradient(135deg,#0a1830 0%,#060c18 60%)',
    accent: '#4a9eff', accent2: '#70b8ff', textAccent: '#90ccff',
    font: 'system-ui,sans-serif', displayFont: 'system-ui,sans-serif',
    headline: 'Comfort you\ncan count on.',
    sub: 'Fast, reliable HVAC service — licensed, insured, and local.',
    cta: 'Get Free Quote', badge: 'CERTIFIED HVAC PROS',
    accentStyle: 'normal', ctaTextColor: '#fff',
    fallbackImg: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&q=80',
  },
  'Pest Control': {
    bg: '#050f05', grad: 'linear-gradient(135deg,#0a1e0a 0%,#050f05 60%)',
    accent: '#5cb85c', accent2: '#7dd47d', textAccent: '#9ee09e',
    font: 'system-ui,sans-serif', displayFont: 'system-ui,sans-serif',
    headline: 'Your home,\nprotected.',
    sub: 'Fast, safe, guaranteed pest elimination for Augusta homes.',
    cta: 'Free Inspection', badge: 'LICENSED & CERTIFIED',
    accentStyle: 'normal', ctaTextColor: '#fff',
    fallbackImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
  },
  'Pressure Washing': {
    bg: '#020d1a', grad: 'linear-gradient(135deg,#041830 0%,#020d1a 60%)',
    accent: '#00c4d8', accent2: '#30d8e8', textAccent: '#60e8f4',
    font: 'system-ui,sans-serif', displayFont: 'system-ui,sans-serif',
    headline: 'Like new.\nEvery time.',
    sub: 'Professional pressure washing that transforms your property.',
    cta: 'Get a Quote', badge: 'FULLY INSURED',
    accentStyle: 'normal', ctaTextColor: '#000',
    fallbackImg: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1600&q=80',
  },
  'Auto Repair': {
    bg: '#0a0a0a', grad: 'linear-gradient(135deg,#1a1008 0%,#0a0a0a 60%)',
    accent: '#ff6800', accent2: '#ff8833', textAccent: '#ffaa66',
    font: 'system-ui,sans-serif', displayFont: 'system-ui,sans-serif',
    headline: 'Your car is in\ngood hands.',
    sub: 'Honest diagnostics. Fair prices. Done right the first time.',
    cta: 'Schedule Service', badge: 'ASE CERTIFIED',
    accentStyle: 'normal', ctaTextColor: '#fff',
    fallbackImg: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&q=80',
  },
  'Contractor': {
    bg: '#0a0806', grad: 'linear-gradient(135deg,#1a1208 0%,#0a0806 60%)',
    accent: '#f09010', accent2: '#f8b040', textAccent: '#fcc870',
    font: 'system-ui,sans-serif', displayFont: 'system-ui,sans-serif',
    headline: 'Built right.\nBuilt to last.',
    sub: 'Licensed contractors delivering quality craftsmanship in Augusta.',
    cta: 'Free Quote', badge: 'LICENSED & BONDED',
    accentStyle: 'normal', ctaTextColor: '#000',
    fallbackImg: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80',
  },
  'Landscaping': {
    bg: '#040c04', grad: 'linear-gradient(135deg,#081808 0%,#040c04 60%)',
    accent: '#6ab840', accent2: '#88d060', textAccent: '#a8e080',
    font: '"Playfair Display",Georgia,serif',
    displayFont: '"Playfair Display",Georgia,serif',
    headline: 'Beautiful spaces\nstart here.',
    sub: 'Expert landscaping that transforms your outdoor living.',
    cta: 'Free Estimate', badge: 'TRUSTED LANDSCAPERS',
    accentStyle: 'italic', ctaTextColor: '#fff',
    fallbackImg: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&q=80',
  },
  'Cleaning Service': {
    bg: '#020e10', grad: 'linear-gradient(135deg,#041820 0%,#020e10 60%)',
    accent: '#00d4a8', accent2: '#20e8c0', textAccent: '#60f0d8',
    font: 'system-ui,sans-serif', displayFont: 'system-ui,sans-serif',
    headline: 'Spotless.\nEvery time.',
    sub: 'Professional cleaning services you can completely trust.',
    cta: 'Book Cleaning', badge: 'FULLY INSURED',
    accentStyle: 'normal', ctaTextColor: '#000',
    fallbackImg: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80',
  },
  'Plumber': {
    bg: '#04091a', grad: 'linear-gradient(135deg,#081428 0%,#04091a 60%)',
    accent: '#4090ff', accent2: '#60a8ff', textAccent: '#88c0ff',
    font: 'system-ui,sans-serif', displayFont: 'system-ui,sans-serif',
    headline: 'Fixed fast.\nDone right.',
    sub: 'Licensed plumbers available when you need us most.',
    cta: 'Call Now', badge: 'LICENSED PLUMBERS',
    accentStyle: 'normal', ctaTextColor: '#fff',
    fallbackImg: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1600&q=80',
  },
  'Electrician': {
    bg: '#0f0c00', grad: 'linear-gradient(135deg,#201800 0%,#0f0c00 60%)',
    accent: '#f5c800', accent2: '#ffe040', textAccent: '#ffec80',
    font: 'system-ui,sans-serif', displayFont: 'system-ui,sans-serif',
    headline: 'Power you\ncan rely on.',
    sub: 'Licensed electricians with fast response and honest pricing.',
    cta: 'Call Now', badge: 'LICENSED ELECTRICIAN',
    accentStyle: 'normal', ctaTextColor: '#000',
    fallbackImg: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&q=80',
  },
  'Painter': {
    bg: '#0c0818', grad: 'linear-gradient(135deg,#180c2a 0%,#0c0818 60%)',
    accent: '#b060f8', accent2: '#cc88ff', textAccent: '#e0b0ff',
    font: '"Playfair Display",Georgia,serif',
    displayFont: '"Playfair Display",Georgia,serif',
    headline: 'Color that\ntransforms.',
    sub: 'Expert painting with flawless, long-lasting results.',
    cta: 'Free Quote', badge: 'EXPERT PAINTERS',
    accentStyle: 'italic', ctaTextColor: '#fff',
    fallbackImg: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1600&q=80',
  },
  'Roofer': {
    bg: '#0c0806', grad: 'linear-gradient(135deg,#1c1008 0%,#0c0806 60%)',
    accent: '#e85020', accent2: '#f07040', textAccent: '#f89870',
    font: 'system-ui,sans-serif', displayFont: 'system-ui,sans-serif',
    headline: 'Your roof.\nOur reputation.',
    sub: 'Licensed roofers with proven results and guaranteed work.',
    cta: 'Free Estimate', badge: 'LICENSED ROOFERS',
    accentStyle: 'normal', ctaTextColor: '#fff',
    fallbackImg: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=1600&q=80',
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
    description: `${data.business_name} — top-rated ${data.category} in ${data.city}, GA with ${data.review_count} Google reviews averaging ${data.google_rating}★.`,
  }
}

export default async function DemoSite({ params }) {
  const { data: lead } = await db.from('business_leads').select('*').eq('slug', params.slug).single()
  if (!lead) notFound()

  const d = DNA[lead.category] || DEFAULT
  const photos = lead.photo_urls || []
  const heroPhoto = photos[0] || d.fallbackImg
  const galleryPhotos = photos.length > 1 ? photos.slice(1, 7) : [d.fallbackImg]
  const reviews = (lead.google_reviews || []).filter(r => {
    const t = typeof r === 'string' ? r : r.text || ''
    return t.length > 10
  })
  const services = lead.services || []
  const rating = lead.google_rating || 4.8
  const reviewCount = lead.review_count || 0
  const heroLines = d.headline.split('\n')

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Oswald:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${d.bg};color:#fff;font-family:${d.font};-webkit-font-smoothing:antialiased;overflow-x:hidden}
        ::selection{background:${d.accent};color:#000}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:${d.accent}55;border-radius:2px}
        a{text-decoration:none;color:inherit}

        .nav{position:fixed;top:0;left:0;right:0;z-index:200;height:68px;padding:0 6%;display:flex;align-items:center;justify-content:space-between;transition:all 0.4s ease}
        .nav.stuck{background:${d.bg}f0;backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.06)}
        .nav-brand{display:flex;align-items:center;gap:12px}
        .nav-icon{width:36px;height:36px;border-radius:50%;background:${d.accent};color:${d.ctaTextColor};display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;font-family:${d.displayFont};flex-shrink:0}
        .nav-title{font-size:14px;font-weight:600;color:#fff;letter-spacing:0.2px}
        .nav-links{display:flex;gap:32px}
        .nav-links a{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.55);transition:color 0.2s;font-family:system-ui;font-weight:500}
        .nav-links a:hover{color:${d.accent}}
        .nav-cta{background:${d.accent};color:${d.ctaTextColor};padding:10px 24px;border-radius:2px;font-size:10px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;font-family:system-ui;transition:all 0.2s;white-space:nowrap}
        .nav-cta:hover{background:${d.accent2};transform:translateY(-1px)}

        .hero{position:relative;height:100vh;min-height:640px;display:flex;align-items:center;overflow:hidden;background:${d.grad}}
        .hero-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;opacity:0.45;transform:scale(1.06);transition:transform 12s ease}
        .hero-overlay{position:absolute;inset:0;background:linear-gradient(100deg,${d.bg}fa 0%,${d.bg}cc 45%,${d.bg}55 100%)}
        .hero-overlay2{position:absolute;inset:0;background:linear-gradient(to top,${d.bg} 0%,transparent 40%)}
        .hero-body{position:relative;z-index:3;padding:0 6%;width:100%;max-width:1200px;margin:0 auto}
        .hero-eyebrow{display:flex;align-items:center;gap:16px;margin-bottom:24px}
        .hero-line{width:48px;height:1px;background:${d.accent};opacity:0.8}
        .hero-badge{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:${d.textAccent};font-family:system-ui;font-weight:600}
        .hero-h1{font-size:clamp(50px,7.5vw,96px);font-weight:700;line-height:0.95;letter-spacing:-1px;color:#fff;margin-bottom:6px;font-family:${d.displayFont}}
        .hero-h1 em{font-style:${d.accentStyle};color:${d.accent}}
        .hero-sub{font-size:clamp(14px,1.6vw,18px);color:rgba(255,255,255,0.55);line-height:1.75;max-width:460px;margin:24px 0 40px;font-family:system-ui;font-weight:300;letter-spacing:0.1px}
        .hero-btns{display:flex;gap:14px;flex-wrap:wrap;align-items:center}
        .btn-main{display:inline-block;background:${d.accent};color:${d.ctaTextColor};padding:15px 36px;border-radius:2px;font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;font-family:system-ui;transition:all 0.25s}
        .btn-main:hover{background:${d.accent2};transform:translateY(-2px);box-shadow:0 8px 32px ${d.accent}44}
        .btn-outline{display:inline-block;color:rgba(255,255,255,0.65);padding:15px 36px;border-radius:2px;font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;font-family:system-ui;transition:all 0.25s;border:1px solid rgba(255,255,255,0.2)}
        .btn-outline:hover{color:#fff;border-color:rgba(255,255,255,0.6)}
        .hero-rating-row{display:inline-flex;align-items:center;gap:14px;margin-top:44px;padding:14px 22px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:3px;backdrop-filter:blur(8px)}
        .stars{color:${d.accent};font-size:15px;letter-spacing:2.5px}
        .rating-text{font-family:system-ui;font-size:13px;color:rgba(255,255,255,0.65)}
        .rating-text strong{color:#fff}
        .hero-scroll{position:absolute;bottom:32px;left:6%;display:flex;align-items:center;gap:12px;opacity:0.35;z-index:3}
        .hero-scroll span{font-size:9px;letter-spacing:3px;text-transform:uppercase;font-family:system-ui}
        .scroll-line{width:48px;height:1px;background:#fff}

        .stats-row{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid rgba(255,255,255,0.07);background:${d.bg}}
        .stat{padding:40px 28px;text-align:center;border-right:1px solid rgba(255,255,255,0.07);position:relative}
        .stat:last-child{border-right:none}
        .stat::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:1px;height:4px;background:${d.accent}}
        .stat-val{font-size:clamp(28px,3.5vw,44px);font-weight:700;color:${d.accent};line-height:1;margin-bottom:8px;font-family:${d.displayFont}}
        .stat-key{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.3);font-family:system-ui}

        .section{padding:96px 6%;max-width:1200px;margin:0 auto}
        .section-full{padding:96px 6%;background:rgba(255,255,255,0.018);border-top:1px solid rgba(255,255,255,0.05);border-bottom:1px solid rgba(255,255,255,0.05)}
        .eyebrow{display:flex;align-items:center;gap:14px;margin-bottom:18px}
        .ey-line{width:36px;height:1px;background:${d.accent}}
        .ey-tag{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:${d.textAccent};font-family:system-ui;font-weight:600}
        .sec-title{font-size:clamp(28px,3.8vw,50px);font-weight:700;color:#fff;line-height:1.1;letter-spacing:-0.5px;font-family:${d.displayFont}}
        .sec-sub{font-size:15px;color:rgba(255,255,255,0.4);line-height:1.8;max-width:520px;margin-top:14px;font-family:system-ui;font-weight:300}

        .gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin-top:52px}
        .gallery-item{aspect-ratio:4/3;overflow:hidden;background:${d.bg};position:relative}
        .gallery-item img{width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease;display:block}
        .gallery-item:hover img{transform:scale(1.06)}
        .gallery-item::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,${d.bg}44,transparent)}

        .services-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1px;margin-top:52px;border:1px solid rgba(255,255,255,0.06)}
        .svc{padding:32px 28px;background:rgba(255,255,255,0.02);transition:background 0.3s;position:relative;overflow:hidden;cursor:default}
        .svc::before{content:'';position:absolute;left:0;top:0;width:2px;height:0;background:${d.accent};transition:height 0.35s ease}
        .svc:hover{background:rgba(255,255,255,0.05)}
        .svc:hover::before{height:100%}
        .svc-n{font-size:10px;color:${d.accent};font-family:system-ui;letter-spacing:2px;margin-bottom:12px;opacity:0.6}
        .svc-name{font-size:16px;font-weight:500;color:#fff;line-height:1.35;font-family:${d.font}}

        .reviews-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;margin-top:52px}
        .rev{padding:32px;border:1px solid rgba(255,255,255,0.08);border-radius:2px;background:rgba(255,255,255,0.025);position:relative;overflow:hidden;transition:border-color 0.3s}
        .rev:hover{border-color:${d.accent}44}
        .rev-q{font-size:56px;line-height:0.5;color:${d.accent};opacity:0.15;margin-bottom:18px;font-family:Georgia,serif;font-weight:900}
        .rev-stars{color:${d.accent};font-size:12px;letter-spacing:2.5px;margin-bottom:14px}
        .rev-text{font-size:14px;color:rgba(255,255,255,0.7);line-height:1.8;font-style:italic;margin-bottom:22px;font-family:${d.font}}
        .rev-foot{display:flex;align-items:center;gap:10px}
        .rev-avatar{width:32px;height:32px;border-radius:50%;background:${d.accent}28;border:1px solid ${d.accent}44;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:${d.accent};font-family:system-ui;flex-shrink:0}
        .rev-name{font-size:11px;font-weight:600;color:${d.textAccent};letter-spacing:1px;text-transform:uppercase;font-family:system-ui}
        .rev-src{font-size:10px;color:rgba(255,255,255,0.25);font-family:system-ui;letter-spacing:0.5px}

        .pricing-wrap{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin-top:52px;border:1px solid rgba(255,255,255,0.07)}
        .pc{padding:44px 32px;background:rgba(255,255,255,0.025);position:relative;transition:background 0.3s}
        .pc:hover{background:rgba(255,255,255,0.04)}
        .pc.hot{background:${d.accent}14;border:1px solid ${d.accent}33}
        .pc-badge{position:absolute;top:-1px;left:32px;background:${d.accent};color:${d.ctaTextColor};font-size:9px;font-weight:700;letter-spacing:2.5px;padding:5px 14px;font-family:system-ui;text-transform:uppercase}
        .pc-tier{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,0.3);font-family:system-ui;margin-bottom:18px}
        .pc-price{font-size:clamp(38px,4.5vw,54px);font-weight:700;color:#fff;line-height:1;font-family:${d.displayFont}}
        .pc-per{font-size:13px;font-weight:300;color:rgba(255,255,255,0.3);font-family:system-ui}
        .pc-dep{font-size:10px;color:rgba(255,255,255,0.25);margin:8px 0 26px;font-family:system-ui}
        .pc-div{height:1px;background:rgba(255,255,255,0.07);margin-bottom:26px}
        .pc-feats{list-style:none;margin-bottom:32px}
        .pc-feats li{font-size:12px;color:rgba(255,255,255,0.5);padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;gap:10px;font-family:system-ui;line-height:1.4}
        .pc-feats li::before{content:'→';color:${d.accent};flex-shrink:0;font-size:11px;margin-top:1px}
        .pc.hot .pc-feats li{color:rgba(255,255,255,0.65)}
        .pc-btn{display:block;text-align:center;padding:13px;font-size:10px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;font-family:system-ui;border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.5);transition:all 0.25s}
        .pc-btn:hover,.pc.hot .pc-btn{background:${d.accent};color:${d.ctaTextColor};border-color:transparent}

        .cta-section{padding:112px 6%;text-align:center;position:relative;overflow:hidden}
        .cta-section::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:600px;border-radius:50%;background:${d.accent};opacity:0.04;filter:blur(80px);pointer-events:none}
        .cta-section::after{content:'';position:absolute;inset:0;border-top:1px solid rgba(255,255,255,0.05)}
        .cta-title{font-size:clamp(34px,5vw,68px);font-weight:700;color:#fff;line-height:1.05;letter-spacing:-1px;margin-bottom:18px;font-family:${d.displayFont};position:relative;z-index:1}
        .cta-title span{color:${d.accent};font-style:${d.accentStyle}}
        .cta-sub{font-size:16px;color:rgba(255,255,255,0.4);max-width:500px;margin:0 auto 48px;line-height:1.75;font-family:system-ui;font-weight:300;position:relative;z-index:1}
        .cta-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;position:relative;z-index:1}
        .contact-strip{display:flex;justify-content:center;gap:48px;flex-wrap:wrap;margin-top:64px;padding-top:64px;border-top:1px solid rgba(255,255,255,0.06);position:relative;z-index:1}
        .cs-block{text-align:center}
        .cs-label{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.25);font-family:system-ui;margin-bottom:8px}
        .cs-val{font-size:15px;color:rgba(255,255,255,0.75);font-family:system-ui}
        .cs-val a{color:rgba(255,255,255,0.75);transition:color 0.2s}
        .cs-val a:hover{color:${d.accent}}

        .footer{padding:28px 6%;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.05);background:${d.bg}}
        .footer-left{font-size:11px;color:rgba(255,255,255,0.18);font-family:system-ui;line-height:1.9}
        .footer-right{font-size:12px;color:rgba(255,255,255,0.12);font-family:system-ui}
        .footer-right span{color:${d.accent}55}

        @media(max-width:900px){
          .nav-links{display:none}
          .stats-row{grid-template-columns:repeat(2,1fr)}
          .pricing-wrap{grid-template-columns:1fr}
          .gallery{grid-template-columns:repeat(2,1fr)}
          .contact-strip{gap:28px}
          .footer{flex-direction:column;gap:10px;text-align:center}
        }
        @media(max-width:600px){
          .section{padding:72px 5%}
          .section-full{padding:72px 5%}
          .services-list{grid-template-columns:1fr}
          .reviews-grid{grid-template-columns:1fr}
          .hero-btns{flex-direction:column;align-items:flex-start}
          .gallery{grid-template-columns:1fr}
          .cta-btns{flex-direction:column;align-items:center}
        }
      `}} />

      {/* NAV */}
      <nav className="nav" id="sitenav">
        <div className="nav-brand">
          <div className="nav-icon">{lead.business_name[0]}</div>
          <span className="nav-title">{lead.business_name}</span>
        </div>
        <div className="nav-links">
          {['Services','Gallery','Reviews','Pricing','Contact'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}>{l}</a>
          ))}
        </div>
        <a href={`tel:${lead.phone}`} className="nav-cta">{d.cta}</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <img
          src={heroPhoto}
          alt={lead.business_name}
          className="hero-photo"
          id="hero-photo"
        />
        <div className="hero-overlay" />
        <div className="hero-overlay2" />
        <div className="hero-body">
          <div className="hero-eyebrow">
            <div className="hero-line" />
            <span className="hero-badge">{d.badge} · {lead.city.toUpperCase()}, GA</span>
          </div>
          <h1 className="hero-h1">
            {heroLines.map((line, i) => (
              <span key={i} style={{ display: 'block' }}>
                {i === 1 ? <em>{line}</em> : line}
              </span>
            ))}
          </h1>
          <p className="hero-sub">{d.sub}</p>
          <div className="hero-btns">
            <a href={`tel:${lead.phone}`} className="btn-main">{d.cta}</a>
            <a href="#reviews" className="btn-outline">Read Reviews</a>
          </div>
          {reviewCount > 0 && (
            <div className="hero-rating-row">
              <span className="stars">{'★'.repeat(Math.round(rating))}</span>
              <span className="rating-text">
                <strong>{rating}</strong> · {reviewCount.toLocaleString()} Google Reviews
              </span>
            </div>
          )}
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>Explore</span>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-row">
        {[
          { v: `${rating}★`, k: 'Google Rating' },
          { v: reviewCount > 0 ? reviewCount.toLocaleString() : '—', k: 'Reviews' },
          { v: lead.city, k: 'Location' },
          { v: lead.category, k: 'Specialty' },
        ].map(s => (
          <div className="stat" key={s.k}>
            <div className="stat-val">{s.v}</div>
            <div className="stat-key">{s.k}</div>
          </div>
        ))}
      </div>

      {/* GALLERY */}
      {galleryPhotos.length > 0 && (
        <div id="gallery">
          <div className="section">
            <div className="eyebrow"><div className="ey-line"/><span className="ey-tag">Our work</span></div>
            <h2 className="sec-title">See for yourself.</h2>
            <div className="gallery">
              {galleryPhotos.map((url, i) => (
                <div className="gallery-item" key={i}>
                  <img src={url} alt={`${lead.business_name} photo ${i+1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SERVICES */}
      {services.length > 0 && (
        <div className="section-full" id="services">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="eyebrow"><div className="ey-line"/><span className="ey-tag">What we offer</span></div>
            <h2 className="sec-title">Our Services</h2>
            <p className="sec-sub">Everything you need, delivered with expertise and care.</p>
            <div className="services-list">
              {services.map((svc, i) => {
                const name = typeof svc === 'string' ? svc : svc.name || ''
                return (
                  <div className="svc" key={i}>
                    <div className="svc-n">0{i + 1}</div>
                    <div className="svc-name">{name}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* REVIEWS */}
      {reviews.length > 0 && (
        <div id="reviews">
          <div className="section">
            <div className="eyebrow"><div className="ey-line"/><span className="ey-tag">Real customers</span></div>
            <h2 className="sec-title">What people say.</h2>
            <p className="sec-sub">Verified reviews directly from Google.</p>
            <div className="reviews-grid">
              {reviews.slice(0, 6).map((rev, i) => {
                const text = typeof rev === 'string' ? rev : rev.text || rev.review_text || ''
                const author = typeof rev === 'string' ? 'Customer' : rev.author_name || rev.author || 'Customer'
                if (!text) return null
                return (
                  <div className="rev" key={i}>
                    <div className="rev-q">"</div>
                    <div className="rev-stars">★★★★★</div>
                    <p className="rev-text">{text}</p>
                    <div className="rev-foot">
                      <div className="rev-avatar">{author[0]}</div>
                      <div>
                        <div className="rev-name">{author}</div>
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

      {/* PRICING */}
      <div className="section-full" id="pricing">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="eyebrow"><div className="ey-line"/><span className="ey-tag">Simple pricing</span></div>
          <h2 className="sec-title">No surprises. No contracts.</h2>
          <p className="sec-sub">This demo was built free. If you love it, choose a plan — live in 7 days.</p>
          <div className="pricing-wrap">
            {[
              { tier:'Starter', price:'$47', per:'/mo', feats:['Site on synthiq subdomain','Mobile-first responsive design','Click-to-call button','Google reviews displayed','Basic SEO setup'] },
              { tier:'Standard', price:'$97', per:'/mo', hot:true, feats:['Your own custom domain','Everything in Starter','Monthly content updates','Google Analytics setup','Priority support'] },
              { tier:'Pro', price:'$197', per:'/mo', feats:['Everything in Standard','Online booking system','Automated review requests','Local SEO optimization','Social media feed'] },
            ].map(p => (
              <div className={`pc${p.hot?' hot':''}`} key={p.tier}>
                {p.hot && <div className="pc-badge">Most Popular</div>}
                <div className="pc-tier">{p.tier}</div>
                <div><span className="pc-price">{p.price}</span><span className="pc-per">{p.per}</span></div>
                <div className="pc-dep">$200 deposit · cancel anytime</div>
                <div className="pc-div" />
                <ul className="pc-feats">
                  {p.feats.map((f,i) => <li key={i}>{f}</li>)}
                </ul>
                <a href="mailto:ly@synthiqdesigns.com" className="pc-btn">Get Started</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="cta-section" id="contact">
        <div className="eyebrow" style={{ justifyContent:'center' }}>
          <div className="ey-line"/>
          <span className="ey-tag">Ready to go live?</span>
          <div className="ey-line"/>
        </div>
        <h2 className="cta-title">
          Let's make it<br /><span>officially yours.</span>
        </h2>
        <p className="cta-sub">
          This demo was built free by Synthiq. Reply to the email you received and we'll have your real site live within 7 days. Everything is negotiable — price, features, timeline.
        </p>
        <div className="cta-btns">
          <a href={`mailto:ly@synthiqdesigns.com?subject=I want to go live — ${lead.business_name}`} className="btn-main">
            Email Ly Now
          </a>
          {lead.phone && <a href={`tel:${lead.phone}`} className="btn-outline">{lead.phone}</a>}
        </div>
        <div className="contact-strip">
          {lead.phone && <div className="cs-block"><div className="cs-label">Phone</div><div className="cs-val"><a href={`tel:${lead.phone}`}>{lead.phone}</a></div></div>}
          {lead.address && <div className="cs-block"><div className="cs-label">Address</div><div className="cs-val">{lead.address}</div></div>}
          {lead.hours && Object.keys(lead.hours).length > 0 && (
            <div className="cs-block">
              <div className="cs-label">Hours</div>
              <div className="cs-val" style={{fontSize:13,lineHeight:1.8}}>
                {Object.entries(lead.hours).slice(0,3).map(([day,hrs]) => (
                  <div key={day}><span style={{color:'rgba(255,255,255,0.35)',fontSize:10}}>{day.slice(0,3).toUpperCase()}</span> {hrs}</div>
                ))}
              </div>
            </div>
          )}
          <div className="cs-block"><div className="cs-label">Built by</div><div className="cs-val"><a href="mailto:ly@synthiqdesigns.com">ly@synthiqdesigns.com</a></div></div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-left">
          © 2026 {lead.business_name} · {lead.city}, GA<br/>
          <span style={{opacity:0.6,fontSize:10}}>Demo website built free by Synthiq Web Design · not yet live</span>
        </div>
        <div className="footer-right">synth<span>iq</span></div>
      </footer>

      <script dangerouslySetInnerHTML={{ __html: `
        var nav = document.getElementById('sitenav');
        var ph = document.getElementById('hero-photo');
        window.addEventListener('scroll',function(){
          var y = window.scrollY;
          if(y>50) nav.classList.add('stuck'); else nav.classList.remove('stuck');
          if(ph) ph.style.transform = 'scale(1.06) translateY('+(y*0.12)+'px)';
        },{passive:true});
      `}} />
    </>
  )
}
