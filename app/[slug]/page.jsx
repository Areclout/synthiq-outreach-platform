import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const THEMES = {
  'Nail Salon': {
    primary: '#1a0a2e', accent: '#d4af37', text: '#fff',
    heroStyle: 'luxury', font: 'Georgia, serif',
    tagFont: '"Playfair Display", Georgia, serif',
    headline: 'Where beauty becomes art.',
    subtext: 'Premium nail care crafted for you.',
    ctaLabel: 'Book Now', ctaColor: '#d4af37', ctaText: '#000',
    bgOverlay: 'linear-gradient(135deg, rgba(26,10,46,0.92) 0%, rgba(60,20,80,0.85) 100%)',
    accentGlow: '#d4af37',
  },
  'Barbershop': {
    primary: '#0d1b2a', accent: '#c9a84c', text: '#fff',
    heroStyle: 'bold', font: '"Oswald", system-ui, sans-serif',
    tagFont: '"Bebas Neue", "Oswald", sans-serif',
    headline: 'Sharp cuts. Real respect.',
    subtext: 'The best barbers in Augusta.',
    ctaLabel: 'Book a Cut', ctaColor: '#c9a84c', ctaText: '#000',
    bgOverlay: 'linear-gradient(160deg, rgba(13,27,42,0.95) 0%, rgba(30,50,70,0.88) 100%)',
    accentGlow: '#c9a84c',
  },
  'Restaurant': {
    primary: '#1a0800', accent: '#f5a623', text: '#fff',
    heroStyle: 'warm', font: '"Playfair Display", Georgia, serif',
    tagFont: '"Playfair Display", Georgia, serif',
    headline: 'Authentic flavors, every time.',
    subtext: 'Made fresh. Served with heart.',
    ctaLabel: 'Call to Reserve', ctaColor: '#f5a623', ctaText: '#000',
    bgOverlay: 'linear-gradient(135deg, rgba(26,8,0,0.88) 0%, rgba(80,25,0,0.82) 100%)',
    accentGlow: '#f5a623',
  },
  'HVAC': {
    primary: '#0a1628', accent: '#3b9eff', text: '#fff',
    heroStyle: 'professional', font: 'system-ui, sans-serif',
    tagFont: 'system-ui, sans-serif',
    headline: 'Comfort you can count on.',
    subtext: 'Fast, reliable HVAC service.',
    ctaLabel: 'Get a Quote', ctaColor: '#3b9eff', ctaText: '#fff',
    bgOverlay: 'linear-gradient(135deg, rgba(10,22,40,0.95) 0%, rgba(20,45,80,0.9) 100%)',
    accentGlow: '#3b9eff',
  },
  'Pest Control': {
    primary: '#0f1f0f', accent: '#5cb85c', text: '#fff',
    heroStyle: 'bold', font: 'system-ui, sans-serif',
    tagFont: 'system-ui, sans-serif',
    headline: 'Your home, protected.',
    subtext: 'Fast, safe pest elimination.',
    ctaLabel: 'Get Free Inspection', ctaColor: '#5cb85c', ctaText: '#fff',
    bgOverlay: 'linear-gradient(135deg, rgba(15,31,15,0.95) 0%, rgba(30,60,30,0.9) 100%)',
    accentGlow: '#5cb85c',
  },
  'Pressure Washing': {
    primary: '#001830', accent: '#00b4d8', text: '#fff',
    heroStyle: 'clean', font: 'system-ui, sans-serif',
    tagFont: 'system-ui, sans-serif',
    headline: 'Like new. Every time.',
    subtext: 'Professional pressure washing services.',
    ctaLabel: 'Get a Quote', ctaColor: '#00b4d8', ctaText: '#fff',
    bgOverlay: 'linear-gradient(135deg, rgba(0,24,48,0.95) 0%, rgba(0,60,90,0.9) 100%)',
    accentGlow: '#00b4d8',
  },
  'Auto Repair': {
    primary: '#111', accent: '#ff6b00', text: '#fff',
    heroStyle: 'bold', font: 'system-ui, sans-serif',
    tagFont: 'system-ui, sans-serif',
    headline: 'Your car is in good hands.',
    subtext: 'Honest repairs. Fair prices.',
    ctaLabel: 'Call Now', ctaColor: '#ff6b00', ctaText: '#fff',
    bgOverlay: 'linear-gradient(135deg, rgba(17,17,17,0.95) 0%, rgba(40,30,20,0.92) 100%)',
    accentGlow: '#ff6b00',
  },
  'Contractor': {
    primary: '#1a1008', accent: '#ff8c00', text: '#fff',
    heroStyle: 'bold', font: 'system-ui, sans-serif',
    tagFont: 'system-ui, sans-serif',
    headline: 'Built right. Built to last.',
    subtext: 'Licensed contractors you can trust.',
    ctaLabel: 'Get a Quote', ctaColor: '#ff8c00', ctaText: '#fff',
    bgOverlay: 'linear-gradient(135deg, rgba(26,16,8,0.95) 0%, rgba(60,35,10,0.9) 100%)',
    accentGlow: '#ff8c00',
  },
  'Landscaping': {
    primary: '#0a1f0a', accent: '#7bc67e', text: '#fff',
    heroStyle: 'natural', font: '"Georgia", serif',
    tagFont: 'Georgia, serif',
    headline: 'Beautiful spaces start here.',
    subtext: 'Expert landscaping for your home.',
    ctaLabel: 'Get a Quote', ctaColor: '#7bc67e', ctaText: '#000',
    bgOverlay: 'linear-gradient(135deg, rgba(10,31,10,0.92) 0%, rgba(20,60,20,0.88) 100%)',
    accentGlow: '#7bc67e',
  },
  'Cleaning Service': {
    primary: '#001a2c', accent: '#00d4aa', text: '#fff',
    heroStyle: 'clean', font: 'system-ui, sans-serif',
    tagFont: 'system-ui, sans-serif',
    headline: 'Spotless. Every single time.',
    subtext: 'Professional cleaning you can trust.',
    ctaLabel: 'Book Cleaning', ctaColor: '#00d4aa', ctaText: '#000',
    bgOverlay: 'linear-gradient(135deg, rgba(0,26,44,0.95) 0%, rgba(0,60,80,0.9) 100%)',
    accentGlow: '#00d4aa',
  },
  'Plumber': {
    primary: '#0a1628', accent: '#4da6ff', text: '#fff',
    heroStyle: 'professional', font: 'system-ui, sans-serif',
    tagFont: 'system-ui, sans-serif',
    headline: 'Fixed fast. Done right.',
    subtext: 'Licensed plumbers, available now.',
    ctaLabel: 'Call Now', ctaColor: '#4da6ff', ctaText: '#fff',
    bgOverlay: 'linear-gradient(135deg, rgba(10,22,40,0.95) 0%, rgba(20,45,80,0.9) 100%)',
    accentGlow: '#4da6ff',
  },
  'Electrician': {
    primary: '#1a1400', accent: '#ffd700', text: '#fff',
    heroStyle: 'bold', font: 'system-ui, sans-serif',
    tagFont: 'system-ui, sans-serif',
    headline: 'Power you can rely on.',
    subtext: 'Licensed electricians, fast response.',
    ctaLabel: 'Call Now', ctaColor: '#ffd700', ctaText: '#000',
    bgOverlay: 'linear-gradient(135deg, rgba(26,20,0,0.95) 0%, rgba(60,45,0,0.9) 100%)',
    accentGlow: '#ffd700',
  },
  'Painter': {
    primary: '#1a0a2e', accent: '#b57bee', text: '#fff',
    heroStyle: 'luxury', font: 'Georgia, serif',
    tagFont: 'Georgia, serif',
    headline: 'Color that transforms.',
    subtext: 'Expert painting, flawless results.',
    ctaLabel: 'Get a Quote', ctaColor: '#b57bee', ctaText: '#fff',
    bgOverlay: 'linear-gradient(135deg, rgba(26,10,46,0.95) 0%, rgba(60,20,80,0.9) 100%)',
    accentGlow: '#b57bee',
  },
  'Roofer': {
    primary: '#1a1410', accent: '#ff6b35', text: '#fff',
    heroStyle: 'bold', font: 'system-ui, sans-serif',
    tagFont: 'system-ui, sans-serif',
    headline: 'Your roof. Our reputation.',
    subtext: 'Licensed roofers with proven results.',
    ctaLabel: 'Get Free Estimate', ctaColor: '#ff6b35', ctaText: '#fff',
    bgOverlay: 'linear-gradient(135deg, rgba(26,20,16,0.95) 0%, rgba(60,40,20,0.9) 100%)',
    accentGlow: '#ff6b35',
  },
}

