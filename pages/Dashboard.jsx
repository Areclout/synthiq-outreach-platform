import { useState, useEffect, useCallback } from "react";
import { BusinessLead } from "@/api/entities";

const FUNCTIONS_URL = "https://the-bank-76242c01.base44.app/functions";
const BASE_URL      = "https://the-bank-app-53a5c1b7.base44.app";

// ─── CATEGORY CONFIG ─────────────────────────────────────────────────────────
const CAT_EMOJI = {
  "Nail Salon":"💅","Barbershop":"✂️","Restaurant":"🍽️","Pest Control":"🛡️",
  "Pressure Washing":"💦","Auto Repair":"🔧","Painter":"🎨","Hvac":"❄️",
  "Landscaping":"🌿","Cleaning Service":"✨","Hair Salon":"💇","Contractor":"🏗️",
  "Plumber":"🔩","Electrician":"⚡","Roofer":"🏠",
};

const CAT_THEME = {
  "Nail Salon":       { primary:"#c4788a", secondary:"#f2e4d8", accent:"#bfa07a", dark:"#2d1b22", font:"Cormorant Garamond" },
  "Barbershop":       { primary:"#1a2744", secondary:"#d4af37", accent:"#f5f0e8", dark:"#0d1525", font:"Bebas Neue" },
  "Restaurant":       { primary:"#c4460a", secondary:"#f5a623", accent:"#2d5016", dark:"#1a0a00", font:"Playfair Display" },
  "Hair Salon":       { primary:"#4a1a6b", secondary:"#c4956a", accent:"#f7efea", dark:"#1e0a2e", font:"Abril Fatface" },
  "Contractor":       { primary:"#1c4e80", secondary:"#f47920", accent:"#e8edf2", dark:"#0d2238", font:"Rajdhani" },
  "Pest Control":     { primary:"#2d6a2d", secondary:"#7bc67b", accent:"#f0f7f0", dark:"#0f1f0f", font:"Inter" },
  "Pressure Washing": { primary:"#1e3a8a", secondary:"#38bdf8", accent:"#e0f2fe", dark:"#0c1a3a", font:"Oswald" },
  "Auto Repair":      { primary:"#7f1d1d", secondary:"#ef4444", accent:"#fef2f2", dark:"#450a0a", font:"Oswald" },
  "Hvac":             { primary:"#0c4a6e", secondary:"#0ea5e9", accent:"#e0f2fe", dark:"#082f49", font:"Inter" },
  "Landscaping":      { primary:"#14532d", secondary:"#22c55e", accent:"#f0fdf4", dark:"#052e16", font:"Inter" },
  "Cleaning Service": { primary:"#4c1d95", secondary:"#a78bfa", accent:"#f5f3ff", dark:"#1e1b4b", font:"Inter" },
  "Painter":          { primary:"#78350f", secondary:"#f59e0b", accent:"#fffbeb", dark:"#451a03", font:"Merriweather" },
  "Plumber":          { primary:"#1e3a5f", secondary:"#3b82f6", accent:"#eff6ff", dark:"#0f1e33", font:"Inter" },
  "Electrician":      { primary:"#3b1f00", secondary:"#f59e0b", accent:"#fffbeb", dark:"#1a0e00", font:"Oswald" },
  "Roofer":           { primary:"#1c1917", secondary:"#a8a29e", accent:"#fafaf9", dark:"#0c0a09", font:"Inter" },
  "default":          { primary:"#1e293b", secondary:"#6366f1", accent:"#eef2ff", dark:"#0f172a", font:"Inter" },
};

const DESIGNED_SLUGS = new Set([
  "ElegantNailsAndSpa","NailDesign","BeautyExpoGrovetown","PoblanosMexicanBarGrill",
  "TheChaum","TaqueriaMiCasita","YummyPhoGrovetown","JanwichesGrill",
  "GoForthPestControl","LikeNewPressureWashing",
]);

const STATUS_CFG = {
  found:      { label:"Found",         color:"#64748b", bg:"rgba(100,116,139,0.12)", dot:"#64748b" },
  site_built: { label:"Site Built",    color:"#6366f1", bg:"rgba(99,102,241,0.12)",  dot:"#6366f1" },
  approved:   { label:"Approved",      color:"#10b981", bg:"rgba(16,185,129,0.12)",  dot:"#10b981" },
  contacted:  { label:"Pitched",       color:"#f59e0b", bg:"rgba(245,158,11,0.12)",  dot:"#f59e0b" },
  replied:    { label:"Replied 🔥",    color:"#ef4444", bg:"rgba(239,68,68,0.15)",   dot:"#ef4444" },
  converted:  { label:"Converted 💰",  color:"#22c55e", bg:"rgba(34,197,94,0.12)",   dot:"#22c55e" },
  skipped:    { label:"Skipped",       color:"#374151", bg:"rgba(55,65,81,0.08)",    dot:"#374151" },
};

const SCAN_STEPS = [
  "Google Maps profile",
  "Logo & brand colors",
  "Photo gallery",
  "Google Reviews (verbatim)",
  "Business hours & phone",
  "Category design template",
  "Font personality match",
  "Generating demo site…",
];

