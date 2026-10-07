# Checkpoint: Commercial infrastructure and partner route

Date: 2026-10-07
Branch: main

## Website state

The Bauhu website has been updated beyond the main design rebuild into commercial infrastructure, AI/search discoverability, attribution and partner acquisition.

## Key changes included in this checkpoint

### AI/search resource links

Four AI/search-oriented resource pages have been created and are now linked discreetly from FAQ answers on `/resources`:

- `/resources/hurricane-resistant-homes-caribbean`
- `/resources/building-on-remote-island-sites`
- `/resources/steel-frame-homes-coastal-locations`
- `/resources/prefab-modular-homes-bahamas-caribbean`

These are also listed in `/llms.txt`.

### Partner and contractor route

A new partner route has been added:

- `/work-with-bauhu`

This page is intended for contractors, assembly teams, local delivery partners, engineers, consultants, logistics partners, developers, landowners and introducers.

The partner form posts into the existing `/api/enquiries` system using:

- `project_route: partner`
- `classification: Partner`
- `source: partner-page`
- `campaign: partner-network`

The footer now includes a discreet `Work with Bauhu` link.

### Tracking and attribution

Site-wide attribution capture has been added through:

- `/public/lead-attribution.js`

This captures first-touch and last-touch attribution, UTMs, click IDs, referrer, landing page, current page and AI/referral sources where detectable.

The existing Bauhu.com tracking setup has been restored into the new site:

- Matomo tracker: `https://bauhu.com/analytics/`
- Matomo site ID: `1`
- Meta Pixel ID: `684657639337711`
- Facebook domain verification: `iticng9m7v8xbubpf69c08sbu6ycyv`

No Google Analytics or GTM has been added because Bauhu does not use Google Analytics.

### Leads API

The enquiries API has been updated to support partner lead classification and richer source data in lead payloads and notification emails without a database migration.

### Commercial playbook

A no-index internal commercial follow-up page has been added:

- `/commercial-playbook`

It contains response frameworks for qualified leads, nurture leads, partner/contractor enquiries and documentation requests.

### UI polish

The `/work-with-bauhu` hero label has been corrected so `Work With Bauhu` displays as a small, uppercase, gold kicker consistent with the rest of the site.

## Current known follow-up items

- Test `/work-with-bauhu` form submission on the deployed site.
- Confirm Partner leads display usefully in `/leads/`.
- Confirm Matomo receives page views from the new deployment.
- Confirm Meta Pixel fires PageView and partner/lead events in Meta Events Manager.
- Review whether `/commercial-playbook` should remain hidden/no-index or be protected later.
- Connect Meta Ads reporting/management through Windsor.ai Facebook Ads if direct campaign management from ChatGPT is required.

## Notes

This checkpoint intentionally avoids adding Google Analytics. Tracking is based on existing Bauhu Matomo and Meta assets only.
