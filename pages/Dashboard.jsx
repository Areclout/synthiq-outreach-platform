import { useState, useEffect, useCallback } from "react";
import { BusinessLead } from "@/api/entities";

const FUNCTIONS_URL = "https://the-bank-76242c01.base44.app/functions";
const BASE_URL = "https://the-bank-app-53a5c1b7.base44.app";

// ─── EMAIL TEMPLATES ─────────────────────────────────────────────────────────
const EMAIL_TEMPLATES = {
  default: {
    label: "Standard Pitch",
    subject: (biz) => `I built a free website for ${biz} — take a look`,
    body: (biz, owner, url, cat) => {
      const greeting = owner ? `Hi ${owner.split(" ")[0]}` : "Hi there";
      const catLine = {
        "Nail Salon": "Nail salons with a strong online presence book 3× more appointments — and right now, customers searching for nail services in your area can't find you.",
        "Barbershop": "Barbershops with websites get booked out weeks in advance. Right now, someone in your area is Googling for a barber and not finding you.",
        "Restaurant": "Restaurants with websites get 70% more foot traffic from local searches. Right now, hungry people near you are searching and landing on your competitors.",
        "Pest Control": "When someone has a pest problem, the first company they find online gets the call — and right now, that's not you.",
        "Pressure Washing": "Homeowners search for pressure washing services every single day. Without a website, you're invisible to all of them.",
        "Hvac": "HVAC jobs average $300–$3,000 per ticket. Every week without a website is money going to whoever shows up in Google first.",
        "Auto Repair": "People Google mechanics before they drive anywhere. Without a website, you're losing jobs to shops half as good as yours.",
        "Contractor": "Contractors who show up online win bids before they ever make a call. A website is the first impression that gets you in the door.",
        "Landscaping": "Homeowners search for landscapers and hire the first ones they trust. A website with real photos of your work is how that trust starts.",
        "Cleaning Service": "Cleaning clients are loyal — but they have to find you first. A website turns a one-time search into a recurring customer.",
        "Plumber": "Plumbing emergencies happen at 11pm. The plumber with a website gets that call. The one without doesn't.",
        "Electrician": "Electrical jobs are high-ticket and urgent. Homeowners hire fast — and they hire whoever they find first online.",
        "Painter": "Before anyone hires a painter, they look at examples online. A website with your real work turns browsers into booked jobs.",
        "Roofer": "Roof jobs are some of the highest-value residential contracts out there. A website lets your work speak before you ever pick up the phone.",
      }[cat] || "Businesses with a professional website win more customers — and right now, yours isn't showing up when people search.";
      return `${greeting},

My name is Ly — I run a small web design company called Synthiq out of Augusta, Georgia. I work exclusively with local businesses in the CSRA, and I noticed ${biz} doesn't have a website yet.

So I built you one. Free. No strings.

${catLine}

I put real time into your demo — your actual photos, your Google reviews, your services, your vibe. It's not a template. It's built specifically for ${biz}.

👉 Your demo: ${url}

If you like it, I'd love to make it officially yours — custom domain, your branding fully dialed in, live within a week. Pricing is flexible and built around what makes sense for your business. We can start as low or as big as you want.

If it's not your thing, no hard feelings at all — but take 30 seconds to look. I think you'll be surprised.

Talk soon,
Ly
Synthiq Web Design — Augusta, GA
Synthiq101@gmail.com
(No pressure. Open to any conversation.)`;
    }
  },
  followup: {
    label: "Follow-Up (5 days)",
    subject: (biz) => `Re: your free website — just checking in`,
    body: (biz, owner, url, cat) => {
      const greeting = owner ? `Hey ${owner.split(" ")[0]}` : "Hey";
      return `${greeting},

Just wanted to bump this up in case my last message got buried. I built a free demo site for ${biz} a few days ago and wanted to make sure you got a chance to see it.

Your demo: ${url}

No pressure at all — just genuinely think it could help. If the timing isn't right or you have questions, I'm happy to chat whenever works for you.

Everything is negotiable. Budget, timeline, what's included — we figure it out together.

Ly
Synthiq Web Design
Synthiq101@gmail.com`;
    }
  },
  personal: {
    label: "Personal / Warm",
    subject: (biz) => `Quick question about ${biz}`,
    body: (biz, owner, url, cat) => {
      const greeting = owner ? `Hi ${owner.split(" ")[0]}` : "Hi";
      return `${greeting},

I was looking up local businesses in the Augusta area and came across ${biz} — honestly really impressed with your reviews.

I noticed you don't have a website yet, and I couldn't help myself — I went ahead and built you a demo. It's free, it's yours to keep, and it took me a few hours to put together because I wanted it to actually look like YOUR business.

Here it is: ${url}

If you want to make it live, I can do that for you — affordable, fast, and we'll tweak it until it's exactly right. Happy to negotiate on anything.

If not, I hope it at least puts a smile on your face. You've clearly built something people love.

Ly
Synthiq Web Design
Synthiq101@gmail.com`;
    }
  },
  urgency: {
    label: "Competitive Urgency",
    subject: (biz) => `Your competitor just got a new website — here's yours`,
    body: (biz, owner, url, cat) => {
      const greeting = owner ? `Hi ${owner.split(" ")[0]}` : "Hi";
      return `${greeting},

I'll keep it short — I build websites for local businesses in the Augusta area, and I noticed ${biz} doesn't have one yet while some of your competitors just got upgraded.

I built you a free demo so you could see what's possible before making any decision: ${url}

No commitment. No pressure. If you want it live, I'll make it happen fast and we'll work out pricing that makes sense for you. Everything is on the table — domain, hosting, design, all of it.

Reply whenever you're ready.

Ly — Synthiq Web Design
Synthiq101@gmail.com`;
    }
  }
};

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const STATUS_CFG = {
  found:      { label: "Found",        color: "#64748b", bg: "rgba(100,116,139,0.1)",  dot: "#64748b" },
  site_built: { label: "Site Built",   color: "#6366f1", bg: "rgba(99,102,241,0.1)",   dot: "#6366f1" },
  approved:   { label: "Approved",     color: "#10b981", bg: "rgba(16,185,129,0.1)",   dot: "#10b981" },
  contacted:  { label: "Pitched",      color: "#f59e0b", bg: "rgba(245,158,11,0.1)",   dot: "#f59e0b" },
  replied:    { label: "Replied 🔥",   color: "#ef4444", bg: "rgba(239,68,68,0.12)",   dot: "#ef4444" },
  converted:  { label: "Converted 💰", color: "#22c55e", bg: "rgba(34,197,94,0.1)",    dot: "#22c55e" },
  skipped:    { label: "Skipped",      color: "#374151", bg: "rgba(55,65,81,0.08)",    dot: "#374151" },
};

