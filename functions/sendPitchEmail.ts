import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { leadId, to, businessName, demoUrl, ownerName, customSubject, customBody } = body;

    if (!to || !businessName || !demoUrl) {
      return Response.json({ error: "Missing required fields: to, businessName, demoUrl" }, { status: 400 });
    }

    // Get Gmail access token
    const { accessToken } = await (base44 as any).asServiceRole.connectors.getConnection("gmail");

    const greeting = ownerName ? `Hi ${ownerName.split(" ")[0]}` : "Hi there";
    const subject = customSubject || `I built a free website for ${businessName} — take a look`;

    // If custom plain-text body is provided, use it; otherwise fall back to HTML template
    const textBody = customBody || `${greeting},

My name is Ly — I run a web design company called Synthiq based out of Augusta, Georgia.

I noticed ${businessName} doesn't have a website yet, so I went ahead and built you a free demo — no charge, no strings attached.

View your demo here: ${demoUrl}

If you like what you see, I'd love to talk about making it yours. Everything is negotiable — pricing, timeline, what's included. We'll make it work for your budget.

Talk soon,
Ly
Synthiq Web Design
Synthiq101@gmail.com`;

    // Build beautiful HTML version from the text body
    const htmlLines = textBody
      .split('\n')
      .map(line => {
        if (line.includes(demoUrl)) {
          return `<p style="text-align:center;margin:24px 0">
            <a href="${demoUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c6aff,#5b4fcf);color:#fff;font-weight:700;font-size:15px;padding:16px 40px;border-radius:100px;text-decoration:none;">
              View Your Free Demo →
            </a><br><span style="font-size:11px;color:#aaa;word-break:break-all;display:block;margin-top:8px">${demoUrl}</span>
          </p>`;
        }
        if (line.trim() === '') return '<br>';
        return `<p style="font-size:15px;color:#444;line-height:1.75;margin:0 0 12px">${line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
      })
      .join('\n');

    const htmlBody = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:580px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <div style="background:linear-gradient(135deg,#0f0f1a 0%,#1a1a2e 100%);padding:36px 40px 28px;text-align:center">
      <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px">SYNTH<span style="color:#7c6aff">IQ</span></div>
      <div style="font-size:11px;color:rgba(255,255,255,0.35);letter-spacing:3px;text-transform:uppercase">Web Design · Augusta, GA</div>
    </div>
    <div style="padding:36px 40px">
      ${htmlLines}
      <div style="margin-top:28px;padding-top:20px;border-top:1px solid #eee;font-size:13px;color:#888;line-height:1.6">
        <strong style="color:#555">Ly — Synthiq Web Design</strong><br>
        Augusta, Georgia · <a href="mailto:Synthiq101@gmail.com" style="color:#7c6aff">Synthiq101@gmail.com</a><br>
        <em style="font-size:12px">Open to negotiation — pricing, timeline, everything.</em>
      </div>
    </div>
    <div style="background:#fafafa;border-top:1px solid #eee;padding:18px 40px;text-align:center">
      <p style="font-size:11px;color:#aaa;margin:0;line-height:1.6">
        You're receiving this because <strong style="color:#777">${businessName}</strong> is a local business in Augusta, GA.<br>
        Not interested? Just reply and I'll never reach out again. No hard feelings.
      </p>
    </div>
  </div>
</body>
</html>`;

    const boundary = `synthiq_${Date.now()}`;
    const mimeMessage = [
      `From: Ly @ Synthiq <Synthiq101@gmail.com>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/plain; charset="UTF-8"`,
      ``,
      textBody,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset="UTF-8"`,
      ``,
      htmlBody,
      ``,
      `--${boundary}--`,
    ].join("\r\n");

    const encodedMessage = btoa(unescape(encodeURIComponent(mimeMessage)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const sendRes = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ raw: encodedMessage }),
      }
    );

    if (!sendRes.ok) {
      const err = await sendRes.text();
      return Response.json({ error: "Gmail send failed", detail: err }, { status: 500 });
    }

    const sentMsg = await sendRes.json();

    if (leadId) {
      const leads = await base44.asServiceRole.entities.BusinessLead.filter({});
      const lead = Array.isArray(leads) ? leads.find((l: any) => l.id === leadId) : null;
      if (lead) {
        // update via service role — use raw API
      }
    }

    return Response.json({ success: true, messageId: sentMsg.id });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});
