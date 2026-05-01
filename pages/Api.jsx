import { useState, useEffect } from "react";

const API_BASE = "https://the-bank-76242c01.base44.app/functions/synthiqApi";

const ENDPOINTS = [
  { id: "all",      label: "All Leads",        url: API_BASE,                        desc: "All 40 leads — name, category, city, status, rating, demo URL" },
  { id: "stats",    label: "Pipeline Stats",   url: `${API_BASE}?stats=true`,        desc: "Conversion rates, pipeline counts, avg rating, category & city breakdown" },
  { id: "full",     label: "Full Data",        url: `${API_BASE}?full=true`,         desc: "All fields including photos, reviews, email history, notes" },
  { id: "ready",    label: "Ready to Pitch",   url: `${API_BASE}?status=site_built`, desc: "All leads with a demo site built but not yet emailed" },
  { id: "nail",     label: "Nail Salons",      url: `${API_BASE}?category=Nail`,     desc: "Nail salon leads only" },
  { id: "barber",   label: "Barbershops",      url: `${API_BASE}?category=Barbershop`, desc: "Barbershop leads only" },
  { id: "evans",    label: "Evans, GA",        url: `${API_BASE}?city=Evans`,        desc: "All leads in Evans" },
  { id: "augusta",  label: "Augusta, GA",      url: `${API_BASE}?city=Augusta`,      desc: "All leads in Augusta" },
  { id: "elegant",  label: "Elegant Nails",    url: `${API_BASE}?slug=ElegantNailsAndSpa`, desc: "Single lead — full record for Elegant Nails & Spa" },
];

const STATUS_COLORS = {
  site_built: "#6366f1", found: "#64748b", contacted: "#f59e0b",
  replied: "#ef4444", converted: "#22c55e", approved: "#10b981",
};

function JsonView({ data, depth = 0 }) {
  const [collapsed, setCollapsed] = useState(depth > 1);
  if (data === null) return <span style={{ color: "#e06c75" }}>null</span>;
  if (typeof data === "boolean") return <span style={{ color: "#e5c07b" }}>{String(data)}</span>;
  if (typeof data === "number") return <span style={{ color: "#d19a66" }}>{data}</span>;
  if (typeof data === "string") return <span style={{ color: "#98c379" }}>"{data}"</span>;
  if (Array.isArray(data)) {
    if (data.length === 0) return <span style={{ color: "#abb2bf" }}>[]</span>;
    return (
      <span>
        <span onClick={() => setCollapsed(c => !c)} style={{ cursor: "pointer", color: "#61afef", userSelect: "none" }}>
          {collapsed ? `▶ [ ${data.length} items ]` : "▼ ["}
        </span>
        {!collapsed && (
          <>
            {data.map((item, i) => (
              <div key={i} style={{ marginLeft: 18 }}>
                <JsonView data={item} depth={depth + 1} />
                {i < data.length - 1 && <span style={{ color: "#abb2bf" }}>,</span>}
              </div>
            ))}
            <span style={{ color: "#61afef" }}>]</span>
          </>
        )}
      </span>
    );
  }
  if (typeof data === "object") {
    const keys = Object.keys(data);
    if (keys.length === 0) return <span style={{ color: "#abb2bf" }}>{"{}"}</span>;
    return (
      <span>
        <span onClick={() => setCollapsed(c => !c)} style={{ cursor: "pointer", color: "#61afef", userSelect: "none" }}>
          {collapsed ? `▶ { ${keys.length} keys }` : "▼ {"}
        </span>
        {!collapsed && (
          <>
            {keys.map((k, i) => (
              <div key={k} style={{ marginLeft: 18 }}>
                <span style={{ color: "#e06c75" }}>"{k}"</span>
                <span style={{ color: "#abb2bf" }}>: </span>
                <JsonView data={data[k]} depth={depth + 1} />
                {i < keys.length - 1 && <span style={{ color: "#abb2bf" }}>,</span>}
              </div>
            ))}
            <span style={{ color: "#61afef" }}>{"}"}</span>
          </>
        )}
      </span>
    );
  }
  return <span style={{ color: "#abb2bf" }}>{String(data)}</span>;
}

