import { useState, useEffect } from "react";
import { BusinessLead } from "@/api/entities";

const STATUS_COLORS = {
  found: "bg-gray-700 text-gray-300",
  site_built: "bg-blue-900 text-blue-300",
  email_approved: "bg-yellow-900 text-yellow-300",
  email_sent: "bg-orange-900 text-orange-300",
  responded: "bg-green-900 text-green-300",
  closed: "bg-purple-900 text-purple-300",
  not_interested: "bg-red-900 text-red-300",
};

const APP_BASE_URL = "https://the-bank-app-53a5c1b7.base44.app";
const API_BASE = "https://the-bank-76242c01.base44.app/functions";

export default function Home() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCity, setFilterCity] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [confirmModal, setConfirmModal] = useState(null);
  const [search, setSearch] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/getLeads`);
      const json = await res.json();
      if (json.leads) {
        setLeads(json.leads);
      } else {
        setError("No leads returned.");
      }
    } catch (e) {
      setError("Failed to load leads: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const cities = ["All", ...Array.from(new Set(leads.map(l => l.city).filter(Boolean))).sort()];
  const categories = ["All", ...Array.from(new Set(leads.map(l => l.category).filter(Boolean))).sort()];
  const statuses = ["All", "site_built", "email_sent", "responded", "not_interested"];

  const filtered = leads.filter(l => {
    const matchCity = filterCity === "All" || l.city === filterCity;
    const matchCat = filterCategory === "All" || l.category === filterCategory;
    const matchStatus = filterStatus === "All" || l.status === filterStatus;
    const matchSearch = !search || l.business_name?.toLowerCase().includes(search.toLowerCase());
    return matchCity && matchCat && matchStatus && matchSearch;
  });

  const stats = {
    total: leads.length,
    pending: leads.filter(l => l.status === "site_built" && !l.email_sent).length,
    sent: leads.filter(l => l.email_sent).length,
    responded: leads.filter(l => l.status === "responded" || l.status === "closed").length,
  };

  const handleApprove = (lead) => setConfirmModal(lead);

  const confirmApprove = async () => {
    await BusinessLead.update(confirmModal.id, { status: "email_approved" });
    setConfirmModal(null);
    fetchLeads();
  };

  const handleSkip = async (lead) => {
    await BusinessLead.update(lead.id, { status: "not_interested" });
    fetchLeads();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg">S</div>
          <div>
            <div className="text-lg font-bold">Synthiq</div>
            <div className="text-gray-500 text-xs">Lead Dashboard — Augusta, GA Area</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">{leads.length} total leads</span>
          <button
            onClick={fetchLeads}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-300 transition"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-6 py-5 grid grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: stats.total, color: "border-gray-700" },
          { label: "Awaiting Approval", value: stats.pending, color: "border-indigo-600", highlight: true },
          { label: "Emails Sent", value: stats.sent, color: "border-orange-600" },
          { label: "Responded", value: stats.responded, color: "border-green-600" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-5 bg-gray-900 border ${s.color}`}>
            <div className={`text-3xl font-bold ${s.highlight ? "text-indigo-400" : "text-white"}`}>{s.value}</div>
            <div className="text-gray-400 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="px-6 pb-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search businesses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 w-56"
        />
        <select
          value={filterCity}
          onChange={e => setFilterCity(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
        >
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
        >
          {statuses.map(s => (
            <option key={s} value={s}>{s === "All" ? "All Statuses" : s.replace(/_/g, " ")}</option>
          ))}
        </select>
        <span className="text-gray-500 text-sm">{filtered.length} showing</span>
      </div>

      {/* Leads List */}
      <div className="px-6 pb-10">
        {loading ? (
          <div className="text-center text-gray-500 py-24 text-lg animate-pulse">Loading leads...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-24 bg-gray-900 rounded-xl border border-gray-800">
            ⚠️ {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-24 bg-gray-900 rounded-xl border border-gray-800">
            No leads match your filters.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(lead => (
              <div key={lead.id} className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl px-6 py-5 flex items-center gap-5 transition">
                {/* Emoji */}
                <div className="text-3xl w-10 text-center shrink-0">{lead.theme_emoji || "🏢"}</div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-white font-semibold text-base">{lead.business_name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status] || "bg-gray-700 text-gray-300"}`}>
                      {lead.status?.replace(/_/g, " ") || "unknown"}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm flex flex-wrap gap-x-4 gap-y-1">
                    <span>📍 {lead.city}</span>
                    <span>🏷️ {lead.category}</span>
                    {lead.google_rating > 0 && <span>⭐ {lead.google_rating} ({lead.review_count} reviews)</span>}
                    {lead.phone && <span>📞 {lead.phone}</span>}
                  </div>
                </div>

                {/* Demo Link */}
                <div className="shrink-0">
                  {lead.demo_site_slug && (
                    <a
                      href={`${APP_BASE_URL}/BusinessSite?slug=${lead.demo_site_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 text-sm underline underline-offset-2 whitespace-nowrap"
                    >
                      View Demo →
                    </a>
                  )}
                </div>

                {/* Actions */}
                {lead.status === "site_built" && !lead.email_sent && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleSkip(lead)}
                      className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white text-xs transition"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => handleApprove(lead)}
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition"
                    >
                      ✅ Approve Email
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-white font-bold text-xl mb-2">Send pitch email?</h3>
            <p className="text-gray-400 mb-5">
              This will send a cold pitch to <strong className="text-white">{confirmModal.business_name}</strong>
              {confirmModal.email ? ` at ${confirmModal.email}` : " — note: no email on file yet"}.
            </p>
            <div className="bg-gray-800 rounded-xl p-4 mb-6 text-sm">
              <div className="text-gray-400 text-xs mb-1">SUBJECT</div>
              <div className="text-white">I built a free website for {confirmModal.business_name}</div>
              <div className="text-gray-400 text-xs mt-3 mb-1">DEMO LINK</div>
              <div className="text-indigo-400 text-xs break-all">{APP_BASE_URL}/BusinessSite?slug={confirmModal.demo_site_slug}</div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmApprove}
                className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
              >
                ✅ Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
