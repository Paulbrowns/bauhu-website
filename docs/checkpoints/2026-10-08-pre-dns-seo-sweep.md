# Pre-DNS SEO migration sweep — 2026-10-08

Status: release-candidate SEO migration check completed before moving bauhu.com DNS to the new Cloudflare Pages deployment.

## Summary

The main organic-search protection work is in place. The current build is suitable for DNS cutover once final Cloudflare custom-domain/DNS settings are confirmed.

## Confirmed in repo

- `astro.config.mjs` sets the production site URL to `https://bauhu.com`.
- Astro sitemap integration is enabled.
- `public/robots.txt` allows crawling and points to `https://bauhu.com/sitemap-index.xml`.
- Base layout generates canonical URLs from the production Bauhu domain.
- Canonical and Open Graph URLs now normalize page routes to the trailing-slash version to reduce duplicate canonical variants.
- Internal commercial playbook remains `noindex`.
- AI/search discovery file `public/llms.txt` points to the final `bauhu.com` URLs.
- Key legacy SEO pages exist as first-class pages:
  - `/off-the-shelf-modular-homes/`
  - `/steel-frame-home-kits/`
  - `/bespoke-modular-homes/`
  - `/modular-residential-projects/`
- Search/AI resource pages exist and are linked from Resources/FAQ content.
- Main commercial routes are present:
  - `/site-fit/`
  - `/project-details/`
  - `/project-contact/`
  - `/work-with-bauhu/`
- Enquiry flow and file uploads have been user-tested on desktop and mobile.

## Redirect coverage

`public/_redirects` preserves key legacy routes, including:

- `.html` versions of high-value SEO landing pages.
- Legacy `/developments` route to `/remote-locations`.
- Legacy `/downloads`, `/faq`, `/reviews`, `/about`, `/contact` routes.
- Legacy Element model routes such as `/homes/element-eon` to current model routes such as `/homes/eon`.
- Generic old `/homes/:slug.html` model route handling.
- Legacy `/news/*` and `/project-news/*` to `/projects`.
- Site placement/project route consolidations.

Public search checks surfaced indexed legacy URLs including `/homes/element-eon` and `/news/angel-exuma`; both are covered by existing redirect rules.

## Final launch checklist

Before DNS cutover:

1. Confirm Cloudflare Pages custom domains are ready for `bauhu.com` and `www.bauhu.com`.
2. Preserve all email DNS records.
3. Confirm how Matomo `/analytics/` will continue to resolve after DNS cutover.
4. Wait for the latest deployment containing canonical normalization.
5. Spot-test preview routes after deployment:
   - `/`
   - `/models/`
   - `/homes/eon/`
   - `/resources/`
   - `/site-fit/`
   - `/project-details/`
   - `/work-with-bauhu/`
   - `/off-the-shelf-modular-homes/`
   - `/steel-frame-home-kits/`
6. Immediately after DNS cutover, test:
   - `https://bauhu.com/robots.txt`
   - `https://bauhu.com/sitemap-index.xml`
   - key old redirects such as `/homes/element-eon`, `/news/angel-exuma`, `/steel-frame-home-kits.html`.
7. Submit the sitemap in Google Search Console.
8. Monitor Search Console, Matomo, Cloudflare Pages logs, 404s, leads dashboard and enquiry file uploads for the first 48 hours, then weekly.

## Notes

The migration is not risk-free; organic visibility can fluctuate temporarily after a site move. The main structural protections are in place: production canonicals, sitemap, crawl permissions, redirects, preserved high-value landing pages, internal linking and post-launch monitoring plan.
