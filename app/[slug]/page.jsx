import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import BookingCart from './_components/BookingCart'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const DNA = {
  'Nail Salon':       { bg:'#0d0810', accent:'#d4a0c0', displayFont:'Cormorant Garamond', bodyFont:'Lato', style:'italic', badge:'PREMIUM NAIL STUDIO' },
  'Barbershop':       { bg:'#080c10', accent:'#c9972a', displayFont:'Oswald', bodyFont:'Barlow', style:'normal', badge:'PREMIUM BARBERSHOP' },
  'Restaurant':       { bg:'#0a0600', accent:'#e8a020', displayFont:'Playfair Display', bodyFont:'Nunito', style:'italic', badge:'LOCAL FAVORITE' },
  'HVAC':             { bg:'#060c18', accent:'#4a9eff', displayFont:'Rajdhani', bodyFont:'Open Sans', style:'normal', badge:'CERTIFIED HVAC' },
  'Pest Control':     { bg:'#050f05', accent:'#5cb85c', displayFont:'Exo 2', bodyFont:'Open Sans', style:'normal', badge:'LICENSED & CERTIFIED' },
  'Pressure Washing': { bg:'#020d1a', accent:'#00c4d8', displayFont:'Barlow Condensed', bodyFont:'Barlow', style:'normal', badge:'FULLY INSURED' },
  'Auto Repair':      { bg:'#0a0a0a', accent:'#ff6800', displayFont:'Barlow Condensed', bodyFont:'Barlow', style:'normal', badge:'ASE CERTIFIED' },
  'Contractor':       { bg:'#0a0806', accent:'#f09010', displayFont:'Oswald', bodyFont:'Source Sans Pro', style:'normal', badge:'LICENSED & BONDED' },
  'Landscaping':      { bg:'#040c04', accent:'#6ab840', displayFont:'Playfair Display', bodyFont:'Lato', style:'italic', badge:'TRUSTED LANDSCAPERS' },
  'Cleaning Service': { bg:'#fafafa', accent:'#00d4a8', displayFont:'Poppins', bodyFont:'Open Sans', style:'normal', badge:'FULLY INSURED', light:true },
  'Plumber':          { bg:'#04091a', accent:'#4090ff', displayFont:'Oswald', bodyFont:'Roboto', style:'normal', badge:'LICENSED PLUMBERS' },
  'Electrician':      { bg:'#0f0c00', accent:'#f5c800', displayFont:'Exo 2', bodyFont:'Roboto', style:'normal', badge:'LICENSED ELECTRICIAN' },
  'Painter':          { bg:'#0c0818', accent:'#b060f8', displayFont:'Playfair Display', bodyFont:'Raleway', style:'italic', badge:'EXPERT PAINTERS' },
  'Roofer':           { bg:'#0c0806', accent:'#e85020', displayFont:'Oswald', bodyFont:'Source Sans Pro', style:'normal', badge:'LICENSED ROOFERS' },
}

export async function generateMetadata({ params }) {
  const { data } = await supabase.from('business_leads').select('business_name,category,city,google_rating,review_count').eq('slug', params.slug).single()
  if (!data) return { title: 'Demo Site — Synthiq' }
  return {
    title: `${data.business_name} — ${data.category} in ${data.city}, GA`,
    description: `${data.business_name} — top-rated ${data.category} in ${data.city}, GA with ${data.review_count} Google reviews.`,
  }
}

