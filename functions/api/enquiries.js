const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

const authorised = (request, env) => {
  if (!env.LEADS_DASHBOARD_TOKEN) return false;
  const auth = request.headers.get('authorization') || '';
  return auth === `Bearer ${env.LEADS_DASHBOARD_TOKEN}`;
};

const clean = (value) => typeof value === 'string' ? value.trim() : '';
const num = (value) => Number.isFinite(Number(value)) ? Number(value) : null;
const pick = (...values) => values.map(clean).find(Boolean) || '';

const enquiryColumns = {
  id: 'TEXT PRIMARY KEY',
  reference: 'TEXT',
  created_at: 'TEXT',
  updated_at: 'TEXT',
  status: 'TEXT',
  classification: 'TEXT',
  owner: 'TEXT',
  internal_notes: 'TEXT',
  contact_name: 'TEXT',
  contact_email: 'TEXT',
  contact_phone: 'TEXT',
  preferred_contact: 'TEXT',
  consent: 'INTEGER',
  site_location: 'TEXT',
  site_lat: 'REAL',
  site_lng: 'REAL',
  site_source: 'TEXT',
  project_route: 'TEXT',
  intended_use: 'TEXT',
  bedrooms_scale: 'TEXT',
  land_status: 'TEXT',
  planning_status: 'TEXT',
  budget: 'TEXT',
  target_start: 'TEXT',
  decision_role: 'TEXT',
  project_notes: 'TEXT',
  home_choice: 'TEXT',
  model_slug: 'TEXT',
  model_name: 'TEXT',
  placement_confirmed: 'INTEGER',
  placement_lat: 'REAL',
  placement_lng: 'REAL',
  placement_rotation: 'REAL',
  attribution_source: 'TEXT',
  attribution_medium: 'TEXT',
  attribution_campaign: 'TEXT',
  attribution_content: 'TEXT',
  attribution_term: 'TEXT',
  landing_page: 'TEXT',
  referrer: 'TEXT',
  source_url: 'TEXT',
  message: 'TEXT',
  raw_json: 'TEXT'
};

async function ensureEnquirySchema(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      reference TEXT,
      created_at TEXT,
      updated_at TEXT,
      status TEXT,
      classification TEXT,
      owner TEXT,
      internal_notes TEXT,
      contact_name TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      preferred_contact TEXT,
      consent INTEGER,
      site_location TEXT,
      site_lat REAL,
      site_lng REAL,
      site_source TEXT,
      project_route TEXT,
      intended_use TEXT,
      bedrooms_scale TEXT,
      land_status TEXT,
      planning_status TEXT,
      budget TEXT,
      target_start TEXT,
      decision_role TEXT,
      project_notes TEXT,
      home_choice TEXT,
      model_slug TEXT,
      model_name TEXT,
      placement_confirmed INTEGER,
      placement_lat REAL,
      placement_lng REAL,
      placement_rotation REAL,
      attribution_source TEXT,
      attribution_medium TEXT,
      attribution_campaign TEXT,
      attribution_content TEXT,
      attribution_term TEXT,
      landing_page TEXT,
      referrer TEXT,
      source_url TEXT,
      message TEXT,
      raw_json TEXT
    )
  `).run();

  for (const [column, type] of Object.entries(enquiryColumns)) {
    if (column === 'id') continue;
    try {
      await db.prepare(`ALTER TABLE enquiries ADD COLUMN ${column} ${type}`).run();
    } catch {}
  }
}

async function ensureFileSchema(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS enquiry_files (
      id TEXT PRIMARY KEY,
      enquiry_id TEXT,
      r2_key TEXT,
      filename TEXT,
      content_type TEXT,
      size INTEGER,
      created_at TEXT
    )
  `).run();
}

function normaliseAttribution(attribution = {}, fallback = {}) {
  const firstTouchSource = pick(attribution.firstTouchSource, attribution.first_touch_source, attribution.utmSource, fallback.source);
  const firstTouchMedium = pick(attribution.firstTouchMedium, attribution.first_touch_medium, attribution.utmMedium, fallback.medium);
  const firstTouchCampaign = pick(attribution.firstTouchCampaign, attribution.first_touch_campaign, attribution.utmCampaign, fallback.campaign);
  const lastTouchSource = pick(attribution.lastTouchSource, attribution.last_touch_source, attribution.utmSource, fallback.source);
  const lastTouchMedium = pick(attribution.lastTouchMedium, attribution.last_touch_medium, attribution.utmMedium, fallback.medium);
  const lastTouchCampaign = pick(attribution.lastTouchCampaign, attribution.last_touch_campaign, attribution.utmCampaign, fallback.campaign);

  return {
    source: lastTouchSource || firstTouchSource || 'direct',
    medium: lastTouchMedium || firstTouchMedium || 'direct',
    campaign: lastTouchCampaign || firstTouchCampaign || '',
    content: pick(attribution.utmContent, attribution.content),
    term: pick(attribution.utmTerm, attribution.term),
    landingPage: pick(attribution.firstTouchLandingPage, attribution.landingPage, fallback.landingPage),
    currentPage: pick(attribution.currentPage, fallback.currentPage),
    referrer: pick(attribution.referrer, fallback.referrer),
    firstTouchSource,
    firstTouchMedium,
    firstTouchCampaign,
    lastTouchSource,
    lastTouchMedium,
    lastTouchCampaign,
    gclid: pick(attribution.gclid),
    fbclid: pick(attribution.fbclid),
    msclkid: pick(attribution.msclkid)
  };
}

