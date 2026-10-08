# Bauhu Interiors — sourcing and launch register

Status: editorial prototype / NOT YET A CUSTOMER PRODUCT CATALOGUE.

## The rule

The Interiors service concerns only six fixed architectural categories in the Bauhu home package: external façade/openings, fitted kitchens, sanitary ware and bathrooms, ceramics, internal doors and hardware, and interior wall/ceiling paint. Furniture, rugs, curtains, decorative light fittings, artwork, loose accessories and styling are excluded.

The four public collections (Coastal, Contemporary, Signature, Tropical) are style directions, not different price or quality grades. Default finish selection remains part of the home purchase; professional design assistance is optional and chargeable. Confirm scope of supply against the individual home contract; never imply every catalogue product is automatically included.

## Supplier data needed before interactive selection

For each approved selectable option, record:
- category / room application
- manufacturer, series and product reference
- exact finish name and colour code (not a screen-derived approximation)
- image asset, manufacturer source URL, and recorded supplier permission (Bauhu confirms permission to use suppliers' website images; retain image attribution and source metadata)
- format/dimensions where relevant
- technical suitability and regional restrictions (e.g. slip resistance in wet areas; availability; specifications)
- supplied as standard / may require adjustment / by quotation (internal status; no invented retail pricing)
- substitution and lead-time controls
- source catalogue URL and date of verification
- approver, revision and approval date

## Source-to-category mapping

| Category | Evidence from 2026 Bauhu décor brochure | Missing before customer launch |
| --- | --- | --- |
| Exterior | Sto façade system; render grain and through-tint colour; aluminium frames with typically anthracite or white colourways | Exact Sto shade/grain codes and frame colour range for each project |
| Kitchens | Made-to-order cabinetry, carcass/front/handle/worktop selections, sink and faucet | Current manufacturer's catalogue, approved codes and kitchen-specific schedule |
| Bathrooms | Wall-hung vanities, composite integrated basin, white ceramics, chrome mixers; BRUMA water-saving fittings | Current approved vanity, sanitary, Bruma faucet references |
| Ceramics | Portuguese ceramic manufacturer; large-format interior floors and wall tiles | Approved factory and product line, format, application and slip specifications |
| Doors | Matt lacquer or oak/walnut/wenge/beech veneer direction; door hardware | Exact supplier profiles, veneer/paint code and handle reference |
| Paint | RAL or Pantone colour-based interior paint selection | Paint brand/product, coating/specification and final matched approved colour |

## Design collection content policy

1. Treat concept palettes as **inspiration only** until mapped to actual approved products.
2. If project photography is used, do not imply the photograph proves a particular finish is orderable.
3. A customer selection is not an order until approved and recorded in the project's finish schedule.
4. Do not place external supplier catalogues at the centre of the customer journey; an approved curated library should ultimately supply the choices.
5. For visualisation, state clearly that any furniture and accessories are illustrative and not supplied.

## Approval and workflow

1. Confirm source catalogue and commercially available finish range.
2. Assign supplier product codes to each collection direction.
3. Build customer selectors from the approved range only.
4. Allow saved drafts, but label them **not yet approved**.
5. Capture sign-off on a versioned final finishes schedule.
6. Transfer approved references to procurement/BOM only after project review.

## Preview / release checklist

- [x] Shared Bauhu site styling, navigation, mobile link
- [x] Interiors landing page with home-first and style-first pathways
- [x] Four collection pages with six architectural finish groups
- [x] Explicit no-furniture scope and inclusive-selection policy
- [ ] Verify image suitability and permission for each use
- [ ] Verify manufacturers' current ranges and product codes
- [ ] Load approved material photographs/swatches
- [x] Add preliminary selection controls, browser-only draft persistence, import/export and print/copy summary
- [ ] Replace indicative swatches with licensed, supplier-matched approved materials
- [ ] Add authenticated customer project association and durable server-side draft storage
- [ ] Implement professional-service enquiry and agreed pricing
- [ ] Build and visually QA at mobile/tablet/desktop
- [ ] Deploy to non-production Cloudflare preview
- [ ] Review copy, scope and functionality before production merge

## Design Studio prototype limitations (October 2026)

The working prototype at `/interiors/studio/` offers six-category draft selections, illustrative clickable colour chips for selected finishes, local browser saving, JSON export/import, printable specification summary, and copy-to-clipboard sharing. These features are not an order form or approval workflow. A draft is not accessible on another device unless the user explicitly exports and imports it. Browser history/storage clearing may erase local drafts. No actual project BOM or payment workflow is connected. The display colours are **not** manufacturer-accurate colour chips or proof of supply.

## Supplier imagery authorisation

Bauhu confirms it has permission from its suppliers to use images from their websites for Bauhu Interiors. This enables genuine catalogue photography and product images in the customer-facing library. Record the original manufacturer URL, product reference, asset filename and retrieval date. Do not confuse permission to reuse imagery with confirmation that every pictured product is available or included in an individual Bauhu home. Keep customer-specific technical drawings and personal information private.
