import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ── Category design tokens ────────────────────────────────────────────────────
const CATEGORY_THEMES = {
  'Nail Salon':       { primary:'#C4788A', secondary:'#F2E4D8', accent:'#BFA07A', dark:'#2D1B22', font:'Georgia,serif',       hero:'split',    emoji:'💅' },
  'Barbershop':       { primary:'#1A2744', secondary:'#D4AF37', accent:'#F5F0E8', dark:'#0D1525', font:'system-ui,sans-serif', hero:'bold',     emoji:'✂️' },
  'Restaurant':       { primary:'#C4460A', secondary:'#F5A623', accent:'#2D5016', dark:'#1A0A00', font:'Georgia,serif',       hero:'full',     emoji:'🍽️' },
  'Pest Control':     { primary:'#2D4A1E', secondary:'#7CB342', accent:'#F5F5DC', dark:'#1A2E0F', font:'system-ui,sans-serif', hero:'bold',     emoji:'🛡️' },
  'Pressure Washing': { primary:'#0277BD', secondary:'#E3F2FD', accent:'#01579B', dark:'#01579B', font:'system-ui,sans-serif', hero:'clean',    emoji:'💧' },
  'HVAC':             { primary:'#1565C0', secondary:'#FF8F00', accent:'#E3F2FD', dark:'#0D47A1', font:'system-ui,sans-serif', hero:'bold',     emoji:'❄️' },
  'Auto Repair':      { primary:'#263238', secondary:'#F57C00', accent:'#ECEFF1', dark:'#102027', font:'system-ui,sans-serif', hero:'bold',     emoji:'🔧' },
  'Contractor':       { primary:'#4E342E', secondary:'#FF8F00', accent:'#EFEBE9', dark:'#2C1810', font:'system-ui,sans-serif', hero:'full',     emoji:'🔨' },
  'Landscaping':      { primary:'#2E7D32', secondary:'#8BC34A', accent:'#F1F8E9', dark:'#1B5E20', font:'Georgia,serif',       hero:'split',    emoji:'🌿' },
  'Cleaning Service': { primary:'#006064', secondary:'#80DEEA', accent:'#E0F7FA', dark:'#004D40', font:'system-ui,sans-serif', hero:'clean',    emoji:'✨' },
  'Plumber':          { primary:'#1A237E', secondary:'#42A5F5', accent:'#E8EAF6', dark:'#0D1B6B', font:'system-ui,sans-serif', hero:'bold',     emoji:'🔵' },
  'Electrician':      { primary:'#F57F17', secondary:'#212121', accent:'#FFF9C4', dark:'#E65100', font:'system-ui,sans-serif', hero:'bold',     emoji:'⚡' },
  'Painter':          { primary:'#6A1B9A', secondary:'#CE93D8', accent:'#F3E5F5', dark:'#4A148C', font:'Georgia,serif',       hero:'split',    emoji:'🎨' },
  'Roofer':           { primary:'#37474F', secondary:'#FF7043', accent:'#ECEFF1', dark:'#263238', font:'system-ui,sans-serif', hero:'bold',     emoji:'🏠' },
}

const DEFAULT_THEME = { primary:'#1D9E75', secondary:'#E1F5EE', accent:'#F7FFFE', dark:'#0F4D3A', font:'system-ui,sans-serif', hero:'clean', emoji:'🏢' }

export async function generateMetadata({ params }) {
  const { data } = await db.from('business_leads').select('business_name,category,city').eq('slug', params.slug).single()
  if (!data) return { title: 'Synthiq Demo Site' }
  return {
    title: `${data.business_name} — Free Demo Site by Synthiq`,
    description: `Professional website demo for ${data.business_name}, a ${data.category} in ${data.city}, GA. Built free by Synthiq Web Design.`,
  }
}

