import { useState, useEffect, useCallback } from "react";
import { BusinessLead } from "@/api/entities";

const BASE_URL = "https://the-bank-app-53a5c1b7.base44.app";
const FUNCTIONS_URL = "https://the-bank-76242c01.base44.app/functions";

const QUOTES = [
  "\"The secret of getting ahead is getting started.\" — Mark Twain",
  "\"Success is not for the lazy.\"",
  "\"Do the work. Everyone wants to be successful, but nobody wants to do the work.\" — Gary Vee",
  "\"Every lead you ignore is money someone else is making.\"",
  "\"Your future clients are out there right now, waiting to be found.\"",
  "\"Discipline is the bridge between goals and accomplishment.\" — Jim Rohn",
  "\"One more email. One more demo. One more yes.\"",
  "\"You don't have to be great to start, but you have to start to be great.\" — Zig Ziglar",
  "\"Revenue doesn't come from ideas. It comes from execution.\"",
  "\"The grind is the gift.\"",
];

const STATUS_CFG = {
  found:      { label: "Found",        color: "#64748b", bg: "rgba(100,116,139,0.12)", dot: "#64748b" },
  site_built: { label: "Site Built",   color: "#818cf8", bg: "rgba(129,140,248,0.12)", dot: "#818cf8" },
  approved:   { label: "Approved",     color: "#34d399", bg: "rgba(52,211,153,0.12)",  dot: "#34d399" },
  contacted:  { label: "Emailed",      color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  dot: "#fbbf24" },
  replied:    { label: "Replied 🔥",   color: "#f87171", bg: "rgba(248,113,113,0.15)", dot: "#f87171" },
  converted:  { label: "Converted 💰", color: "#4ade80", bg: "rgba(74,222,128,0.12)",  dot: "#4ade80" },
  skipped:    { label: "Skipped",      color: "#374151", bg: "rgba(55,65,81,0.1)",     dot: "#374151" },
};

const CAT_EMOJI = {
  "Nail Salon":"💅","Barbershop":"✂️","Restaurant":"🍽️","Pest Control":"🛡️",
  "Pressure Washing":"💦","Auto Repair":"🔧","Painter":"🎨","Hvac":"❄️",
  "Landscaping":"🌿","Cleaning Service":"✨","Hair Salon":"💇","Contractor":"🏗️",
};

const DESIGNED_SLUGS = new Set([
  "ElegantNailsAndSpa","NailDesign","BeautyExpoGrovetown","PoblanosMexicanBarGrill",
  "TheChaum","TaqueriaMiCasita","YummyPhoGrovetown","JanwichesGrill",
  "GoForthPestControl","LikeNewPressureWashing",
]);

function Dot({ color }) {
  return <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block", marginRight: 6, flexShrink: 0 }} />;
}

function StatusPill({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.found;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: c.color, background: c.bg, borderRadius: 100, padding: "3px 10px", whiteSpace: "nowrap" }}>
      <Dot color={c.dot} />{c.label}
    </span>
  );
}

function Stars({ r = 0 }) {
  return <span style={{ color: "#fbbf24", fontSize: 11 }}>{"★".repeat(Math.floor(r))}{"☆".repeat(5 - Math.floor(r))}</span>;
}

