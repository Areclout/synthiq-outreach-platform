'use client'
import { useState, useEffect, useCallback } from 'react'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON_KEY     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const STATUS_META = {
  found:      { label: 'Found',      bg: '#F1EFE8', color: '#5F5E5A' },
  site_built: { label: 'Site Built', bg: '#E6F1FB', color: '#185FA5' },
  approved:   { label: 'Approved',   bg: '#EAF3DE', color: '#3B6D11' },
  contacted:  { label: 'Contacted',  bg: '#FAEEDA', color: '#854F0B' },
  replied:    { label: 'Replied',    bg: '#FAC775', color: '#633806' },
  converted:  { label: 'Converted',  bg: '#E1F5EE', color: '#0F6E56' },
  skipped:    { label: 'Skipped',    bg: '#F1EFE8', color: '#888780' },
}

const TEMPLATES = [
  { id: 1, name: 'Standard Pitch',       desc: 'Default — works for all categories' },
  { id: 2, name: 'Follow-up',            desc: 'Day 5 — no reply yet' },
  { id: 3, name: 'Personal / Warm',      desc: 'Best for 4.8★+ leads' },
  { id: 4, name: 'Competitive Urgency',  desc: 'Second batch pressure' },
]

async function apiFetch(path, opts = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

function Badge({ status }) {
  const m = STATUS_META[status] || STATUS_META.found
  return (
    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4,
      background: m.bg, color: m.color, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
      {m.label}
    </span>
  )
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{ background: '#fff', border: '0.5px solid #EDEDE8', borderRadius: 10,
      padding: '12px 16px', flex: 1, minWidth: 100 }}>
      <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#bbb', letterSpacing: 1.5,
        textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: accent || '#111', lineHeight: 1 }}>{value ?? '—'}</div>
      {sub && <div style={{ fontSize: 11, color: '#aaa', marginTop: 4, fontFamily: 'monospace' }}>{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const [leads, setLeads]           = useState([])
  const [stats, setStats]           = useState(null)
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState({ status: '', category: '', city: '', search: '' })
  const [selected, setSelected]     = useState(null)
  const [sending, setSending]       = useState(null)
  const [templateId, setTemplateId] = useState(1)
  const [toast, setToast]           = useState(null)
  const [tab, setTab]               = useState('leads') // leads | pipeline | settings

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter.status)   params.set('status', filter.status)
      if (filter.category) params.set('category', filter.category)
      if (filter.city)     params.set('city', filter.city)
      const [leadsData, statsData] = await Promise.all([
        apiFetch(`/leads?${params}`),
        apiFetch('/stats').catch(() => null),
      ])
      setLeads(leadsData.leads || [])
      setStats(statsData?.stats || null)
    } catch (e) { showToast(e.message, 'error') }
    setLoading(false)
  }, [filter.status, filter.category, filter.city])

  useEffect(() => { loadData() }, [loadData])

  const filteredLeads = leads.filter(l => {
    if (!filter.search) return true
    const s = filter.search.toLowerCase()
    return l.business_name?.toLowerCase().includes(s) ||
           l.city?.toLowerCase().includes(s) ||
           l.category?.toLowerCase().includes(s)
  })

  async function sendEmail(lead) {
    if (!lead.email) return showToast('No email address on file for this lead', 'error')
    setSending(lead.id)
    try {
      await apiFetch('/send-email', {
        method: 'POST',
        body: JSON.stringify({
          leadId:      lead.id,
          to:          lead.email,
          businessName: lead.business_name,
          ownerName:   lead.owner_name,
          category:    lead.category,
          city:        lead.city,
          rating:      lead.google_rating,
          reviewCount: lead.review_count,
          demoUrl:     lead.demo_site_url,
          templateId,
          primaryColor: lead.primary_color,
        }),
      })
      showToast(`Pitch sent to ${lead.business_name}`)
      loadData()
    } catch (e) { showToast(e.message, 'error') }
    setSending(null)
  }

  async function updateStatus(lead, newStatus) {
    try {
      await apiFetch(`/leads/${lead.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      })
      showToast(`${lead.business_name} → ${newStatus}`)
      loadData()
    } catch (e) { showToast(e.message, 'error') }
  }

  async function approveLead(lead) {
    try {
      await apiFetch(`/leads/${lead.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action: 'approve' }),
      })
      showToast(`${lead.business_name} approved`)
      loadData()
    } catch (e) { showToast(e.message, 'error') }
  }

  async function autoApproveAll() {
    try {
      const r = await apiFetch('/leads', {
        method: 'POST',
        body: JSON.stringify({ action: 'auto_approve' }),
      })
      showToast(`Auto-approved ${r.count} leads (4.0★+, 10+ reviews)`)
      loadData()
    } catch (e) { showToast(e.message, 'error') }
  }

  const categories = [...new Set(leads.map(l => l.category).filter(Boolean))].sort()
  const cities     = [...new Set(leads.map(l => l.city).filter(Boolean))].sort()

  const inp = { fontSize: 12, padding: '6px 10px', borderRadius: 6, border: '0.5px solid #E0E0D8',
    background: '#fff', color: '#111', fontFamily: 'inherit', outline: 'none' }
  const btn = { fontSize: 11, padding: '6px 12px', borderRadius: 6, border: '0.5px solid #E0E0D8',
    background: '#fff', color: '#555', cursor: 'pointer', fontFamily: 'inherit' }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F7F4', fontFamily: 'system-ui, sans-serif' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999,
          background: toast.type === 'error' ? '#FCEBEB' : '#E1F5EE',
          color: toast.type === 'error' ? '#A32D2D' : '#0F6E56',
          border: `1px solid ${toast.type === 'error' ? '#F09595' : '#9FE1CB'}`,
          borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          {toast.msg}
        </div>
      )}

      {/* Nav */}
      <div style={{ background: '#fff', borderBottom: '0.5px solid #EDEDE8', padding: '0 24px',
        display: 'flex', alignItems: 'center', height: 54, gap: 20, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: -0.5, color: '#111' }}>
          synth<span style={{ color: '#1D9E75' }}>iq</span>
        </div>
        <div style={{ display: 'flex', gap: 2, marginLeft: 16 }}>
          {[['leads','Leads'],['pipeline','Pipeline'],['settings','Settings']].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{ ...btn, background: tab===k?'#F1EFE8':'transparent',
                color: tab===k?'#111':'#888', border: 'none', fontWeight: tab===k?600:400 }}>
              {l}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#aaa' }}>
            {filteredLeads.length} leads
          </span>
          <button onClick={autoApproveAll} style={{ ...btn, color: '#3B6D11', background: '#EAF3DE', border: '0.5px solid #97C459' }}>
            Auto-approve eligible
          </button>
          <button onClick={loadData} style={{ ...btn }}>Refresh</button>
        </div>
      </div>

      <div style={{ padding: '20px 24px' }}>

        {/* Stats row */}
        {stats && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <StatCard label="Total leads" value={leads.length} />
            <StatCard label="Emails sent" value={stats.emails_sent || 0} />
            <StatCard label="Replies" value={stats.replies || 0} sub={`${stats.emails_sent ? Math.round((stats.replies/stats.emails_sent)*100) : 0}% reply rate`} />
            <StatCard label="Converted" value={stats.converted || 0} accent="#1D9E75" />
            <StatCard label="MRR" value={`$${((stats.converted||0)*97).toLocaleString()}`} sub="@ $97/mo standard" accent="#1D9E75" />
          </div>
        )}

        {/* Pipeline bar */}
        <div style={{ display: 'flex', gap: 0, border: '0.5px solid #EDEDE8', borderRadius: 10,
          overflow: 'hidden', background: '#fff', marginBottom: 16 }}>
          {Object.entries(STATUS_META).filter(([k]) => k !== 'skipped').map(([status, meta], i, arr) => {
            const count = leads.filter(l => l.status === status).length
            return (
              <div key={status} onClick={() => setFilter(f => ({ ...f, status: f.status===status?'':status }))}
                style={{ flex: 1, padding: '10px 6px', textAlign: 'center', cursor: 'pointer',
                  background: filter.status===status ? meta.bg : 'transparent',
                  borderRight: i < arr.length-1 ? '0.5px solid #EDEDE8' : 'none' }}>
                <div style={{ fontSize: 8, fontFamily: 'monospace', color: '#bbb', letterSpacing: 1.5,
                  textTransform: 'uppercase', marginBottom: 4 }}>{status.replace('_',' ')}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: status==='converted'?'#1D9E75':'#111' }}>{count}</div>
                <div style={{ height: 3, borderRadius: 2, background: meta.bg === '#F1EFE8' ? '#D3D1C7' : meta.color,
                  marginTop: 7, opacity: 0.6 }} />
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <input placeholder="Search name, city, category..." value={filter.search}
            onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
            style={{ ...inp, flex: 1, minWidth: 200 }} />
          <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
            style={inp}>
            <option value="">All statuses</option>
            {Object.entries(STATUS_META).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={filter.category} onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}
            style={inp}>
            <option value="">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filter.city} onChange={e => setFilter(f => ({ ...f, city: e.target.value }))}
            style={inp}>
            <option value="">All cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={templateId} onChange={e => setTemplateId(Number(e.target.value))}
            style={{ ...inp, color: '#185FA5' }}>
            {TEMPLATES.map(t => <option key={t.id} value={t.id}>Template {t.id}: {t.name}</option>)}
          </select>
        </div>

        {/* Lead table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#aaa', fontSize: 13, fontFamily: 'monospace' }}>
            Loading leads from Supabase…
          </div>
        ) : filteredLeads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#aaa', fontSize: 13 }}>
            No leads match this filter.
          </div>
        ) : (
          <div style={{ background: '#fff', border: '0.5px solid #EDEDE8', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#FAFAF8' }}>
                  {['Business','Category','City','Rating','Status','Demo','Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 10,
                      fontFamily: 'monospace', color: '#aaa', letterSpacing: 1.5,
                      textTransform: 'uppercase', fontWeight: 500,
                      borderBottom: '0.5px solid #EDEDE8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, i) => (
                  <tr key={lead.id} onClick={() => setSelected(selected?.id===lead.id?null:lead)}
                    style={{ borderTop: i > 0 ? '0.5px solid #EDEDE8' : 'none',
                      cursor: 'pointer',
                      background: selected?.id===lead.id ? '#F7FBF9' : 'transparent' }}>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#111' }}>{lead.business_name}</div>
                      {lead.email && <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{lead.email}</div>}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#666' }}>{lead.category}</td>
                    <td style={{ padding: '10px 14px', color: '#666' }}>{lead.city}</td>
                    <td style={{ padding: '10px 14px' }}>
                      {lead.google_rating ? (
                        <span>
                          <span style={{ color: '#EF9F27' }}>{'★'.repeat(Math.floor(lead.google_rating))}</span>
                          <span style={{ fontSize: 11, color: '#aaa', marginLeft: 4 }}>{lead.google_rating} ({lead.review_count})</span>
                        </span>
                      ) : <span style={{ color: '#ccc' }}>—</span>}
                    </td>
                    <td style={{ padding: '10px 14px' }}><Badge status={lead.status} /></td>
                    <td style={{ padding: '10px 14px' }}>
                      {lead.demo_site_url ? (
                        <a href={lead.demo_site_url} target="_blank" rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ fontSize: 11, color: '#185FA5', textDecoration: 'none', fontFamily: 'monospace' }}>
                          View →
                        </a>
                      ) : <span style={{ color: '#ccc', fontSize: 11 }}>—</span>}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: 5 }} onClick={e => e.stopPropagation()}>
                        {!lead.approved && lead.status !== 'converted' && (
                          <button onClick={() => approveLead(lead)}
                            style={{ ...btn, fontSize: 10, padding: '4px 8px', color: '#3B6D11',
                              background: '#EAF3DE', border: '0.5px solid #97C459' }}>
                            Approve
                          </button>
                        )}
                        {lead.approved && lead.status !== 'contacted' && lead.status !== 'converted' && (
                          <button onClick={() => sendEmail(lead)} disabled={!!sending}
                            style={{ ...btn, fontSize: 10, padding: '4px 8px',
                              background: sending===lead.id ? '#E1F5EE' : '#111',
                              color: sending===lead.id ? '#0F6E56' : '#fff',
                              border: 'none', opacity: sending&&sending!==lead.id ? 0.4 : 1 }}>
                            {sending===lead.id ? 'Sending…' : 'Send pitch'}
                          </button>
                        )}
                        {lead.status === 'replied' && (
                          <button onClick={() => updateStatus(lead, 'converted')}
                            style={{ ...btn, fontSize: 10, padding: '4px 8px', color: '#0F6E56',
                              background: '#E1F5EE', border: '0.5px solid #5DCAA5' }}>
                            Mark converted
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Selected lead detail panel */}
        {selected && (
          <div style={{ marginTop: 12, background: '#fff', border: '0.5px solid #EDEDE8',
            borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#111', marginBottom: 4 }}>
                  {selected.business_name}
                </div>
                <div style={{ fontSize: 12, color: '#888' }}>{selected.category} · {selected.city}, GA · {selected.phone}</div>
              </div>
              <button onClick={() => setSelected(null)}
                style={{ ...btn, fontSize: 12, padding: '4px 10px' }}>✕ Close</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#aaa', letterSpacing: 1.5, marginBottom: 6 }}>GOOGLE DATA</div>
                <div style={{ fontSize: 13, color: '#444', lineHeight: 1.8 }}>
                  Rating: <strong>{selected.google_rating}★</strong><br/>
                  Reviews: <strong>{selected.review_count}</strong><br/>
                  Priority score: <strong>{Number(selected.priority_score || 0).toFixed(1)}</strong>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#aaa', letterSpacing: 1.5, marginBottom: 6 }}>PIPELINE</div>
                <div style={{ fontSize: 13, color: '#444', lineHeight: 1.8 }}>
                  Status: <Badge status={selected.status} /><br/>
                  Approved: <strong>{selected.approved ? 'Yes' : 'No'}</strong><br/>
                  Email sent: <strong>{selected.email_sent ? new Date(selected.email_sent_at).toLocaleDateString() : 'Not yet'}</strong><br/>
                  Template used: <strong>{selected.template_used ? `#${selected.template_used}` : '—'}</strong>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#aaa', letterSpacing: 1.5, marginBottom: 6 }}>DEMO SITE</div>
                <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#185FA5', wordBreak: 'break-all' }}>
                  {selected.demo_site_url || '—'}
                </div>
                {selected.demo_site_url && (
                  <a href={selected.demo_site_url} target="_blank" rel="noreferrer"
                    style={{ display: 'inline-block', marginTop: 8, fontSize: 11, padding: '5px 12px',
                      borderRadius: 6, background: '#111', color: '#fff', textDecoration: 'none' }}>
                    Open site →
                  </a>
                )}
              </div>
            </div>
            {selected.email_reply_text && (
              <div style={{ marginTop: 14, background: '#F7FBF9', border: '0.5px solid #9FE1CB',
                borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#0F6E56', letterSpacing: 1.5, marginBottom: 6 }}>THEIR REPLY</div>
                <div style={{ fontSize: 13, color: '#333', lineHeight: 1.6 }}>{selected.email_reply_text}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
