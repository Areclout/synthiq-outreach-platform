export default function Home() {
  return (
    <main style={{ fontFamily: '-apple-system,BlinkMacSystemFont,sans-serif', background: '#fff', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ borderBottom:'1px solid #F0F0EC', padding:'0 24px', height:56,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        position:'sticky', top:0, background:'rgba(255,255,255,0.95)', zIndex:100 }}>
        <div style={{ fontWeight:800, fontSize:20, letterSpacing:-0.5 }}>
          synth<span style={{ color:'#1D9E75' }}>iq</span>
        </div>
        <div style={{ display:'flex', gap:24, alignItems:'center' }}>
          <span style={{ fontSize:13, color:'#888' }}>Augusta, GA</span>
          <a href="mailto:ly@synthiqdesigns.com"
            style={{ fontSize:12, padding:'7px 16px', borderRadius:8, background:'#111', color:'#fff', fontWeight:600, textDecoration:'none' }}>
            Get your free site →
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding:'100px 24px 80px', textAlign:'center', background:'linear-gradient(180deg,#F7F7F4 0%,#fff 100%)' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ display:'inline-block', fontSize:11, letterSpacing:3, color:'#1D9E75',
            fontFamily:'monospace', fontWeight:700, padding:'4px 16px', borderRadius:20,
            background:'#E1F5EE', marginBottom:24 }}>
            AUGUSTA · EVANS · MARTINEZ · GROVETOWN
          </div>
          <h1 style={{ fontSize:'clamp(36px,6vw,64px)', fontWeight:900, lineHeight:1.08,
            letterSpacing:-1, marginBottom:20, color:'#111' }}>
            We build your website<br />
            <span style={{ color:'#1D9E75' }}>before you pay a cent.</span>
          </h1>
          <p style={{ fontSize:18, color:'#666', lineHeight:1.7, maxWidth:560, margin:'0 auto 40px' }}>
            Synthiq finds local businesses without websites, builds them a real demo using
            their actual photos and reviews, then sends it over — free. If you love it, we talk price.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="mailto:ly@synthiqdesigns.com?subject=I want a free website demo"
              style={{ padding:'14px 28px', borderRadius:10, background:'#111', color:'#fff',
                fontSize:14, fontWeight:700, display:'inline-block', textDecoration:'none' }}>
              See your free demo →
            </a>
            <a href="#how"
              style={{ padding:'14px 28px', borderRadius:10, background:'transparent', color:'#111',
                fontSize:14, fontWeight:600, display:'inline-block', border:'1px solid #E0E0D8', textDecoration:'none' }}>
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding:'40px 24px', background:'#111' }}>
        <div style={{ maxWidth:960, margin:'0 auto', display:'flex', border:'1px solid #222', borderRadius:12, overflow:'hidden' }}>
          {[['40+','Demo sites built'],['4.7★','Avg Google rating'],['14','Business categories'],['$0','Upfront cost']].map(([n,l],i,arr) => (
            <div key={n} style={{ flex:1, padding:'20px 16px', textAlign:'center', borderRight:i<arr.length-1?'1px solid #222':'none' }}>
              <div style={{ fontSize:28, fontWeight:900, color:'#1D9E75', marginBottom:4 }}>{n}</div>
              <div style={{ fontSize:12, color:'#666', fontFamily:'monospace' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding:'80px 24px' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ fontSize:11, letterSpacing:3, color:'#1D9E75', fontFamily:'monospace', fontWeight:700, marginBottom:12 }}>THE PROCESS</div>
            <h2 style={{ fontSize:36, fontWeight:800, letterSpacing:-0.5 }}>Zero risk. Zero upfront.</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:24 }}>
            {[
              { n:'01', title:'We find you', desc:'We search Google Maps for businesses in Augusta without websites.' },
              { n:'02', title:'We research you', desc:'We pull your real photos, reviews, hours, and brand colors.' },
              { n:'03', title:'We build your site', desc:'A unique demo — your actual data, your exact vibe. No templates.' },
              { n:'04', title:'We send it', desc:'One email with a direct link to your live demo. No sales pitch.' },
              { n:'05', title:'You decide', desc:'Love it? We talk price. Not for you? No hard feelings.' },
            ].map(step => (
              <div key={step.n} style={{ padding:'24px', border:'1px solid #F0F0EC', borderRadius:12 }}>
                <div style={{ fontSize:28, fontWeight:900, color:'#E8E8E4', marginBottom:12, fontFamily:'monospace' }}>{step.n}</div>
                <div style={{ fontSize:15, fontWeight:700, color:'#111', marginBottom:8 }}>{step.title}</div>
                <div style={{ fontSize:13, color:'#888', lineHeight:1.65 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'80px 24px', background:'#111', textAlign:'center' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <h2 style={{ fontSize:36, fontWeight:900, color:'#fff', marginBottom:16, letterSpacing:-0.5 }}>
            Your demo is already being built.
          </h2>
          <p style={{ fontSize:16, color:'#666', marginBottom:32, maxWidth:480, margin:'0 auto 32px' }}>
            We're working through businesses in Augusta right now. If you haven't heard from us yet, reach out directly.
          </p>
          <a href="mailto:ly@synthiqdesigns.com?subject=I want my free website demo"
            style={{ display:'inline-block', padding:'16px 36px', borderRadius:10,
              background:'#1D9E75', color:'#fff', fontSize:15, fontWeight:800, textDecoration:'none' }}>
            Get your free demo →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding:'24px', textAlign:'center', background:'#0A0A0A' }}>
        <div style={{ fontSize:12, color:'#444' }}>
          © 2026 Synthiq Web Design · Augusta, GA ·{' '}
          <a href="mailto:ly@synthiqdesigns.com" style={{ color:'#1D9E75' }}>ly@synthiqdesigns.com</a>
        </div>
      </footer>

    </main>
  )
}