const EMAIL_TEMPLATES = {
  default: {
    label: "Standard Pitch",
    subject: (biz) => `I built a free website for ${biz} — take a look`,
    body: (biz, owner, url, cat) => {
      const greeting = owner ? `Hi ${owner.split(" ")[0]}` : "Hi there";
      const hook = {
        "Nail Salon":       "Nail salons with a strong online presence book 3× more appointments. Right now, customers searching for nail services near you can't find you.",
        "Barbershop":       "Barbershops with websites get booked out weeks in advance. Right now, someone nearby is Googling for a barber and not finding you.",
        "Restaurant":       "Restaurants with websites see 70% more foot traffic from local searches. Hungry people near you are searching — and landing on competitors.",
        "Pest Control":     "When someone has a pest problem, the first company they find online gets the call. Right now, that's not you.",
        "Pressure Washing": "Homeowners search for pressure washing every single day. Without a website, you're invisible to all of them.",
        "Hvac":             "HVAC jobs average $300–$3,000 per ticket. Every week without a website is money going to whoever shows up on Google first.",
        "Auto Repair":      "People Google mechanics before they drive anywhere. Without a website, you're losing jobs to shops half as good as yours.",
        "Contractor":       "Contractors who show up online win bids before they ever make a call. A website is the first impression that gets you in the door.",
        "Landscaping":      "Homeowners hire the landscaper they trust first. A website with real photos of your work is how that trust starts.",
        "Cleaning Service": "Cleaning clients are loyal — but they have to find you first. A website turns a one-time search into a recurring customer.",
        "Plumber":          "Plumbing emergencies happen at 11pm. The plumber with a website gets that call. The one without doesn't.",
        "Electrician":      "Electrical jobs are high-ticket and urgent. Homeowners hire fast — and they hire whoever they find first online.",
        "Painter":          "Before anyone hires a painter, they look at work examples online. A website with your real projects turns browsers into booked jobs.",
        "Roofer":           "Roof jobs are some of the highest-value residential contracts out there. A website lets your work speak before you pick up the phone.",
      }[cat] || "Businesses with a professional website win more customers — and right now, yours isn't showing up when people search.";
      return `${greeting},

My name is Ly — I run a small web design company called Synthiq out of Augusta, Georgia. I work exclusively with local businesses in the CSRA, and I noticed ${biz} doesn't have a website yet.

So I built you one. Free. No strings.

${hook}

I put real time into your demo — your actual photos, your Google reviews, your services, your vibe. It's not a template. It's built specifically for ${biz}.

👉 Your demo: ${url}

If you like it, I'd love to make it officially yours — custom domain, your branding fully dialed in, live within a week. Pricing is flexible and built around what makes sense for your business. We can start as small or as big as you want — everything is negotiable.

If it's not your thing, no hard feelings — but take 30 seconds to look. I think you'll be surprised.

Talk soon,
Ly
Synthiq Web Design — Augusta, GA
Synthiq101@gmail.com`;
    }
  },
  followup: {
    label: "Follow-Up",
    subject: (biz) => `Re: your free website — just checking in`,
    body: (biz, owner, url) => {
      const greeting = owner ? `Hey ${owner.split(" ")[0]}` : "Hey";
      return `${greeting},

Just bumping this up in case my last message got buried. I built a free demo site for ${biz} and wanted to make sure you got a chance to see it.

Your demo: ${url}

No pressure at all. Budget, timeline, scope — we figure it out together. Happy to chat whenever works.

Ly — Synthiq Web Design
Synthiq101@gmail.com`;
    }
  },
  personal: {
    label: "Personal / Warm",
    subject: (biz) => `Quick question about ${biz}`,
    body: (biz, owner, url) => {
      const greeting = owner ? `Hi ${owner.split(" ")[0]}` : "Hi";
      return `${greeting},

I was searching for local businesses in Augusta and came across ${biz} — genuinely impressed with your reviews.

I noticed you don't have a website yet, so I went ahead and built you a demo. Free, yours to keep, built to actually look like YOUR business — not a template.

Here it is: ${url}

If you want to make it live, I can do that — affordable, fast, and we'll tweak it until it's exactly right. Happy to negotiate on anything.

Ly
Synthiq Web Design
Synthiq101@gmail.com`;
    }
  },
  urgency: {
    label: "Competitive Urgency",
    subject: (biz) => `Your competitor just got a new website — here's yours`,
    body: (biz, owner, url) => {
      const greeting = owner ? `Hi ${owner.split(" ")[0]}` : "Hi";
      return `${greeting},

I build websites for local businesses in Augusta, and I noticed ${biz} doesn't have one yet while some of your competitors just got upgraded.

Built you a free demo so you can see what's possible before deciding anything: ${url}

No commitment. No pressure. If you want it live, I'll make it happen fast. Everything is on the table — domain, hosting, design, pricing. Reply when you're ready.

Ly — Synthiq Web Design
Synthiq101@gmail.com`;
    }
  }
};

const QUOTES = [
  "Revenue doesn't come from ideas. It comes from execution.",
  "Every lead you ignore is money someone else is making.",
  "One more email. One more demo. One more yes.",
  "Do the work. Everyone wants to be successful, but nobody wants to do the work.",
  "The grind is the gift.",
  "Your future clients are out there right now, waiting to be found.",
  "Show up. Every day. That's the edge.",
  "The secret of getting ahead is getting started.",
  "Discipline is the bridge between goals and accomplishment.",
  "Small consistent actions compound into massive results.",
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function Stars({ r = 0 }) {
  return <span style={{ color:"#f59e0b", fontSize:11, letterSpacing:1 }}>{"★".repeat(Math.floor(r))}{"☆".repeat(5-Math.floor(r))}</span>;
}
function Pill({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.found;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:9, fontWeight:800, letterSpacing:1.2, textTransform:"uppercase", color:c.color, background:c.bg, borderRadius:100, padding:"2px 8px", whiteSpace:"nowrap" }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:c.dot, display:"inline-block" }} />{c.label}
    </span>
  );
}

