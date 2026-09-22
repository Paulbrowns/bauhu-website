const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

const authorised = (request, env) => {
  if (!env.LEADS_DASHBOARD_TOKEN) return false;
  return (request.headers.get('authorization') || '') === `Bearer ${env.LEADS_DASHBOARD_TOKEN}`;
};

export async function onRequestGet({ request, env, params }) {
  if (!authorised(request, env)) return json({ error: 'Unauthorised.' }, 401);
  const enquiry = await env.DB.prepare('SELECT * FROM enquiries WHERE id = ?').bind(params.id).first();
  if (!enquiry) return json({ error: 'Not found.' }, 404);
  const files = await env.DB.prepare('SELECT id, filename, content_type, size, created_at FROM enquiry_files WHERE enquiry_id = ? ORDER BY created_at').bind(params.id).all();
  return json({ enquiry, files: files.results || [] });
}

export async function onRequestPatch({ request, env, params }) {
  if (!authorised(request, env)) return json({ error: 'Unauthorised.' }, 401);
  const body = await request.json().catch(() => ({}));
  const allowedStatuses = ['New','Reviewed','Qualified','Contacted','Meeting','Proposal','Won','Lost','Nurture'];
  const current = await env.DB.prepare('SELECT id FROM enquiries WHERE id = ?').bind(params.id).first();
  if (!current) return json({ error: 'Not found.' }, 404);

  if (body.status && !allowedStatuses.includes(body.status)) return json({ error: 'Invalid status.' }, 400);

  await env.DB.prepare(`
    UPDATE enquiries
    SET status = COALESCE(?, status),
        owner = COALESCE(?, owner),
        internal_notes = COALESCE(?, internal_notes),
        updated_at = ?
    WHERE id = ?
  `).bind(
    body.status || null,
    typeof body.owner === 'string' ? body.owner.trim() : null,
    typeof body.internal_notes === 'string' ? body.internal_notes : null,
    new Date().toISOString(),
    params.id
  ).run();

  return json({ ok: true });
}
