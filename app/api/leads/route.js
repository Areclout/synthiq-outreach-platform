// app/api/leads/route.js
import { getAllLeads, createLead, autoApproveBatch } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const leads = await getAllLeads({
      status:   searchParams.get('status')   || undefined,
      city:     searchParams.get('city')     || undefined,
      category: searchParams.get('category') || undefined,
      limit:    parseInt(searchParams.get('limit') || '200'),
    })
    return NextResponse.json({ leads, count: leads.length })
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function POST(request) {
  try {
    const body = await request.json()
    if (body.action === 'auto_approve') {
      const approved = await autoApproveBatch()
      return NextResponse.json({ approved, count: approved.length })
    }
    const lead = await createLead(body)
    return NextResponse.json({ lead }, { status: 201 })
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
