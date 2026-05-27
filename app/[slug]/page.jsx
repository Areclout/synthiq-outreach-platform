import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import BookingCart from './_components/BookingCart'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function hash(s){let h=0;for(let i=0;i<s.length;i++)h=s.charCodeAt(i)+((h<<5)-h);return Math.abs(h)}
function sp(v){if(!v)return{};if(typeof v==='object')return v;try{return JSON.parse(v)}catch{return{}}}
function sa(v){if(Array.isArray(v))return v;if(!v)return[];try{const p=JSON.parse(v);return Array.isArray(p)?p:[]}catch{return[]}}

export default async function Page({params}){
  let lead=null
  try{
    const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL||'',process.env.SUPABASE_SERVICE_ROLE_KEY||'',{auth:{autoRefreshToken:false,persistSession:false}})
    const{data,error}=await sb.from('business_leads').select('*').eq('slug',params.slug).single()
    if(error||!data)return notFound()
    lead=data
  }catch(e){
    console.error('SLUG PAGE ERROR:',e)
    return notFound()
  }

  const DNA={
    'Nail Salon':{bg:'#0d0810',ac:'#d4a0c0',df:'Cormorant Garamond',bf:'Lato',fs:'italic'},
    'Barbershop':{bg:'#080c10',ac:'#c9972a',df:'Oswald',bf:'Barlow',fs:'normal'},
    'Restaurant':{bg:'#0a0600',ac:'#e8a020',df:'Playfair Display',bf:'Nunito',fs:'italic'},
    'HVAC':{bg:'#060c18',ac:'#4a9eff',df:'Rajdhani',bf:'Open Sans',fs:'normal'},
    'Auto Repair':{bg:'#0a0a0a',ac:'#ff6800',df:'Barlow Condensed',bf:'Barlow',fs:'normal'},
    'Contractor':{bg:'#0a0806',ac:'#f09010',df:'Oswald',bf:'Source Sans Pro',fs:'normal'},
    'Plumber':{bg:'#04091a',ac:'#4090ff',df:'Oswald',bf:'Roboto',fs:'normal'},
    'Electrician':{bg:'#0f0c00',ac:'#f5c800',df:'Exo 2',bf:'Roboto',fs:'normal'},
    'Painter':{bg:'#0c0818',ac:'#b060f8',df:'Playfair Display',bf:'Raleway',fs:'italic'},
    'Landscaping':{bg:'#040c04',ac:'#6ab840',df:'Playfair Display',bf:'Lato',fs:'italic'},
    'Cleaning Service':{bg:'#fafafa',ac:'#00d4a8',df:'Poppins',bf:'Open Sans',fs:'normal',lt:1},
    'Pest Control':{bg:'#fafafa',ac:'#5cb85c',df:'Exo 2',bf:'Open Sans',fs:'normal',lt:1},
    'Pressure Washing':{bg:'#020d1a',ac:'#00c4d8',df:'Barlow Condensed',bf:'Barlow',fs:'normal'},
    'Roofer':{bg:'#0c0806',ac:'#e85020',df:'Oswald',bf:'Source Sans Pro',fs:'normal'},
  }

  const cat=lead.category||'Nail Salon'
  const d=DNA[cat]||DNA['Nail Salon']
  const bg=lead.primary_color||d.bg
  const ac=lead.secondary_color||d.ac
  const df=lead.font_display||d.df
  const bf=lead.font_body||d.bf
  const fs=d.fs
  const lt=!!d.lt
  const tc=lt?'#111':'#fff'
  const sc=lt?'rgba(0,0,0,0.6)':'rgba(255,255,255,0.6)'
  const bd=lt?'rgba(0,0,0,0.08)':'rgba(255,255,255,0.08)'
  const cb=lt?'#fff':'rgba(255,255,255,0.03)'

  const vh=hash(params.slug||'x')
  const ha=['center','left','right'][vh%3]

  const photos=sa(lead.photo_urls)
  const brand=sp(lead.brand_content)
  const reviews=sa(lead.google_reviews).filter(r=>r&&typeof r==='object'&&r.text&&r.text.length>5)
  const services=sa(lead.services)
  const hours=sp(lead.hours)
  const rt=Number(lead.google_rating)||4.8
  const rc=Number(lead.review_count)||0
  const bname=lead.business_name||'Business'
  const h1=String(brand.hero_headline_line1||bname)
  const h2=String(brand.hero_headline_line2||'')
  const hsub=String(brand.hero_subtext||'')
  const cta=String(brand.cta_text||'Book Now')
  const tag=String(lead.tagline||'')

  const fu=`https://fonts.googleapis.com/css2?family=${encodeURIComponent(df)}:ital,wght@0,300;0,400;0,700;1,400&family=${encodeURIComponent(bf)}:wght@300;400;700&display=swap`

  return(
    <div style={{backgroundColor:bg,color:tc,fontFamily:`"${bf}",sans-serif`,margin:0,padding:0,overflowX:'hidden'}}>
      <style dangerouslySetInnerHTML={{__html:`@import url('${fu}');html{scroll-behavior:smooth}.nb{backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}.gz{transition:transform .6s ease}.gz:hover{transform:scale(1.04)}.lf{transition:transform .4s ease,box-shadow .4s ease}.lf:hover{transform:translateY(-6px);box-shadow:0 20px 40px rgba(0,0,0,.15)}.gw{animation:pw 3s infinite}@keyframes pw{0%{box-shadow:0 0 0 0 ${ac}40}70%{box-shadow:0 0 0 15px ${ac}00}100%{box-shadow:0 0 0 0 ${ac}00}}@media(max-width:768px){.rs{grid-template-columns:1fr!important;gap:40px!important}.mh{display:none!important}.mb{display:flex!important}.rh{text-align:center!important}.rg{grid-template-columns:1fr 1fr!important}}@media(max-width:480px){.rg{grid-template-columns:1fr!important}}`}}/>

      <nav className="nb" style={{position:'sticky',top:0,zIndex:1000,padding:'18px 5vw',display:'flex',alignItems:'center',justifyContent:'space-between',backgroundColor:lt?'rgba(250,250,250,.85)':`${bg}cc`,borderBottom:`1px solid ${bd}`}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <span style={{fontFamily:`"${df}",serif`,fontSize:24,fontWeight:700,color:ac}}>{bname[0]}</span>
          <span style={{fontFamily:`"${df}",serif`,fontSize:18}}>{bname}</span>
        </div>
        <div className="mh" style={{display:'flex',gap:28,fontSize:11,textTransform:'uppercase',letterSpacing:'2.5px'}}>
          {['Gallery','Services','Reviews','Pricing'].map(l=><a key={l} href={'#'+l.toLowerCase()} style={{color:sc,textDecoration:'none',fontFamily:'system-ui',fontWeight:500}}>{l}</a>)}
        </div>
        <a href="#services" style={{padding:'10px 22px',border:`1px solid ${ac}`,color:lt?'#111':ac,backgroundColor:lt?ac:'transparent',textDecoration:'none',fontSize:11,textTransform:'uppercase',letterSpacing:'2px',fontWeight:700,fontFamily:'system-ui'}}>{cta}</a>
      </nav>

      <section style={{height:'92vh',minHeight:640,position:'relative',display:'flex',alignItems:'center',justifyContent:ha==='center'?'center':ha==='left'?'flex-start':'flex-end',padding:'0 8vw',overflow:'hidden'}}>
        {photos[0]&&<img src={photos[0]} alt={bname} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:1,opacity:lt?.12:.35}}/>}
        <div style={{position:'absolute',inset:0,background:lt?'linear-gradient(to top,#fafafa,transparent)':`linear-gradient(to top,${bg},transparent 90%)`,zIndex:2}}/>
        <div style={{position:'absolute',inset:0,background:lt?'none':`linear-gradient(110deg,${bg}fa 0%,${bg}88 50%,transparent)`,zIndex:2}}/>
        <div className="rh" style={{position:'relative',zIndex:10,maxWidth:850,textAlign:ha==='center'?'center':'left'}}>
          {tag&&<p style={{fontFamily:`"${df}",serif`,fontStyle:fs,color:ac,fontSize:'clamp(14px,2.5vw,20px)',marginBottom:20,letterSpacing:'1px'}}>{tag}</p>}
          <h1 style={{fontFamily:`"${df}",serif`,fontSize:'clamp(44px,7.5vw,88px)',fontWeight:300,lineHeight:1.05,marginBottom:8,letterSpacing:'-1px'}}>{h1}</h1>
          {h2&&<h1 style={{fontFamily:`"${df}",serif`,fontSize:'clamp(44px,7.5vw,88px)',fontWeight:300,lineHeight:1.05,marginBottom:28,fontStyle:fs,color:ac,letterSpacing:'-1px'}}>{h2}</h1>}
          {hsub&&<p style={{fontSize:'clamp(14px,1.6vw,18px)',lineHeight:1.7,opacity:.85,maxWidth:600,margin:ha==='center'?'0 auto 40px':'0 0 40px'}}>{hsub}</p>}
          <div style={{display:'flex',gap:16,justifyContent:ha==='center'?'center':'flex-start',flexWrap:'wrap'}}>
            <a href="#services" className="gw" style={{padding:'18px 44px',backgroundColor:ac,color:lt?'#fff':'#000',textDecoration:'none',fontWeight:700,fontSize:12,textTransform:'uppercase',letterSpacing:'3px',fontFamily:'system-ui'}}>{cta}</a>
            {lead.phone&&<a href={'tel:'+lead.phone} style={{padding:'18px 36px',border:`1px solid ${bd}`,color:tc,textDecoration:'none',fontSize:12,textTransform:'uppercase',letterSpacing:'2.5px',fontWeight:600,fontFamily:'system-ui'}}>Call {lead.phone}</a>}
          </div>
          {rc>0&&<div style={{display:'inline-flex',alignItems:'center',gap:14,marginTop:44,padding:'14px 24px',background:lt?'rgba(0,0,0,.04)':'rgba(255,255,255,.05)',border:`1px solid ${bd}`}}><span style={{color:ac,fontSize:16,letterSpacing:'2px'}}>{'★'.repeat(Math.min(Math.round(rt),5))}</span><span style={{fontSize:13,color:sc,fontFamily:'system-ui'}}><strong style={{color:tc}}>{rt}</strong> · {rc} Reviews</span></div>}
        </div>
      </section>

      <section style={{padding:'28px 5vw',backgroundColor:cb,borderTop:`1px solid ${bd}`,borderBottom:`1px solid ${bd}`,display:'flex',flexWrap:'wrap',justifyContent:'space-around',alignItems:'center',gap:20,fontSize:14}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}><span style={{color:ac,fontSize:18}}>★</span><strong>{rt} Stars</strong><span style={{opacity:.5}}>({rc} Reviews)</span></div>
        <div className="mh" style={{width:1,height:20,background:bd}}/>
        <div>Serving <strong>{lead.city||'Augusta'}, GA</strong></div>
        <div className="mh" style={{width:1,height:20,background:bd}}/>
        <div><span style={{color:ac}}>✓</span> Verified on Google</div>
      </section>

      {photos.length>1&&<section id="gallery" style={{padding:'100px 6vw'}}>
        <div style={{textAlign:'center',marginBottom:64}}>
          <p style={{textTransform:'uppercase',letterSpacing:'3px',fontSize:10,color:ac,marginBottom:10,fontFamily:'system-ui',fontWeight:600}}>Our Work</p>
          <h2 style={{fontFamily:`"${df}",serif`,fontSize:'clamp(28px,4vw,48px)',fontWeight:300}}>See for <span style={{fontStyle:fs}}>yourself.</span></h2>
        </div>
        <div className="rg" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:4}}>
          {photos.slice(1,7).map((url,i)=><div key={i} className="gz" style={{height:340,overflow:'hidden'}}><img src={url} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} loading="lazy"/></div>)}
        </div>
      </section>}

      <section id="services" style={{padding:'100px 6vw',backgroundColor:cb,borderTop:`1px solid ${bd}`,borderBottom:`1px solid ${bd}`}}>
        <div className="rs" style={{display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:80,maxWidth:1400,margin:'0 auto'}}>
          <div>
            <p style={{textTransform:'uppercase',letterSpacing:'3px',fontSize:10,color:ac,marginBottom:10,fontFamily:'system-ui',fontWeight:600}}>Services</p>
            <h2 style={{fontFamily:`"${df}",serif`,fontSize:'clamp(28px,4vw,52px)',fontWeight:300,marginTop:0,marginBottom:48}}>Select <span style={{fontStyle:fs}}>Treatments</span></h2>
            {services.length>0&&<BookingCart services={services} accentColor={ac} businessSlug={lead.slug} businessName={bname}/>}
            {services.length===0&&<p style={{color:sc,fontSize:15}}>Contact us directly for service pricing and availability.</p>}
          </div>
          <div id="reviews" style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <div style={{marginBottom:48}}>
              <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:10}}>
                <span style={{fontSize:'clamp(40px,5vw,56px)',fontWeight:700,fontFamily:`"${df}",serif`}}>{rt}</span>
                <div style={{color:ac,fontSize:22}}>{'★'.repeat(Math.min(Math.floor(rt),5))}</div>
              </div>
              <p style={{textTransform:'uppercase',letterSpacing:'3px',fontSize:10,color:ac,fontFamily:'system-ui',fontWeight:600}}>{rc} Google Reviews</p>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:32}}>
              {reviews.slice(0,4).map((rev,i)=><div key={i} className="lf" style={{padding:36,backgroundColor:lt?'#fff':'rgba(255,255,255,.03)',border:`1px solid ${bd}`}}>
                <div style={{color:ac,fontSize:13,letterSpacing:'2px',marginBottom:20}}>{'★'.repeat(Math.min(Number(rev.rating)||5,5))}</div>
                <p style={{fontSize:15,fontStyle:'italic',lineHeight:1.7,marginBottom:24,fontFamily:`"${df}",serif`,color:lt?'rgba(0,0,0,.75)':'rgba(255,255,255,.75)'}}>"{String(rev.text||'')}"</p>
                <div style={{width:30,height:1,background:ac,marginBottom:12}}/>
                <span style={{fontWeight:700,fontSize:12,letterSpacing:'1px'}}>{String(rev.author||rev.author_name||'Customer')}</span>
              </div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" style={{padding:'100px 6vw'}}>
        <div style={{textAlign:'center',marginBottom:64}}>
          <p style={{textTransform:'uppercase',letterSpacing:'3px',fontSize:10,color:ac,marginBottom:10,fontFamily:'system-ui',fontWeight:600}}>Simple Pricing</p>
          <h2 style={{fontFamily:`"${df}",serif`,fontSize:'clamp(28px,4vw,48px)',fontWeight:300}}>No surprises. <span style={{fontStyle:fs}}>No contracts.</span></h2>
        </div>
        <div className="rs" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,maxWidth:1200,margin:'0 auto',border:`1px solid ${bd}`}}>
          {[{n:'Starter',p:'$47',f:['Synthiq subdomain','Mobile-first design','Click-to-call','Google reviews','Basic SEO']},{n:'Standard',p:'$97',hot:1,f:['Custom domain','Everything in Starter','Monthly updates','Google Analytics','Priority support']},{n:'Pro',p:'$197',f:['Everything in Standard','Online booking','Review automation','Local SEO','Social feed']}].map(plan=><div key={plan.n} style={{padding:'48px 36px',backgroundColor:plan.hot?ac+'12':bg,border:plan.hot?`1px solid ${ac}33`:'none',position:'relative'}}>
            {plan.hot&&<div style={{position:'absolute',top:-1,left:36,background:ac,color:lt?'#fff':'#000',fontSize:9,fontWeight:700,letterSpacing:'2.5px',padding:'4px 14px',fontFamily:'system-ui',textTransform:'uppercase'}}>Most Popular</div>}
            <div style={{fontSize:9,letterSpacing:'4px',textTransform:'uppercase',color:sc,fontFamily:'system-ui',marginBottom:18}}>{plan.n}</div>
            <div><span style={{fontSize:'clamp(36px,4.5vw,52px)',fontWeight:700,fontFamily:`"${df}",serif`}}>{plan.p}</span><span style={{fontSize:13,fontWeight:300,color:sc}}>/mo</span></div>
            <div style={{fontSize:10,color:sc,margin:'8px 0 26px',fontFamily:'system-ui'}}>$200 deposit · cancel anytime</div>
            <div style={{height:1,background:bd,marginBottom:26}}/>
            <ul style={{listStyle:'none',padding:0,marginBottom:32}}>{plan.f.map((f,i)=><li key={i} style={{fontSize:12,color:plan.hot?(lt?'rgba(0,0,0,.7)':'rgba(255,255,255,.65)'):sc,padding:'8px 0',borderBottom:`1px solid ${bd}`,display:'flex',gap:10,fontFamily:'system-ui',lineHeight:1.4}}><span style={{color:ac,flexShrink:0}}>→</span>{f}</li>)}</ul>
            <a href="mailto:ly@synthiqdesigns.com" style={{display:'block',textAlign:'center',padding:14,fontSize:10,fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',fontFamily:'system-ui',background:plan.hot?ac:'transparent',color:plan.hot?(lt?'#fff':'#000'):sc,border:plan.hot?'none':`1px solid ${bd}`,textDecoration:'none'}}>Get Started</a>
          </div>)}
        </div>
      </section>

      <section style={{padding:'120px 5vw',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:700,height:700,borderRadius:'50%',background:ac,opacity:.035,filter:'blur(100px)',pointerEvents:'none'}}/>
        <div style={{position:'relative',zIndex:10,maxWidth:800,margin:'0 auto'}}>
          <h2 style={{fontFamily:`"${df}",serif`,fontSize:'clamp(32px,5.5vw,64px)',fontWeight:300,marginBottom:28,lineHeight:1.1}}>Let's make it<br/><span style={{fontStyle:fs,color:ac}}>officially yours.</span></h2>
          <p style={{fontSize:17,color:sc,marginBottom:48,lineHeight:1.7}}>This demo was built free by Synthiq. Reply to the email and we'll have your site live within 7 days.</p>
          <a href={'mailto:ly@synthiqdesigns.com?subject=I want to go live — '+bname} className="gw" style={{padding:'20px 52px',backgroundColor:ac,color:lt?'#fff':'#000',textDecoration:'none',fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'3px',fontFamily:'system-ui',display:'inline-block'}}>Email Ly Now</a>
        </div>
      </section>

      <section style={{padding:'80px 6vw',borderTop:`1px solid ${bd}`,backgroundColor:cb}}>
        <div className="rs" style={{display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:80,maxWidth:1300,margin:'0 auto'}}>
          <div>
            <h3 style={{fontFamily:`"${df}",serif`,fontSize:28,fontWeight:400,marginBottom:28,marginTop:0}}>Get In Touch</h3>
            <div style={{display:'flex',flexDirection:'column',gap:24,fontSize:15}}>
              {lead.address&&<div><span style={{color:ac,fontWeight:700,display:'block',textTransform:'uppercase',fontSize:9,letterSpacing:'2.5px',marginBottom:6,fontFamily:'system-ui'}}>Address</span>{lead.address}</div>}
              {lead.phone&&<div><span style={{color:ac,fontWeight:700,display:'block',textTransform:'uppercase',fontSize:9,letterSpacing:'2.5px',marginBottom:6,fontFamily:'system-ui'}}>Phone</span><a href={'tel:'+lead.phone} style={{color:tc,textDecoration:'none'}}>{lead.phone}</a></div>}
            </div>
          </div>
          {Object.keys(hours).length>0&&<div style={{padding:36,border:`1px solid ${bd}`,backgroundColor:bg}}>
            <h4 style={{fontFamily:`"${df}",serif`,fontSize:20,marginTop:0,marginBottom:24,color:ac}}>Hours</h4>
            <div style={{display:'flex',flexDirection:'column',gap:12,fontSize:14}}>
              {Object.entries(hours).map(([day,val])=><div key={day} style={{display:'flex',justifyContent:'space-between',borderBottom:`1px solid ${bd}`,paddingBottom:8}}><span style={{fontWeight:600}}>{String(day)}</span><span style={{opacity:.7}}>{String(val)}</span></div>)}
            </div>
          </div>}
        </div>
      </section>

      <footer style={{padding:'32px 6vw',borderTop:`1px solid ${bd}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div style={{fontSize:11,color:sc,lineHeight:1.9,fontFamily:'system-ui'}}>© 2026 {bname} · {lead.city||'Augusta'}, GA<br/><span style={{opacity:.55,fontSize:10}}>Demo built free by Synthiq Web Design</span></div>
        <div style={{fontSize:12,color:sc,fontFamily:'system-ui',opacity:.4}}>synth<span style={{color:ac}}>iq</span></div>
      </footer>

      <div className="mb" style={{position:'fixed',bottom:0,left:0,right:0,height:64,zIndex:9999,backgroundColor:bg+'f0',backdropFilter:'blur(20px)',borderTop:`1px solid ${bd}`,display:'none',alignItems:'center',justifyContent:'space-between',padding:'0 20px'}}>
        <div><span style={{display:'block',fontSize:13,fontWeight:700}}>{bname}</span><span style={{fontSize:11,color:ac}}>★ {rt}</span></div>
        <a href="#services" style={{height:44,minWidth:140,display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:ac,color:lt?'#fff':'#000',textDecoration:'none',fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'1.5px',fontFamily:'system-ui'}}>Book Now</a>
      </div>
    </div>
  )
}