function classify(project = {}) {
  const route = clean(project.route).toLowerCase();
  if (route === 'partner') return 'Partner';

  const timing = clean(project.targetStart).toLowerCase();
  const land = clean(project.landStatus).toLowerCase();
  const budget = clean(project.budget).toLowerCase();
  const role = clean(project.decisionRole).toLowerCase();

  const strongTiming = timing.includes('as soon') || timing.includes('within 6') || timing.includes('6–12');
  const strongLand = land.includes('owned') || land.includes('under offer') || land.includes('site identified');
  const hasBudget = budget && !budget.includes('not established');
  const decisionMaker = role.includes('decision maker') || role.includes('developer');

  if (strongTiming && strongLand && hasBudget && decisionMaker) return 'Qualified';
  if (timing.includes('researching') || (!strongLand && !hasBudget)) return 'Nurture';
  return 'Review';
}

function enquiryReference() {
  const year = new Date().getUTCFullYear();
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
  return `BH-${year}-${suffix}`;
}

async function sendNotification(env, enquiry) {
  if (!env.RESEND_API_KEY || !env.ENQUIRY_NOTIFICATION_EMAIL) return;
  const from = env.ENQUIRY_NOTIFICATION_FROM || 'Bauhu Website <enquiries@bauhu.com>';
  const subject = `${enquiry.reference} · ${enquiry.classification} · ${enquiry.contact_name} · ${enquiry.site_location || 'Location not supplied'}`;
  const text = [
    'New Bauhu website enquiry',
    '',
    `Reference: ${enquiry.reference}`,
    `Classification: ${enquiry.classification}`,
    `Name: ${enquiry.contact_name}`,
    `Email: ${enquiry.contact_email}`,
    `Phone: ${enquiry.contact_phone || '—'}`,
    `Location: ${enquiry.site_location || '—'}`,
    `Route: ${enquiry.project_route || '—'}`,
    `Budget: ${enquiry.budget || '—'}`,
    `Target start: ${enquiry.target_start || '—'}`,
    `Model: ${enquiry.model_name || enquiry.home_choice || '—'}`,
    `Source: ${enquiry.attribution_source || 'Direct / unknown'}`,
    `Medium: ${enquiry.attribution_medium || '—'}`,
    `Campaign: ${enquiry.attribution_campaign || '—'}`,
    `Landing page: ${enquiry.landing_page || '—'}`,
    `Referrer: ${enquiry.referrer || '—'}`
  ].join('\n');

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({ from, to: [env.ENQUIRY_NOTIFICATION_EMAIL], subject, text })
    });
  } catch {}
}

