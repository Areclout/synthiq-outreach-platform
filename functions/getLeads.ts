import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Try service role first, fall back to debug info
    let leads;
    try {
      leads = await base44.asServiceRole.entities.BusinessLead.filter({});
    } catch (e1) {
      return Response.json({ error: "serviceRole failed: " + String(e1) }, { status: 500 });
    }

    // If service role returns empty, try the direct user-scoped call
    if (!leads || (Array.isArray(leads) && leads.length === 0)) {
      try {
        const userLeads = await base44.entities.BusinessLead.filter({});
        if (Array.isArray(userLeads) && userLeads.length > 0) {
          leads = userLeads;
        }
      } catch (_e) { /* ignore */ }
    }

    return Response.json({
      leads: Array.isArray(leads) ? leads : [],
      count: Array.isArray(leads) ? leads.length : 0
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
});
