# Bauhu enquiry backend (Cloudflare Pages)

The website now expects two Cloudflare bindings:

- D1 binding: `DB`
- R2 binding: `ENQUIRY_FILES`

It also supports these environment variables/secrets:

- `LEADS_DASHBOARD_TOKEN` — required to read/update the internal Leads dashboard.
- `RESEND_API_KEY` — optional, enables email notifications.
- `ENQUIRY_NOTIFICATION_EMAIL` — optional recipient for new-enquiry alerts.
- `ENQUIRY_NOTIFICATION_FROM` — optional sender, defaults to `Bauhu Website <enquiries@bauhu.com>`.

## D1 setup

Create a D1 database for website leads, bind it to the Pages project as `DB`, then run:

`cloudflare/enquiries-schema.sql`

against that database.

## R2 setup

Create a private R2 bucket for enquiry documents and bind it to the Pages project as `ENQUIRY_FILES`.

Files are never exposed as public R2 URLs. The internal dashboard requests them through an authenticated Pages Function.

## Leads dashboard

The dashboard lives at:

`/leads`

It asks for the value of `LEADS_DASHBOARD_TOKEN` and stores that token in sessionStorage only.

## Submission

`/project-contact` posts a multipart form to `/api/enquiries`.
The structured enquiry is written to D1 and supporting files are written to R2.
