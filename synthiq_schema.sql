-- ═══════════════════════════════════════════════════════════════════════════
-- SYNTHIQ — COMPLETE DATABASE SCHEMA
-- Run this in Supabase → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. BUSINESS LEADS ────────────────────────────────────────────────────────
create table if not exists business_leads (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz default now(),
  updated_at          timestamptz default now(),

  -- Identity
  business_name       text not null,
  owner_name          text,
  category            text not null,
  slug                text unique not null,

  -- Contact
  phone               text,
  email               text,
  address             text,
  city                text,
  state               text default 'GA',

  -- Google data
  google_rating       numeric(2,1),
  review_count        integer default 0,
  photo_urls          jsonb default '[]',
  google_reviews      jsonb default '[]',

  -- Brand intelligence (scraped)
  primary_color       text,
  secondary_color     text,
  accent_color        text,
  font_choice         text,
  tagline             text,
  services            jsonb default '[]',

  -- Demo site
  demo_site_url       text,
  demo_site_built     boolean default false,
  demo_site_built_at  timestamptz,

  -- Pipeline
  status              text default 'found'
                      check (status in (
                        'found','site_built','approved',
                        'contacted','replied','converted','skipped'
                      )),
  approved            boolean default false,
  approved_at         timestamptz,
  priority_score      numeric generated always as (
                        coalesce(google_rating,0) * ln(greatest(coalesce(review_count,1),1))
                      ) stored,

  -- Outreach
  template_used       integer,
  email_sent          boolean default false,
  email_sent_at       timestamptz,
  email_opened        boolean default false,
  email_opened_at     timestamptz,
  email_replied       boolean default false,
  email_reply_text    text,
  email_replied_at    timestamptz,

  -- Follow-up
  followup_sent       boolean default false,
  followup_sent_at    timestamptz,

  -- Conversion
  converted           boolean default false,
  converted_at        timestamptz,
  deal_value          numeric(10,2),
  plan_tier           text check (plan_tier in ('starter','standard','pro')),
  stripe_customer_id  text,

  -- Internal
  notes               text,
  source              text default 'google_maps'
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger business_leads_updated_at
  before update on business_leads
  for each row execute function update_updated_at();

-- Indexes for common queries
create index idx_leads_status   on business_leads(status);
create index idx_leads_city     on business_leads(city);
create index idx_leads_category on business_leads(category);
create index idx_leads_priority on business_leads(priority_score desc);
create index idx_leads_slug     on business_leads(slug);


-- ── 2. EMAIL SENDS LOG ───────────────────────────────────────────────────────
create table if not exists email_sends (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz default now(),

  lead_id       uuid references business_leads(id) on delete cascade,
  to_email      text not null,
  to_name       text,
  from_email    text default 'ly@synthiqdesigns.com',
  subject       text not null,
  template_id   integer not null,
  resend_id     text,            -- Resend message ID for tracking
  status        text default 'sent'
                check (status in ('sent','opened','replied','bounced','failed')),
  opened_at     timestamptz,
  replied_at    timestamptz,
  error_msg     text
);

create index idx_sends_lead    on email_sends(lead_id);
create index idx_sends_status  on email_sends(status);
create index idx_sends_date    on email_sends(created_at desc);


-- ── 3. EMAIL TEMPLATES ───────────────────────────────────────────────────────
create table if not exists email_templates (
  id          integer primary key,
  name        text not null,
  subject     text not null,
  body_text   text not null,
  use_case    text,
  active      boolean default true
);

insert into email_templates (id, name, subject, body_text, use_case) values
(1, 'Standard Pitch',
 'I built a free website for {{business_name}} — take a look',
 'Hi {{first_name}},

My name is Ly — I run a small web design company called Synthiq out of Augusta, Georgia. I work exclusively with local businesses in the CSRA, and I noticed {{business_name}} doesn''t have a website yet.

So I built you one. Free. No strings.

{{category_hook}}

I put real time into your demo — your actual photos, your Google reviews ({{review_count}} of them, averaging {{rating}}★), your services, your vibe. It''s not a template. It''s built specifically for {{business_name}}.

👉 Your demo: {{demo_url}}

If you like it, I''d love to make it officially yours — custom domain, your branding fully dialed in, live within a week. Pricing starts at $97/mo and everything is negotiable.

Talk soon,
Ly
Synthiq Web Design — Augusta, GA
ly@synthiqdesigns.com',
 'First contact — all categories'),

(2, 'Follow-Up',
 'Re: your free website — just checking in',
 'Hey {{first_name}},

Just bumping this up in case my last message got buried. I built a free demo site for {{business_name}} and wanted to make sure you got a chance to see it.

Your demo: {{demo_url}}

No pressure at all. Budget, timeline, scope — we figure it out together.

Ly — Synthiq Web Design
ly@synthiqdesigns.com',
 'Day 5 follow-up — no reply'),

(3, 'Personal / Warm',
 'Quick question about {{business_name}}',
 'Hi {{first_name}},

I was searching for local businesses in Augusta and came across {{business_name}} — {{review_count}} reviews averaging {{rating}}★ is genuinely impressive.

I noticed you don''t have a website yet, so I went ahead and built you a demo. Free, yours to keep, built to actually look like YOUR business — not a template.

Here it is: {{demo_url}}

If you want to make it live, I can do that — affordable, fast, and we''ll tweak it until it''s exactly right.

Ly
Synthiq Web Design
ly@synthiqdesigns.com',
 'High-rating leads (4.8★+)'),

(4, 'Competitive Urgency',
 'Your competitor just got a new website — here''s yours',
 'Hi {{first_name}},

I build websites for local businesses in Augusta, and I noticed {{business_name}} doesn''t have one yet while some of your competitors just got upgraded.

Built you a free demo so you can see what''s possible before deciding anything: {{demo_url}}

No commitment. No pressure. If you want it live, I''ll make it happen fast. Everything is on the table — domain, hosting, design, pricing.

Ly — Synthiq Web Design
ly@synthiqdesigns.com',
 'Second batch / competitive framing')
on conflict (id) do nothing;


-- ── 4. PIPELINE EVENTS (audit log) ──────────────────────────────────────────
create table if not exists pipeline_events (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  lead_id     uuid references business_leads(id) on delete cascade,
  event_type  text not null,   -- status_change, email_sent, reply_received, etc.
  from_status text,
  to_status   text,
  note        text,
  triggered_by text default 'claude'
);

create index idx_events_lead on pipeline_events(lead_id);
create index idx_events_type on pipeline_events(event_type);
create index idx_events_date on pipeline_events(created_at desc);


-- ── 5. USEFUL VIEWS ──────────────────────────────────────────────────────────

-- Pipeline overview
create or replace view pipeline_stats as
select
  count(*) filter (where status = 'found')      as found,
  count(*) filter (where status = 'site_built') as site_built,
  count(*) filter (where status = 'approved')   as approved,
  count(*) filter (where status = 'contacted')  as contacted,
  count(*) filter (where status = 'replied')    as replied,
  count(*) filter (where status = 'converted')  as converted,
  count(*) filter (where email_sent = true)     as emails_sent,
  count(*) filter (where email_replied = true)  as replies,
  round(avg(google_rating), 1)                  as avg_rating,
  sum(review_count)                             as total_reviews,
  sum(deal_value)                               as total_revenue,
  count(*) filter (where converted = true) * 97.0 as mrr_standard
from business_leads
where status != 'skipped';

-- Top leads to pitch next
create or replace view leads_to_pitch as
select
  id, business_name, category, city, phone, email,
  google_rating, review_count, priority_score,
  demo_site_url, slug, status
from business_leads
where
  status in ('site_built', 'approved')
  and email_sent = false
  and approved = true
  and email is not null
order by priority_score desc;

-- Leads awaiting reply (for follow-up)
create or replace view leads_awaiting_reply as
select
  id, business_name, email, demo_site_url,
  email_sent_at,
  now() - email_sent_at as days_since_sent,
  template_used
from business_leads
where
  email_sent = true
  and email_replied = false
  and status = 'contacted'
  and now() - email_sent_at > interval '5 days'
order by email_sent_at asc;

-- Revenue summary
create or replace view revenue_summary as
select
  count(*) filter (where converted) as total_clients,
  sum(deal_value) filter (where converted) as total_deal_value,
  count(*) filter (where plan_tier = 'starter') * 47 as starter_mrr,
  count(*) filter (where plan_tier = 'standard') * 97 as standard_mrr,
  count(*) filter (where plan_tier = 'pro') * 197 as pro_mrr,
  (count(*) filter (where plan_tier = 'starter') * 47 +
   count(*) filter (where plan_tier = 'standard') * 97 +
   count(*) filter (where plan_tier = 'pro') * 197) as total_mrr
from business_leads;


-- ── 6. ROW LEVEL SECURITY ────────────────────────────────────────────────────
-- Public read on leads (for demo sites to load)
alter table business_leads enable row level security;
create policy "public_read" on business_leads for select using (true);
create policy "service_write" on business_leads for all
  using (auth.role() = 'service_role');

alter table email_sends enable row level security;
create policy "service_all" on email_sends for all
  using (auth.role() = 'service_role');

alter table pipeline_events enable row level security;
create policy "service_all_events" on pipeline_events for all
  using (auth.role() = 'service_role');

-- ═══════════════════════════════════════════════════════════════════════════
-- Done. Paste your keys to Claude and I'll run the lead import next.
-- ═══════════════════════════════════════════════════════════════════════════
