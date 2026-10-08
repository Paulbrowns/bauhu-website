# Bauhu website checkpoint — tested release candidate

Date: 2026-10-08
Branch: main
Repository: Paulbrowns/bauhu-website

## Status

The current Bauhu website build has been manually tested across the main pages and active website functions. The user has confirmed that all tested pages and functions now seem good.

This checkpoint records the current working state after the final site-fit, enquiry, mobile, desktop and file-upload fixes.

## Confirmed working

- Core pages have been reviewed/tested by the user.
- Site-fit flow works on desktop and mobile.
- Site-fit map supports desktop zoom/trackpad behaviour while keeping mobile scroll-safe behaviour.
- Site-fit map is intended to remain focused on the Caribbean / nearby hurricane-exposed region.
- Mobile site-fit journey now uses a clearer flow:
  - place or drag the pin;
  - confirm the location;
  - then reveal the prominent `Continue to project details` CTA.
- `Continue to project details` is hidden until the location is confirmed.
- `Continue to project details` has been restyled as a more polished pill CTA.
- Pin labels have been cleaned up, including replacing `Adjusted map point` with `Dropped pin`.
- Project details and contact steps submit correctly.
- Desktop file attachments upload correctly with the enquiry.
- Mobile file attachments now upload correctly with the enquiry.
- Enquiry API has been hardened to return JSON errors and avoid blocking successful enquiries unnecessarily.
- D1 enquiry saving is working.
- R2 attachment upload path is working on desktop and mobile.
- Footer and mobile layout issues previously reported have been addressed.
- FAQ/resource links and AI/search-oriented resource routes remain in place.
- Tracking/attribution scripts, Meta Pixel and Matomo are installed in the base layout.

## Recent important fixes included in this checkpoint

- Mobile site-fit map usability improvements.
- Desktop map scroll/trackpad zoom restored.
- Mobile and desktop map/location CTA flow cleaned up.
- Mobile step 3 enquiry failure with attached files fixed.
- Attachment handling now works on both desktop and mobile.
- Enquiry API made more defensive around D1 schema, JSON errors and file upload warnings.
- Site-fit CTA polished into a pill-style button.
- Map pin wording changed to `Dropped pin`.

## Notes for future work

- Before launch, verify Cloudflare production bindings are present:
  - `DB`
  - `ENQUIRY_FILES`
  - `LEADS_DASHBOARD_TOKEN`
- Resend is not being used as part of the current operating setup.
- If further map constraint issues are observed on desktop, review Leaflet `maxBounds`, zoom level, and whether the visible viewport can show areas outside the constrained pan bounds at low zoom.
- Final production DNS / custom-domain migration remains a separate launch step.

## Checkpoint intent

This file marks the current site as a tested release-candidate state from the user’s perspective, suitable as a reference point before domain/DNS launch work or any further feature changes.