const CAT_EMOJI = {
  "Nail Salon":"💅","Barbershop":"✂️","Restaurant":"🍽️","Pest Control":"🛡️",
  "Pressure Washing":"💦","Auto Repair":"🔧","Painter":"🎨","Hvac":"❄️",
  "Landscaping":"🌿","Cleaning Service":"✨","Hair Salon":"💇","Contractor":"🏗️",
  "Plumber":"🔩","Electrician":"⚡","Roofer":"🏠",
};

const DESIGNED_SLUGS = new Set([
  "ElegantNailsAndSpa","NailDesign","BeautyExpoGrovetown","PoblanosMexicanBarGrill",
  "TheChaum","TaqueriaMiCasita","YummyPhoGrovetown","JanwichesGrill",
  "GoForthPestControl","LikeNewPressureWashing",
]);

// ─── HELPERS ────────────────────────────────────────────────────────────────
function Dot({ color }) {
  return <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block", marginRight: 6, flexShrink: 0 }} />;
}
function StatusPill({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.found;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: c.color, background: c.bg, borderRadius: 100, padding: "2px 9px", whiteSpace: "nowrap" }}>
      <Dot color={c.dot} />{c.label}
    </span>
  );
}
function Stars({ r = 0 }) {
  return <span style={{ color: "#f59e0b", fontSize: 11, letterSpacing: 1 }}>{"★".repeat(Math.floor(r))}{"☆".repeat(5 - Math.floor(r))}</span>;
}

