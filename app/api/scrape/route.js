import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const GKEY = process.env.GOOGLE_PLACES_API_KEY
const SECRET = 'synthiq2026'

async function findPlace(name, city) {
  const query = encodeURIComponent(`${name} ${city} GA`)
  const r = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id,name,rating,user_ratings_total&key=${GKEY}`)
  const d = await r.json()
  return d.candidates?.[0] || null
}

async function getDetails(placeId) {
  const fields = 'place_id,name,rating,user_ratings_total,formatted_phone_number,formatted_address,opening_hours,photos,reviews,price_level'
  const r = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GKEY}`)
  const d = await r.json()
  return d.result || null
}

function buildPhotoUrls(photos = []) {
  return photos.slice(0, 8).map(p =>
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${p.photo_reference}&key=${GKEY}`
  )
}

function extractReviews(reviews = []) {
  return reviews
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)
    .map(r => ({ text: r.text, author: r.author_name, rating: r.rating }))
    .filter(r => r.text && r.text.length > 10)
}

function formatHours(opening_hours) {
  if (!opening_hours?.weekday_text) return {}
  const hours = {}
  opening_hours.weekday_text.forEach(h => {
    const parts = h.split(': ')
    if (parts.length === 2) hours[parts[0]] = parts[1]
  })
  return hours
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!GKEY) return NextResponse.json({ error: 'GOOGLE_PLACES_API_KEY not configured in Vercel' }, { status: 500 })

  const single = searchParams.get('slug')
  let query = db.from('business_leads').select('id,business_name,city,slug,category,google_rating,review_count,phone,address')
  if (single) query = query.eq('slug', single)
  else query = query.limit(40)

  const { data: leads, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const results = [], errors = []

  for (const lead of leads) {
    try {
      const candidate = await findPlace(lead.business_name, lead.city)
      if (!candidate?.place_id) { errors.push({ name: lead.business_name, error: 'Not found' }); continue }

      const details = await getDetails(candidate.place_id)
      if (!details) { errors.push({ name: lead.business_name, error: 'No details' }); continue }

      await db.from('business_leads').update({
        place_id: details.place_id,
        photo_urls: buildPhotoUrls(details.photos || []),
        google_reviews: extractReviews(details.reviews || []),
        hours: formatHours(details.opening_hours),
        google_rating: details.rating || lead.google_rating,
        review_count: details.user_ratings_total || lead.review_count,
        phone: details.formatted_phone_number || lead.phone,
        address: details.formatted_address || lead.address,
        price_level: details.price_level ? '$'.repeat(details.price_level) : null,
        scraped_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('id', lead.id)

      results.push({ name: lead.business_name, photos: (details.photos||[]).length, reviews: (details.reviews||[]).length })
      await new Promise(r => setTimeout(r, 150))
    } catch(e) {
      errors.push({ name: lead.business_name, error: e.message })
    }
  }

  return NextResponse.json({ success: true, scraped: results.length, failed: errors.length, results, errors })
}
