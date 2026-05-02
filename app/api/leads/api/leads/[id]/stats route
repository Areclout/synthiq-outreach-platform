// app/api/stats/route.js
import { getPipelineStats, getLeadsToPitch, getLeadsAwaitingFollowup } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [stats, toPitch, awaitingFollowup] = await Promise.all([
      getPipelineStats(),
      getLeadsToPitch(),
      getLeadsAwaitingFollowup(),
    ])
    return NextResponse.json({
      stats,
      toPitch,
      awaitingFollowup,
      generated: new Date().toISOString(),
    })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
