import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import BookingCart from './_components/BookingCart'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

function getDeterministicHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

export async function generateMetadata({ params }) {
  const { data } = await supabase.from('business_leads').select('business_name,category,city,google_rating,review_count').eq('slug', params.slug).single()
  if (!data) return { title: 'Demo Site — Synthiq' }
  return {
    title: `${data.business_name} — ${data.category} in ${data.city}, GA`,
    description: `${data.business_name} — top-rated ${data.category} in ${data.city}, GA with ${data.review_count} Google reviews averaging ${data.google_rating} stars.`,
  }
}

export default async function DynamicBusinessDemoPage({ params }) {
  const { slug } = params
  const { data: lead, error } = await supabase.from('business_leads').select('*').eq('slug', slug).single()
  if (error || !lead) notFound()

  const variantHash = getDeterministicHash(slug || 'synthiq')

  const dnaFallbacks = {
    'Nail Salon':       { bg:'#0d0810', accent:'#d4a0c0', displayFont:'Cormorant Garamond', bodyFont:'Lato', style:'italic' },
    'Barbershop':       { bg:'#080c10', accent:'#c9972a', displayFont:'Oswald', bodyFont:'Barlow', style:'normal' },
    'Restaurant':       { bg:'#0a0600', accent:'#e8a020', displayFont:'Playfair Display', bodyFont:'Nunito', style:'italic' },
    'HVAC':             { bg:'#060c18', accent:'#4a9eff', displayFont:'Rajdhani', bodyFont:'Open Sans', style:'normal' },
    'Auto Repair':      { bg:'#0a0a0a', accent:'#ff6800', displayFont:'Barlow Condensed', bodyFont:'Barlow', style:'normal' },
    'Contractor':       { bg:'#0a0806', accent:'#f09010', displayFont:'Oswald', bodyFont:'Source Sans Pro', style:'normal' },
    'Plumber':          { bg:'#04091a', accent:'#4090ff', displayFont:'Oswald', bodyFont:'Roboto', style:'normal' },
    'Electrician':      { bg:'#0f0c00', accent:'#f5c800', displayFont:'Exo 2', bodyFont:'Roboto', style:'normal' },
    'Painter':          { bg:'#0c0818', accent:'#b060f8', displayFont:'Playfair Display', bodyFont:'Raleway', style:'italic' },
    'Landscaping':      { bg:'#040c04', accent:'#6ab840', displayFont:'Playfair Display', bodyFont:'Lato', style:'italic' },
    'Cleaning Service': { bg:'#fafafa', accent:'#00d4a8', displayFont:'Poppins', bodyFont:'Open Sans', style:'normal', lightMode:true },
    'Pest Control':     { bg:'#fafafa', accent:'#5cb85c', displayFont:'Exo 2', bodyFont:'Open Sans', style:'normal', lightMode:true },
    'Pressure Washing': { bg:'#020d1a', accent:'#00c4d8', displayFont:'Barlow Condensed', bodyFont:'Barlow', style:'normal' },
    'Roofer':           { bg:'#0c0806', accent:'#e85020', displayFont:'Oswald', bodyFont:'Source Sans Pro', style:'normal' },
  }

  const fb = dnaFallbacks[lead.category] || dnaFallbacks['Nail Salon']
  const bgColor = lead.primary_color || fb.bg
  const accentColor = lead.secondary_color || fb.accent
  const displayFont = lead.font_display || fb.displayFont
  const bodyFont = lead.font_body || fb.bodyFont
  const fontStyle = fb.style
  const isLight = !!fb.lightMode
  const textCol = isLight ? '#111' : '#fff'
  const subCol = isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)'
  const cardBg = isLight ? '#fff' : 'rgba(255,255,255,0.03)'
  const borderCol = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'

  const layouts = {
    heroAlign: ['center','left','right'][variantHash % 3],
    gallery: ['masonry','magazine','grid'][variantHash % 3],
    reviews: ['cards','pullquotes','split'][variantHash % 3],
    spanFirst: (variantHash % 2 === 0),
  }

  const photos = lead.photo_urls || []
  const heroImg = photos[0] || ''
  const galleryImgs = photos.slice(1, 8)
  const ambientImg = photos[photos.length - 1] || ''
  const reviews = (lead.google_reviews || []).filter(r => (r?.text || '').length > 10)
  const services = lead.services || []
  const brand = lead.brand_content || {}
  const hours = lead.hours || {}
  const rating = lead.google_rating || 4.8
  const reviewCount = lead.review_count || 0

  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(displayFont)}:ital,wght@0,300;0,400;0,700;1,300;1,400&family=${encodeURIComponent(bodyFont)}:wght@300;400;700&display=swap`

  return (
    <div style={{ backgroundColor:bgColor, color:textCol, fontFamily:`"${bodyFont}",sans-serif`, margin:0, padding:0, overflowX:'hidden', WebkitFontSmoothing:'antialiased' }}>

      <style dangerouslySetInnerHTML={{__html:`
        @import url('${fontUrl}');
        html{scroll-behavior:smooth}
        .nav-blur{backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
        .gz{transition:transform 0.6s cubic-bezier(0.16,1,0.3,1)}
        .gz:hover{transform:scale(1.04)}
        .lift{transition:transform 0.4s cubic-bezier(0.16,1,0.3,1),box-shadow 0.4s ease}
        .lift:hover{transform:translateY(-6px);box-shadow:0 20px 40px rgba(0,0,0,0.15)}
        .glow{animation:pg 3s infinite}
        @keyframes pg{0%{box-shadow:0 0 0 0 ${accentColor}40}70%{box-shadow:0 0 0 15px ${accentColor}00}100%{box-shadow:0 0 0 0 ${accentColor}00}}
        @media(max-width:768px){
          .rstack{grid-template-columns:1fr !important;gap:40px !important}
          .rhero{text-align:center !important;padding:0 20px !important}
          .rgal{grid-template-columns:1fr 1fr !important}
          .mhide{display:none !important}
          .mbar{display:flex !important}
        }
        @media(max-width:480px){.rgal{grid-template-columns:1fr !important}}
      `}}/>

      {/* NAV */}
      <nav className="nav-blur" style={{ position:'sticky', top:0, zIndex:1000, width:'100%', padding:'18px 5vw', display:'flex', alignItems:'center', justifyContent:'space-between', backgroundColor:isLight?'rgba(250,250,250,0.85)':`${bgColor}cc`, borderBottom:`1px solid ${borderCol}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {lead.logo_url ? (
            <img src={lead.logo_url} alt="" style={{ height:36, width:'auto', objectFit:'contain' }} />
          ) : (
            <span style={{ fontFamily:`"${displayFont}",serif`, fontSize:24, fontWeight:700, color:accentColor }}>{lead.business_name[0]}</span>
          )}
          <span style={{ fontFamily:`"${displayFont}",serif`, fontSize:18, fontWeight:400, letterSpacing:'0.02em' }}>{lead.business_name}</span>
        </div>
        <div className="mhide" style={{ display:'flex', gap:28, fontSize:11, textTransform:'uppercase', letterSpacing:'2.5px' }}>
          {['Gallery','Services','Reviews','Pricing'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color:subCol, textDecoration:'none', fontFamily:'system-ui', fontWeight:500 }}>{l}</a>
          ))}
        </div>
        <a href="#services" style={{ padding:'10px 22px', border:`1px solid ${accentColor}`, color:isLight?'#111':accentColor, backgroundColor:isLight?accentColor:'transparent', textDecoration:'none', fontSize:11, textTransform:'uppercase', letterSpacing:'2px', fontWeight:700, fontFamily:'system-ui' }}>
          {brand.cta_text || 'Book Now'}
        </a>
      </nav>

      {/* HERO */}
      <section style={{ height:'92vh', minHeight:640, position:'relative', display:'flex', alignItems:'center', justifyContent:layouts.heroAlign==='center'?'center':layouts.heroAlign==='left'?'flex-start':'flex-end', padding:'0 8vw', overflow:'hidden' }}>
        {heroImg && <img src={heroImg} alt={lead.business_name} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:1, opacity:isLight?0.12:0.35, transform:'scale(1.02)' }} />}
        <div style={{ position:'absolute', inset:0, background:isLight?'linear-gradient(to top,#fafafa,transparent)':`linear-gradient(to top,${bgColor},transparent 90%)`, zIndex:2 }} />
        <div style={{ position:'absolute', inset:0, background:isLight?'none':`linear-gradient(110deg,${bgColor}fa 0%,${bgColor}88 50%,transparent 100%)`, zIndex:2 }} />

        <div className="rhero" style={{ position:'relative', zIndex:10, maxWidth:850, textAlign:layouts.heroAlign==='center'?'center':'left' }}>
          {lead.tagline && (
            <p style={{ fontFamily:`"${displayFont}",serif`, fontStyle, color:accentColor, fontSize:'clamp(14px,2.5vw,20px)', marginBottom:20, letterSpacing:'1px' }}>
              {lead.tagline}
            </p>
          )}
          <h1 style={{ fontFamily:`"${displayFont}",serif`, fontSize:'clamp(44px,7.5vw,88px)', fontWeight:300, lineHeight:1.05, marginBottom:8, letterSpacing:'-1px' }}>
            {brand.hero_headline_line1 || lead.business_name}
          </h1>
          <h1 style={{ fontFamily:`"${displayFont}",serif`, fontSize:'clamp(44px,7.5vw,88px)', fontWeight:300, lineHeight:1.05, marginBottom:28, fontStyle, color:accentColor, letterSpacing:'-1px' }}>
            {brand.hero_headline_line2 || ''}
          </h1>
          <p style={{ fontSize:'clamp(14px,1.6vw,18px)', lineHeight:1.7, opacity:0.85, maxWidth:600, margin:layouts.heroAlign==='center'?'0 auto 40px':'0 0 40px' }}>
            {brand.hero_subtext || ''}
          </p>
          <div style={{ display:'flex', gap:16, justifyContent:layouts.heroAlign==='center'?'center':'flex-start', flexWrap:'wrap' }}>
            <a href="#services" className="glow" style={{ padding:'18px 44px', backgroundColor:accentColor, color:isLight?'#fff':'#000', textDecoration:'none', fontWeight:700, fontSize:12, textTransform:'uppercase', letterSpacing:'3px', fontFamily:'system-ui', display:'inline-block' }}>
              {brand.cta_text || 'Book Now'}
            </a>
            {lead.phone && (
              <a href={`tel:${lead.phone}`} style={{ padding:'18px 36px', border:`1px solid ${borderCol}`, color:textCol, textDecoration:'none', fontSize:12, textTransform:'uppercase', letterSpacing:'2.5px', fontWeight:600, fontFamily:'system-ui', display:'inline-block' }}>
                Call {lead.phone}
              </a>
            )}
          </div>

          {reviewCount > 0 && (
            <div style={{ display:'inline-flex', alignItems:'center', gap:14, marginTop:44, padding:'14px 24px', background:isLight?'rgba(0,0,0,0.04)':'rgba(255,255,255,0.05)', border:`1px solid ${borderCol}`, backdropFilter:'blur(8px)' }}>
              <span style={{ color:accentColor, fontSize:16, letterSpacing:'2px' }}>{'★'.repeat(Math.round(rating))}</span>
              <span style={{ fontSize:13, color:subCol, fontFamily:'system-ui' }}><strong style={{ color:textCol }}>{rating}</strong> · {reviewCount.toLocaleString()} Google Reviews</span>
            </div>
          )}
        </div>
      </section>

      {/* TRUST BAR */}
      <section style={{ padding:'28px 5vw', backgroundColor:cardBg, borderTop:`1px solid ${borderCol}`, borderBottom:`1px solid ${borderCol}`, display:'flex', flexWrap:'wrap', justifyContent:'space-around', alignItems:'center', gap:20, fontSize:14, letterSpacing:'0.5px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ color:accentColor, fontSize:18 }}>★</span>
          <strong>{rating} Stars</strong>
          <span style={{ opacity:0.5 }}>({reviewCount} Reviews)</span>
        </div>
        <div className="mhide" style={{ width:1, height:20, background:borderCol }} />
        <div>Serving <strong>{lead.city}, GA</strong></div>
        <div className="mhide" style={{ width:1, height:20, background:borderCol }} />
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ color:accentColor }}>✓</span>
          <span>Verified on Google</span>
        </div>
      </section>

      {/* GALLERY */}
      {galleryImgs.length > 0 && (
        <section id="gallery" style={{ padding:'100px 6vw' }}>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <p style={{ textTransform:'uppercase', letterSpacing:'3px', fontSize:10, color:accentColor, marginBottom:10, fontFamily:'system-ui', fontWeight:600 }}>Our Work</p>
            <h2 style={{ fontFamily:`"${displayFont}",serif`, fontSize:'clamp(28px,4vw,48px)', fontWeight:300, margin:0 }}>
              See for <span style={{ fontStyle }}>yourself.</span>
            </h2>
          </div>

          {layouts.gallery === 'magazine' ? (
            <div className="rgal" style={{ display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap:4 }}>
              {galleryImgs.map((url, i) => (
                <div key={i} className="gz" style={{ gridColumn: i===0&&layouts.spanFirst?'span 8':i===1?'span 4':'span 4', height:i<2?520:300, overflow:'hidden' }}>
                  <img src={url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} loading="lazy" />
                </div>
              ))}
            </div>
          ) : layouts.gallery === 'masonry' ? (
            <div className="rgal" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:4 }}>
              {galleryImgs.map((url, i) => (
                <div key={i} className="gz" style={{ gridColumn:i===0&&layouts.spanFirst?'span 2':'auto', aspectRatio:i===0&&layouts.spanFirst?'16/9':'4/3', overflow:'hidden' }}>
                  <img src={url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} loading="lazy" />
                </div>
              ))}
            </div>
          ) : (
            <div className="rgal" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:4 }}>
              {galleryImgs.map((url, i) => (
                <div key={i} className="gz" style={{ height:340, overflow:'hidden' }}>
                  <img src={url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* SERVICES + BOOKING + REVIEWS */}
      <section id="services" style={{ padding:'100px 6vw', backgroundColor:cardBg, borderTop:`1px solid ${borderCol}`, borderBottom:`1px solid ${borderCol}` }}>
        <div className="rstack" style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:80, maxWidth:1400, margin:'0 auto' }}>
          <div>
            <p style={{ textTransform:'uppercase', letterSpacing:'3px', fontSize:10, color:accentColor, marginBottom:10, fontFamily:'system-ui', fontWeight:600 }}>Services</p>
            <h2 style={{ fontFamily:`"${displayFont}",serif`, fontSize:'clamp(28px,4vw,52px)', fontWeight:300, marginTop:0, marginBottom:48 }}>
              Select <span style={{ fontStyle }}>Treatments</span>
            </h2>
            <BookingCart services={services} accentColor={accentColor} businessSlug={lead.slug} businessName={lead.business_name} />
          </div>

          <div id="reviews" style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <div style={{ marginBottom:48 }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:10 }}>
                <span style={{ fontSize:'clamp(40px,5vw,56px)', fontWeight:700, fontFamily:`"${displayFont}",serif` }}>{rating}</span>
                <div style={{ color:accentColor, fontSize:22 }}>{'★'.repeat(Math.floor(rating))}</div>
              </div>
              <p style={{ textTransform:'uppercase', letterSpacing:'3px', fontSize:10, color:accentColor, fontFamily:'system-ui', fontWeight:600 }}>
                {reviewCount} Google Reviews
              </p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
              {reviews.slice(0,4).map((rev, i) => (
                <div key={i} className="lift" style={{ padding:36, backgroundColor:isLight?'#fff':'rgba(255,255,255,0.03)', border:`1px solid ${borderCol}` }}>
                  <div style={{ color:accentColor, fontSize:13, letterSpacing:'2px', marginBottom:20 }}>{'★'.repeat(rev.rating || 5)}</div>
                  <p style={{ fontSize:15, fontStyle:'italic', lineHeight:1.7, marginBottom:24, fontFamily:`"${displayFont}",serif`, color:isLight?'rgba(0,0,0,0.75)':'rgba(255,255,255,0.75)' }}>
                    "{rev.text}"
                  </p>
                  <div style={{ width:30, height:1, background:accentColor, marginBottom:12 }} />
                  <span style={{ fontWeight:700, fontSize:12, letterSpacing:'1px' }}>{rev.author || rev.author_name || 'Customer'}</span>
                  <br /><span style={{ fontSize:10, opacity:0.4, textTransform:'uppercase' }}>Google Review</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding:'100px 6vw' }}>
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <p style={{ textTransform:'uppercase', letterSpacing:'3px', fontSize:10, color:accentColor, marginBottom:10, fontFamily:'system-ui', fontWeight:600 }}>Simple Pricing</p>
          <h2 style={{ fontFamily:`"${displayFont}",serif`, fontSize:'clamp(28px,4vw,48px)', fontWeight:300, margin:0 }}>
            No surprises. <span style={{ fontStyle }}>No contracts.</span>
          </h2>
        </div>
        <div className="rstack" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, maxWidth:1200, margin:'0 auto', border:`1px solid ${borderCol}` }}>
          {[
            { name:'Starter', price:'$47', per:'/mo', feats:['Site on synthiq subdomain','Mobile-first responsive design','Click-to-call button','Google reviews displayed','Basic SEO setup'] },
            { name:'Standard', price:'$97', per:'/mo', hot:true, feats:['Your own custom domain','Everything in Starter','Monthly content updates','Google Analytics setup','Priority support'] },
            { name:'Pro', price:'$197', per:'/mo', feats:['Everything in Standard','Online booking system','Automated review requests','Local SEO optimization','Social media feed'] },
          ].map(plan => (
            <div key={plan.name} style={{ padding:'48px 36px', backgroundColor:plan.hot?`${accentColor}12`:bgColor, border:plan.hot?`1px solid ${accentColor}33`:'none', position:'relative' }}>
              {plan.hot && <div style={{ position:'absolute', top:-1, left:36, background:accentColor, color:isLight?'#fff':'#000', fontSize:9, fontWeight:700, letterSpacing:'2.5px', padding:'4px 14px', fontFamily:'system-ui', textTransform:'uppercase' }}>Most Popular</div>}
              <div style={{ fontSize:9, letterSpacing:'4px', textTransform:'uppercase', color:subCol, fontFamily:'system-ui', marginBottom:18 }}>{plan.name}</div>
              <div><span style={{ fontSize:'clamp(36px,4.5vw,52px)', fontWeight:700, fontFamily:`"${displayFont}",serif` }}>{plan.price}</span><span style={{ fontSize:13, fontWeight:300, color:subCol }}>{plan.per}</span></div>
              <div style={{ fontSize:10, color:subCol, margin:'8px 0 26px', fontFamily:'system-ui' }}>$200 deposit · cancel anytime</div>
              <div style={{ height:1, background:borderCol, marginBottom:26 }} />
              <ul style={{ listStyle:'none', padding:0, marginBottom:32 }}>
                {plan.feats.map((f,i) => (
                  <li key={i} style={{ fontSize:12, color:plan.hot?(isLight?'rgba(0,0,0,0.7)':'rgba(255,255,255,0.65)'):subCol, padding:'8px 0', borderBottom:`1px solid ${borderCol}`, display:'flex', gap:10, fontFamily:'system-ui', lineHeight:1.4 }}>
                    <span style={{ color:accentColor, flexShrink:0 }}>→</span>{f}
                  </li>
                ))}
              </ul>
              <a href="mailto:ly@synthiqdesigns.com" style={{ display:'block', textAlign:'center', padding:14, fontSize:10, fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', fontFamily:'system-ui', background:plan.hot?accentColor:'transparent', color:plan.hot?(isLight?'#fff':'#000'):subCol, border:plan.hot?'none':`1px solid ${borderCol}`, textDecoration:'none' }}>
                Get Started
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'120px 5vw', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:700, borderRadius:'50%', background:accentColor, opacity:0.035, filter:'blur(100px)', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:10, maxWidth:800, margin:'0 auto' }}>
          <h2 style={{ fontFamily:`"${displayFont}",serif`, fontSize:'clamp(32px,5.5vw,64px)', fontWeight:300, marginBottom:28, lineHeight:1.1 }}>
            Let's make it<br /><span style={{ fontStyle, color:accentColor }}>officially yours.</span>
          </h2>
          <p style={{ fontSize:17, color:subCol, marginBottom:48, lineHeight:1.7 }}>
            This demo was built free by Synthiq. Reply to the email you received and we'll have your site live within 7 days.
          </p>
          <a href={`mailto:ly@synthiqdesigns.com?subject=I want to go live — ${lead.business_name}`} className="glow" style={{ padding:'20px 52px', backgroundColor:accentColor, color:isLight?'#fff':'#000', textDecoration:'none', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'3px', fontFamily:'system-ui', display:'inline-block' }}>
            Email Ly Now
          </a>
        </div>
      </section>

      {/* CONTACT + HOURS */}
      <section style={{ padding:'80px 6vw', borderTop:`1px solid ${borderCol}`, backgroundColor:cardBg }}>
        <div className="rstack" style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:80, maxWidth:1300, margin:'0 auto' }}>
          <div>
            <h3 style={{ fontFamily:`"${displayFont}",serif`, fontSize:28, fontWeight:400, marginBottom:28, marginTop:0 }}>Get In Touch</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:24, fontSize:15 }}>
              {lead.address && <div><span style={{ color:accentColor, fontWeight:700, display:'block', textTransform:'uppercase', fontSize:9, letterSpacing:'2.5px', marginBottom:6, fontFamily:'system-ui' }}>Address</span>{lead.address}</div>}
              {lead.phone && <div><span style={{ color:accentColor, fontWeight:700, display:'block', textTransform:'uppercase', fontSize:9, letterSpacing:'2.5px', marginBottom:6, fontFamily:'system-ui' }}>Phone</span><a href={`tel:${lead.phone}`} style={{ color:textCol, textDecoration:'none' }}>{lead.phone}</a></div>}
              <div><span style={{ color:accentColor, fontWeight:700, display:'block', textTransform:'uppercase', fontSize:9, letterSpacing:'2.5px', marginBottom:6, fontFamily:'system-ui' }}>Built By</span><a href="mailto:ly@synthiqdesigns.com" style={{ color:subCol, textDecoration:'none' }}>ly@synthiqdesigns.com</a></div>
            </div>
          </div>
          {Object.keys(hours).length > 0 && (
            <div style={{ padding:36, border:`1px solid ${borderCol}`, backgroundColor:bgColor }}>
              <h4 style={{ fontFamily:`"${displayFont}",serif`, fontSize:20, marginTop:0, marginBottom:24, color:accentColor }}>Hours</h4>
              <div style={{ display:'flex', flexDirection:'column', gap:12, fontSize:14 }}>
                {Object.entries(hours).map(([day, val]) => (
                  <div key={day} style={{ display:'flex', justifyContent:'space-between', borderBottom:`1px solid ${borderCol}`, paddingBottom:8 }}>
                    <span style={{ fontWeight:600 }}>{day}</span>
                    <span style={{ opacity:0.7 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:'32px 6vw', borderTop:`1px solid ${borderCol}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div style={{ fontSize:11, color:subCol, lineHeight:1.9, fontFamily:'system-ui' }}>
          © 2026 {lead.business_name} · {lead.city}, GA<br />
          <span style={{ opacity:0.55, fontSize:10 }}>Demo built free by Synthiq Web Design · not yet live</span>
        </div>
        <div style={{ fontSize:12, color:subCol, fontFamily:'system-ui', opacity:0.4 }}>synth<span style={{ color:accentColor }}>iq</span></div>
      </footer>

      {/* MOBILE STICKY BAR */}
      <div className="mbar" style={{ position:'fixed', bottom:0, left:0, right:0, height:64, zIndex:9999, backgroundColor:`${bgColor}f0`, backdropFilter:'blur(20px)', borderTop:`1px solid ${borderCol}`, display:'none', alignItems:'center', justifyContent:'space-between', padding:'0 20px' }}>
        <div>
          <span style={{ display:'block', fontSize:13, fontWeight:700 }}>{lead.business_name}</span>
          <span style={{ fontSize:11, color:accentColor }}>★ {rating} on Google</span>
        </div>
        <a href="#services" style={{ height:44, minWidth:140, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:accentColor, color:isLight?'#fff':'#000', textDecoration:'none', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', fontFamily:'system-ui' }}>
          Book Now
        </a>
      </div>
    </div>
  )
}
