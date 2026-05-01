import { createClientFromRequest } from "https://esm.sh/@base44/deno-sdk@0.0.6/src/server.ts";

export default async function handler(req: Request): Promise<Response> {
  const base44 = createClientFromRequest(req);
  const body = await req.json();

  const messageIds = body.data?.new_message_ids ?? [];
  if (!messageIds.length) return new Response("ok", { status: 200 });

  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection("gmail");
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    for (const messageId of messageIds) {
      const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
        { headers: authHeader }
      );
      if (!res.ok) continue;
      const message = await res.json();

      const headers = message.payload?.headers ?? [];
      const fromHeader = headers.find((h: any) => h.name === "From")?.value ?? "";
      const subjectHeader = headers.find((h: any) => h.name === "Subject")?.value ?? "";
      const dateHeader = headers.find((h: any) => h.name === "Date")?.value ?? "";

      // Only process replies (subject starts with Re:)
      if (!subjectHeader.toLowerCase().includes("re:")) continue;

      // Extract email from "From" header
      const emailMatch = fromHeader.match(/<([^>]+)>/) || fromHeader.match(/([^\s]+@[^\s]+)/);
      const replyFromEmail = emailMatch ? emailMatch[1] : fromHeader;

      // Get body text
      let bodyText = "";
      const extractBody = (part: any): string => {
        if (part.mimeType === "text/plain" && part.body?.data) {
          return atob(part.body.data.replace(/-/g, "+").replace(/_/g, "/"));
        }
        if (part.parts) {
          for (const p of part.parts) {
            const t = extractBody(p);
            if (t) return t;
          }
        }
        return "";
      };
      bodyText = extractBody(message.payload);

      // Find lead with matching email
      const leads = await base44.asServiceRole.entities.BusinessLead.filter({ email: replyFromEmail });
      if (!leads || leads.length === 0) continue;

      const lead = leads[0];

      // Update lead with reply
      await base44.asServiceRole.entities.BusinessLead.update(lead.id, {
        email_replied: true,
        email_reply_text: bodyText.slice(0, 2000),
        email_reply_date: new Date().toISOString(),
        status: "replied",
      });
    }
  } catch (err: any) {
    console.error("Reply handler error:", err.message);
  }

  return new Response("ok", { status: 200 });
}
