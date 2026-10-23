# Project image publishing — Google Drive → WebP → R2

This workflow publishes prepared **WebP project photographs** to Cloudflare R2. It does not alter the live website, delete R2 objects, or alter the Google Drive originals.

## One-time Cloudflare setup

1. Create or choose an R2 bucket reserved for Bauhu website project images.
2. In Cloudflare R2, create an **R2 API token** with **Object Read & Write** permissions limited to that bucket. Do not use your Global API Key.
3. In GitHub → `Paulbrowns/bauhu-website` → Settings → Secrets and variables → Actions, add these four **repository secrets**:
   - `R2_ACCOUNT_ID` — Cloudflare account ID
   - `R2_ACCESS_KEY_ID` — R2 token Access Key ID
   - `R2_SECRET_ACCESS_KEY` — R2 token Secret Access Key
   - `R2_BUCKET` — destination R2 bucket name
4. Configure a public custom domain for the bucket, such as `images.bauhu.com`, separately. **Do not replace website image URLs until the public domain and images have been verified.**

Never paste credentials in chats, PRs, or repository files.

## Per-project publishing

1. Select genuine project photographs from the Bauhu Google Drive project folder.
2. Convert to appropriately sized WebP, preserve useful descriptive context, and prepare SEO-friendly filenames and image-specific alt text. Keep a separate metadata manifest: browser alt text belongs in HTML, not just embedded in the WebP.
3. Stage approved WebP files under `assets/r2-projects/<project-slug>/` on a review branch. **Do not commit the original full-resolution photos.** Consider removing staging assets from Git after upload, or use Git LFS / an authenticated upload route as the collection scales.
4. Once the uploader workflow is available on the default branch, open GitHub → Actions → **Upload Bauhu project WebP images to R2** → Run workflow. Set `project_slug`, keep `dry_run=true` first.
5. After checking the proposed list, run with `dry_run=false`. Each object is uploaded to `projects/<project-slug>/<filename>.webp`, with `Content-Type: image/webp` and long-lived cache control. Objects are checked after upload. Files are **not** automatically removed from R2.
6. Verify the public image URLs, then update project data records and alt text through a separate site PR. Preview and approve before merging.

For the initial pilot, use `exuma-waterfront`. The existing Squarespace URLs remain as-is until the R2 images are reachable.

## Security / limits

- Upload workflow is **manual only**, not triggered by pushes.
- Its first-run default is validation only.
- Only lowercase alphanumeric/hyphen project slugs and genuine WebP files are accepted.
- R2 token must be scoped to the bucket; the uploader never needs bucket administration rights.
- This is the GitHub staging variant, **not yet a direct Google Drive-to-R2 importer**. Large galleries may warrant a dedicated upload pipeline that avoids committing images to Git.
