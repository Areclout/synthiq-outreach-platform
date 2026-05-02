import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM  = process.env.NEXT_PUBLIC_FROM_EMAIL  || 'ly@synthiqdesigns.com'
const NAME  = process.env.NEXT_PUBLIC_FROM_NAME   || 'Ly — Synthiq Web Design'
const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN     || 'https://synthiqdesigns.com'

// ── Category-specific hooks ──────────────────────────────────────────────────
const HOOKS = {
  'Nail Salon':       'Nail salons with a strong online presence book 3× more appointments. Right now, customers searching for nail services near you can\'t find you.',
  'Barbershop':       'Barbershops with websites get booked out weeks in advance. Right now, someone nearby is Googling for a barber and not finding you.',
  'Restaurant':       'Restaurants with websites see 70% more foot traffic from local searches. Hungry people near you are searching — and landing on competitors.',
  'Pest Control':     'When someone has a pest problem, the first company they find online gets the call. Right now, that\'s not you.',
  'Pressure Washing': 'Homeowners search for pressure washing every single day. Without a website, you\'re invisible to all of them.',
  'HVAC':             'HVAC jobs average $300–$3,000 per ticket. Every week without a website is money going to whoever shows up on Google first.',
  'Auto Repair':      'People Google mechanics before they drive anywhere. Without a website, you\'re losing jobs to shops half as good as yours.',
  'Contractor':       'Contractors who show up online win bids before they ever make a call. A website is the first impression that gets you in the door.',
  'Landscaping':      'Homeowners hire the landscaper they trust first. A website with real photos of your work is how that trust starts.',
  'Cleaning Service': 'Cleaning clients are loyal — but they have to find you first. A website turns a one-time search into a recurring customer.',
  'Plumber':          'Plumbing emergencies happen at 11pm. The plumber with a website gets that call. The one without doesn\'t.',
  'Electrician':      'Electrical jobs are high-ticket and urgent. Homeowners hire fast — and they hire whoever they find first online.',
  'Painter':          'Before anyone hires a painter, they look at work examples online. A website with your real projects turns browsers into booked jobs.',
  'Roofer':           'Roof jobs are some of the highest-value residential contracts. A website lets your work speak before you pick up the phone.',
}

// ── Template builders ────────────────────────────────────────────────────────

function t1_standard({ firstName, bizName, demoUrl, category, rating, reviewCount }) {
  const hook = HOOKS[category] || 'Businesses with websites consistently outperform those without — and the gap is only growing.'
  return {
    subject: `I built a free website for ${bizName} — take a look`,
    text: `Hi ${firstName},

My name is Ly — I run a small web design company called Synthiq out of Augusta, Georgia. I work exclusively with local businesses in the CSRA, and I noticed ${bizName} doesn't have a website yet.

So I built you one. Free. No strings.

${hook}

I put real time into your demo — your actual photos, your Google reviews (${reviewCount} of them, averaging ${rating}★), your services, your vibe. It's not a template. It's built specifically for ${bizName}.

👉 Your demo: ${demoUrl}

If you like it, I'd love to make it officially yours — custom domain, your branding fully dialed in, live within a week. Pricing starts at $97/mo and everything is negotiable.

Talk soon,
Ly
Synthiq Web Design — Augusta, GA
${FROM}`
  }
}

function t2_followup({ firstName, bizName, demoUrl }) {
  return {
    subject: `Re: your free website — just checking in`,
    text: `Hey ${firstName},

Just bumping this up in case my last message got buried. I built a free demo site for ${bizName} and wanted to make sure you got a chance to see it.

Your demo: ${demoUrl}

No pressure at all. Budget, timeline, scope — we figure it out together.

Ly — Synthiq Web Design
${FROM}`
  }
}

