# Legacy image URLs and AI-search visibility — 19 October 2026

## Evidence

Cloudflare HTTP logs show verified **AI Search** traffic receiving 404 and 422 for older image-service URLs under `img.bauhu.com/pr:sharp/...`. These requests reached the image origin; they are **not evidence of Cloudflare firewall blocks**. Other AI Search requests successfully fetched HTML pages at `bauhu.com` with HTTP 200.

## Recoverability and hosting boundaries

The current site stores model images at `https://bauhu.com/images/models/bauhu-<model>/...` and serves them through **Cloudflare Pages**. The old requests use the separate hostname `img.bauhu.com`; updating Pages `public/_redirects` for `bauhu.com` will **not** automatically fix that hostname. Examine its DNS and currently assigned image-service Worker/origin before attempting redirects. Do not replace the hostname or claim image equivalence without checking the pictures.

## Candidate model-level matches for manual visual verification

| Legacy source image filename seen in AI Search logs | Candidate model folder on Pages | Confidence |
| --- | --- | --- |
| `firefly-11.jpg`, `firefly-4.jpg` | `/images/models/bauhu-firefly/` | Model-name match only; image identity unconfirmed |
| `angel-7.jpg`, `angel-13.jpg` | `/images/models/bauhu-angel/` | Model-name match only; image identity unconfirmed |
| `caribbean-cottage-18.jpg` | `/images/models/bauhu-caribbean-cottage/` | Model-name match only; image identity unconfirmed |
| `red-hawk-ridge19_900x506.jpg` | `/images/models/bauhu-red-hawk-ridge/` | Model-name match only; image identity unconfirmed |
| `casa-lavanda20_900x506.jpg` | `/images/models/bauhu-casa-lavanda/` | Model-name match only; image identity unconfirmed |
| `grenada-luxe-two-bed11_900x506.jpg` | `/images/models/bauhu-grenada-luxe/` | Model-name match only; image identity unconfirmed |
| `north-beach2_900x506.jpg` | `/images/models/bauhu-north-beach/` | Model-name match only; image identity unconfirmed |
| `coral-bay.jpg`, `ps-antigua.jpg`, `whale-point34_900x506.jpg` | To be determined | Do not redirect without matching source asset |

## Proposed safe recovery

1. Export the top image-service 404/422 URLs by hits and referring/indexed pages.
2. Decode the base64 source segment after `/g:sm/` to identify original asset filenames, then check the original media archive.
3. Visually verify the actual old and new image are the same (not merely the same model). Record exact target image paths and maintain a small mapping table.
4. On the **existing** `img.bauhu.com` service, implement exact 301 redirects only for verified mappings. Leave unmatched URLs as 404/410. Do not redirect every missing image to a model hero.
5. Validate HTTP status, `Location` and `Content-Type`, verify 200 on the target WebP, and compare Cloudflare AI Search logs.

## Current AI-search foundation and next checks

- `robots.txt` permits OAI-SearchBot, Bingbot and other named crawlers.
- The Astro sitemap, canonicals, Organisation/WebSite JSON-LD and `llms.txt` already exist.
- The dynamic model page template now emits factual, model-specific Product JSON-LD on the preview branch; this deliberately omits unconfirmed prices, availability and reviews.
- Monitor **verified OAI-SearchBot** by user agent and HTTP status separately from Apple's AI Search category; the latter's successful traffic does not establish OpenAI's status.
- After model-schema deployment, validate several model pages with a structured-data validator and verify HTML contains the correct model values.