// ─── EMAIL COMPOSER ──────────────────────────────────────────────────────────
function EmailComposer({ lead, onClose, onSent }) {
  const [template, setTemplate] = useState("default");
  const [to, setTo]     = useState(lead.email || "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const demoUrl = `${BASE_URL}/BusinessSite?slug=${lead.demo_site_slug}`;

  useEffect(() => {
    const t = EMAIL_TEMPLATES[template];
    setSubject(t.subject(lead.business_name));
    setBody(t.body(lead.business_name, lead.owner_name, demoUrl, lead.category));
  }, [template, lead]);

  const send = async () => {
    if (!to.trim()) { alert("Add an email address first"); return; }
    setSending(true);
    try {
      const r = await fetch(`${FUNCTIONS_URL}/sendPitchEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          to: to.trim(),
          businessName: lead.business_name,
          demoUrl,
          ownerName: lead.owner_name || "",
          customSubject: subject,
          customBody: body,
        }),
      });
      if (!r.ok) throw new Error(await r.text());
      await BusinessLead.update(lead.id, {
        email: to.trim(),
        email_sent: true,
        email_sent_date: new Date().toISOString(),
        status: "contacted",
      });
      onSent();
    } catch (e) { alert("Send failed: " + e.message); }
    setSending(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, width: "100%", maxWidth: 680, maxHeight: "90vh", overflow: "auto", padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>✉ Pitch Email — {lead.business_name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Demo: <a href={`${BASE_URL}/BusinessSite?slug=${lead.demo_site_slug}`} target="_blank" rel="noopener noreferrer" style={{ color: "#6366f1" }}>view site ↗</a></div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        {/* Template picker */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Template</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(EMAIL_TEMPLATES).map(([key, t]) => (
              <button key={key} onClick={() => setTemplate(key)}
                style={{ fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 8, cursor: "pointer", border: "1px solid",
                  background: template === key ? "#6366f1" : "transparent",
                  borderColor: template === key ? "#6366f1" : "rgba(255,255,255,0.15)",
                  color: template === key ? "#fff" : "rgba(255,255,255,0.5)",
                  transition: "all 0.15s" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* To */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>To</div>
          <input value={to} onChange={e => setTo(e.target.value)}
            placeholder="their@email.com"
            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 14px", color: "#fff", fontSize: 13, outline: "none" }} />
        </div>

        {/* Subject */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Subject</div>
          <input value={subject} onChange={e => setSubject(e.target.value)}
            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 14px", color: "#fff", fontSize: 13, outline: "none" }} />
        </div>

        {/* Body */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Body <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400, textTransform: "none" }}>— edit freely</span></div>
          <textarea value={body} onChange={e => setBody(e.target.value)}
            rows={14}
            style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 14px", color: "rgba(255,255,255,0.85)", fontSize: 13, outline: "none", resize: "vertical", lineHeight: 1.65, fontFamily: "inherit" }} />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={send} disabled={sending}
            style={{ flex: 1, background: "linear-gradient(135deg, #6366f1, #4f46e5)", border: "none", color: "#fff", fontWeight: 700, fontSize: 14, padding: "13px", borderRadius: 10, cursor: "pointer", opacity: sending ? 0.6 : 1 }}>
            {sending ? "Sending..." : "Send Pitch ✉"}
          </button>
          <button onClick={onClose}
            style={{ padding: "13px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", borderRadius: 10, cursor: "pointer", fontSize: 13 }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── REPLY MODAL ─────────────────────────────────────────────────────────────
function ReplyModal({ lead, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#0f0f1a", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, width: "100%", maxWidth: 560, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#f87171" }}>🔥 {lead.business_name} replied</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
          {lead.email_reply_date ? new Date(lead.email_reply_date).toLocaleString() : ""}
        </div>
        <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 10, padding: "16px 18px", fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
          {lead.email_reply_text || "Reply content not available."}
        </div>
        <div style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
          From: {lead.email} · Phone: {lead.phone}
        </div>
      </div>
    </div>
  );
}

// ─── LEAD ROW ────────────────────────────────────────────────────────────────
function LeadRow({ lead, onRefresh }) {
  const [composer, setComposer] = useState(false);
  const [replyModal, setReplyModal] = useState(false);
  const [editNote, setEditNote] = useState(false);
  const [note, setNote] = useState(lead.notes || "");

  const slug = lead.demo_site_slug || "";
  const isDesigned = DESIGNED_SLUGS.has(slug);
  const demoUrl = `${BASE_URL}/BusinessSite?slug=${slug}`;
  const emoji = CAT_EMOJI[lead.category] || "📍";

  const skip = async () => {
    await BusinessLead.update(lead.id, { status: "skipped" });
    onRefresh();
  };
  const saveNote = async () => {
    await BusinessLead.update(lead.id, { notes: note });
    setEditNote(false);
    onRefresh();
  };

  if (lead.status === "skipped") return null;

  return (
    <>
      {composer && <EmailComposer lead={lead} onClose={() => setComposer(false)} onSent={() => { setComposer(false); onRefresh(); }} />}
      {replyModal && <ReplyModal lead={lead} onClose={() => setReplyModal(false)} />}
      <div style={{
        background: lead.email_replied
          ? "linear-gradient(90deg,rgba(239,68,68,0.06),rgba(10,10,20,0.8))"
          : isDesigned
          ? "linear-gradient(90deg,rgba(99,102,241,0.05),rgba(10,10,20,0.8))"
          : "rgba(255,255,255,0.02)",
        border: lead.email_replied
          ? "1px solid rgba(239,68,68,0.25)"
          : isDesigned
          ? "1px solid rgba(99,102,241,0.18)"
          : "1px solid rgba(255,255,255,0.05)",
        borderRadius: 12, padding: "14px 18px", marginBottom: 6, transition: "all 0.2s",
      }}>
        {lead.email_replied && (
          <div onClick={() => setReplyModal(true)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: 7, padding: "7px 13px", marginBottom: 10, cursor: "pointer" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#f87171" }}>🔥 They replied — click to read</span>
            <span style={{ fontSize: 11, color: "rgba(239,68,68,0.5)" }}>{lead.email_reply_date ? new Date(lead.email_reply_date).toLocaleDateString() : ""}</span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ width: 40, height: 40, borderRadius: 9, background: isDesigned ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, border: isDesigned ? "1px solid rgba(99,102,241,0.2)" : "1px solid rgba(255,255,255,0.05)" }}>
            {emoji}
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{lead.business_name}</span>
              <StatusPill status={lead.status} />
              {isDesigned && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: "#6366f1", background: "rgba(99,102,241,0.1)", padding: "2px 7px", borderRadius: 100, textTransform: "uppercase", border: "1px solid rgba(99,102,241,0.18)" }}>✦ Custom</span>}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
              <span>📍 {lead.city}</span>
              <span>· {lead.category}</span>
              {lead.google_rating > 0 && <span>· <Stars r={lead.google_rating} /> {lead.google_rating} ({lead.review_count})</span>}
              {lead.phone && <span>· {lead.phone}</span>}
              {lead.email_sent && <span style={{ color: "#f59e0b" }}>· ✉ Sent {lead.email_sent_date ? new Date(lead.email_sent_date).toLocaleDateString() : ""}</span>}
            </div>
            {editNote ? (
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note..." autoFocus
                  style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "5px 11px", color: "#fff", fontSize: 12, outline: "none" }} />
                <button onClick={saveNote} style={{ background: "rgba(255,255,255,0.07)", border: "none", color: "#fff", fontSize: 11, padding: "5px 12px", borderRadius: 7, cursor: "pointer" }}>Save</button>
                <button onClick={() => setEditNote(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 11, cursor: "pointer" }}>Cancel</button>
              </div>
            ) : lead.notes ? (
              <div onClick={() => setEditNote(true)} style={{ marginTop: 5, fontSize: 11, color: "rgba(255,255,255,0.25)", cursor: "pointer", fontStyle: "italic" }}>📝 {lead.notes}</div>
            ) : null}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
            <a href={demoUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: "#6366f1", fontWeight: 600, padding: "6px 12px", borderRadius: 7, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)", textDecoration: "none", whiteSpace: "nowrap" }}>
              Demo →
            </a>
            <button onClick={() => setComposer(true)}
              style={{ fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 7, cursor: "pointer", background: lead.email_sent ? "rgba(245,158,11,0.08)" : "linear-gradient(135deg,#6366f1,#4f46e5)", border: lead.email_sent ? "1px solid rgba(245,158,11,0.2)" : "none", color: lead.email_sent ? "#f59e0b" : "#fff", whiteSpace: "nowrap" }}>
              {lead.email_sent ? "✉ Re-pitch" : "✉ Pitch"}
            </button>
            <button onClick={() => setEditNote(true)} title="Note"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)", fontSize: 11, padding: "6px 10px", borderRadius: 7, cursor: "pointer" }}>
              📝
            </button>
            <button onClick={skip} title="Skip"
              style={{ background: "none", border: "1px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.2)", fontSize: 11, padding: "6px 10px", borderRadius: 7, cursor: "pointer" }}>
              ✕
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [leads, setLeads]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [filter, setFilter]       = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch]       = useState("");
  const [quoteIdx]                = useState(() => Math.floor(Math.random() * 10));

  const QUOTES = [
    "Revenue doesn't come from ideas. It comes from execution.",
    "Every lead you ignore is money someone else is making.",
    "One more email. One more demo. One more yes.",
    "Do the work. Everyone wants to be successful, but nobody wants to do the work.",
    "The grind is the gift.",
    "You don't have to be great to start, but you have to start to be great.",
    "Your future clients are out there right now, waiting to be found.",
    "Discipline is the bridge between goals and accomplishment.",
    "The secret of getting ahead is getting started.",
    "Show up. Every day. That's the edge.",
  ];

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const r = await fetch(`${FUNCTIONS_URL}/getLeads`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      const d = await r.json();
      if (d.leads) setLeads(d.leads);
      else setError(d.error || "Load failed");
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Stats (real) ──
  const total       = leads.length;
  const sitesBuilt  = leads.filter(l => l.status !== "found").length;
  const emailed     = leads.filter(l => l.email_sent).length;
  const replied     = leads.filter(l => l.email_replied).length;
  const converted   = leads.filter(l => l.status === "converted").length;

  // ── Category breakdown ──
  const catCounts = leads.reduce((acc, l) => {
    acc[l.category] = (acc[l.category] || 0) + 1; return acc;
  }, {});
  const topCats = Object.entries(catCounts).sort((a,b) => b[1]-a[1]).slice(0, 6);

  // ── City breakdown ──
  const cityCounts = leads.reduce((acc, l) => {
    acc[l.city] = (acc[l.city] || 0) + 1; return acc;
  }, {});

  // ── Filtered leads ──
  const visible = leads.filter(l => {
    if (l.status === "skipped") return false;
    if (filter === "ready")     return !l.email_sent && l.status === "site_built";
    if (filter === "sent")      return l.email_sent;
    if (filter === "replied")   return l.email_replied;
    if (filter === "custom")    return DESIGNED_SLUGS.has(l.demo_site_slug || "");
    if (catFilter !== "all" && l.category !== catFilter) return false;
    if (search && !l.business_name.toLowerCase().includes(search.toLowerCase()) && !l.city.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const allCats = [...new Set(leads.map(l => l.category))].sort();

  // ── Pipeline bar widths ──
  const pipeMax = total || 1;

  const S = {
    page: { minHeight: "100vh", background: "#080810", color: "#e2e8f0", fontFamily: "'Inter', -apple-system, sans-serif", padding: "0 0 60px" },
    inner: { maxWidth: 1100, margin: "0 auto", padding: "0 20px" },
    header: { padding: "20px 0 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 },
    logo: { fontSize: 22, fontWeight: 900, letterSpacing: -0.5, color: "#fff" },
    statGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 10, marginBottom: 24 },
    statCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 18px" },
    sectionLabel: { fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 12 },
  };

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 2px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: rgba(255,255,255,0.2) !important; }
        textarea { font-family: inherit; }
      `}</style>

      <div style={S.inner}>
        {/* ── HEADER ── */}
        <div style={S.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={S.logo}>synth<span style={{ color: "#6366f1" }}>iq</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
              pipeline live · Augusta, GA
            </div>
          </div>
          <div style={{ fontSize: 12, fontStyle: "italic", color: "rgba(255,255,255,0.25)", maxWidth: 320, textAlign: "right" }}>
            "{QUOTES[quoteIdx]}"
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={S.statGrid}>
          {[
            { label: "Leads Found", val: total, sub: "14 categories · 4 cities", color: "#6366f1" },
            { label: "Sites Built", val: sitesBuilt, sub: `${total > 0 ? Math.round(sitesBuilt/total*100) : 0}% build rate`, color: "#8b5cf6" },
            { label: "Avg Rating", val: "4.7★", sub: `${leads.reduce((s,l)=>s+(l.review_count||0),0).toLocaleString()} total reviews`, color: "#f59e0b" },
            { label: "Pitched", val: emailed, sub: emailed === 0 ? "Ready to launch 🚀" : `${replied} replied back`, color: "#10b981" },
            { label: "Converted", val: converted, sub: converted === 0 ? "First close incoming" : `$${converted * 1200} est. revenue`, color: "#22c55e" },
          ].map(c => (
            <div key={c.label} style={S.statCard}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>{c.label}</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: c.color, lineHeight: 1, marginBottom: 4 }}>{c.val}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* ── PIPELINE FLOW ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={S.sectionLabel}>Pipeline Flow</div>
          <div style={{ display: "flex", gap: 0, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
            {[
              { label: "Found",   val: total,      color: "#6366f1" },
              { label: "Built",   val: sitesBuilt, color: "#8b5cf6" },
              { label: "Pitched", val: emailed,    color: "#f59e0b" },
              { label: "Replied", val: replied,    color: "#ef4444" },
              { label: "Closed",  val: converted,  color: "#22c55e" },
            ].map((s, i, arr) => (
              <div key={s.label} style={{ flex: 1, padding: "16px 12px", textAlign: "center", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ height: 3, borderRadius: 2, background: s.color, opacity: 0.4, marginTop: 10, width: `${Math.max(8, (s.val / pipeMax) * 100)}%`, margin: "10px auto 0" }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {/* ── BY CATEGORY ── */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={S.sectionLabel}>By Category</div>
            {topCats.map(([cat, count]) => (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, cursor: "pointer" }}
                onClick={() => setCatFilter(catFilter === cat ? "all" : cat)}>
                <span style={{ fontSize: 14 }}>{CAT_EMOJI[cat] || "📍"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: catFilter === cat ? "#fff" : "rgba(255,255,255,0.6)", fontWeight: catFilter === cat ? 700 : 400 }}>{cat}</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{count}</span>
                  </div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                    <div style={{ height: 3, background: "#6366f1", borderRadius: 2, width: `${(count / total) * 100}%`, opacity: catFilter === cat ? 1 : 0.5 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── BY CITY ── */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={S.sectionLabel}>By City</div>
            {Object.entries(cityCounts).sort((a,b)=>b[1]-a[1]).map(([city, count]) => (
              <div key={city} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", width: 80 }}>📍 {city}</span>
                <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3 }}>
                  <div style={{ height: 6, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: 3, width: `${(count/total)*100}%` }} />
                </div>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", width: 20, textAlign: "right" }}>{count}</span>
              </div>
            ))}

            {/* ── Email templates preview ── */}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>Email Templates</div>
              {Object.entries(EMAIL_TEMPLATES).map(([key, t]) => (
                <div key={key} style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", padding: "4px 0", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block", opacity: 0.6 }} />
                  {t.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FILTERS + SEARCH ── */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { id: "all",     label: `All (${leads.filter(l=>l.status!=="skipped").length})` },
              { id: "ready",   label: `Ready to Pitch (${leads.filter(l=>!l.email_sent && l.status==="site_built").length})` },
              { id: "sent",    label: `Pitched (${emailed})` },
              { id: "replied", label: `Replied (${replied})` },
              { id: "custom",  label: "Custom Sites" },
            ].map(f => (
              <button key={f.id} onClick={() => { setFilter(f.id); setCatFilter("all"); }}
                style={{ fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 8, cursor: "pointer", border: "1px solid", transition: "all 0.15s",
                  background: filter === f.id ? "#6366f1" : "transparent",
                  borderColor: filter === f.id ? "#6366f1" : "rgba(255,255,255,0.1)",
                  color: filter === f.id ? "#fff" : "rgba(255,255,255,0.4)" }}>
                {f.label}
              </button>
            ))}
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search business or city..."
            style={{ marginLeft: "auto", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 14px", color: "#fff", fontSize: 12, outline: "none", width: 220 }} />
        </div>

        {catFilter !== "all" && (
          <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Filtering: <strong style={{ color: "#fff" }}>{catFilter}</strong></span>
            <button onClick={() => setCatFilter("all")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", fontSize: 11, padding: "2px 8px", borderRadius: 6, cursor: "pointer" }}>✕ clear</button>
          </div>
        )}

        {/* ── LEAD LIST ── */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.3)" }}>Loading leads...</div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: 40, color: "#ef4444", fontSize: 13 }}>Error: {error}</div>
        ) : visible.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.3)" }}>No leads match this filter.</div>
        ) : (
          <div style={{ animation: "fadeUp 0.4s ease both" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginBottom: 10 }}>{visible.length} lead{visible.length !== 1 ? "s" : ""}</div>
            {visible.map(lead => (
              <LeadRow key={lead.id} lead={lead} onRefresh={load} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
