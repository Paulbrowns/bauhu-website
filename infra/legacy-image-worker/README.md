# Bauhu legacy image URL rescue (isolated Worker)

Purpose: restore historically crawled `img.bauhu.com/pr:sharp/.../g:sm/...` URLs by responding **301** to the exact corresponding model WebP images now hosted at `https://bauhu.com`.

## Safety / scope

- **Not deployed to production by adding this folder to GitHub.** The main site remains on Cloudflare Pages.
- No `routes`, `account_id`, or `custom_domain` in Wrangler. Test the *.workers.dev deployment first.
- The legacy DNS currently points to a Cloudflare Tunnel in another or former account. Do **not** change DNS, disable the tunnel, or attach `img.bauhu.com` before confirming ownership of routing and rollback strategy.
- The Worker intentionally **does not replicate Sharp resizing/watermarking**. For 11 visually verified original photographs, it permanently redirects to the equivalent WebP (which has its own full-size rendition). Changing from JPG to WebP and dimensions may matter to external embeds; this is an SEO-preservation redirect, not pixel-perfect image service compatibility.
- Unknown legacy image URLs return 404. Since some might still work on the old endpoint, inspect latest logs and expand the mapping before cutover. Never blanket-redirect unmatched URLs.
- Original `ps-antigua.jpg` is recovered in conversation but not yet verified published on Pages, so it is deliberately excluded.
- Other known candidates from 2026-10-20 logs: `point-eleuthera20_900x506.jpg`, `ps-elbow-cay.jpg`, `quinta-de-lago19.jpg`, `chameleon14_900x506.jpg`, `the-coconut-cottage8.jpg`, and multiple `slides/onsite_*.jpg`. Add **only after** verifying the image and hosted target.

## Deployment/test sequence

1. Merge this isolated infrastructure folder when reviewed; it has no impact on Pages build.
2. In Cloudflare Workers create Worker `bauhu-legacy-images`, paste `src/index.js` (or deploy with Wrangler from this folder). **Initially use only its workers.dev URL.**
3. Test:
   - Encoded URL for `angel-7.jpg`: expect 301 to `https://bauhu.com/images/models/bauhu-angel/angel-7.webp`.
   - Old URL for `firefly-11.jpg`: expect 301 to the exact file.
   - Unrecognised legacy image: expect 404, not a bad substitute.
   - `robots.txt`: expect 200.
   - Verify the redirected WebPs load with HTTP 200 and `image/webp`.
4. Determine whether a Cloudflare Worker **route** on `img.bauhu.com/*` can intercept the existing proxied tunnel hostname. Check the route in the correct Cloudflare zone/account, and test on a nonproduction hostname first when possible.
5. Only then set the route for `img.bauhu.com/*`. Keep an immediate rollback path (remove the Worker route). Confirm old requests return 301, target images return 200, and no other useful image paths became broken.
6. Review Cloudflare Observability logs after cutover, add selective mappings for valuable missing files, and keep the old hosting until all required files have been safely recovered.

## Parser notes

The legacy image endpoint encoded its original absolute HTTP image URL after `/g:sm/` as unpadded base64url, sometimes with an extra `.jpg` suffix, or used a `plain/http://...` variant. Only `bauhu.com/assets/images/...` sources that exactly match a vetted filename are allowed. This prevents open redirects.

## Tests

`node --test infra/legacy-image-worker/test/index.test.mjs` from repo root.
