// scripts/seed.js
// Run: node scripts/seed.js
// Imports all 40 Synthiq leads into your Supabase database
// ─────────────────────────────────────────────────────────────────────────────
// HOW TO USE:
//   1. Export your leads from Base44 as JSON (Settings → Export or entity view)
//   2. Save the JSON file as scripts/base44_export.json
//   3. Run: node scripts/seed.js
// ─────────────────────────────────────────────────────────────────────────────

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const SUPABASE_URL = 'https://dhvsuqjgnhuhmjxxndrc.supabase.co'
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodnN1cWpnbmh1aG1qeHhuZHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzY1OTc3MCwiZXhwIjoyMDkzMjM1NzcwfQ.-YXa1H1qvhVOEQ9naJNLnBqICVI-95yvmpDMvIisw-g'
const BASE_SITE    = 'https://synthiqdesigns.com/'

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

function slugify(name) {
  return name.replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1)).join('')
}

function mapBase44Lead(raw) {
  // Handles Base44 field naming conventions — adjust if your export uses different names
  const name  = raw.business_name || raw.name || raw.businessName || 'Unknown'
  const slug  = raw.demo_site_slug || raw.slug || slugify(name)
  return {
    business_name:    name,
    owner_name:       raw.owner_name || raw.ownerName || null,
    category:         raw.category || 'Local Business',
    slug,
    phone:            raw.phone || null,
    email:            raw.email || null,
    address:          raw.address || null,
    city:             raw.city || 'Augusta',
    state:            'GA',
    google_rating:    parseFloat(raw.google_rating || raw.googleRating || raw.rating || 0) || null,
    review_count:     parseInt(raw.review_count || raw.reviewCount || raw.reviews || 0) || 0,
    photo_urls:       raw.photo_urls || raw.photoUrls || [],
    google_reviews:   raw.google_reviews || raw.googleReviews || raw.google_reviews_full || [],
    demo_site_url:    raw.demo_site_url || raw.demoSiteUrl || `${BASE_SITE}${slug}`,
    demo_site_built:  true,
    demo_site_built_at: new Date().toISOString(),
    status:           raw.status || 'site_built',
    approved:         (raw.google_rating || raw.rating || 0) >= 4.0 && (raw.review_count || raw.reviews || 0) >= 10,
    tagline:          raw.tagline || null,
    services:         raw.services || [],
    notes:            raw.notes || null,
    primary_color:    raw.primary_color || null,
  }
}

async function seed() {
  console.log('🚀 Synthiq Lead Seeder\n')

  // Load export file
  const exportPath = path.join(__dirname, 'base44_export.json')
  if (!fs.existsSync(exportPath)) {
    console.error('❌ Missing: scripts/base44_export.json')
    console.error('   Export your leads from Base44 and save as scripts/base44_export.json')
    process.exit(1)
  }

  const raw = JSON.parse(fs.readFileSync(exportPath, 'utf8'))
  const leads = Array.isArray(raw) ? raw : (raw.leads || raw.data || Object.values(raw))

  if (!leads.length) {
    console.error('❌ No leads found in export file')
    process.exit(1)
  }

  console.log(`📦 Found ${leads.length} leads in export\n`)

  let success = 0, failed = 0, skipped = 0

  for (const raw of leads) {
    const lead = mapBase44Lead(raw)

    // Check for duplicate
    const { data: existing } = await db
      .from('business_leads')
      .select('id, business_name')
      .eq('slug', lead.slug)
      .single()

    if (existing) {
      console.log(`⏭  Skipped (duplicate): ${lead.business_name}`)
      skipped++
      continue
    }

    const { data, error } = await db
      .from('business_leads')
      .insert(lead)
      .select('id, business_name, category, city, google_rating')
      .single()

    if (error) {
      console.error(`❌ Failed: ${lead.business_name} — ${error.message}`)
      failed++
    } else {
      console.log(`✅ Imported: ${data.business_name} (${data.category}, ${data.city}, ${data.google_rating}★)`)
      success++
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 50))
  }

  console.log(`\n─────────────────────────────────`)
  console.log(`✅ Imported:  ${success}`)
  console.log(`⏭  Skipped:   ${skipped}`)
  console.log(`❌ Failed:    ${failed}`)
  console.log(`─────────────────────────────────`)
  console.log(`\nDone! Your leads are live in Supabase.`)
  console.log(`View them at: ${SUPABASE_URL.replace('https://', 'https://supabase.com/dashboard/project/')}/editor`)
}

seed().catch(err => { console.error(err); process.exit(1) })
