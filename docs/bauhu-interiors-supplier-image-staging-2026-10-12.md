# Bauhu Interiors — staged supplier image integration (12 October 2026)

**Branch:** feature/bauhu-interiors. **Do not alter approved layout or any room/hero photography.**

## Source and prepared assets
- Google Drive: Projects / Product Data and Catalogs / KitBanho (15 PNGs); Sanindusa (9 JPGs).
- Cropped/optimised WebP files prepared in a local staging archive `bauhu-supplier-images-ready.zip`.
- The binary WebPs are **not yet in GitHub**. Do not change UI registry to point at paths until binary files have been uploaded, otherwise broken images result.

## Target GitHub paths
All 24 files belong under `public/images/interiors/suppliers/`, named:
```
dali-pine.webp
dali-walnut.webp
dali-grey.webp
pompeia-grey.webp
pompeia-white.webp
pompeia-earth.webp
sara-grey.webp
sara-white.webp
sara-blue.webp
sara-earth.webp
olimpo-earth.webp
olimpo-white.webp
olimpo-grey.webp
kloss-alt10.webp
kloss-alt2.webp
safira-8966802211-amb1-shower-screen.webp
9708007000-marina-star-shower-tray-grey.webp
9708007000-marina-star-shower-tray-beige.webp
9708007000-marina-star-shower-tray-black.webp
9708007000-marina-star-shower-tray-white.webp
urby-8046000000-freestanding-bath.webp
urby-8076000000-bathtub.webp
urby-140014004-back-to-wall-toilet.webp
urby-140912-1---close-coupled.webp
```

## Product integration rules
- Add entries in `src/data/interiors-supplier-photography.ts` and resolve exact furniture/basin range and proposed finish for each of the 12 designs. Keep exact finish status provisional if not approved.
- Kitbanho: Olimpo, Sara, Dali, Pompeia; Kloss STD alt.10 and alt.2.
- Sanindusa: URB.Y close coupled (existing Bauhu schedule code **140052004** remains unchanged), Marina Star tray, Safira shower screen; additional URB.Y back-to-wall and bath models for library.
- **Critical provenance distinction:** newly provided close-coupled photo is named `Urby-140912-1 - close-coupled.jpg`. User requests retaining the existing schedule code `140052004` with this new image; do NOT claim photo itself verifies code 140052004. Label image as illustrative/model-code reconciliation pending.
- Prefer neutral matching finishes by scheme. Don't assert a precise manufacturer colour solely from the descriptive file name.
- Register product source in Google Drive and keep the image/finish identity transparent.
- Only replace small product images on the **left** of the Finishes/Kitchens/Bathrooms cards, NOT the large **right-side** room photos.
- No changes to homepage structure, design heroes or other approved visual elements.
- Validate all image HTTP responses, Astro build, and Cloudflare preview after integration.

## Status
Preparation complete; binary transfer and site integration outstanding.
