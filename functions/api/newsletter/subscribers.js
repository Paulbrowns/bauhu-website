import { authorised } from '../_dashboard-auth.js';

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

export async function onRequestGet({ request, env }) {
  if (!(await authorised(request, env))) return json({ error: 'Unauthorised.' }, 401);
  if (!env.DB) return json({ error: 'Database unavailable.' }, 503);

  try {
    const [subscribers, stats] = await Promise.all([
      env.DB.prepare(`
        SELECT email, status, source, consent_at, consent_version, subscribed_at, unsubscribed_at
        FROM newsletter_subscribers
        ORDER BY created_at DESC LIMIT 1000
      `).all(),
      env.DB.prepare(`
        SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN status = 'subscribed' THEN 1 ELSE 0 END) AS subscribed,
          SUM(CASE WHEN status = 'unsubscribed' THEN 1 ELSE 0 END) AS unsubscribed
        FROM newsletter_subscribers
      `).first()
    ]);
    return json({
      subscribers: subscribers.results || [],
      stats: {
        total: Number(stats?.total || 0),
        subscribed: Number(stats?.subscribed || 0),
        unsubscribed: Number(stats?.unsubscribed || 0)
      }
    });
  } catch (error) {
    console.error('Newsletter dashboard fetch failed', error);
    return json({ error: 'Unable to retrieve newsletter subscribers.' }, 500);
  }
}