function LeadRow({ lead, onRefresh, onReply }) {
  const [sending, setSending] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [emailVal, setEmailVal] = useState(lead.email || "");
  const [editNote, setEditNote] = useState(false);
  const [note, setNote] = useState(lead.notes || "");

  const slug = lead.demo_site_slug || "";
  const isDesigned = DESIGNED_SLUGS.has(slug);
  const demoUrl = `${BASE_URL}/BusinessSite?slug=${slug}`;
  const emoji = CAT_EMOJI[lead.category] || "📍";

  const approve = async () => {
    await BusinessLead.update(lead.id, { approved: true, approved_date: new Date().toISOString(), status: "approved" });
    onRefresh();
  };

  const skip = async () => {
    await BusinessLead.update(lead.id, { status: "skipped" });
    onRefresh();
  };

  const sendEmail = async () => {
    const to = emailVal.trim();
    if (!to) { setShowEmail(true); return; }
    setSending(true);
    try {
      const r = await fetch(`${FUNCTIONS_URL}/sendPitchEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id, to, businessName: lead.business_name, demoUrl, ownerName: lead.owner_name || "" }),
      });
      if (!r.ok) throw new Error(await r.text());
      await BusinessLead.update(lead.id, { email: to, email_sent: true, email_sent_date: new Date().toISOString(), status: "contacted" });
      setShowEmail(false);
      onRefresh();
    } catch (e) { alert("Send failed: " + e.message); }
    setSending(false);
  };

  const saveNote = async () => {
    await BusinessLead.update(lead.id, { notes: note });
    setEditNote(false);
    onRefresh();
  };

  if (lead.status === "skipped") return null;

  return (
    <div style={{
      background: lead.email_replied
        ? "linear-gradient(90deg,rgba(248,113,113,0.06),rgba(15,15,28,0.8))"
        : isDesigned
        ? "linear-gradient(90deg,rgba(129,140,248,0.05),rgba(15,15,28,0.8))"
        : "rgba(255,255,255,0.025)",
      border: lead.email_replied
        ? "1px solid rgba(248,113,113,0.3)"
        : isDesigned
        ? "1px solid rgba(129,140,248,0.2)"
        : "1px solid rgba(255,255,255,0.06)",
      borderRadius: 14, padding: "16px 20px", marginBottom: 8, transition: "all 0.2s",
    }}>
      {lead.email_replied && (
        <div onClick={() => onReply(lead)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:8, padding:"8px 14px", marginBottom:12, cursor:"pointer" }}>
          <span style={{ fontSize:12, fontWeight:700, color:"#f87171" }}>🔥 They replied — click to read</span>
          <span style={{ fontSize:11, color:"rgba(248,113,113,0.5)" }}>{lead.email_reply_date ? new Date(lead.email_reply_date).toLocaleDateString() : ""}</span>
        </div>
      )}
      <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
        <div style={{ width:42, height:42, borderRadius:10, background:isDesigned?"rgba(129,140,248,0.15)":"rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, flexShrink:0, border:isDesigned?"1px solid rgba(129,140,248,0.25)":"1px solid rgba(255,255,255,0.06)" }}>
          {emoji}
        </div>
        <div style={{ flex:1, minWidth:180 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
            <span style={{ fontSize:14, fontWeight:700, color:"#fff", letterSpacing:-0.3 }}>{lead.business_name}</span>
            <StatusPill status={lead.status} />
            {isDesigned && <span style={{ fontSize:9, fontWeight:800, letterSpacing:1.5, color:"#818cf8", background:"rgba(129,140,248,0.12)", padding:"2px 8px", borderRadius:100, textTransform:"uppercase", border:"1px solid rgba(129,140,248,0.2)" }}>✦ Site Designed</span>}
          </div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", fontSize:11, color:"rgba(255,255,255,0.35)" }}>
            <span>📍 {lead.city}</span>
            <span>· {lead.category}</span>
            {lead.google_rating > 0 && <span>· <Stars r={lead.google_rating} /> {lead.google_rating} ({lead.review_count})</span>}
            {lead.phone && <span>· {lead.phone}</span>}
            {lead.email_sent && <span style={{ color:"#fbbf24" }}>· ✉ Sent {lead.email_sent_date ? new Date(lead.email_sent_date).toLocaleDateString() : ""}</span>}
          </div>
          {showEmail && (
            <div style={{ display:"flex", gap:8, marginTop:10 }}>
              <input value={emailVal} onChange={e=>setEmailVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendEmail()} placeholder="their@email.com" style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:8, padding:"7px 12px", color:"#fff", fontSize:13, outline:"none" }} autoFocus />
              <button onClick={sendEmail} disabled={sending} style={{ background:"linear-gradient(135deg,#818cf8,#6366f1)", border:"none", color:"#fff", fontWeight:700, fontSize:12, padding:"7px 16px", borderRadius:8, cursor:"pointer" }}>{sending?"Sending...":"Send ✉"}</button>
              <button onClick={()=>setShowEmail(false)} style={{ background:"none", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.3)", fontSize:11, padding:"7px 12px", borderRadius:8, cursor:"pointer" }}>✕</button>
            </div>
          )}
          {editNote ? (
            <div style={{ display:"flex", gap:8, marginTop:10 }}>
              <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a note..." style={{ flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"6px 12px", color:"#fff", fontSize:12, outline:"none" }} autoFocus />
              <button onClick={saveNote} style={{ background:"rgba(255,255,255,0.08)", border:"none", color:"#fff", fontSize:11, padding:"6px 14px", borderRadius:8, cursor:"pointer" }}>Save</button>
              <button onClick={()=>setEditNote(false)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.3)", fontSize:11, cursor:"pointer" }}>Cancel</button>
            </div>
          ) : lead.notes ? (
            <div onClick={()=>setEditNote(true)} style={{ marginTop:6, fontSize:11, color:"rgba(255,255,255,0.28)", cursor:"pointer", fontStyle:"italic" }}>📝 {lead.notes}</div>
          ) : null}
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0, flexWrap:"wrap" }}>
          <a href={demoUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:"#818cf8", fontWeight:600, padding:"7px 13px", borderRadius:8, background:"rgba(129,140,248,0.1)", border:"1px solid rgba(129,140,248,0.2)", textDecoration:"none", whiteSpace:"nowrap" }}>View Demo →</a>
          <button onClick={()=>setEditNote(true)} title="Add note" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.35)", fontSize:13, width:32, height:32, borderRadius:8, cursor:"pointer" }}>📝</button>
          <button onClick={skip} style={{ background:"none", border:"1px solid rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.25)", fontSize:11, padding:"7px 12px", borderRadius:8, cursor:"pointer" }}>Skip</button>
          {!lead.approved ? (
            <button onClick={approve} style={{ background:"linear-gradient(135deg,#34d399,#059669)", border:"none", color:"#fff", fontWeight:700, fontSize:12, padding:"7px 16px", borderRadius:8, cursor:"pointer" }}>✅ Approve</button>
          ) : !lead.email_sent ? (
            <button onClick={()=>setShowEmail(true)} style={{ background:"linear-gradient(135deg,#818cf8,#6366f1)", border:"none", color:"#fff", fontWeight:700, fontSize:12, padding:"7px 16px", borderRadius:8, cursor:"pointer" }}>✉ Send Email</button>
          ) : (
            <span style={{ fontSize:11, color:"#34d399", fontWeight:700 }}>✓ Sent</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ReplyModal({ lead, onClose }) {
  if (!lead) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#0f0f1e", border:"1px solid rgba(248,113,113,0.3)", borderRadius:20, padding:"36px", maxWidth:580, width:"100%" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:3, color:"#f87171", textTransform:"uppercase", marginBottom:6 }}>Reply Received 🔥</div>
            <div style={{ fontSize:20, fontWeight:700, color:"#fff" }}>{lead.business_name}</div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.06)", border:"none", color:"#fff", width:34, height:34, borderRadius:"50%", fontSize:16, cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"18px 20px", marginBottom:20 }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.28)", marginBottom:10 }}>{lead.email_reply_date ? new Date(lead.email_reply_date).toLocaleString() : ""}</div>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.7)", lineHeight:1.8, margin:0, whiteSpace:"pre-wrap" }}>{lead.email_reply_text || "No reply text recorded."}</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <a href={`mailto:${lead.email}`} style={{ flex:1, display:"block", textAlign:"center", background:"linear-gradient(135deg,#818cf8,#6366f1)", color:"#fff", fontWeight:700, fontSize:13, padding:"13px", borderRadius:10, textDecoration:"none" }}>Reply in Gmail →</a>
          <button onClick={onClose} style={{ flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", color:"rgba(255,255,255,0.5)", fontSize:13, padding:"13px", borderRadius:10, cursor:"pointer" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

const FILTER_TABS = [
  { key:"all",      label:"All Leads",     icon:"📋" },
  { key:"designed", label:"Site Designed", icon:"✦"  },
  { key:"approved", label:"Approved",      icon:"✅" },
  { key:"unsent",   label:"Ready to Send", icon:"📬" },
  { key:"emailed",  label:"Emailed",       icon:"✉️" },
  { key:"replied",  label:"Replied",       icon:"🔥" },
];

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [replyLead, setReplyLead] = useState(null);
  const [quoteIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${FUNCTIONS_URL}/getLeads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLeads(data.leads || []);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const active = leads.filter(l => l.status !== "skipped");
  const stats = {
    total:     active.length,
    designed:  active.filter(l => DESIGNED_SLUGS.has(l.demo_site_slug || "")).length,
    approved:  active.filter(l => l.approved).length,
    emailed:   active.filter(l => l.email_sent).length,
    replied:   active.filter(l => l.email_replied).length,
    converted: active.filter(l => l.status === "converted").length,
    pipeline:  active.filter(l => !l.email_sent).length,
  };

  const cats = [...new Set(active.map(l => l.category).filter(Boolean))].sort();

  const filtered = active.filter(l => {
    if (tab === "designed" && !DESIGNED_SLUGS.has(l.demo_site_slug || "")) return false;
    if (tab === "approved" && !l.approved) return false;
    if (tab === "unsent"   && !(l.approved && !l.email_sent)) return false;
    if (tab === "emailed"  && !l.email_sent) return false;
    if (tab === "replied"  && !l.email_replied) return false;
    if (catFilter !== "all" && l.category !== catFilter) return false;
    if (search && !l.business_name.toLowerCase().includes(search.toLowerCase()) && !(l.city||"").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const closedGoal = 5;
  const closedPct = Math.min(100, Math.round((stats.converted / closedGoal) * 100));

  return (
    <div style={{ background:"#080810", minHeight:"100vh", color:"#e2e8f0", fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
        input::placeholder{color:rgba(255,255,255,0.25)}
        select option{background:#1a1a2e}
        .tab-btn:hover{background:rgba(255,255,255,0.07)!important}
        .stat-card{transition:all 0.2s;cursor:default}
        .stat-card:hover{border-color:rgba(129,140,248,0.3)!important;transform:translateY(-2px)}
      `}</style>

      {/* NAV */}
      <nav style={{ background:"rgba(8,8,16,0.98)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"0 32px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#818cf8,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>⚡</div>
          <div>
            <span style={{ fontSize:15, fontWeight:800, letterSpacing:-0.5, color:"#fff" }}>Synthiq</span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.25)", letterSpacing:3, textTransform:"uppercase", marginLeft:10 }}>CRM</span>
          </div>
        </div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.2)", letterSpacing:2, textTransform:"uppercase" }}>Augusta · Evans · Martinez · Grovetown</div>
        <div style={{ display:"flex", gap:8 }}>
          <a href="https://mail.google.com/mail/u/0/#sent" target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:600, padding:"7px 14px", borderRadius:8, textDecoration:"none" }}>✉ Gmail Sent</a>
          <button onClick={load} style={{ background:"rgba(129,140,248,0.1)", border:"1px solid rgba(129,140,248,0.2)", color:"#818cf8", fontSize:12, fontWeight:600, padding:"7px 14px", borderRadius:8, cursor:"pointer" }}>↻ Refresh</button>
        </div>
      </nav>

      <div style={{ maxWidth:1180, margin:"0 auto", padding:"28px 24px" }}>

        {/* QUOTE */}
        <div style={{ background:"linear-gradient(135deg,rgba(99,102,241,0.08),rgba(129,140,248,0.04))", border:"1px solid rgba(129,140,248,0.12)", borderRadius:14, padding:"18px 28px", marginBottom:28, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,#6366f1,#818cf8,transparent)" }} />
          <div style={{ fontSize:10, color:"rgba(129,140,248,0.6)", letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>Daily Fuel</div>
          <div style={{ fontSize:15, color:"rgba(255,255,255,0.72)", fontStyle:"italic", lineHeight:1.6, fontWeight:300 }}>{QUOTES[quoteIdx]}</div>
        </div>

        {/* STATS */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:24 }}>
          {[
            { label:"Total Leads",    value:stats.total,     icon:"📋", color:"#94a3b8", sub:"in pipeline" },
            { label:"Sites Designed", value:stats.designed,  icon:"✦",  color:"#818cf8", sub:"fully built" },
            { label:"Approved",       value:stats.approved,  icon:"✅", color:"#34d399", sub:"ready to send" },
            { label:"Emailed",        value:stats.emailed,   icon:"✉️", color:"#fbbf24", sub:"pitch sent" },
            { label:"Replied",        value:stats.replied,   icon:"🔥", color:"#f87171", sub:"hot leads" },
            { label:"Converted",      value:stats.converted, icon:"💰", color:"#4ade80", sub:`of ${closedGoal} goal` },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"18px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <span style={{ fontSize:18 }}>{s.icon}</span>
                <span style={{ fontSize:9, color:"rgba(255,255,255,0.22)", letterSpacing:1 }}>{s.sub}</span>
              </div>
              <div style={{ fontSize:30, fontWeight:900, color:s.color, lineHeight:1, marginBottom:4 }}>{s.value}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", letterSpacing:1.5, textTransform:"uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* PROGRESS */}
        <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"16px 22px", marginBottom:24, display:"flex", alignItems:"center", gap:20 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.55)" }}>🏁 Conversion Goal — {stats.converted}/{closedGoal} Clients Closed</span>
              <span style={{ fontSize:12, fontWeight:800, color:"#4ade80" }}>{closedPct}%</span>
            </div>
            <div style={{ height:6, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${closedPct}%`, background:"linear-gradient(90deg,#6366f1,#34d399)", borderRadius:100, transition:"width 1s ease" }} />
            </div>
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <div style={{ fontSize:22, fontWeight:900, color:"#fbbf24" }}>{stats.pipeline}</div>
            <div style={{ fontSize:10, letterSpacing:1.5, textTransform:"uppercase", color:"rgba(255,255,255,0.25)" }}>Unsent</div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
          {FILTER_TABS.map(f => (
            <button key={f.key} className="tab-btn" onClick={()=>setTab(f.key)} style={{ background:tab===f.key?"linear-gradient(135deg,#6366f1,#818cf8)":"rgba(255,255,255,0.04)", border:tab===f.key?"none":"1px solid rgba(255,255,255,0.07)", color:tab===f.key?"#fff":"rgba(255,255,255,0.4)", fontSize:11, fontWeight:700, letterSpacing:0.8, padding:"7px 16px", borderRadius:100, cursor:"pointer", transition:"all 0.2s", textTransform:"uppercase", display:"flex", alignItems:"center", gap:5 }}>
              <span>{f.icon}</span> {f.label}
              {f.key==="replied"&&stats.replied>0&&<span style={{ background:"#f87171", color:"#fff", borderRadius:"50%", width:16, height:16, fontSize:9, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>{stats.replied}</span>}
            </button>
          ))}
          <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
            <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.5)", fontSize:11, padding:"7px 12px", borderRadius:8, outline:"none", cursor:"pointer" }}>
              <option value="all">All Categories</option>
              {cats.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#fff", fontSize:12, padding:"7px 14px", borderRadius:8, outline:"none", width:160 }} />
          </div>
        </div>

        {/* COUNT */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.22)", letterSpacing:1.2, textTransform:"uppercase" }}>
            {loading?"Loading...":error?"Error":(`${filtered.length} leads`)} · <span style={{ color:"#818cf8" }}>✦ = personally designed</span>
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.18)" }}>Approve → Send Email → Get Paid 💸</div>
        </div>

        {/* ERROR */}
        {error && (
          <div style={{ background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:10, padding:"14px 18px", marginBottom:16, fontSize:13, color:"#f87171" }}>
            ⚠️ {error} — <button onClick={load} style={{ background:"none", border:"none", color:"#818cf8", cursor:"pointer", textDecoration:"underline", fontSize:13 }}>Retry</button>
          </div>
        )}

        {/* LEADS LIST */}
        {loading ? (
          <div style={{ textAlign:"center", padding:"80px 0" }}>
            <div style={{ fontSize:28, marginBottom:16 }}>⚡</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.3)", letterSpacing:1 }}>Loading your pipeline...</div>
          </div>
        ) : !error && filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 0" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,0.3)" }}>No leads match this filter</div>
          </div>
        ) : (
          filtered.map(lead => (
            <LeadRow key={lead.id} lead={lead} onRefresh={load} onReply={setReplyLead} />
          ))
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ textAlign:"center", padding:"32px 0 12px", borderTop:"1px solid rgba(255,255,255,0.04)", marginTop:24 }}>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.18)", letterSpacing:2, textTransform:"uppercase" }}>
              Every email you send is a door you open. Keep going, Ly. 🔥
            </div>
          </div>
        )}
      </div>

      <ReplyModal lead={replyLead} onClose={()=>setReplyLead(null)} />
    </div>
  );
}
