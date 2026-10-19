const authorised = (request, env) => {
  if (!env.LEADS_DASHBOARD_TOKEN) return false;
  return (request.headers.get('authorization') || '') === `Bearer ${env.LEADS_DASHBOARD_TOKEN}`;
};

export async function onRequestGet({ request, env, params }) {
  if (!authorised(request, env)) return new Response('Unauthorised', { status: 401 });
  const file = await env.DB.prepare(
    'SELECT r2_key, filename, content_type FROM enquiry_files WHERE id = ? AND enquiry_id = ?'
  ).bind(params.fileId, params.id).first();
  if (!file) return new Response('Not found', { status: 404 });

  const object = await env.ENQUIRY_FILES.get(file.r2_key);
  if (!object) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  // Never serve user-supplied HTML, SVG or other active content inline on bauhu.com.
  const filename = String(file.filename || 'attachment').replace(/[\r\n"\\]/g, '_').slice(0, 120);
  headers.set('content-type', 'application/octet-stream');
  headers.set('content-disposition', `attachment; filename="${filename}"`);
  headers.set('x-content-type-options', 'nosniff');
  headers.set('content-security-policy', "sandbox; default-src 'none'");
  headers.set('cache-control', 'private, no-store');
  return new Response(object.body, { headers });
}