export default function Api() {
  const [active, setActive]   = useState("stats");
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [copied, setCopied]   = useState(false);
  const [customUrl, setCustomUrl] = useState("");

  const ep = ENDPOINTS.find(e => e.id === active);

  const fetchData = async (url) => {
    setLoading(true); setError(null); setData(null);
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      setData(d);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  useEffect(() => { if (ep) fetchData(ep.url); }, [active]);

  const copy = (text) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); };

  // Compute stats for the summary bar
  const stats = data?.pipeline || null;
  const leads = data?.leads || [];

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#c9d1d9", fontFamily: "'DM Mono', 'Fira Code', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 2px; }
        input::placeholder { color: #484f58 !important; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: "#161b22", borderBottom: "1px solid #30363d", padding: "0 28px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#fff" }}>
            synth<span style={{ color: "#1D9E75" }}>iq</span>
            <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#484f58", marginLeft: 10, fontWeight: 400 }}>/ api explorer</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#484f58" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75", display: "inline-block", animation: "pulse 2s infinite" }} />
            live · CORS open · no auth required
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="/Dashboard" style={{ fontSize: 11, padding: "5px 13px", borderRadius: 6, background: "#21262d", color: "#8b949e", border: "1px solid #30363d", textDecoration: "none" }}>
            ← Dashboard
          </a>
          <a href="https://github.com/Areclout/synthiq-outreach-platform" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 11, padding: "5px 13px", borderRadius: 6, background: "#21262d", color: "#8b949e", border: "1px solid #30363d", textDecoration: "none" }}>
            GitHub ↗
          </a>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "calc(100vh - 56px)" }}>

        {/* ── SIDEBAR ── */}
        <div style={{ background: "#161b22", borderRight: "1px solid #30363d", padding: "18px 12px" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: "#484f58", marginBottom: 12, paddingLeft: 8 }}>ENDPOINTS</div>

          {ENDPOINTS.map(ep => (
            <button key={ep.id} onClick={() => setActive(ep.id)}
              style={{ width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 3, transition: "all 0.12s",
                background: active === ep.id ? "rgba(29,158,117,0.1)" : "transparent",
                borderLeft: active === ep.id ? "2px solid #1D9E75" : "2px solid transparent" }}>
              <div style={{ fontSize: 12, fontWeight: active === ep.id ? 700 : 400, color: active === ep.id ? "#fff" : "#8b949e" }}>{ep.label}</div>
              <div style={{ fontSize: 10, color: "#484f58", marginTop: 2, lineHeight: 1.4 }}>{ep.desc.slice(0, 48)}{ep.desc.length > 48 ? "…" : ""}</div>
            </button>
          ))}

          {/* Custom URL */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #30363d" }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#484f58", marginBottom: 8, paddingLeft: 4 }}>CUSTOM QUERY</div>
            <input
              value={customUrl}
              onChange={e => setCustomUrl(e.target.value)}
              placeholder="?category=Plumber"
              style={{ width: "100%", background: "#0d1117", border: "1px solid #30363d", borderRadius: 6, padding: "7px 10px", color: "#c9d1d9", fontSize: 11, outline: "none" }}
            />
            <button onClick={() => { if (customUrl.trim()) fetchData(API_BASE + customUrl.trim()); }}
              style={{ width: "100%", marginTop: 6, padding: "7px", borderRadius: 6, border: "none", background: "#1D9E75", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              Fetch →
            </button>
          </div>

          {/* Share info */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #30363d" }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#484f58", marginBottom: 8, paddingLeft: 4 }}>SHARE WITH AI TOOLS</div>
            <div style={{ fontSize: 10, color: "#8b949e", lineHeight: 1.6, paddingLeft: 4 }}>
              Give Claude or any AI this URL and it can read your full lead database in real time:
            </div>
            <div style={{ marginTop: 8, background: "#0d1117", border: "1px solid #30363d", borderRadius: 6, padding: "7px 10px", fontSize: 10, color: "#1D9E75", wordBreak: "break-all", lineHeight: 1.5 }}>
              {API_BASE}
            </div>
          </div>
        </div>

        {/* ── MAIN PANEL ── */}
        <div style={{ padding: "20px 24px", overflowY: "auto" }}>

          {/* URL bar */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
            <div style={{ background: "#1D9E75", color: "#fff", fontSize: 10, fontWeight: 800, padding: "5px 10px", borderRadius: 6, letterSpacing: 1 }}>GET</div>
            <div style={{ flex: 1, background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: "8px 14px", fontSize: 12, color: "#58a6ff", wordBreak: "break-all" }}>
              {ep?.url || API_BASE}
            </div>
            <button onClick={() => copy(ep?.url || API_BASE)}
              style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #30363d", background: "#21262d", color: copied ? "#1D9E75" : "#8b949e", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'DM Mono', monospace" }}>
              {copied ? "✓ Copied" : "Copy URL"}
            </button>
            <button onClick={() => fetchData(ep?.url || API_BASE)}
              style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#1D9E75,#0f6e56)", color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}>
              {loading ? "⟳ Fetching…" : "Run ↗"}
            </button>
          </div>

          {ep && <div style={{ fontSize: 12, color: "#484f58", marginBottom: 16 }}>{ep.desc}</div>}

          {/* Stats cards if stats endpoint */}
          {active === "stats" && stats && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Total Leads",  val: stats.total,      color: "#6366f1" },
                { label: "Sites Built",  val: stats.sites_built, color: "#8b5cf6" },
                { label: "Pitched",      val: stats.pitched,    color: "#f59e0b" },
                { label: "Replied",      val: stats.replied,    color: "#ef4444" },
                { label: "Converted",    val: stats.converted,  color: "#22c55e" },
              ].map(s => (
                <div key={s.label} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: "#484f58", marginBottom: 5 }}>{s.label.toUpperCase()}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: s.color, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{s.val}</div>
                </div>
              ))}
            </div>
          )}

          {/* Lead cards if leads returned */}
          {leads.length > 0 && active !== "stats" && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#484f58", marginBottom: 10 }}>PREVIEW — {leads.length} LEADS</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 8, marginBottom: 16 }}>
                {leads.slice(0, 6).map(lead => (
                  <div key={lead.id} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "12px 14px", animation: "fadeUp 0.3s ease" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#e6edf3", fontFamily: "'Syne', sans-serif", lineHeight: 1.3 }}>{lead.business_name}</div>
                      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, color: STATUS_COLORS[lead.status] || "#8b949e", background: `${STATUS_COLORS[lead.status]}18`, padding: "2px 7px", borderRadius: 100, whiteSpace: "nowrap", marginLeft: 8 }}>
                        {lead.status?.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: "#8b949e", marginBottom: 4 }}>
                      {lead.category} · {lead.city}, GA
                    </div>
                    <div style={{ fontSize: 10, color: "#f59e0b", marginBottom: 8 }}>
                      {"★".repeat(Math.floor(lead.google_rating || 0))} {lead.google_rating} ({lead.review_count} reviews)
                    </div>
                    {lead.demo_site_url && (
                      <a href={lead.demo_site_url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 10, color: "#58a6ff", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        ↗ {lead.demo_site_url.replace("https://", "")}
                      </a>
                    )}
                  </div>
                ))}
              </div>
              {leads.length > 6 && (
                <div style={{ fontSize: 11, color: "#484f58", textAlign: "center", padding: "8px 0" }}>
                  … and {leads.length - 6} more — see full JSON below
                </div>
              )}
            </div>
          )}

          {/* Raw JSON */}
          <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid #30363d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, letterSpacing: 2, color: "#484f58" }}>RAW JSON RESPONSE</span>
              <button onClick={() => data && copy(JSON.stringify(data, null, 2))}
                style={{ fontSize: 10, padding: "3px 10px", borderRadius: 5, border: "1px solid #30363d", background: "transparent", color: "#8b949e", cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>
                Copy JSON
              </button>
            </div>
            <div style={{ padding: "16px", maxHeight: 480, overflowY: "auto", fontSize: 12, lineHeight: 1.65 }}>
              {loading && <div style={{ color: "#484f58", animation: "pulse 1s infinite" }}>Fetching from API…</div>}
              {error && <div style={{ color: "#f85149" }}>Error: {error}</div>}
              {data && <JsonView data={data} depth={0} />}
            </div>
          </div>

          {/* Usage guide for Claude / AI tools */}
          <div style={{ marginTop: 16, background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "16px 20px" }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#484f58", marginBottom: 12 }}>HOW TO USE WITH CLAUDE OR ANY AI</div>
            {[
              { title: "Get all stats", prompt: `Fetch this URL and give me a full breakdown: ${API_BASE}?stats=true` },
              { title: "Find best leads to pitch", prompt: `Fetch ${API_BASE}?status=site_built and tell me which 5 leads I should pitch first based on their ratings and review count.` },
              { title: "Get full data for one business", prompt: `Fetch ${API_BASE}?slug=ElegantNailsAndSpa and summarize everything about this business.` },
              { title: "Write a pitch for a specific category", prompt: `Fetch ${API_BASE}?category=Barbershop and write personalized cold email pitches for each one.` },
            ].map(item => (
              <div key={item.title} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 5 }}>{item.title}</div>
                <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 6, padding: "8px 12px", fontSize: 11, color: "#c9d1d9", lineHeight: 1.6, cursor: "pointer", display: "flex", justifyContent: "space-between", gap: 10 }}
                  onClick={() => copy(item.prompt)}>
                  <span>"{item.prompt}"</span>
                  <span style={{ color: "#484f58", flexShrink: 0, fontSize: 10 }}>click to copy</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
