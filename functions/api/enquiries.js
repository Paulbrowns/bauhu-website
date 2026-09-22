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

function classify(project = {}) {
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
  const subject = `${enquiry.reference} · ${enquiry.contact_name} · ${enquiry.site_location || 'Location not supplied'}`;
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
    `Source: ${enquiry.attribution_source || 'Direct / unknown'}`
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

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: 'D1 binding DB is not configured.' }, 503);
  if (!env.ENQUIRY_FILES) return json({ error: 'R2 binding ENQUIRY_FILES is not configured.' }, 503);

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
  const projectRoute = clean(project.route) === 'private' ? 'custom' : clean(project.route);
  const homeChoiceRaw = clean(home.homeChoice) === 'private' ? 'custom' : clean(home.homeChoice);
  const effectiveHomeChoice = projectRoute || homeChoiceRaw;
  const isModelRoute = effectiveHomeChoice === 'model';

  const contactName = clean(contact.name);
  const contactEmail = clean(contact.email);
  if (!contactName || !contactEmail) return json({ error: 'Name and email are required.' }, 400);

  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const reference = enquiryReference();
  const classification = classify(project);

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
    model_name: isModelRoute ? clean(home.modelName) : '',
    placement_confirmed: placement.confirmed ? 1 : 0,
    placement_lat: num(placement.lat),
    placement_lng: num(placement.lng),
    placement_rotation: num(placement.rotation),
    attribution_source: clean(attribution.utmSource),
    attribution_medium: clean(attribution.utmMedium),
    attribution_campaign: clean(attribution.utmCampaign),
    attribution_content: clean(attribution.utmContent),
    attribution_term: clean(attribution.utmTerm),
    landing_page: clean(attribution.landingPage),
    referrer: clean(attribution.referrer),
    source_url: clean(payload.sourceUrl),
    message: clean(contact.message),
    raw_json: JSON.stringify(payload)
  };

  await env.DB.prepare(`
    INSERT INTO enquiries (
      id, reference, created_at, updated_at, status, classification, owner, internal_notes,
      contact_name, contact_email, contact_phone, preferred_contact, consent,
      site_location, site_lat, site_lng, site_source,
      project_route, intended_use, bedrooms_scale, land_status, planning_status, budget, target_start, decision_role, project_notes,
      home_choice, model_slug, model_name,
      placement_confirmed, placement_lat, placement_lng, placement_rotation,
      attribution_source, attribution_medium, attribution_campaign, attribution_content, attribution_term, landing_page, referrer, source_url,
      message, raw_json
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?
    )
  `).bind(
    row.id, row.reference, row.created_at, row.updated_at, row.status, row.classification, row.owner, row.internal_notes,
    row.contact_name, row.contact_email, row.contact_phone, row.preferred_contact, row.consent,
    row.site_location, row.site_lat, row.site_lng, row.site_source,
    row.project_route, row.intended_use, row.bedrooms_scale, row.land_status, row.planning_status, row.budget, row.target_start, row.decision_role, row.project_notes,
    row.home_choice, row.model_slug, row.model_name,
    row.placement_confirmed, row.placement_lat, row.placement_lng, row.placement_rotation,
    row.attribution_source, row.attribution_medium, row.attribution_campaign, row.attribution_content, row.attribution_term, row.landing_page, row.referrer, row.source_url,
    row.message, row.raw_json
  ).run();

  const files = form.getAll('files').filter((item) => item && typeof item !== 'string' && item.size > 0);
  const savedFiles = [];
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

  await sendNotification(env, row);
  return json({ ok: true, id, reference, classification, files: savedFiles }, 201);
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: 'D1 binding DB is not configured.' }, 503);
  if (!authorised(request, env)) return json({ error: 'Unauthorised.' }, 401);

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