async function handlePost({ request, env }) {
  if (!env.DB) return json({ error: 'D1 binding DB is not configured.' }, 503);

  const form = await request.formData();
  const payloadRaw = form.get('payload');
  if (typeof payloadRaw !== 'string') return json({ error: 'Missing enquiry payload.' }, 400);

  let payload;
  try { payload = JSON.parse(payloadRaw); } catch { return json({ error: 'Invalid enquiry payload.' }, 400); }

  const contact = payload.contact || {};
  const site = payload.site || {};
  const project = payload.project || {};
  const home = payload.home || {};
  const placement = payload.placement || {};
  const attribution = payload.attribution || {};
  const normalisedAttribution = normaliseAttribution(attribution, {
    landingPage: clean(payload.sourceUrl),
    currentPage: clean(payload.sourceUrl),
    referrer: clean(attribution.referrer)
  });
  const projectRoute = clean(project.route) === 'private' ? 'custom' : clean(project.route);
  const homeChoiceRaw = clean(home.homeChoice) === 'private' ? 'custom' : clean(home.homeChoice);
  const effectiveHomeChoice = projectRoute || homeChoiceRaw;
  const isModelRoute = effectiveHomeChoice === 'model';

  const contactName = clean(contact.name);
  const contactEmail = clean(contact.email);
  if (!contactName || !contactEmail) return json({ error: 'Name and email are required.' }, 400);

  await ensureEnquirySchema(env.DB);

  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const reference = enquiryReference();
  const classification = classify(project);
  const rawJson = JSON.stringify({ ...payload, commercialAttribution: normalisedAttribution });

  const row = {
    id,
    reference,
    created_at: now,
    updated_at: now,
    status: 'New',
    classification,
    owner: null,
    internal_notes: null,
    contact_name: contactName,
    contact_email: contactEmail,
    contact_phone: clean(contact.phone),
    preferred_contact: clean(contact.contactPreference),
    consent: contact.consent ? 1 : 0,
    site_location: clean(site.place) || clean(project.buildLocation),
    site_lat: num(site.lat),
    site_lng: num(site.lng),
    site_source: clean(site.source),
    project_route: projectRoute,
    intended_use: clean(project.intendedUse),
    bedrooms_scale: clean(project.bedrooms),
    land_status: clean(project.landStatus),
    planning_status: clean(project.planningStatus),
    budget: clean(project.budget),
    target_start: clean(project.targetStart),
    decision_role: clean(project.decisionRole),
    project_notes: clean(project.notes),
    home_choice: effectiveHomeChoice,
    model_slug: isModelRoute ? clean(home.modelSlug || project.modelSlug) : '',
    model_name: isModelRoute ? clean(home.modelName || project.modelName) : '',
    placement_confirmed: placement.confirmed ? 1 : 0,
    placement_lat: num(placement.lat),
    placement_lng: num(placement.lng),
    placement_rotation: num(placement.rotation),
    attribution_source: normalisedAttribution.source,
    attribution_medium: normalisedAttribution.medium,
    attribution_campaign: normalisedAttribution.campaign,
    attribution_content: normalisedAttribution.content,
    attribution_term: normalisedAttribution.term,
    landing_page: normalisedAttribution.landingPage,
    referrer: normalisedAttribution.referrer,
    source_url: clean(payload.sourceUrl),
    message: clean(contact.message),
    raw_json: rawJson
  };

  const columns = Object.keys(row);
  const placeholders = columns.map(() => '?').join(', ');
  await env.DB.prepare(`INSERT INTO enquiries (${columns.join(', ')}) VALUES (${placeholders})`)
    .bind(...columns.map((column) => row[column]))
    .run();

  const files = form.getAll('files').filter((item) => item && typeof item !== 'string' && item.size > 0);
  const savedFiles = [];
  if (files.length) {
    if (!env.ENQUIRY_FILES) return json({ error: 'The enquiry was saved, but file storage is not configured.' }, 503);
    await ensureFileSchema(env.DB);

    for (const file of files) {
      const fileId = crypto.randomUUID();
      const safeName = (file.name || 'document').replace(/[^a-zA-Z0-9._-]+/g, '-').slice(-120);
      const key = `enquiries/${id}/${fileId}-${safeName}`;
      await env.ENQUIRY_FILES.put(key, file.stream(), {
        httpMetadata: { contentType: file.type || 'application/octet-stream' },
        customMetadata: { enquiryId: id, originalName: file.name || safeName }
      });
      await env.DB.prepare(`
        INSERT INTO enquiry_files (id, enquiry_id, r2_key, filename, content_type, size, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(fileId, id, key, file.name || safeName, file.type || '', file.size || 0, now).run();
      savedFiles.push({ id: fileId, name: file.name || safeName, size: file.size || 0 });
    }
  }

  await sendNotification(env, row);
  return json({ ok: true, id, reference, classification, files: savedFiles }, 201);
}

export async function onRequestPost(context) {
  try {
    return await handlePost(context);
  } catch (error) {
    return json({
      error: 'The enquiry could not be sent.',
      detail: error?.message || String(error || 'Unknown server error')
    }, 500);
  }
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: 'D1 binding DB is not configured.' }, 503);
  if (!authorised(request, env)) return json({ error: 'Unauthorised.' }, 401);
  await ensureEnquirySchema(env.DB);

  const url = new URL(request.url);
  const status = clean(url.searchParams.get('status'));
  const source = clean(url.searchParams.get('source'));
  const search = clean(url.searchParams.get('q'));
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || 100), 1), 250);

  const clauses = [];
  const binds = [];
  if (status && status !== 'All') { clauses.push('status = ?'); binds.push(status); }
  if (source) { clauses.push('attribution_source = ?'); binds.push(source); }
  if (search) {
    clauses.push('(reference LIKE ? OR contact_name LIKE ? OR contact_email LIKE ? OR site_location LIKE ? OR model_name LIKE ?)');
    const q = `%${search}%`;
    binds.push(q, q, q, q, q);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const result = await env.DB.prepare(`
    SELECT
      e.*,
      (SELECT COUNT(*) FROM enquiry_files f WHERE f.enquiry_id = e.id) AS file_count
    FROM enquiries e
    ${where}
    ORDER BY created_at DESC
    LIMIT ?
  `).bind(...binds, limit).all();

  return json({ enquiries: result.results || [] });
}
