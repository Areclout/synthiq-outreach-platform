// app/api/send-email/route.js
import { sendPitchEmail } from '@/lib/email'
import { markEmailed, logEmailSend } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      leadId, to, businessName, ownerName,
      category, city, rating, reviewCount,
      demoUrl, templateId = 1, primaryColor,
    } = body

    if (!to || !businessName || !demoUrl) {
      return NextResponse.json({ error: 'to, businessName, and demoUrl are required' }, { status: 400 })
    }

    const { id: resendId, subject } = await sendPitchEmail({
      to, businessName, ownerName, category, city,
      rating, reviewCount, demoUrl, templateId, primaryColor,
    })

    if (leadId) {
      await Promise.all([
        markEmailed(leadId, templateId),
        logEmailSend({ leadId, toEmail: to, toName: businessName, subject, templateId, resendId }),
      ])
    }

    return NextResponse.json({ success: true, resendId, subject, templateId })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
