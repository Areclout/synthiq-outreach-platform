// ─── app/api/leads/[id]/route.js ─────────────────────────────────────────────
// Save as: app/api/leads/[id]/route.js

import { getLeadById, updateLead, deleteLead, markEmailed, markReplied, markConverted, approveLead } from '../../../../lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(_, { params }) {
  try {
    const lead = await getLeadById(params.id)
    return NextResponse.json({ lead })
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 404 }) }
}

export async function PATCH(request, { params }) {
  try {
    const body = await request.json()

    // Named actions
    if (body.action === 'approve')   return NextResponse.json(await approveLead(params.id))
    if (body.action === 'replied')   return NextResponse.json(await markReplied(params.id, body.replyText))
    if (body.action === 'converted') return NextResponse.json(await markConverted(params.id, body))

    const lead = await updateLead(params.id, body)
    return NextResponse.json({ lead })
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function DELETE(_, { params }) {
  try {
    await deleteLead(params.id)
    return NextResponse.json({ deleted: params.id })
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}


// ─── app/api/stats/route.js ───────────────────────────────────────────────────
// Save as: app/api/stats/route.js

// import { getPipelineStats, getLeadsToPitch, getLeadsAwaitingFollowup } from '../../../../lib/supabase'
// import { NextResponse } from 'next/server'
//
// export async function GET() {
//   try {
//     const [stats, toPitch, toFollowup] = await Promise.all([
//       getPipelineStats(), getLeadsToPitch(), getLeadsAwaitingFollowup()
//     ])
//     return NextResponse.json({ stats, toPitch, toFollowup, generated: new Date().toISOString() })
//   } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }) }
// }


// ─── app/api/send-email/route.js ─────────────────────────────────────────────
// Save as: app/api/send-email/route.js

// import { sendPitchEmail } from '../../../../lib/email'
// import { markEmailed, logEmailSend } from '../../../../lib/supabase'
// import { NextResponse } from 'next/server'
//
// export async function POST(request) {
//   try {
//     const body = await request.json()
//     const { leadId, to, businessName, ownerName, category, city, rating, reviewCount,
//             demoUrl, templateId = 1, primaryColor } = body
//
//     if (!to || !businessName || !demoUrl)
//       return NextResponse.json({ error: 'to, businessName, demoUrl required' }, { status: 400 })
//
//     const { id: resendId, subject } = await sendPitchEmail({
//       to, businessName, ownerName, category, city, rating, reviewCount, demoUrl, templateId, primaryColor
//     })
//
//     if (leadId) {
//       await Promise.all([
//         markEmailed(leadId, templateId),
//         logEmailSend({ leadId, toEmail: to, toName: businessName, subject, templateId, resendId })
//       ])
//     }
//
//     return NextResponse.json({ success: true, resendId, subject, templateId })
//   } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }) }
// }
