// Synthiq — Two-Stage Outreach Email Library
// Stage 1: peak interest (no demo link). Stage 2: deliver preview (only to interested).

const FROM = 'Ly <ly@synthiqdesigns.com>';

function greet(lead) {
  return lead.owner_name ? lead.owner_name.split(' ')[0] : 'there';
}

// ─── STAGE 1: INTEREST-PEAKING (no demo link) ───
export function interestEmail(lead) {
  const name = greet(lead);
  const rating = lead.google_rating || '';
  const reviews = lead.review_count || '';
  const city = lead.city || 'town';
  const biz = lead.business_name;

  // Pick template by rating
  if (rating >= 4.8) {
    return {
      template: 'B-compliment',
      subject: `${biz}'s reviews caught my eye`,
      text: `Hi ${name},\n\n${reviews} reviews averaging ${rating} stars — ${biz} is clearly doing something right in ${city}.\n\nThe one thing missing is a website that matches that reputation. I'd like to build you a free preview so you can see it for yourself — no obligation.\n\nJust reply "yes" and I'll get started.\n\n— Ly, Synthiq`,
    };
  }
  return {
    template: 'A-noticing',
    subject: `quick question about ${biz}`,
    text: `Hi ${name},\n\nI'm local to ${city} and came across ${biz} on Google — ${reviews} reviews at ${rating} stars is genuinely impressive.\n\nI build websites for standout local businesses, and I noticed you don't have one yet. I'd love to build you a free preview (no charge, no catch) so you can see what it'd look like.\n\nWant me to put one together for you?\n\n— Ly, Synthiq`,
  };
}

// Soft curiosity variant (use for lower-review-count leads if you want)
export function interestEmailSoft(lead) {
  const name = greet(lead);
  return {
    template: 'C-curiosity',
    subject: `a quick idea for ${lead.business_name}`,
    text: `Hi ${name},\n\nQuick one — I had an idea for ${lead.business_name} and put a little time into it. Would it be alright if I sent it over? Totally free, just something I think you'd like.\n\n— Ly, Synthiq`,
  };
}

// ─── STAGE 1 FOLLOW-UP (day 4, no reply) ───
export function interestFollowUp(lead) {
  const name = greet(lead);
  return {
    template: 'followup',
    subject: `re: ${lead.business_name}`,
    text: `Hey ${name}, just floating this back up — still happy to build ${lead.business_name} a free preview whenever you're curious. No rush.\n\n— Ly`,
  };
}

// ─── STAGE 2: PREVIEW DELIVERY (only after they reply interested) ───
export function previewEmail(lead) {
  const name = greet(lead);
  const url = lead.demo_site_url || `https://synthiq-outreach-platform.vercel.app/${lead.slug}`;
  return {
    template: 'preview-reveal',
    subject: `here's ${lead.business_name} — built it for you`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;line-height:1.6">
      <p>${name}, that was fast — I had most of it ready. Here's your preview:</p>
      <p style="text-align:center;margin:28px 0">
        <a href="${url}" style="background:#d4a0c0;color:#0d0810;padding:14px 32px;text-decoration:none;font-weight:700;border-radius:4px">View Your Preview</a>
      </p>
      <p>It's built from your real Google photos and reviews. Take a look and tell me what you'd change.</p>
      <p>If you love it, I can have it live on your own domain within a week — $97/month, cancel anytime, $200 refundable deposit.</p>
      <p>— Ly, Synthiq</p>
    </div>`,
    text: `${name}, that was fast — I had most of it ready. Here's your preview:\n\n${url}\n\nIt's built from your real Google photos and reviews. Take a look and tell me what you'd change. If you love it, I can have it live on your own domain within a week ($97/mo, cancel anytime, $200 refundable deposit).\n\n— Ly, Synthiq`,
  };
}

export { FROM };
