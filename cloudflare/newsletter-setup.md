# Bauhu newsletter signup — experiment

Status: code committed to experiment/residences-sketch-hero. **Not live-ready until D1 migration and Cloudflare preview bindings are verified.**

## Set up in Cloudflare Pages
1. Apply `cloudflare/newsletter-schema.sql` to the existing D1 database associated with the Bauhu Pages `DB` binding. If testing with a separate preview D1 database, apply the same schema there.
2. Confirm Pages Functions environment binding `DB` points to the correct D1 database for both production and preview (prefer separate preview DB to prevent test email contamination).
3. Confirm `TURNSTILE_SECRET_KEY` is set to the corresponding secret for the site key in the newsletter form. The code intentionally fails closed if this is missing.
4. Test newsletter form via `/ux-lab/newsletter-welcome/` or `/newsletter/`. Check invalid email, unchecked consent, duplicate address, rate limiting, Turnstile failures, D1 missing/table missing, and success.
5. Verify unsubscribe confirmation using a test record token: `/api/newsletter/unsubscribe?token=<unsubscribe_token>` — requires an explicit button press before status changes.
6. Review and update `/privacy` to cover newsletter purpose, retention, contact rights and withdrawal before launching.
7. Before sending campaigns, append each recipient's unique unsubscribe URL from the database. Build an export/audience process that includes only `status='subscribed'`.

## Behaviour
- Form sends JSON to `POST /api/newsletter/subscribe`.
- Turnstile verification occurs server-side.
- Valid consent and timestamp are stored in `newsletter_subscribers` with subscribed status and a unique unsubscribe token.
- Duplicate active subscriptions respond successfully without inserting another record.
- Unsubscribed users are not silently reactivated.
- Welcome animation only appears following server-confirmed success.

## Important
No newsletter delivery or email sending has been built. No D1 migration or Cloudflare settings were changed by the GitHub commits. Production main stays unchanged.
