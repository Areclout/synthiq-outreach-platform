import { createClientFromRequest } from "https://esm.sh/@base44/deno-sdk@0.0.6/src/server.ts";

export default async function handler(req: Request): Promise<Response> {
  const base44 = createClientFromRequest(req);
  const body = await req.json();
  const { leadId, to, businessName, demoUrl, ownerName } = body;

  if (!to || !businessName || !demoUrl) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection("gmail");

    const greeting = ownerName ? `Hi ${ownerName}` : "Hi there";
    const subject = `I built a free website for ${businessName} — take a look`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { margin: 0; padding: 0; background: #f5f5f5; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .wrapper { max-width: 580px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%); padding: 40px 40px 32px; text-align: center; }
    .logo { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 4px; }
    .logo span { color: #7c6aff; }
    .tagline { font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 3px; text-transform: uppercase; }
    .body { padding: 40px; }
    .greeting { font-size: 17px; color: #1a1a1a; font-weight: 600; margin-bottom: 20px; }
    p { font-size: 15px; color: #444; line-height: 1.75; margin: 0 0 16px; }
    .highlight { background: #f8f6ff; border-left: 3px solid #7c6aff; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 24px 0; }
    .highlight p { margin: 0; font-size: 14px; color: #555; }
    .cta-wrap { text-align: center; margin: 32px 0; }
    .cta { display: inline-block; background: linear-gradient(135deg, #7c6aff, #5b4fcf); color: #fff !important; font-weight: 700; font-size: 15px; padding: 16px 40px; border-radius: 100px; text-decoration: none; letter-spacing: 0.5px; }
    .url-fallback { text-align: center; font-size: 12px; color: #aaa; margin-top: 8px; word-break: break-all; }
    .footer { background: #fafafa; border-top: 1px solid #eee; padding: 24px 40px; text-align: center; }
    .footer p { font-size: 12px; color: #aaa; margin: 0; line-height: 1.6; }
    .footer strong { color: #666; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">SYNTH<span>IQ</span></div>
      <div class="tagline">Web Design · Augusta Area</div>
    </div>
    <div class="body">
      <p class="greeting">${greeting},</p>
      <p>My name is Ly — I run a web design company called <strong>Synthiq</strong> based out of Augusta, Georgia. I noticed <strong>${businessName}</strong> doesn't have a website yet, so I went ahead and built you a free demo — no charge, no strings attached.</p>
      <p>I put real time into it: your business info, real photos, a full services section, and a design that actually represents your brand. I want you to see what's possible before you decide anything.</p>
      <div class="highlight">
        <p>👇 Your personalized demo site is ready to view right now:</p>
      </div>
      <div class="cta-wrap">
        <a href="${demoUrl}" class="cta">View Your Free Demo →</a>
        <div class="url-fallback">${demoUrl}</div>
      </div>
      <p>If you like what you see, I'd love to hop on a quick call and talk about making it yours — fully customized, your domain, live within a week. Everything is negotiable and built around your budget.</p>
      <p>If it's not your thing, no worries at all. But take 30 seconds to look — I think you'll like it. 😊</p>
      <p style="margin-top: 32px;">Talk soon,<br><strong>Ly</strong><br>Synthiq Web Design<br><a href="mailto:Synthiq101@gmail.com" style="color: #7c6aff;">Synthiq101@gmail.com</a></p>
    </div>
    <div class="footer">
      <p>You're receiving this because <strong>${businessName}</strong> is a local business in the Augusta, GA area.<br>Not interested? Just reply and I'll never reach out again. No hard feelings.</p>
    </div>
  </div>
</body>
</html>`;

    const textBody = `${greeting},

My name is Ly — I run a web design company called Synthiq based out of Augusta, Georgia.

I noticed ${businessName} doesn't have a website yet, so I went ahead and built you a free demo — no charge, no strings attached.

View your demo here: ${demoUrl}

If you like what you see, I'd love to talk about making it yours. Everything is negotiable.

Talk soon,
Ly
Synthiq Web Design
Synthiq101@gmail.com`;

    // Build RFC 2822 MIME email
    const boundary = `boundary_${Date.now()}`;
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
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: encodedMessage }),
      }
    );

    if (!sendRes.ok) {
      const err = await sendRes.text();
      return new Response(JSON.stringify({ error: "Gmail send failed", detail: err }), { status: 500 });
    }

    const sentMsg = await sendRes.json();

    // Update lead record in DB
    if (leadId) {
      await base44.asServiceRole.entities.BusinessLead.update(leadId, {
        email_sent: true,
        email_sent_date: new Date().toISOString(),
        status: "contacted",
      });
    }

    return new Response(JSON.stringify({ success: true, messageId: sentMsg.id }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