function t3_warm({ firstName, bizName, demoUrl, rating, reviewCount }) {
  return {
    subject: `Quick question about ${bizName}`,
    text: `Hi ${firstName},

I was searching for local businesses in Augusta and came across ${bizName} — ${reviewCount} reviews averaging ${rating}★ is genuinely impressive.

I noticed you don't have a website yet, so I went ahead and built you a demo. Free, yours to keep, built to actually look like YOUR business — not a template.

Here it is: ${demoUrl}

If you want to make it live, I can do that — affordable, fast, and we'll tweak it until it's exactly right. Happy to negotiate on anything.

Ly
Synthiq Web Design
${FROM}`
  }
}

function t4_competitive({ firstName, bizName, demoUrl }) {
  return {
    subject: `Your competitor just got a new website — here's yours`,
    text: `Hi ${firstName},

I build websites for local businesses in Augusta, and I noticed ${bizName} doesn't have one yet while some of your competitors just got upgraded.

Built you a free demo so you can see what's possible before deciding anything: ${demoUrl}

No commitment. No pressure. If you want it live, I'll make it happen fast. Everything is on the table.

Ly — Synthiq Web Design
${FROM}`
  }
}

const TEMPLATES = { 1: t1_standard, 2: t2_followup, 3: t3_warm, 4: t4_competitive }

// ── HTML email wrapper ────────────────────────────────────────────────────────
function buildHtml(text, primaryColor = '#1D9E75') {
  const paragraphs = text
    .split('\n\n')
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:#333">${p.replace(/\n/g, '<br>')}</p>`)
    .join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Synthiq Web Design</title></head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e8e8e4">
    <div style="background:${primaryColor};padding:20px 28px;display:flex;align-items:center;gap:12px">
      <div style="width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#fff">S</div>
      <div>
        <div style="color:#fff;font-weight:700;font-size:15px;letter-spacing:-0.2px">Synthiq Web Design</div>
        <div style="color:rgba(255,255,255,0.65);font-size:11px">Augusta, Georgia</div>
      </div>
    </div>
    <div style="padding:28px 32px">${paragraphs}</div>
    <div style="padding:14px 32px;background:#f9f9f7;border-top:1px solid #eee;font-size:11px;color:#aaa;text-align:center;line-height:1.6">
      Synthiq Web Design · Augusta, GA · <a href="mailto:${FROM}" style="color:#aaa">${FROM}</a><br>
      <a href="{{unsubscribe_url}}" style="color:#ccc;font-size:10px">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`
}

// ── Main send function ────────────────────────────────────────────────────────

/**
 * Send a pitch email
 * @param {Object} opts
 * @param {string} opts.to - recipient email
 * @param {string} opts.businessName
 * @param {string} opts.ownerName - used as firstName if provided
 * @param {string} opts.category
 * @param {string} opts.city
 * @param {number} opts.rating
 * @param {number} opts.reviewCount
 * @param {string} opts.demoUrl
 * @param {number} opts.templateId - 1|2|3|4
 * @param {string} opts.primaryColor - brand color for email header
 * @returns {{ id, subject }}
 */
export async function sendPitchEmail({
  to,
  businessName,
  ownerName,
  category,
  city,
  rating,
  reviewCount,
  demoUrl,
  templateId = 1,
  primaryColor = '#111111',
}) {
  const firstName = ownerName || businessName.split(' ')[0]
  const builder = TEMPLATES[templateId] || TEMPLATES[1]
  const { subject, text } = builder({ firstName, bizName: businessName, demoUrl, category, rating, reviewCount })
  const html = buildHtml(text, primaryColor)

  const { data, error } = await resend.emails.send({
    from: `${NAME} <${FROM}>`,
    to,
    subject,
    text,
    html,
    reply_to: FROM,
    headers: { 'X-Synthiq-Template': String(templateId), 'X-Synthiq-Lead': businessName },
  })

  if (error) throw new Error(error.message)
  return { id: data.id, subject }
}

export { HOOKS, TEMPLATES }
