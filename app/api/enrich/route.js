// app/api/enrich/route.js
// Visit: /api/enrich?secret=synthiq2026
// Uses Claude AI to generate unique taglines, headlines, font pairings per business
// Then updates Supabase with all enriched brand data

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Unique Google font pairings per category + personality
const FONT_PAIRINGS = {
  'Nail Salon': [
    { display: 'Cormorant Garamond', body: 'Lato', style: 'elegant-serif' },
    { display: 'Playfair Display', body: 'Source Sans Pro', style: 'editorial' },
    { display: 'Libre Baskerville', body: 'Raleway', style: 'luxury' },
  ],
  'Barbershop': [
    { display: 'Bebas Neue', body: 'Oswald', style: 'bold-industrial' },
    { display: 'Alfa Slab One', body: 'Barlow', style: 'strong' },
    { display: 'Black Han Sans', body: 'Nunito Sans', style: 'urban' },
  ],
  'Restaurant': [
    { display: 'Playfair Display', body: 'Nunito', style: 'warm-editorial' },
    { display: 'Cormorant', body: 'Mulish', style: 'fine-dining' },
    { display: 'Fraunces', body: 'Inter', style: 'artisanal' },
  ],
  'HVAC': [
    { display: 'Rajdhani', body: 'Roboto', style: 'technical' },
    { display: 'Exo 2', body: 'Open Sans', style: 'professional' },
    { display: 'Orbitron', body: 'Exo 2', style: 'modern-tech' },
  ],
  'Pest Control': [
    { display: 'Exo 2', body: 'Open Sans', style: 'authoritative' },
    { display: 'Rajdhani', body: 'Nunito Sans', style: 'direct' },
    { display: 'Barlow Condensed', body: 'Barlow', style: 'utility' },
  ],
  'Pressure Washing': [
    { display: 'Barlow Condensed', body: 'Barlow', style: 'clean-utility' },
    { display: 'Exo 2', body: 'Roboto', style: 'professional' },
    { display: 'Rajdhani', body: 'Open Sans', style: 'direct' },
  ],
  'Auto Repair': [
    { display: 'Barlow Condensed', body: 'Barlow', style: 'industrial' },
    { display: 'Exo 2', body: 'Nunito Sans', style: 'technical' },
    { display: 'Black Han Sans', body: 'Open Sans', style: 'tough' },
  ],
  'Contractor': [
    { display: 'Oswald', body: 'Source Sans Pro', style: 'builder' },
    { display: 'Barlow Condensed', body: 'Barlow', style: 'industrial' },
    { display: 'Exo 2', body: 'Roboto', style: 'structural' },
  ],
  'Landscaping': [
    { display: 'Playfair Display', body: 'Lato', style: 'natural' },
    { display: 'Cormorant Garamond', body: 'Nunito', style: 'organic' },
    { display: 'Libre Baskerville', body: 'Source Sans Pro', style: 'earthy' },
  ],
  'Cleaning Service': [
    { display: 'Nunito', body: 'Nunito Sans', style: 'friendly-clean' },
    { display: 'Poppins', body: 'Open Sans', style: 'modern-clean' },
    { display: 'Quicksand', body: 'Mulish', style: 'approachable' },
  ],
  'Plumber': [
    { display: 'Oswald', body: 'Roboto', style: 'reliable' },
    { display: 'Barlow Condensed', body: 'Open Sans', style: 'direct' },
    { display: 'Exo 2', body: 'Nunito Sans', style: 'technical' },
  ],
  'Electrician': [
    { display: 'Exo 2', body: 'Roboto', style: 'electric' },
    { display: 'Rajdhani', body: 'Open Sans', style: 'technical' },
    { display: 'Orbitron', body: 'Exo 2', style: 'high-tech' },
  ],
  'Painter': [
    { display: 'Cormorant Garamond', body: 'Raleway', style: 'artistic' },
    { display: 'Playfair Display', body: 'Lato', style: 'creative' },
    { display: 'Libre Baskerville', body: 'Nunito', style: 'crafted' },
  ],
  'Roofer': [
    { display: 'Oswald', body: 'Source Sans Pro', style: 'solid' },
    { display: 'Barlow Condensed', body: 'Barlow', style: 'industrial' },
    { display: 'Exo 2', body: 'Roboto', style: 'structural' },
  ],
}