const DEFAULT_THEME = THEMES['Contractor']

export async function generateMetadata({ params }) {
  const { data } = await db.from('business_leads')
    .select('business_name,category,city,google_rating,review_count')
    .eq('slug', params.slug).single()
  if (!data) return { title: 'Demo Site — Synthiq' }
  return {
    title: `${data.business_name} — ${data.city}, GA`,
    description: `${data.business_name} is a top-rated ${data.category} in ${data.city}, GA with ${data.review_count} Google reviews averaging ${data.google_rating}★.`,
  }
}

export default async function DemoSite({ params }) {
  const { data: lead } = await db.from('business_leads')
    .select('*').eq('slug', params.slug).single()
  if (!lead) notFound()

  const t = THEMES[lead.category] || DEFAULT_THEME
  const photos = lead.photo_urls || []
  const reviews = lead.google_reviews || []
  const services = lead.services || []
  const rating = lead.google_rating || 4.8
  const reviewCount = lead.review_count || 0
  const stars = Math.round(rating)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Oswald:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:${t.font};background:#0a0a0a;color:#fff;overflow-x:hidden}
        ::selection{background:${t.accent};color:#000}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:${t.accent}55;border-radius:2px}
        a{text-decoration:none;color:inherit}
        .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 5%;height:70px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(to bottom,rgba(0,0,0,0.8) 0%,transparent 100%);backdrop-filter:blur(2px)}
        .nav-logo{font-size:18px;font-weight:700;letter-spacing:1px;color:#fff}
        .nav-logo span{color:${t.accent}}
        .nav-links{display:flex;gap:32px}
        .nav-links a{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.8);transition:color 0.2s}
        .nav-links a:hover{color:${t.accent}}
        .nav-cta{background:${t.accent};color:${t.ctaText};padding:10px 24px;border-radius:4px;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;transition:opacity 0.2s;cursor:pointer;border:none}
        .nav-cta:hover{opacity:0.9}
        .hero{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .hero-bg{position:absolute;inset:0;background:${t.primary}}
        .hero-photos{position:absolute;inset:0;display:grid;grid-template-columns:repeat(3,1fr);opacity:0.35}
        .hero-photos div{background-size:cover;background-position:center;filter:saturate(0.8)}
        .hero-overlay{position:absolute;inset:0;background:${t.bgOverlay}}
        .hero-content{position:relative;z-index:2;text-align:center;padding:80px 5% 60px;max-width:900px}
        .hero-eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${t.accent};margin-bottom:24px;font-family:${t.tagFont}}
        .hero-eyebrow::before,.hero-eyebrow::after{content:'';width:30px;height:1px;background:${t.accent};opacity:0.6}
        .hero-name{font-size:clamp(42px,8vw,88px);font-weight:900;line-height:0.95;letter-spacing:-1px;color:#fff;margin-bottom:12px;font-family:${t.tagFont};text-shadow:0 4px 30px rgba(0,0,0,0.5)}
        .hero-tagline{font-size:clamp(16px,2.5vw,22px);color:rgba(255,255,255,0.75);font-style:italic;margin-bottom:32px;font-family:${t.tagFont}}
        .hero-rating{display:inline-flex;align-items:center;gap:12px;background:rgba(255,255,255,0.08);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);border-radius:50px;padding:10px 24px;margin-bottom:40px}
        .hero-stars{color:${t.accent};font-size:18px;letter-spacing:2px}
        .hero-rating-text{font-size:13px;color:rgba(255,255,255,0.85)}
        .hero-btns{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
        .btn-primary{background:${t.accent};color:${t.ctaText};padding:16px 40px;border-radius:4px;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;transition:all 0.2s;cursor:pointer;border:none;display:inline-block}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px ${t.accent}55}
        .btn-secondary{background:transparent;color:#fff;padding:16px 40px;border-radius:4px;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;border:1px solid rgba(255,255,255,0.4);transition:all 0.2s;display:inline-block}
        .btn-secondary:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.8)}
        .scroll-indicator{position:absolute;bottom:30px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;opacity:0.5}
        .scroll-indicator span{font-size:10px;letter-spacing:3px;text-transform:uppercase}
        .scroll-indicator::after{content:'';width:1px;height:40px;background:rgba(255,255,255,0.4)}
        .photos-section{padding:0;overflow:hidden}
        .photos-strip{display:flex;gap:3px;height:280px}
        .photos-strip div{flex:1;background-size:cover;background-position:center;transition:flex 0.4s ease;cursor:pointer}
        .photos-strip div:hover{flex:2}
        .section{padding:100px 5%;max-width:1200px;margin:0 auto}
        .section-label{font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${t.accent};margin-bottom:16px;display:flex;align-items:center;gap:12px;font-family:${t.tagFont}}
        .section-label::before{content:'';width:40px;height:1px;background:${t.accent}}
        .section-title{font-size:clamp(28px,4vw,48px);font-weight:800;color:#fff;margin-bottom:16px;line-height:1.1;font-family:${t.tagFont}}
        .section-sub{font-size:16px;color:rgba(255,255,255,0.55);line-height:1.7;max-width:600px}
        .services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:48px}
        .service-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:28px 24px;transition:all 0.3s;cursor:default}
        .service-card:hover{background:rgba(255,255,255,0.07);border-color:${t.accent}44;transform:translateY(-4px)}
        .service-card-icon{font-size:28px;margin-bottom:14px}
        .service-card-name{font-size:15px;font-weight:600;color:#fff;margin-bottom:8px}
        .service-card-desc{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.5}
        .reviews-section{background:rgba(255,255,255,0.02);border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06)}
        .reviews-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;margin-top:48px}
        .review-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:28px;position:relative;overflow:hidden}
        .review-card::before{content:'"';position:absolute;top:-10px;left:20px;font-size:120px;color:${t.accent};opacity:0.08;font-family:Georgia,serif;line-height:1}
        .review-stars{color:${t.accent};font-size:14px;letter-spacing:2px;margin-bottom:16px}
        .review-text{font-size:14px;color:rgba(255,255,255,0.75);line-height:1.75;font-style:italic;margin-bottom:20px}
        .review-author{font-size:12px;color:${t.accent};font-weight:600;letter-spacing:1px;text-transform:uppercase}
        .stats-bar{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,0.06);border-top:1px solid rgba(255,255,255,0.06)}
        .stat-item{padding:40px 24px;text-align:center;background:#0a0a0a}
        .stat-num{font-size:clamp(32px,4vw,48px);font-weight:900;color:${t.accent};line-height:1;font-family:${t.tagFont}}
        .stat-label{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-top:8px}
        .cta-section{background:linear-gradient(135deg,${t.primary} 0%,${t.accent}22 100%);border-top:1px solid ${t.accent}22;padding:100px 5%;text-align:center}
        .cta-title{font-size:clamp(32px,5vw,60px);font-weight:900;color:#fff;margin-bottom:16px;font-family:${t.tagFont}}
        .cta-title span{color:${t.accent}}
        .cta-sub{font-size:18px;color:rgba(255,255,255,0.6);margin-bottom:48px;max-width:540px;margin-left:auto;margin-right:auto}
        .cta-contact{display:flex;gap:20px;justify-content:center;flex-wrap:wrap;margin-bottom:48px}
        .contact-item{display:flex;align-items:center;gap:10px;font-size:15px;color:rgba(255,255,255,0.7)}
        .contact-icon{width:40px;height:40px;border-radius:50%;background:${t.accent}22;border:1px solid ${t.accent}44;display:flex;align-items:center;justify-content:center;font-size:16px}
        .pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:900px;margin:0 auto 60px;text-align:left}
        .pricing-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:32px 28px}
        .pricing-card.featured{background:${t.accent}15;border-color:${t.accent}55;position:relative}
        .pricing-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:${t.accent};color:${t.ctaText};font-size:10px;font-weight:700;letter-spacing:2px;padding:4px 16px;border-radius:20px;text-transform:uppercase;white-space:nowrap}
        .pricing-name{font-size:13px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:8px}
        .pricing-price{font-size:40px;font-weight:900;color:#fff;line-height:1;margin-bottom:4px;font-family:${t.tagFont}}
        .pricing-price span{font-size:16px;font-weight:400;color:rgba(255,255,255,0.4)}
        .pricing-deposit{font-size:12px;color:rgba(255,255,255,0.3);margin-bottom:24px}
        .pricing-features{list-style:none;margin-bottom:28px}
        .pricing-features li{font-size:13px;color:rgba(255,255,255,0.6);padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;gap:10px;align-items:flex-start}
        .pricing-features li::before{content:'✓';color:${t.accent};flex-shrink:0;font-weight:700}
        .pricing-btn{display:block;text-align:center;padding:12px;border-radius:6px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border:1px solid ${t.accent}66;color:${t.accent};transition:all 0.2s}
        .pricing-card.featured .pricing-btn{background:${t.accent};color:${t.ctaText};border-color:transparent}
        .pricing-btn:hover{background:${t.accent};color:${t.ctaText};border-color:transparent}
        .footer{background:#050505;border-top:1px solid rgba(255,255,255,0.05);padding:32px 5%;display:flex;align-items:center;justify-content:space-between}
        .footer-left{font-size:12px;color:rgba(255,255,255,0.25);line-height:1.8}
        .footer-logo{font-size:14px;font-weight:700;color:rgba(255,255,255,0.2)}
        .footer-logo span{color:${t.accent}66}
        @media(max-width:768px){
          .nav-links{display:none}
          .hero-name{font-size:clamp(36px,12vw,60px)}
          .stats-bar{grid-template-columns:repeat(2,1fr)}
          .pricing-grid{grid-template-columns:1fr}
          .photos-strip{height:200px}
          .footer{flex-direction:column;gap:12px;text-align:center}
        }
      `}} />

      {/* Nav */}
      <nav className="nav">
        <div className="nav-logo">{lead.business_name.split(' ')[0]}<span>.</span></div>
        <div className="nav-links">
          {['About','Services','Gallery','Reviews','Contact'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}>{l}</a>
          ))}
        </div>
        <a href={`tel:${lead.phone}`} className="nav-cta">{t.ctaLabel}</a>
      </nav>

      {/* Hero */}
      <section className="hero" id="about">
        <div className="hero-bg" />
        {photos.length > 0 && (
          <div className="hero-photos">
            {photos.slice(0,3).map((url,i) => (
              <div key={i} style={{ backgroundImage: `url(${url})` }} />
            ))}
          </div>
        )}
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-eyebrow">{lead.category} &nbsp;·&nbsp; {lead.city}, Georgia</div>
          <h1 className="hero-name">{lead.business_name}</h1>
          <p className="hero-tagline">{lead.tagline || t.subtext}</p>
          {reviewCount > 0 && (
            <div style={{ display:'flex', justifyContent:'center', marginBottom:40 }}>
              <div className="hero-rating">
                <span className="hero-stars">{'★'.repeat(stars)}</span>
                <span className="hero-rating-text"><strong>{rating}</strong> · {reviewCount.toLocaleString()} Google Reviews</span>
              </div>
            </div>
          )}
          <div className="hero-btns">
            <a href={`tel:${lead.phone}`} className="btn-primary">{t.ctaLabel}</a>
            <a href="#reviews" className="btn-secondary">See Reviews</a>
          </div>
        </div>
        <div className="scroll-indicator"><span>Scroll</span></div>
      </section>

      {/* Photo strip */}
      {photos.length > 1 && (
        <div className="photos-section" id="gallery">
          <div className="photos-strip">
            {photos.slice(0, Math.min(photos.length, 6)).map((url, i) => (
              <div key={i} style={{ backgroundImage: `url(${url})` }} />
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stats-bar">
        {[
          { num: `${rating}★`, label: 'Google Rating' },
          { num: reviewCount > 0 ? reviewCount.toLocaleString() : '—', label: 'Reviews' },
          { num: lead.city, label: 'Location' },
          { num: lead.phone || 'Call us', label: 'Phone' },
        ].map(s => (
          <div className="stat-item" key={s.label}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Services */}
      {services.length > 0 && (
        <div style={{ background:'#0a0a0a' }} id="services">
          <div className="section">
            <div className="section-label">What we offer</div>
            <h2 className="section-title">Our Services</h2>
            <p className="section-sub">Everything you need, done right.</p>
            <div className="services-grid">
              {services.map((svc, i) => {
                const name = typeof svc === 'string' ? svc : svc.name || ''
                return (
                  <div className="service-card" key={i}>
                    <div className="service-card-name">{name}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="reviews-section" id="reviews">
          <div className="section">
            <div className="section-label">What people say</div>
            <h2 className="section-title">Real Reviews</h2>
            <p className="section-sub">From real customers on Google.</p>
            <div className="reviews-grid">
              {reviews.slice(0,6).map((rev, i) => {
                const text = typeof rev === 'string' ? rev : rev.text || rev.review_text || ''
                const author = typeof rev === 'string' ? 'Google Review' : rev.author_name || rev.author || 'Google Review'
                if (!text) return null
                return (
                  <div className="review-card" key={i}>
                    <div className="review-stars">{'★'.repeat(5)}</div>
                    <p className="review-text">"{text}"</p>
                    <div className="review-author">— {author}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* CTA + Pricing */}
      <section className="cta-section" id="contact">
        <div className="section-label" style={{ justifyContent:'center' }}>Get started today</div>
        <h2 className="cta-title">Ready to go live?<br /><span>Let's make it happen.</span></h2>
        <p className="cta-sub">This demo was built free by Synthiq. If you love it, we'll make it officially yours — custom domain, live within 7 days.</p>

        <div className="cta-contact">
          {lead.phone && <div className="contact-item"><div className="contact-icon">📞</div><a href={`tel:${lead.phone}`}>{lead.phone}</a></div>}
          {lead.address && <div className="contact-item"><div className="contact-icon">📍</div><span>{lead.address}</span></div>}
          <div className="contact-item"><div className="contact-icon">✉️</div><a href="mailto:ly@synthiqdesigns.com">ly@synthiqdesigns.com</a></div>
        </div>

        <div className="pricing-grid">
          {[
            { name:'Starter', price:'$47', per:'/mo', deposit:'$200 deposit', features:['Site on synthiq subdomain','Mobile-responsive design','Click-to-call button','Google reviews displayed','Basic SEO setup'], featured:false },
            { name:'Standard', price:'$97', per:'/mo', deposit:'$200 deposit · most popular', features:['Your own custom domain','Everything in Starter','Monthly content updates','Google Analytics','Priority support'], featured:true },
            { name:'Pro', price:'$197', per:'/mo', deposit:'$200 deposit', features:['Everything in Standard','Online booking system','Automated review requests','Local SEO optimization','Social media feed'], featured:false },
          ].map(plan => (
            <div className={`pricing-card${plan.featured?' featured':''}`} key={plan.name}>
              {plan.featured && <div className="pricing-badge">Most Popular</div>}
              <div className="pricing-name">{plan.name}</div>
              <div className="pricing-price">{plan.price}<span>{plan.per}</span></div>
              <div className="pricing-deposit">{plan.deposit}</div>
              <ul className="pricing-features">
                {plan.features.map((f,i) => <li key={i}>{f}</li>)}
              </ul>
              <a href="mailto:ly@synthiqdesigns.com" className="pricing-btn">Get Started</a>
            </div>
          ))}
        </div>

        <div className="hero-btns">
          <a href="mailto:ly@synthiqdesigns.com?subject=I want to go live" className="btn-primary">Email Ly Now</a>
          {lead.phone && <a href={`tel:${lead.phone}`} className="btn-secondary">{lead.phone}</a>}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-left">
          © 2026 {lead.business_name} · {lead.city}, GA<br />
          <span style={{ fontSize:11 }}>Demo built free by Synthiq Web Design · <a href="mailto:ly@synthiqdesigns.com" style={{ color:'rgba(255,255,255,0.3)' }}>ly@synthiqdesigns.com</a></span>
        </div>
        <div className="footer-logo">synth<span>iq</span></div>
      </footer>
    </>
  )
}