export default async function DemoSite({ params }) {
  const { data: lead } = await db
    .from('business_leads')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!lead) notFound()

  const theme = CATEGORY_THEMES[lead.category] || DEFAULT_THEME
  const p = theme.primary, s = theme.secondary, dk = theme.dark
  const reviews = lead.google_reviews || []
  const photos  = lead.photo_urls    || []
  const services = lead.services     || []
  const stars = '★'.repeat(Math.floor(lead.google_rating || 4)) + (((lead.google_rating || 4) % 1) >= 0.5 ? '½' : '')

  const css = `
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:${theme.font};color:${dk};background:#fff}
    .nav{background:${p};padding:12px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
    .hero{background:linear-gradient(135deg,${p}F5 0%,${s}90 100%);padding:64px 24px;text-align:center}
    .btn-primary{display:inline-block;background:${s};color:${p};padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;border:none;cursor:pointer}
    .btn-secondary{display:inline-block;background:rgba(255,255,255,0.15);color:#fff;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600;text-decoration:none;border:1px solid rgba(255,255,255,0.3);cursor:pointer}
    .section{padding:56px 24px}
    .section-label{font-size:11px;letter-spacing:3px;color:${p};font-family:monospace;font-weight:700;margin-bottom:16px;text-transform:uppercase}
    .grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .service-card{background:${p}10;border:1px solid ${p}25;border-radius:10px;padding:14px 18px;font-size:14px;color:${dk};font-weight:500}
    .review-card{background:${s}30;border-left:4px solid ${s};border-radius:0 10px 10px 0;padding:16px 20px}
    .photo-strip{display:flex;gap:6px;padding:0 24px;overflow-x:auto}
    .photo-box{width:160px;height:120px;border-radius:10px;flex-shrink:0;background:${s};object-fit:cover}
    .pricing-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;max-width:900px;margin:0 auto}
    @media(max-width:680px){
      .grid2{grid-template-columns:1fr}
      .pricing-grid{grid-template-columns:1fr}
      .hero{padding:40px 20px}
    }
  `

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>

        {/* Nav */}
        <nav className="nav">
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:32,height:32,borderRadius:8,background:s,display:'flex',alignItems:'center',
              justifyContent:'center',fontSize:14,fontWeight:900,color:p }}>
              {lead.business_name[0]}
            </div>
            <span style={{ color:'#fff',fontWeight:700,fontSize:14 }}>{lead.business_name}</span>
          </div>
          <div style={{ display:'flex',gap:20 }}>
            {['Services','Reviews','Contact'].map(t => (
              <a key={t} href={`#${t.toLowerCase()}`}
                style={{ color:'rgba(255,255,255,0.75)',fontSize:12,textDecoration:'none',letterSpacing:0.5 }}>
                {t}
              </a>
            ))}
          </div>
          <a href={`tel:${lead.phone}`}
            style={{ background:s,color:p,padding:'8px 16px',borderRadius:8,fontSize:12,fontWeight:700,textDecoration:'none' }}>
            {lead.phone || 'Call Us'}
          </a>
        </nav>

        {/* Hero */}
        <section className="hero">
          <div style={{ display:'inline-block',background:s,color:p,fontSize:11,fontFamily:'monospace',
            letterSpacing:3,padding:'5px 16px',borderRadius:20,marginBottom:16,fontWeight:600 }}>
            {lead.category.toUpperCase()} · {lead.city?.toUpperCase()}, GA
          </div>
          <h1 style={{ fontSize:'clamp(28px,5vw,48px)',color:'#fff',lineHeight:1.1,marginBottom:12,fontWeight:900,
            textShadow:'0 2px 12px rgba(0,0,0,0.15)' }}>
            {lead.business_name}
          </h1>
          {lead.tagline && (
            <p style={{ color:'rgba(255,255,255,0.85)',fontSize:18,marginBottom:24,fontStyle:'italic' }}>
              {lead.tagline}
            </p>
          )}
          {lead.google_rating && (
            <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:28 }}>
              <span style={{ color:'#FFD700',fontSize:20 }}>{stars}</span>
              <span style={{ color:'rgba(255,255,255,0.9)',fontSize:14 }}>
                {lead.google_rating} stars · {lead.review_count} Google reviews
              </span>
            </div>
          )}
          <div style={{ display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap' }}>
            <a href="#contact" className="btn-primary">Book Now</a>
            <a href={`tel:${lead.phone}`} className="btn-secondary">{lead.phone || 'Call Us'}</a>
          </div>
        </section>

        {/* Photo strip */}
        {photos.length > 0 && (
          <div style={{ padding:'20px 0',background:'#f9f9f9' }}>
            <div className="photo-strip">
              {photos.slice(0,8).map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt={`${lead.business_name} photo ${i+1}`}
                  className="photo-box" onError={e => { e.target.style.display='none' }} />
              ))}
            </div>
          </div>
        )}

        {/* Services */}
        {services.length > 0 && (
          <section className="section" id="services" style={{ background:'#fff',maxWidth:960,margin:'0 auto' }}>
            <div className="section-label">Services</div>
            <div className="grid2">
              {services.map((svc, i) => (
                <div key={i} className="service-card">
                  <span style={{ marginRight:8 }}>{theme.emoji}</span>
                  {typeof svc === 'string' ? svc : svc.name || JSON.stringify(svc)}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="section" id="reviews" style={{ background:'#f9f9f9' }}>
            <div style={{ maxWidth:960,margin:'0 auto' }}>
              <div className="section-label">What people say</div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:12 }}>
                {reviews.slice(0,6).map((rev, i) => {
                  const text   = typeof rev === 'string' ? rev : rev.text || rev.review_text || ''
                  const author = typeof rev === 'string' ? 'Google Review' : rev.author_name || rev.author || 'Google Review'
                  const rating = typeof rev === 'object' ? (rev.rating || rev.stars || lead.google_rating) : lead.google_rating
                  return (
                    <div key={i} className="review-card">
                      <div style={{ color:'#FFD700',fontSize:14,marginBottom:8 }}>
                        {'★'.repeat(Math.min(Math.floor(rating || 5), 5))}
                      </div>
                      <p style={{ fontSize:13,lineHeight:1.65,color:'#444',fontStyle:'italic',marginBottom:10 }}>
                        "{text}"
                      </p>
                      <div style={{ fontSize:12,color:p,fontWeight:600 }}>— {author}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="section" id="pricing" style={{ background:'#fff' }}>
          <div style={{ maxWidth:960,margin:'0 auto' }}>
            <div className="section-label">Simple pricing</div>
            <h2 style={{ fontSize:28,fontWeight:800,color:dk,marginBottom:8 }}>No surprises. No contracts.</h2>
            <p style={{ fontSize:16,color:'#666',marginBottom:36 }}>
              We built this demo for free. If you love it, choose a plan and we'll make it live in 7 days.
            </p>
            <div className="pricing-grid">
              {[
                { name:'Starter',  price:'$47',  per:'mo', features:['Your site on our subdomain','Mobile-responsive design','Click-to-call button','Google reviews displayed','Basic SEO setup'] },
                { name:'Standard', price:'$97',  per:'mo', features:['Your own custom domain','Everything in Starter','Monthly content updates','Google Analytics setup','Priority support'], hot:true },
                { name:'Pro',      price:'$197', per:'mo', features:['Everything in Standard','Online booking system','Automated review requests','Local SEO optimization','Instagram feed embedded'] },
              ].map(plan => (
                <div key={plan.name} style={{ border: plan.hot ? `2px solid ${p}` : '1px solid #E8E8E8',
                  borderRadius:14,padding:28,position:'relative',background: plan.hot ? `${p}06` : '#fff' }}>
                  {plan.hot && (
                    <div style={{ position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',
                      background:p,color:'#fff',fontSize:10,padding:'3px 14px',borderRadius:20,
                      fontWeight:700,letterSpacing:1,whiteSpace:'nowrap' }}>
                      MOST POPULAR
                    </div>
                  )}
                  <div style={{ fontSize:15,fontWeight:700,color:dk,marginBottom:4 }}>{plan.name}</div>
                  <div style={{ fontSize:36,fontWeight:900,color:plan.hot?p:dk,lineHeight:1,marginBottom:4 }}>
                    {plan.price}<span style={{ fontSize:14,fontWeight:400,color:'#888' }}>/{plan.per}</span>
                  </div>
                  <div style={{ fontSize:11,color:'#aaa',marginBottom:20 }}>$200 deposit · Cancel anytime</div>
                  <div style={{ borderTop:'1px solid #eee',paddingTop:16,marginBottom:24 }}>
                    {plan.features.map((f,i) => (
                      <div key={i} style={{ display:'flex',gap:8,marginBottom:8,fontSize:13,color:'#444' }}>
                        <span style={{ color:'#1D9E75',fontSize:14,flexShrink:0 }}>✓</span>{f}
                      </div>
                    ))}
                  </div>
                  <a href="#contact"
                    style={{ display:'block',textAlign:'center',padding:'12px',borderRadius:8,fontSize:13,fontWeight:700,
                      textDecoration:'none',background: plan.hot ? p : 'transparent',
                      color: plan.hot ? '#fff' : p, border: plan.hot ? 'none' : `2px solid ${p}` }}>
                    Get started
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="section" id="contact" style={{ background:p }}>
          <div style={{ maxWidth:640,margin:'0 auto',textAlign:'center' }}>
            <div style={{ fontSize:11,letterSpacing:3,color:s,fontFamily:'monospace',fontWeight:700,marginBottom:16 }}>
              GET IN TOUCH
            </div>
            <h2 style={{ fontSize:32,fontWeight:900,color:'#fff',marginBottom:8 }}>Ready to go live?</h2>
            <p style={{ fontSize:16,color:'rgba(255,255,255,0.8)',marginBottom:32 }}>
              Reply to the email you received and Ly will get your site live within 7 days.
              Everything is negotiable — price, timeline, features.
            </p>
            <div style={{ display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap' }}>
              <a href="mailto:ly@synthiqdesigns.com?subject=I want to go live — {lead.business_name}"
                style={{ background:s,color:p,padding:'14px 28px',borderRadius:10,fontSize:14,fontWeight:800,textDecoration:'none' }}>
                Email Ly
              </a>
              {lead.phone && (
                <a href={`tel:${lead.phone}`}
                  style={{ background:'rgba(255,255,255,0.15)',color:'#fff',padding:'14px 28px',
                    borderRadius:10,fontSize:14,fontWeight:600,textDecoration:'none',
                    border:'1px solid rgba(255,255,255,0.3)' }}>
                  {lead.phone}
                </a>
              )}
            </div>
            {lead.address && (
              <p style={{ marginTop:24,fontSize:13,color:'rgba(255,255,255,0.6)' }}>📍 {lead.address}</p>
            )}
            {lead.hours && (
              <p style={{ marginTop:8,fontSize:13,color:'rgba(255,255,255,0.6)' }}>🕐 {lead.hours}</p>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background:'#111',padding:'20px 24px',textAlign:'center' }}>
          <div style={{ fontSize:12,color:'#555',lineHeight:1.8 }}>
            This site was built free by{' '}
            <a href="https://synthiqdesigns.com" style={{ color:'#1D9E75',textDecoration:'none' }}>Synthiq Web Design</a>
            {' '}· Augusta, GA ·{' '}
            <a href="mailto:ly@synthiqdesigns.com" style={{ color:'#555' }}>ly@synthiqdesigns.com</a>
          </div>
          <div style={{ fontSize:11,color:'#333',marginTop:6 }}>
            Want your own professional website? Reply to the email you received.
          </div>
        </footer>

      </body>
    </html>
  )
}