// ─── BRAND DNA PANEL ─────────────────────────────────────────────────────────
function BrandDNA({ lead }) {
  const t = CAT_THEME[lead.category] || CAT_THEME.default;
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const photos = Array.isArray(lead.photo_urls) ? lead.photo_urls.filter(Boolean) : [];
  const reviews = (() => {
    try { return (lead.google_reviews_full ? JSON.parse(lead.google_reviews_full) : JSON.parse(lead.google_reviews || "[]")).slice(0,3); }
    catch { return []; }
  })();

  useEffect(() => {
    setStep(0); setDone(false);
    const timers = SCAN_STEPS.map((_, i) =>
      setTimeout(() => { setStep(i + 1); if (i === SCAN_STEPS.length - 1) setTimeout(() => setDone(true), 400); }, i * 280)
    );
    return () => timers.forEach(clearTimeout);
  }, [lead.id]);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>

      {/* Terminal scan */}
      <div style={{ background:"#0d1117", border:"1px solid #21262d", borderRadius:10, padding:"12px 14px", fontFamily:"'DM Mono',monospace" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10, paddingBottom:8, borderBottom:"1px solid #21262d" }}>
          {["#FF5F57","#FFBD2E","#28C840"].map(c=><span key={c} style={{ width:9, height:9, borderRadius:"50%", background:c, display:"inline-block" }}/>)}
          <span style={{ fontSize:10, color:"#555", marginLeft:6 }}>brand_scan.sh — {lead.business_name}</span>
        </div>
        <div style={{ fontSize:11, color:"#58a6ff", marginBottom:6 }}>$ synthiq scan "{lead.business_name}" --extract-all</div>
        {SCAN_STEPS.slice(0, step).map((s, i) => (
          <div key={i} style={{ display:"flex", gap:8, marginBottom:3, opacity:1, animation:"fadeUp 0.2s ease" }}>
            <span style={{ color: i === step-1 && !done ? "#f5a623" : "#1d9e75", fontSize:11 }}>
              {i === step-1 && !done ? "⟳" : "✓"}
            </span>
            <span style={{ fontSize:11, color: i === step-1 && !done ? "#f5a623" : "#c9d1d9" }}>{s}</span>
          </div>
        ))}
        {done && (
          <div style={{ marginTop:8, padding:"6px 10px", background:"#0d2b0d", borderRadius:6, fontSize:11, color:"#1d9e75" }}>
            ✓ Brand DNA extracted — {photos.length || "?"} assets ready · {lead.review_count} reviews pulled
          </div>
        )}
      </div>

      {/* Color palette */}
      <div style={{ background:"#fff", border:"1px solid #f0f0f0", borderRadius:10, padding:"12px 14px" }}>
        <div style={{ fontSize:9, letterSpacing:2, color:"#aaa", fontFamily:"monospace", marginBottom:10 }}>BRAND PALETTE</div>
        <div style={{ display:"flex", gap:10, justifyContent:"space-between" }}>
          {[["primary",t.primary],["secondary",t.secondary],["accent",t.accent],["dark",t.dark]].map(([lbl,col])=>(
            <div key={lbl} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ width:38, height:38, borderRadius:9, background:col, boxShadow:`0 2px 8px ${col}44`, border:"1px solid rgba(0,0,0,0.06)" }}/>
              <span style={{ fontSize:8, fontFamily:"monospace", color:"#bbb" }}>{col.toUpperCase()}</span>
              <span style={{ fontSize:8, color:"#ccc" }}>{lbl}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop:10, height:6, borderRadius:3, background:`linear-gradient(90deg,${t.primary},${t.secondary},${t.accent})` }}/>
        <div style={{ marginTop:8, fontSize:10, color:"#888", fontFamily:"monospace" }}>Font: {t.font} · {CAT_EMOJI[lead.category]} {lead.category}</div>
      </div>

      {/* Photo grid */}
      {photos.length > 0 && (
        <div style={{ background:"#fff", border:"1px solid #f0f0f0", borderRadius:10, padding:"12px 14px" }}>
          <div style={{ fontSize:9, letterSpacing:2, color:"#aaa", fontFamily:"monospace", marginBottom:8 }}>SCRAPED PHOTOS ({photos.length})</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:5 }}>
            {photos.slice(0,8).map((url,i)=>(
              <div key={i} style={{ height:44, borderRadius:7, overflow:"hidden", background:"#f5f5f5" }}>
                <img src={url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>e.target.style.display="none"}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <div style={{ background:"#fff", border:"1px solid #f0f0f0", borderRadius:10, padding:"12px 14px" }}>
          <div style={{ fontSize:9, letterSpacing:2, color:"#aaa", fontFamily:"monospace", marginBottom:8 }}>VERBATIM GOOGLE REVIEWS</div>
          {reviews.map((r,i)=>(
            <div key={i} style={{ borderLeft:`2px solid ${t.secondary}`, paddingLeft:9, marginBottom:9 }}>
              <p style={{ fontSize:11, color:"#333", lineHeight:1.5, marginBottom:2, fontStyle:"italic" }}>"{r.text || r}"</p>
              {r.author && <p style={{ fontSize:9, color:"#888" }}>— {r.author} {"★".repeat(r.rating||5)}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Email preview */}
      <div style={{ background:`${t.primary}08`, border:`1px solid ${t.primary}20`, borderRadius:10, padding:"12px 14px" }}>
        <div style={{ fontSize:9, letterSpacing:2, color:"#aaa", fontFamily:"monospace", marginBottom:8 }}>PITCH EMAIL PREVIEW</div>
        <div style={{ fontSize:11, color:"#555", lineHeight:1.7 }}>
          <strong style={{ color:"#222" }}>Subject:</strong> I built <span style={{ color:t.primary, fontWeight:600 }}>{lead.business_name}</span> a free website ✨<br/><br/>
          Hi <strong>{lead.business_name.split(" ")[0]}</strong>,<br/><br/>
          I noticed <strong>{lead.business_name}</strong> doesn't have a website — but with{" "}
          <strong>{lead.review_count} reviews averaging {lead.google_rating}★</strong>, you deserve one.<br/><br/>
          I already built it:{" "}
          <span style={{ color:"#6366f1", fontWeight:600 }}>
            {BASE_URL}/BusinessSite?slug={lead.demo_site_slug}
          </span><br/><br/>
          <em style={{ color:"#888", fontSize:10 }}>Real photos. Real reviews. Your actual brand colors. Everything is negotiable.</em>
        </div>
      </div>
    </div>
  );
}

// ─── SITE PREVIEW ────────────────────────────────────────────────────────────
function SitePreview({ lead, mobile }) {
  const t = CAT_THEME[lead.category] || CAT_THEME.default;
  const photos = Array.isArray(lead.photo_urls) ? lead.photo_urls.filter(Boolean) : [];
  const reviews = (() => {
    try { return (lead.google_reviews_full ? JSON.parse(lead.google_reviews_full) : JSON.parse(lead.google_reviews||"[]")).slice(0,1); }
    catch { return []; }
  })();
  const services = [
    { "Nail Salon":["Gel Manicure","Acrylic Full Set","Nail Art","Spa Pedicure"] }[lead.category] ||
    { "Barbershop":["Signature Fade","Classic Cut","Beard Trim","Line-Up"] }[lead.category] ||
    { "Restaurant":["Dine In","Takeout","Catering","Private Events"] }[lead.category] ||
    { "Pest Control":["Roach & Ant","Termite Protection","Mosquito Treatment","Rodent Control"] }[lead.category] ||
    ["Service 1","Service 2","Service 3","Service 4"]
  ];

  return (
    <div style={{ borderRadius:12, overflow:"hidden", border:`1px solid ${t.primary}22`, background:t.accent, fontFamily:`'${t.font}',sans-serif`, boxShadow:`0 12px 40px ${t.primary}18` }}>
      {/* Nav */}
      <div style={{ background:t.primary, padding:"9px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:26, height:26, borderRadius:6, background:t.secondary, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:t.primary }}>
            {CAT_EMOJI[lead.category]}
          </div>
          <span style={{ color:"#fff", fontSize:12, fontWeight:700, letterSpacing:0.3 }}>{lead.business_name}</span>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          {["Services","Reviews","Contact"].map(nav=>(
            <span key={nav} style={{ color:"rgba(255,255,255,0.65)", fontSize:9, letterSpacing:1 }}>{nav.toUpperCase()}</span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg,${t.primary}F0,${t.secondary}80)`, padding:"28px 22px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        {photos[0] && <img src={photos[0]} alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.18 }} onError={e=>e.target.style.display="none"}/>}
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-block", background:t.secondary, color:t.primary, fontSize:9, fontFamily:"monospace", letterSpacing:3, padding:"3px 12px", borderRadius:20, marginBottom:10, fontWeight:700 }}>
            {(lead.category||"").toUpperCase()} · {(lead.city||"").toUpperCase()}, GA
          </div>
          <h1 style={{ fontSize:24, color:"#fff", lineHeight:1.1, marginBottom:8, fontWeight:900, textShadow:"0 2px 12px rgba(0,0,0,0.3)" }}>{lead.business_name}</h1>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginBottom:14 }}>
            <Stars r={lead.google_rating}/>
            <span style={{ color:"rgba(255,255,255,0.85)", fontSize:11 }}>{lead.google_rating} ({lead.review_count} reviews)</span>
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
            <div style={{ background:t.secondary, color:t.primary, padding:"8px 18px", borderRadius:8, fontSize:11, fontWeight:700, cursor:"pointer" }}>Book Now</div>
            <div style={{ background:"rgba(255,255,255,0.15)", color:"#fff", padding:"8px 18px", borderRadius:8, fontSize:11, fontWeight:600, border:"1px solid rgba(255,255,255,0.3)", cursor:"pointer" }}>{lead.phone}</div>
          </div>
        </div>
      </div>

      {/* Photo strip */}
      {photos.length > 0 && (
        <div style={{ display:"flex", gap:3, padding:"8px 10px", background:t.accent }}>
          {photos.slice(0,4).map((url,i)=>(
            <div key={i} style={{ flex:1, height:46, borderRadius:7, overflow:"hidden", background:"#eee" }}>
              <img src={url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>e.target.style.display="none"}/>
            </div>
          ))}
        </div>
      )}

      {/* Services */}
      <div style={{ padding:"12px 14px 8px", background:t.accent }}>
        <p style={{ fontSize:8, letterSpacing:3, color:t.primary, fontFamily:"monospace", fontWeight:700, marginBottom:8 }}>SERVICES</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
          {services.map(s=>(
            <div key={s} style={{ background:`${t.primary}10`, border:`1px solid ${t.primary}18`, borderRadius:7, padding:"6px 10px", fontSize:10, color:t.dark, fontWeight:500 }}>{s}</div>
          ))}
        </div>
      </div>

      {/* Review */}
      {reviews[0] && (
        <div style={{ padding:"10px 14px 14px", background:t.accent }}>
          <p style={{ fontSize:8, letterSpacing:3, color:t.primary, fontFamily:"monospace", fontWeight:700, marginBottom:8 }}>WHAT PEOPLE SAY</p>
          <div style={{ background:`${t.primary}06`, borderLeft:`3px solid ${t.secondary}`, borderRadius:"0 8px 8px 0", padding:"9px 12px" }}>
            <p style={{ fontSize:11, color:t.dark, lineHeight:1.5, fontStyle:"italic", marginBottom:4 }}>"{reviews[0].text || reviews[0]}"</p>
            {reviews[0].author && <p style={{ fontSize:9, color:t.primary, fontWeight:700 }}>— {reviews[0].author}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EMAIL COMPOSER MODAL ────────────────────────────────────────────────────
function EmailComposer({ lead, onClose, onSent }) {
  const [tpl, setTpl]         = useState("default");
  const [to, setTo]           = useState(lead.email || "");
  const [subject, setSubject] = useState("");
  const [body, setBody]       = useState("");
  const [sending, setSending] = useState(false);
  const demoUrl = `${BASE_URL}/BusinessSite?slug=${lead.demo_site_slug}`;

  useEffect(() => {
    const t = EMAIL_TEMPLATES[tpl];
    setSubject(t.subject(lead.business_name));
    setBody(t.body(lead.business_name, lead.owner_name, demoUrl, lead.category));
  }, [tpl, lead.id]);

  const send = async () => {
    if (!to.trim()) { alert("Add an email address first"); return; }
    setSending(true);
    try {
      const r = await fetch(`${FUNCTIONS_URL}/sendPitchEmail`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ leadId:lead.id, to:to.trim(), businessName:lead.business_name, demoUrl, ownerName:lead.owner_name||"", customSubject:subject, customBody:body }),
      });
      if (!r.ok) throw new Error(await r.text());
      await BusinessLead.update(lead.id, { email:to.trim(), email_sent:true, email_sent_date:new Date().toISOString(), status:"contacted" });
      onSent();
    } catch(e) { alert("Send failed: "+e.message); }
    setSending(false);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(10px)", zIndex:950, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#0f0f1a", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, width:"100%", maxWidth:660, maxHeight:"88vh", overflow:"auto", padding:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:"#fff" }}>✉ Pitch — {lead.business_name}</div>
            <a href={demoUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:"#6366f1", textDecoration:"none" }}>view demo ↗</a>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.35)", fontSize:20, cursor:"pointer" }}>✕</button>
        </div>

        {/* Template tabs */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
          {Object.entries(EMAIL_TEMPLATES).map(([key,t])=>(
            <button key={key} onClick={()=>setTpl(key)}
              style={{ fontSize:11, fontWeight:700, padding:"5px 13px", borderRadius:8, cursor:"pointer", border:"1px solid", transition:"all 0.15s",
                background:tpl===key?"#6366f1":"transparent", borderColor:tpl===key?"#6366f1":"rgba(255,255,255,0.12)",
                color:tpl===key?"#fff":"rgba(255,255,255,0.4)" }}>
              {t.label}
            </button>
          ))}
        </div>

        {[["To", to, setTo, "their@email.com"], ["Subject", subject, setSubject, "Subject line"]].map(([lbl,val,set,ph])=>(
          <div key={lbl} style={{ marginBottom:10 }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", letterSpacing:1.5, textTransform:"uppercase", marginBottom:5 }}>{lbl}</div>
            <input value={val} onChange={e=>set(e.target.value)} placeholder={ph}
              style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"9px 13px", color:"#fff", fontSize:13, outline:"none" }}/>
          </div>
        ))}

        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", letterSpacing:1.5, textTransform:"uppercase", marginBottom:5 }}>Body <span style={{ color:"rgba(255,255,255,0.2)", fontWeight:400, textTransform:"none" }}>— edit freely</span></div>
          <textarea value={body} onChange={e=>setBody(e.target.value)} rows={13}
            style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"11px 13px", color:"rgba(255,255,255,0.85)", fontSize:12, outline:"none", resize:"vertical", lineHeight:1.7, fontFamily:"inherit" }}/>
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={send} disabled={sending}
            style={{ flex:1, background:"linear-gradient(135deg,#6366f1,#4f46e5)", border:"none", color:"#fff", fontWeight:800, fontSize:14, padding:13, borderRadius:10, cursor:"pointer", opacity:sending?0.6:1 }}>
            {sending ? "Sending…" : "Send Pitch ✉"}
          </button>
          <button onClick={onClose}
            style={{ padding:"13px 18px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)", borderRadius:10, cursor:"pointer", fontSize:13 }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [leads, setLeads]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);
  const [tab, setTab]             = useState("preview"); // preview | dna
  const [mobileView, setMobileV]  = useState(false);
  const [filter, setFilter]       = useState("all");
  const [search, setSearch]       = useState("");
  const [composer, setComposer]   = useState(null);
  const [quote]                   = useState(() => QUOTES[Math.floor(Math.random()*QUOTES.length)]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${FUNCTIONS_URL}/getLeads`, { method:"POST", headers:{"Content-Type":"application/json"}, body:"{}" });
      const d = await r.json();
      if (d.leads && d.leads.length > 0) {
        setLeads(d.leads);
        setSelected(prev => prev || d.leads[0]);
      }
    } catch(e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Keep selected in sync after refresh
  useEffect(() => {
    if (selected && leads.length) {
      const fresh = leads.find(l => l.id === selected.id);
      if (fresh) setSelected(fresh);
    }
  }, [leads]);

  const total      = leads.length;
  const sitesBuilt = leads.filter(l => l.status !== "found").length;
  const emailed    = leads.filter(l => l.email_sent).length;
  const replied    = leads.filter(l => l.email_replied).length;
  const converted  = leads.filter(l => l.status === "converted").length;

  const filtered = leads.filter(l => {
    if (l.status === "skipped") return false;
    if (filter === "ready")   return !l.email_sent && l.status === "site_built";
    if (filter === "sent")    return l.email_sent;
    if (filter === "replied") return l.email_replied;
    if (filter === "custom")  return DESIGNED_SLUGS.has(l.demo_site_slug||"");
    if (search && !l.business_name.toLowerCase().includes(search.toLowerCase()) && !(l.city||"").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sel = selected;
  const selTheme = sel ? (CAT_THEME[sel.category] || CAT_THEME.default) : CAT_THEME.default;

  return (
    <div style={{ minHeight:"100vh", background:"#F8F8F6", fontFamily:"'Syne','Inter',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700;800&family=DM+Mono:wght@400;500&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @keyframes slideIn{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes spin{to{transform:rotate(360deg)}}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#ddd;border-radius:2px}
        input::placeholder{color:rgba(0,0,0,0.25)!important}
      `}</style>

      {composer && <EmailComposer lead={composer} onClose={()=>setComposer(null)} onSent={()=>{setComposer(null);load();}}/>}

      {/* ── TOP BAR ── */}
      <div style={{ background:"#fff", borderBottom:"1px solid #EDEDE8", padding:"0 24px", display:"flex", alignItems:"center", height:54, gap:20, position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 0 #edede8" }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, letterSpacing:-0.5, color:"#111" }}>
          synth<span style={{ color:"#1D9E75" }}>iq</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#888", fontFamily:"'DM Mono',monospace" }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:"#1D9E75", display:"inline-block", animation:"pulse 2s infinite" }}/>
          pipeline live · Augusta, GA
        </div>
        <div style={{ fontSize:11, fontStyle:"italic", color:"#aaa", flex:1, textAlign:"center", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>
          "{quote}"
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <a href={`${FUNCTIONS_URL}/synthiqApi?stats=true`} target="_blank" rel="noopener noreferrer"
            style={{ fontSize:10, padding:"5px 11px", borderRadius:6, background:"#F1EFE8", color:"#666", fontFamily:"'DM Mono',monospace", textDecoration:"none" }}>
            API ↗
          </a>
          <a href="https://github.com/Areclout/synthiq-outreach-platform" target="_blank" rel="noopener noreferrer"
            style={{ fontSize:10, padding:"5px 11px", borderRadius:6, background:"#F1EFE8", color:"#666", fontFamily:"'DM Mono',monospace", textDecoration:"none" }}>
            GitHub ↗
          </a>
          <button onClick={()=>window.sendPrompt?.("Run the Synthiq scraper now and find 10 new leads near Augusta with no website")}
            style={{ fontSize:11, padding:"6px 14px", borderRadius:7, background:"#1D9E75", color:"#fff", fontWeight:700, border:"none", cursor:"pointer" }}>
            + Run Scraper
          </button>
        </div>
      </div>

      {/* ── STAT BAR ── */}
      <div style={{ background:"#fff", borderBottom:"1px solid #EDEDE8", padding:"10px 24px", display:"flex", gap:0 }}>
        {[
          { label:"Leads",    val:total,      sub:"14 categories",           color:"#6366f1" },
          { label:"Built",    val:sitesBuilt, sub:`${total?Math.round(sitesBuilt/total*100):0}% build rate`, color:"#8b5cf6" },
          { label:"Avg ★",    val:"4.7",      sub:"1,261 total reviews",     color:"#f59e0b" },
          { label:"Pitched",  val:emailed,    sub:emailed===0?"Ready to launch 🚀":`${replied} replied`, color:"#10b981" },
          { label:"Converted",val:converted,  sub:"$0 → first close incoming", color:"#22c55e" },
        ].map((s,i,arr)=>(
          <div key={s.label} style={{ flex:1, padding:"6px 18px", borderRight:i<arr.length-1?"1px solid #EDEDE8":"none" }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"#aaa", marginBottom:4, fontFamily:"'DM Mono',monospace" }}>{s.label}</div>
            <div style={{ fontSize:24, fontWeight:900, color:s.color, lineHeight:1, fontFamily:"'Syne',sans-serif" }}>{s.val}</div>
            <div style={{ fontSize:10, color:"#aaa", marginTop:2 }}>{s.sub}</div>
          </div>
        ))}
        {/* Pipeline mini */}
        <div style={{ flex:2, padding:"6px 18px", borderLeft:"1px solid #EDEDE8" }}>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:"#aaa", marginBottom:6, fontFamily:"'DM Mono',monospace" }}>Pipeline</div>
          <div style={{ display:"flex", gap:0, height:22 }}>
            {[
              { label:"Found",   val:total,      color:"#6366f1" },
              { label:"Built",   val:sitesBuilt, color:"#8b5cf6" },
              { label:"Pitched", val:emailed,    color:"#f59e0b" },
              { label:"Replied", val:replied,    color:"#ef4444" },
              { label:"Closed",  val:converted,  color:"#22c55e" },
            ].map((s,i,arr)=>(
              <div key={s.label} style={{ flex:1, borderRight:i<arr.length-1?"1px solid rgba(255,255,255,0.3)":"none", background:s.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#fff", borderRadius:i===0?"6px 0 0 6px":i===arr.length-1?"0 6px 6px 0":"0" }}>
                {s.val}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:0 }}>
            {["Found","Built","Pitched","Replied","Closed"].map(l=>(
              <div key={l} style={{ flex:1, fontSize:8, color:"#bbb", textAlign:"center", marginTop:3, fontFamily:"'DM Mono',monospace" }}>{l}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BUSINESS SELECTOR TABS ── */}
      <div style={{ background:"#fff", borderBottom:"1px solid #EDEDE8", padding:"0 24px", display:"flex", gap:0, overflowX:"auto" }}>
        {filtered.slice(0,12).map(lead => {
          const isActive = sel?.id === lead.id;
          const t = CAT_THEME[lead.category] || CAT_THEME.default;
          return (
            <button key={lead.id} onClick={()=>setSelected(lead)}
              style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 14px", border:"none", borderBottom:isActive?`2.5px solid ${t.primary}`:"2.5px solid transparent", background:"none", cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.15s", flexShrink:0 }}>
              <div style={{ width:22, height:22, borderRadius:5, background:t.primary, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:t.secondary }}>
                {CAT_EMOJI[lead.category]}
              </div>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontSize:11, fontWeight:isActive?700:500, color:isActive?"#111":"#666" }}>{lead.business_name}</div>
                <div style={{ fontSize:9, color:"#bbb", fontFamily:"'DM Mono',monospace" }}>{lead.category}</div>
              </div>
              <Pill status={lead.status}/>
            </button>
          );
        })}
      </div>

      {/* ── MAIN SPLIT LAYOUT ── */}
      <div style={{ display:"grid", gridTemplateColumns:"360px 1fr", height:"calc(100vh - 178px)" }}>

        {/* ─ LEFT: LEAD LIST ─ */}
        <div style={{ borderRight:"1px solid #EDEDE8", overflowY:"auto", background:"#FAFAF8" }}>
          {/* Filters */}
          <div style={{ padding:"10px 14px", borderBottom:"1px solid #EDEDE8", position:"sticky", top:0, background:"#FAFAF8", zIndex:10 }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search business or city…"
              style={{ width:"100%", background:"#fff", border:"1px solid #e8e8e4", borderRadius:8, padding:"7px 12px", color:"#333", fontSize:12, outline:"none", marginBottom:8 }}/>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              {[
                { id:"all",    label:`All (${leads.filter(l=>l.status!=="skipped").length})` },
                { id:"ready",  label:`Ready (${leads.filter(l=>!l.email_sent&&l.status==="site_built").length})` },
                { id:"sent",   label:`Pitched (${emailed})` },
                { id:"replied",label:`Replied (${replied})` },
                { id:"custom", label:"Custom" },
              ].map(f=>(
                <button key={f.id} onClick={()=>setFilter(f.id)}
                  style={{ fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:6, cursor:"pointer", border:"1px solid", transition:"all 0.15s",
                    background:filter===f.id?"#1D9E75":"transparent", borderColor:filter===f.id?"#1D9E75":"#e0e0d8",
                    color:filter===f.id?"#fff":"#888" }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lead cards */}
          {loading ? (
            <div style={{ padding:40, textAlign:"center", color:"#aaa", fontSize:12 }}>Loading leads…</div>
          ) : filtered.map(lead => {
            const isActive = sel?.id === lead.id;
            const t = CAT_THEME[lead.category] || CAT_THEME.default;
            const isCustom = DESIGNED_SLUGS.has(lead.demo_site_slug||"");
            return (
              <div key={lead.id} onClick={()=>setSelected(lead)}
                style={{ padding:"10px 14px", borderBottom:"1px solid #EDEDE8", cursor:"pointer", transition:"all 0.15s",
                  background: isActive ? `${t.primary}08` : "transparent",
                  borderLeft: isActive ? `3px solid ${t.primary}` : "3px solid transparent" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:9 }}>
                  <div style={{ width:34, height:34, borderRadius:8, background:t.primary, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>
                    {CAT_EMOJI[lead.category]}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3, flexWrap:"wrap" }}>
                      <span style={{ fontSize:12, fontWeight:700, color:"#111" }}>{lead.business_name}</span>
                      {isCustom && <span style={{ fontSize:8, fontWeight:800, letterSpacing:1.5, color:t.primary, background:`${t.primary}12`, padding:"1px 6px", borderRadius:100, border:`1px solid ${t.primary}20` }}>✦ CUSTOM</span>}
                    </div>
                    <div style={{ display:"flex", gap:8, fontSize:10, color:"#aaa", flexWrap:"wrap", alignItems:"center" }}>
                      <Pill status={lead.status}/>
                      <span>📍{lead.city}</span>
                      <Stars r={lead.google_rating}/>
                      <span>{lead.google_rating} ({lead.review_count})</span>
                    </div>
                  </div>
                  <button onClick={e=>{e.stopPropagation();setComposer(lead);}}
                    style={{ fontSize:10, fontWeight:800, padding:"5px 10px", borderRadius:7, cursor:"pointer", border:"none", flexShrink:0,
                      background:lead.email_sent?"rgba(245,158,11,0.12)":"#1D9E75", color:lead.email_sent?"#f59e0b":"#fff" }}>
                    {lead.email_sent?"Re-pitch":"Pitch"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─ RIGHT: DETAIL VIEW ─ */}
        <div style={{ overflowY:"auto", background:"#F2F2EE" }}>
          {sel ? (
            <>
              {/* Tab bar + controls */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", position:"sticky", top:0, background:"#F2F2EE", zIndex:10, borderBottom:"1px solid #e8e8e2" }}>
                <div style={{ display:"flex", gap:5 }}>
                  {["preview","dna"].map(t=>(
                    <button key={t} onClick={()=>setTab(t)}
                      style={{ fontSize:11, fontFamily:"'DM Mono',monospace", padding:"5px 14px", borderRadius:6, border:"1px solid", cursor:"pointer",
                        borderColor:tab===t?selTheme.primary:"#E0E0D8",
                        background:tab===t?selTheme.primary:"#fff",
                        color:tab===t?"#fff":"#888" }}>
                      {t === "preview" ? "Site Preview" : "Brand DNA"}
                    </button>
                  ))}
                  {tab==="preview" && (
                    <button onClick={()=>setMobileV(v=>!v)}
                      style={{ fontSize:11, fontFamily:"'DM Mono',monospace", padding:"5px 14px", borderRadius:6, border:"1px solid #E0E0D8", background:mobileView?"#333":"#fff", color:mobileView?"#fff":"#888", cursor:"pointer" }}>
                      {mobileView ? "📱 Mobile" : "🖥 Desktop"}
                    </button>
                  )}
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <a href={`${BASE_URL}/BusinessSite?slug=${sel.demo_site_slug}`} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize:11, color:selTheme.primary, fontWeight:700, padding:"6px 14px", borderRadius:7, background:`${selTheme.primary}10`, border:`1px solid ${selTheme.primary}20`, textDecoration:"none" }}>
                    Open Demo ↗
                  </a>
                  <button onClick={()=>setComposer(sel)}
                    style={{ fontSize:12, fontWeight:800, padding:"6px 16px", borderRadius:7, cursor:"pointer", border:"none",
                      background:sel.email_sent?"rgba(245,158,11,0.12)":"linear-gradient(135deg,#1D9E75,#0f6e56)",
                      color:sel.email_sent?"#f59e0b":"#fff" }}>
                    {sel.email_sent ? "✉ Re-pitch" : "✉ Send Pitch"}
                  </button>
                </div>
              </div>

              <div style={{ padding:"0 20px 20px" }}>
                {tab === "dna" ? (
                  <div style={{ animation:"slideIn 0.3s ease", marginTop:14 }} key={sel.id+"-dna"}>
                    <BrandDNA lead={sel}/>
                  </div>
                ) : (
                  <div style={{ animation:"slideIn 0.3s ease", marginTop:14 }} key={sel.id+"-preview"}>
                    {/* Browser chrome */}
                    <div style={{ background:"#EBEBEB", borderRadius:"10px 10px 0 0", padding:"8px 12px", display:"flex", alignItems:"center", gap:9, border:"1px solid #DCDCD8", borderBottom:"none" }}>
                      <div style={{ display:"flex", gap:5 }}>
                        {["#FF5F57","#FFBD2E","#28C840"].map(c=><span key={c} style={{ width:9, height:9, borderRadius:"50%", background:c, display:"inline-block" }}/>)}
                      </div>
                      <div style={{ flex:1, background:"#fff", borderRadius:5, padding:"3px 11px", fontSize:10, color:"#888", fontFamily:"'DM Mono',monospace", border:"1px solid #DDD" }}>
                        🔒 {BASE_URL}/BusinessSite?slug={sel.demo_site_slug}
                      </div>
                    </div>
                    <div style={{ maxWidth:mobileView?375:"100%", margin:"0 auto", transition:"max-width 0.3s ease", border:"1px solid #DCDCD8", borderTop:"none", borderRadius:"0 0 10px 10px", overflow:"hidden" }}>
                      <SitePreview lead={sel} mobile={mobileView}/>
                    </div>

                    {/* Meta stats row */}
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginTop:14 }}>
                      {[
                        { label:"Build Time",     val:"~4 min" },
                        { label:"Photos",          val:(Array.isArray(sel.photo_urls)?sel.photo_urls.filter(Boolean).length:0)||"?" },
                        { label:"Google Reviews",  val:sel.review_count },
                        { label:"Est. Value",      val:"$1,200" },
                      ].map(m=>(
                        <div key={m.label} style={{ background:"#fff", borderRadius:9, padding:"10px 12px", border:"1px solid #EDEDE8" }}>
                          <div style={{ fontSize:9, fontFamily:"'DM Mono',monospace", color:"#aaa", marginBottom:3, textTransform:"uppercase", letterSpacing:1 }}>{m.label}</div>
                          <div style={{ fontSize:20, fontWeight:900, color:"#111", fontFamily:"'Syne',sans-serif" }}>{m.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"#aaa", fontSize:13 }}>
              ← Select a business to view its demo and Brand DNA
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
