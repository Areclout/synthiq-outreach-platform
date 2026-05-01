import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json().catch(() => ({}));
    const slug = body.slug || "";

    if (!slug) {
      return Response.json({ error: "slug is required" }, { status: 400 });
    }

    // Fetch all leads via service role (bypasses RLS)
    let leads = await base44.asServiceRole.entities.BusinessLead.filter({});

    // Fallback to user-scoped if service role is empty
    if (!Array.isArray(leads) || leads.length === 0) {
      leads = await base44.entities.BusinessLead.filter({});
    }

    if (!Array.isArray(leads)) {
      return Response.json({ error: "Unexpected response format" }, { status: 500 });
    }

    const lead = leads.find((l: any) => l.demo_site_slug === slug);
    if (!lead) {
      return Response.json({ error: `No lead found for slug: ${slug}` }, { status: 404 });
    }

    return Response.json({ lead });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
});