// Color palettes beyond the defaults — each business gets one unique to its data
const PALETTES = {
  'Nail Salon': [
    { bg:'#0d0810', grad:'#1a0a24', accent:'#d4a0c0', accent2:'#e8c8d8', text:'#f0d0e0', ctaBg:'#d4a0c0', ctaText:'#1a0818' },
    { bg:'#0a0810', grad:'#180a20', accent:'#c8b4e8', accent2:'#ddd0f8', text:'#e8dcf8', ctaBg:'#c8b4e8', ctaText:'#180a20' },
    { bg:'#100810', grad:'#200818', accent:'#e8a0b8', accent2:'#f8c8d8', text:'#fce0e8', ctaBg:'#e8a0b8', ctaText:'#200818' },
    { bg:'#0c0a08', grad:'#1c1408', accent:'#d4b870', accent2:'#e8d090', text:'#f4e8c0', ctaBg:'#d4b870', ctaText:'#1c1408' },
  ],
  'Barbershop': [
    { bg:'#080c10', grad:'#0c1820', accent:'#c9972a', accent2:'#e8b84b', text:'#f0d080', ctaBg:'#c9972a', ctaText:'#080c10' },
    { bg:'#0a0808', grad:'#1a0808', accent:'#cc3333', accent2:'#ee5555', text:'#ff9999', ctaBg:'#cc3333', ctaText:'#fff' },
    { bg:'#060810', grad:'#0a1020', accent:'#e8e8e8', accent2:'#ffffff', text:'#ffffff', ctaBg:'#e8e8e8', ctaText:'#060810' },
    { bg:'#0a0c08', grad:'#141c08', accent:'#88aa44', accent2:'#aaccaa', text:'#cceeaa', ctaBg:'#88aa44', ctaText:'#fff' },
  ],
  'Restaurant': [
    { bg:'#0a0600', grad:'#1a0c00', accent:'#e8a020', accent2:'#f5c040', text:'#f5d080', ctaBg:'#e8a020', ctaText:'#000' },
    { bg:'#080808', grad:'#181010', accent:'#cc4444', accent2:'#ee6666', text:'#ffaaaa', ctaBg:'#cc4444', ctaText:'#fff' },
    { bg:'#080a04', grad:'#121808', accent:'#88bb44', accent2:'#aaddaa', text:'#cceeaa', ctaBg:'#88bb44', ctaText:'#fff' },
    { bg:'#0c0808', grad:'#1c1010', accent:'#cc8844', accent2:'#eeaa66', text:'#ffcc99', ctaBg:'#cc8844', ctaText:'#fff' },
  ],
}

function getPalette(category, businessName) {
  const options = PALETTES[category]
  if (!options) return null
  // Pick based on business name hash for consistency
  const hash = businessName.split('').reduce((a,c) => a + c.charCodeAt(0), 0)
  return options[hash % options.length]
}

function getFontPairing(category, businessName) {
  const options = FONT_PAIRINGS[category] || FONT_PAIRINGS['Contractor']
  const hash = businessName.split('').reduce((a,c) => a + c.charCodeAt(0), 0)
  return options[hash % options.length]
}

async function generateBrandContent(lead, reviews) {
  const reviewTexts = reviews.slice(0,3).map(r =>
    typeof r === 'string' ? r : r.text || ''
  ).filter(Boolean).join(' | ')

  const prompt = `You are a world-class brand strategist. Create unique brand content for a local business demo website.

Business: ${lead.business_name}
Type: ${lead.category}
Location: ${lead.city}, GA
Rating: ${lead.google_rating}★ (${lead.review_count} reviews)
Real customer reviews: "${reviewTexts}"

Return ONLY valid JSON (no markdown, no explanation):
{
  "tagline": "A short, powerful 4-8 word brand tagline specific to THIS business (not generic)",
  "hero_headline_line1": "First line of hero headline (3-5 words, powerful)",
  "hero_headline_line2": "Second line (2-4 words, can be italic accent)",
  "hero_subtext": "One compelling sentence (max 12 words) about what makes them special",
  "trust_statement": "One sentence highlighting their ratings/reviews in a compelling way",
  "cta_text": "Call to action button text (2-4 words)"
}`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }]
      })
    })
    const data = await res.json()
    const text = data.content?.[0]?.text || ''
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch(e) {
    return null
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== 'synthiq2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const single = searchParams.get('slug')
  let query = db.from('business_leads')
    .select('id,business_name,category,city,google_rating,review_count,google_reviews,slug')
  if (single) query = query.eq('slug', single)
  else query = query.limit(40)

  const { data: leads, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const results = [], errors = []

  for (const lead of leads) {
    try {
      const fonts = getFontPairing(lead.category, lead.business_name)
      const palette = getPalette(lead.category, lead.business_name)
      const brand = await generateBrandContent(lead, lead.google_reviews || [])

      const update = {
        font_display: fonts.display,
        font_body: fonts.body,
        font_style: fonts.style,
        updated_at: new Date().toISOString(),
      }

      if (palette) {
        update.primary_color = palette.bg
        update.secondary_color = palette.accent
      }

      if (brand) {
        update.tagline = brand.tagline
        update.brand_content = JSON.stringify(brand)
      }

      const { error: upErr } = await db.from('business_leads').update(update).eq('id', lead.id)
      if (upErr) errors.push({ name: lead.business_name, error: upErr.message })
      else results.push({ name: lead.business_name, tagline: brand?.tagline, fonts: `${fonts.display}/${fonts.body}` })

      await new Promise(r => setTimeout(r, 300))
    } catch(e) {
      errors.push({ name: lead.business_name, error: e.message })
    }
  }

  return NextResponse.json({ success: true, enriched: results.length, failed: errors.length, results, errors })
}
