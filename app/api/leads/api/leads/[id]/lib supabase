import { createClient } from '@supabase/supabase-js'

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SVC  = process.env.SUPABASE_SERVICE_ROLE_KEY

// Public client — for frontend reads
export const supabase = createClient(URL, ANON)

// Service client — for server-side writes (API routes only)
export const supabaseAdmin = createClient(URL, SVC, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// ── LEADS ────────────────────────────────────────────────────────────────────

export async function getAllLeads({ status, city, category, orderBy = 'priority_score', limit = 100 } = {}) {
  let q = supabaseAdmin
    .from('business_leads')
    .select('*')
    .order(orderBy, { ascending: false })
    .limit(limit)

  if (status)   q = q.eq('status', status)
  if (city)     q = q.ilike('city', `%${city}%`)
  if (category) q = q.ilike('category', `%${category}%`)

  const { data, error } = await q
  if (error) throw error
  return data
}

export async function getLeadBySlug(slug) {
  const { data, error } = await supabaseAdmin
    .from('business_leads')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

export async function getLeadById(id) {
  const { data, error } = await supabaseAdmin
    .from('business_leads')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createLead(lead) {
  const { data, error } = await supabaseAdmin
    .from('business_leads')
    .insert(lead)
    .select()
    .single()
  if (error) throw error
  await logEvent(data.id, 'lead_created', null, lead.status || 'found')
  return data
}

export async function updateLead(id, patch) {
  const existing = await getLeadById(id)
  const { data, error } = await supabaseAdmin
    .from('business_leads')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error

  if (patch.status && patch.status !== existing.status) {
    await logEvent(id, 'status_change', existing.status, patch.status)
  }
  return data
}

export async function deleteLead(id) {
  const { error } = await supabaseAdmin
    .from('business_leads')
    .delete()
    .eq('id', id)
  if (error) throw error
  return { deleted: id }
}

// ── PIPELINE ACTIONS ─────────────────────────────────────────────────────────

export async function approveLead(id) {
  return updateLead(id, { approved: true, approved_at: new Date().toISOString(), status: 'approved' })
}

export async function markEmailed(id, templateId) {
  return updateLead(id, {
    email_sent: true,
    email_sent_at: new Date().toISOString(),
    template_used: templateId,
    status: 'contacted',
  })
}

export async function markReplied(id, replyText) {
  return updateLead(id, {
    email_replied: true,
    email_reply_text: replyText,
    email_replied_at: new Date().toISOString(),
    status: 'replied',
  })
}

export async function markConverted(id, { dealValue, planTier, stripeCustomerId } = {}) {
  return updateLead(id, {
    converted: true,
    converted_at: new Date().toISOString(),
    deal_value: dealValue || 97,
    plan_tier: planTier || 'standard',
    stripe_customer_id: stripeCustomerId,
    status: 'converted',
  })
}

export async function autoApproveBatch() {
  const { data, error } = await supabaseAdmin
    .from('business_leads')
    .update({ approved: true, approved_at: new Date().toISOString(), status: 'approved' })
    .eq('status', 'site_built')
    .eq('approved', false)
    .gte('google_rating', 4.0)
    .gte('review_count', 10)
    .select()
  if (error) throw error
  return data
}

// ── STATS ────────────────────────────────────────────────────────────────────

export async function getPipelineStats() {
  const { data, error } = await supabaseAdmin
    .from('pipeline_stats')
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function getLeadsToPitch() {
  const { data, error } = await supabaseAdmin
    .from('leads_to_pitch')
    .select('*')
  if (error) throw error
  return data
}

export async function getLeadsAwaitingFollowup() {
  const { data, error } = await supabaseAdmin
    .from('leads_awaiting_reply')
    .select('*')
  if (error) throw error
  return data
}

// ── EMAIL LOG ─────────────────────────────────────────────────────────────────

export async function logEmailSend({ leadId, toEmail, toName, subject, templateId, resendId }) {
  const { error } = await supabaseAdmin
    .from('email_sends')
    .insert({ lead_id: leadId, to_email: toEmail, to_name: toName, subject, template_id: templateId, resend_id: resendId })
  if (error) console.error('Email log error:', error)
}

// ── PIPELINE EVENTS ───────────────────────────────────────────────────────────

export async function logEvent(leadId, eventType, fromStatus, toStatus, note) {
  await supabaseAdmin
    .from('pipeline_events')
    .insert({ lead_id: leadId, event_type: eventType, from_status: fromStatus, to_status: toStatus, note })
}