export default async function BusinessDemoPage({ params }) {
  const { data: lead, error } = await supabase.from('business_leads').select('*').eq('slug', params.slug).single()
  if (error || !lead) notFound()

  const dna = DNA[lead.category] || DNA['Nail Salon']
  const d = {
    ...dna,
    displayFont: lead.font_display || dna.displayFont,
    bodyFont: lead.font_body || dna.bodyFont,
    accent: lead.secondary_color || dna.accent,
    bg: lead.primary_color || dna.bg,
  }
  const isLight = d.light
  const textCol = isLight ? '#1a1a1a' : '#ffffff'
  const subCol = isLight ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.55)'
  const borderCol = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'
  const surfaceCol = isLight ? 'rgba(0,0,0,0.025)' : 'rgba(255,255,255,0.025)'
  
  const photos = lead.photo_urls || []
  const reviews = (lead.google_reviews || []).filter(r => (typeof r === 'string' ? r : r?.text || '').length > 10)
  const services = lead.services || []
  const rating = lead.google_rating || 4.8
  const reviewCount = lead.review_count || 0
  const brand = lead.brand_content || {}
  const hours = lead.hours || {}

  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(d.displayFont)}:ital,wght@0,300;0,400;0,600;0,700;0,900;1,400;1,700&family=${encodeURIComponent(d.bodyFont)}:wght@300;400;500;600;700&display=swap`

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('${fontUrl}');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${d.bg};color:${textCol};font-family:'${d.bodyFont}',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        ::selection{background:${d.accent};color:#000}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:${d.accent}44;border-radius:2px}
        a{text-decoration:none;color:inherit}
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr !important}
          .services-layout{grid-template-columns:1fr !important}
          .pricing-grid{grid-template-columns:1fr !important}
          .gallery-grid{grid-template-columns:1fr 1fr !important}
          .contact-strip{flex-direction:column;gap:24px !important}
        }
        @media(max-width:480px){
          .gallery-grid{grid-template-columns:1fr !important}
        }
      `}} />

      {/* ── NAV ── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, height:68, padding:'0 6%', display:'flex', alignItems:'center', justifyContent:'space-between', background:`${d.bg}dd`, backdropFilter:'blur(20px)', borderBottom:`1px solid ${borderCol}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:d.accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, color:isLight?'#fff':'#000', fontFamily:`'${d.displayFont}',serif` }}>
            {lead.business_name[0]}
          </div>
          <span style={{ fontSize:14, fontWeight:600, color:textCol }}>{lead.business_name}</span>
        </div>
        <div style={{ display:'flex', gap:28 }}>
          {['Gallery','Services','Reviews','Pricing','Contact'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize:10, letterSpacing:'2.5px', textTransform:'uppercase', color:subCol, fontFamily:'system-ui', fontWeight:500 }}>{l}</a>
          ))}
        </div>
        <a href={`tel:${lead.phone}`} style={{ background:d.accent, color:isLight?'#fff':'#000', padding:'10px 24px', fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', fontFamily:'system-ui' }}>
          {brand.cta_text || 'Book Now'}
        </a>
      </nav>

      {/* ── HERO ── */}
      <section style={{ height:'95vh', minHeight:640, position:'relative', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
        {photos[0] && (
          <img src={photos[0]} alt={lead.business_name} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity: isLight ? 0.15 : 0.4 }} />
        )}
        <div style={{ position:'absolute', inset:0, background: isLight ? 'rgba(250,250,250,0.85)' : `linear-gradient(110deg,${d.bg}fa 0%,${d.bg}cc 45%,${d.bg}55 100%)` }} />
        <div style={{ position:'absolute', inset:0, background: isLight ? 'none' : `linear-gradient(to top,${d.bg} 0%,transparent 40%)` }} />

        <div style={{ position:'relative', zIndex:10, textAlign:'center', padding:'0 5%', maxWidth:900 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginBottom:24 }}>
            <div style={{ width:50, height:1, background:d.accent, opacity:0.6 }} />
            <span style={{ fontSize:9, letterSpacing:'4.5px', textTransform:'uppercase', color:d.accent, fontFamily:'system-ui', fontWeight:600 }}>
              {d.badge} · {lead.city?.toUpperCase()}, GA
            </span>
            <div style={{ width:50, height:1, background:d.accent, opacity:0.6 }} />
          </div>

          <p style={{ fontFamily:`'${d.displayFont}',serif`, fontStyle:d.style, color:d.accent, fontSize:'clamp(14px,2vw,20px)', marginBottom:16, letterSpacing:'1px' }}>
            {lead.tagline || ''}
          </p>

          <h1 style={{ fontFamily:`'${d.displayFont}',serif`, fontSize:'clamp(42px,7.5vw,88px)', fontWeight:300, lineHeight:0.95, marginBottom:8, letterSpacing:'-1px' }}>
            {brand.hero_headline_line1 || lead.business_name}
          </h1>
          <h1 style={{ fontFamily:`'${d.displayFont}',serif`, fontSize:'clamp(42px,7.5vw,88px)', fontWeight:300, lineHeight:0.95, marginBottom:28, fontStyle:d.style, color:d.accent, letterSpacing:'-1px' }}>
            {brand.hero_headline_line2 || ''}
          </h1>

          <p style={{ fontSize:'clamp(14px,1.6vw,18px)', color:subCol, lineHeight:1.75, maxWidth:480, margin:'0 auto 40px', fontWeight:300 }}>
            {brand.hero_subtext || ''}
          </p>

          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="#booking" style={{ display:'inline-block', background:d.accent, color:isLight?'#fff':'#000', padding:'16px 38px', fontSize:11, fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', fontFamily:'system-ui', transition:'all 0.25s' }}>
              {brand.cta_text || 'Book Now'}
            </a>
            <a href="#reviews" style={{ display:'inline-block', color:subCol, padding:'16px 38px', fontSize:11, fontWeight:600, letterSpacing:'2.5px', textTransform:'uppercase', fontFamily:'system-ui', border:`1px solid ${borderCol}` }}>
              Read Reviews
            </a>
          </div>

          {reviewCount > 0 && (
            <div style={{ display:'inline-flex', alignItems:'center', gap:14, marginTop:44, padding:'12px 22px', background:surfaceCol, border:`1px solid ${borderCol}`, backdropFilter:'blur(8px)' }}>
              <span style={{ color:d.accent, fontSize:15, letterSpacing:'2px' }}>{'★'.repeat(Math.round(rating))}</span>
              <span style={{ fontSize:13, color:subCol, fontFamily:'system-ui' }}>
                <strong style={{ color:textCol }}>{rating}</strong> · {reviewCount.toLocaleString()} Google Reviews
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── GALLERY ── */}
      {photos.length > 1 && (
        <section id="gallery" style={{ padding:'96px 5%', maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
            <div style={{ width:36, height:1, background:d.accent }} />
            <span style={{ fontSize:9, letterSpacing:'4px', textTransform:'uppercase', color:d.accent, fontFamily:'system-ui', fontWeight:600 }}>Our work</span>
          </div>
          <h2 style={{ fontFamily:`'${d.displayFont}',serif`, fontSize:'clamp(28px,4vw,48px)', fontWeight:700, fontStyle:d.style, marginBottom:48 }}>
            See for yourself.
          </h2>
          <div className="gallery-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:3 }}>
            {photos.slice(1, 7).map((url, i) => (
              <div key={i} style={{ aspectRatio: i === 0 ? '16/9' : '4/3', overflow:'hidden', position:'relative', gridColumn: i === 0 ? 'span 2' : 'auto' }}>
                <img src={url} alt={`${lead.business_name} ${i+1}`} loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.6s ease', display:'block' }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── SERVICES + BOOKING CART + REVIEWS ── */}
      <section id="booking" style={{ padding:'96px 5%', background:surfaceCol, borderTop:`1px solid ${borderCol}`, borderBottom:`1px solid ${borderCol}` }}>
        <div className="services-layout" style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
              <div style={{ width:36, height:1, background:d.accent }} />
              <span style={{ fontSize:9, letterSpacing:'4px', textTransform:'uppercase', color:d.accent, fontFamily:'system-ui', fontWeight:600 }}>Book a service</span>
            </div>
            <h2 style={{ fontFamily:`'${d.displayFont}',serif`, fontSize:'clamp(28px,4vw,48px)', fontWeight:700, fontStyle:d.style, marginBottom:12 }}>
              Services
            </h2>
            <p style={{ color:subCol, marginBottom:40, fontSize:15, lineHeight:1.7 }}>
              Select what you need and we'll handle the rest.
            </p>
            {services.length > 0 && (
              <BookingCart
                services={services}
                accentColor={d.accent}
                businessSlug={lead.slug}
                businessName={lead.business_name}
              />
            )}
          </div>

          {/* Reviews column */}
          <div id="reviews" style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <div style={{ marginBottom:48 }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:10 }}>
                <span style={{ fontSize:'clamp(40px,5vw,56px)', fontWeight:700, fontFamily:`'${d.displayFont}',serif` }}>{rating}</span>
                <div style={{ color:d.accent, fontSize:20 }}>{'★'.repeat(Math.floor(rating))}</div>
              </div>
              <p style={{ textTransform:'uppercase', letterSpacing:'3px', fontSize:10, color:d.accent, fontFamily:'system-ui', fontWeight:600 }}>
                Based on {reviewCount} Google Reviews
              </p>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:36 }}>
              {reviews.slice(0, 3).map((review, i) => {
                const text = typeof review === 'string' ? review : review.text || ''
                const author = typeof review === 'string' ? 'Customer' : review.author_name || review.author || 'Customer'
                return (
                  <div key={i} style={{ position:'relative', paddingLeft:24, borderLeft:`2px solid ${d.accent}33` }}>
                    <p style={{ fontSize:16, fontStyle:'italic', marginBottom:12, lineHeight:1.7, fontFamily:`'${d.displayFont}',serif`, color: isLight ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.75)' }}>
                      "{text}"
                    </p>
                    <p style={{ fontWeight:600, fontSize:12, letterSpacing:'1px', textTransform:'uppercase', color:d.accent, fontFamily:'system-ui' }}>— {author}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding:'96px 5%', maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
          <div style={{ width:36, height:1, background:d.accent }} />
          <span style={{ fontSize:9, letterSpacing:'4px', textTransform:'uppercase', color:d.accent, fontFamily:'system-ui', fontWeight:600 }}>Simple pricing</span>
        </div>
        <h2 style={{ fontFamily:`'${d.displayFont}',serif`, fontSize:'clamp(28px,4vw,48px)', fontWeight:700, fontStyle:d.style, marginBottom:12 }}>
          No surprises. No contracts.
        </h2>
        <p style={{ color:subCol, marginBottom:52, fontSize:15, lineHeight:1.7, maxWidth:500 }}>
          This demo was built free. If you love it, choose a plan — live in 7 days.
        </p>
        <div className="pricing-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, border:`1px solid ${borderCol}` }}>
          {[
            { tier:'Starter', price:'$47', per:'/mo', feats:['Site on synthiq subdomain','Mobile-first design','Click-to-call button','Google reviews featured','Basic SEO setup'] },
            { tier:'Standard', price:'$97', per:'/mo', hot:true, feats:['Your own custom domain','Everything in Starter','Monthly updates','Google Analytics','Priority support'] },
            { tier:'Pro', price:'$197', per:'/mo', feats:['Everything in Standard','Online booking','Automated review requests','Local SEO','Social media feed'] },
          ].map(plan => (
            <div key={plan.tier} style={{ padding:'44px 32px', background: plan.hot ? `${d.accent}14` : surfaceCol, position:'relative', border: plan.hot ? `1px solid ${d.accent}33` : 'none' }}>
              {plan.hot && <div style={{ position:'absolute', top:-1, left:32, background:d.accent, color:isLight?'#fff':'#000', fontSize:9, fontWeight:700, letterSpacing:'2.5px', padding:'4px 14px', fontFamily:'system-ui', textTransform:'uppercase' }}>Most Popular</div>}
              <div style={{ fontSize:9, letterSpacing:'4px', textTransform:'uppercase', color:subCol, fontFamily:'system-ui', marginBottom:18 }}>{plan.tier}</div>
              <div><span style={{ fontSize:'clamp(36px,4.5vw,52px)', fontWeight:700, fontFamily:`'${d.displayFont}',serif` }}>{plan.price}</span><span style={{ fontSize:13, fontWeight:300, color:subCol }}>{plan.per}</span></div>
              <div style={{ fontSize:10, color:subCol, margin:'8px 0 26px', fontFamily:'system-ui' }}>$200 deposit · cancel anytime</div>
              <div style={{ height:1, background:borderCol, marginBottom:26 }} />
              <ul style={{ listStyle:'none', marginBottom:32 }}>
                {plan.feats.map((f,i) => (
                  <li key={i} style={{ fontSize:12, color: plan.hot ? (isLight?'rgba(0,0,0,0.7)':'rgba(255,255,255,0.65)') : subCol, padding:'8px 0', borderBottom:`1px solid ${borderCol}`, display:'flex', gap:10, fontFamily:'system-ui', lineHeight:1.4 }}>
                    <span style={{ color:d.accent, flexShrink:0, fontSize:10, marginTop:2 }}>→</span>{f}
                  </li>
                ))}
              </ul>
              <a href="mailto:ly@synthiqdesigns.com" style={{ display:'block', textAlign:'center', padding:13, fontSize:10, fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', fontFamily:'system-ui', background: plan.hot ? d.accent : 'transparent', color: plan.hot ? (isLight?'#fff':'#000') : subCol, border: plan.hot ? 'none' : `1px solid ${borderCol}` }}>
                Get Started
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA + CONTACT ── */}
      <section id="contact" style={{ padding:'108px 5%', textAlign:'center', position:'relative', overflow:'hidden', borderTop:`1px solid ${borderCol}` }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:700, borderRadius:'50%', background:d.accent, opacity:0.035, filter:'blur(100px)', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:14, marginBottom:16 }}>
            <div style={{ width:36, height:1, background:d.accent }} />
            <span style={{ fontSize:9, letterSpacing:'4px', textTransform:'uppercase', color:d.accent, fontFamily:'system-ui', fontWeight:600 }}>Ready to go live?</span>
            <div style={{ width:36, height:1, background:d.accent }} />
          </div>
          <h2 style={{ fontFamily:`'${d.displayFont}',serif`, fontSize:'clamp(32px,5vw,64px)', fontWeight:700, lineHeight:1.05, marginBottom:16, letterSpacing:'-1px' }}>
            Let's make it<br /><span style={{ color:d.accent, fontStyle:d.style }}>officially yours.</span>
          </h2>
          <p style={{ fontSize:16, color:subCol, maxWidth:490, margin:'0 auto 48px', lineHeight:1.8, fontWeight:300 }}>
            This demo was built free by Synthiq. Reply to the email you received and we'll have your site live within 7 days. Price, features, timeline — all negotiable.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <a href={`mailto:ly@synthiqdesigns.com?subject=I want to go live — ${lead.business_name}`} style={{ display:'inline-block', background:d.accent, color:isLight?'#fff':'#000', padding:'16px 38px', fontSize:11, fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', fontFamily:'system-ui' }}>
              Email Ly Now
            </a>
            {lead.phone && (
              <a href={`tel:${lead.phone}`} style={{ display:'inline-block', color:subCol, padding:'16px 38px', fontSize:11, fontWeight:600, letterSpacing:'2.5px', textTransform:'uppercase', fontFamily:'system-ui', border:`1px solid ${borderCol}` }}>
                {lead.phone}
              </a>
            )}
          </div>

          <div className="contact-strip" style={{ display:'flex', justifyContent:'center', gap:48, flexWrap:'wrap', marginTop:60, paddingTop:60, borderTop:`1px solid ${borderCol}` }}>
            {lead.phone && <div style={{ textAlign:'center' }}><div style={{ fontSize:8, letterSpacing:'3.5px', textTransform:'uppercase', color:subCol, fontFamily:'system-ui', marginBottom:8 }}>Phone</div><div style={{ fontSize:15, fontFamily:'system-ui' }}><a href={`tel:${lead.phone}`} style={{ color:textCol }}>{lead.phone}</a></div></div>}
            {lead.address && <div style={{ textAlign:'center' }}><div style={{ fontSize:8, letterSpacing:'3.5px', textTransform:'uppercase', color:subCol, fontFamily:'system-ui', marginBottom:8 }}>Address</div><div style={{ fontSize:13, fontFamily:'system-ui', color:subCol }}>{lead.address}</div></div>}
            {Object.keys(hours).length > 0 && (
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:8, letterSpacing:'3.5px', textTransform:'uppercase', color:subCol, fontFamily:'system-ui', marginBottom:8 }}>Hours</div>
                <div style={{ fontSize:12, fontFamily:'system-ui', lineHeight:2, color:subCol }}>
                  {Object.entries(hours).slice(0,3).map(([day,hrs]) => (
                    <div key={day}><span style={{ color:d.accent, fontSize:9, letterSpacing:'1.5px' }}>{day.slice(0,3).toUpperCase()}</span> {hrs}</div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ textAlign:'center' }}><div style={{ fontSize:8, letterSpacing:'3.5px', textTransform:'uppercase', color:subCol, fontFamily:'system-ui', marginBottom:8 }}>Built by</div><div style={{ fontSize:14, fontFamily:'system-ui' }}><a href="mailto:ly@synthiqdesigns.com" style={{ color:subCol }}>ly@synthiqdesigns.com</a></div></div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding:'28px 6%', display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:`1px solid ${borderCol}` }}>
        <div style={{ fontSize:11, color:subCol, fontFamily:'system-ui', lineHeight:1.9 }}>
          © 2026 {lead.business_name} · {lead.city}, GA<br/>
          <span style={{ opacity:0.55, fontSize:10 }}>Demo website built free by Synthiq Web Design · not yet live</span>
        </div>
        <div style={{ fontSize:12, color:subCol, fontFamily:'system-ui', opacity:0.4 }}>synth<span style={{ color:d.accent }}>iq</span></div>
      </footer>
    </>
  )
}
