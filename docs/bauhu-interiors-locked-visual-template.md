# Bauhu Interiors — locked visual specification (09 October 2026)

## Approved customer-facing template — do not redesign

For **each individual design** (12 total: Coastal 01–03, Contemporary 01–03, Signature 01–03, Tropical 01–03):

1. **One photorealistic interior hero** showing the complete aesthetic; **no exterior-only building image**. The hero's cabinetry, tile/stone, metal and paint tones must correspond to the design's selections.
2. **One overall editorial mood board**: a compelling tactile material flat-lay or art-directed composition explaining the complete design language. No website mockup, pricing, product cataloguing or dense captions embedded in this artwork.
3. **Three product-specific visual cards** below the overall board: **Finishes**, **Kitchens**, **Bathrooms**. They can be arranged as tactile styled objects and material fragments. Product identification is not required within the board imagery itself.
4. **Separate Bauhu ID / supplier product list** lower on the page, for genuine exact references, manufacturer photos, quantities, project-specific cost variations and approval status later.

This is the last user-approved layout. **Do not add a second row of hero photography above the category boards**, and do not replace editorial boards with a dropdown-led configurator.

### Artwork guidance

- Photorealistic natural daylight, tactility, believable stone, cabinetry, ceramic, plaster, metal and painted finishes; editorial interior-design photography, restrained styling.
- The specific **tile colour, undertone, sheen, wood grain, cabinetry front colour and metal finish** visible on the board should plausibly represent the curated product ranges. Mood-board imagery remains a **design interpretation**, not a manufacturer-certified colour swatch.
- Supplier products and images belong in the specification record; visual boards can be artistic *while materially honest*.
- For each design create **five independent optimised WebP assets**: `<collection>-<design>-hero.webp`, `...-overall.webp`, `...-finishes.webp`, `...-kitchens.webp`, `...-bathrooms.webp`. Published paths: `/images/interiors/`.
- **Never reuse Coastal Natural boards** as a fallback for differently coloured collections. Missing images must be visibly labelled as in preparation or shown as a nonphotographic palette study.
- The product references in `src/data/interiors-curated-schemes.ts` are **provisional Bauhu design selections**. Don't imply exact variant, availability, inclusion or supplier confirmation before verification.

## Collection character, distinct from price tiers

| Collection | Character | Illustrative palettes |
|---|---|---|
| **Contemporary** | Crisp precision, quiet geometry, modern minimal cabinetry | Pure: light porcelain and silver; Graphite: cool stone and deep grey; Mineral: linen, stone beige and charcoal |
| **Signature** | More layered, crafted, warm and distinctive, without changing supplier quality tier | Atelier: walnut and warm taupe; Gallery: refined stone and warm ivory; Noir: deep timber, graphite and pale mineral |
| **Tropical** | Sunlit, grounded island architecture with restrained botanical tones | Canopy: natural wood and sage; Lagoon: water tones and ivory; Terracotta: sand, terra and clay |
| **Coastal** | Gentle sea-facing interiors, light materials and relaxed elegance | Natural: sand and pale stone; Ocean: sea mist and chalk; Refined: taupe, walnut and anthracite |

## Fixed purchasing rules across all designs

- **Sto Stolit K fine grain, RAL 9003 Signal White** external render; this is **not selectable**.
- **Cortizo exterior frame colours: RAL 9010 Pure White or Anthracite only**. Anthracite RAL/code still to be verified.
- **CIN Cináqua GC 300 / 10300** for **both walls and ceilings**; palette shades each need exact CIN reference.
- **Dominó floors**: Pantanal, Lodge, Nordic, Feel Good, Ecoliving, New York, Urban. **Walls**: Atlas, Uptown, Tokyo, Mundi, Crystal, Geo, Habitat, Cube.
- **Nobilia** fronts: Nordic, Natura, Laser, Senso, Sylt, Cascada.
- **Bruma kitchen**: Ginger 1227003, Chrome or Black. **Bathroom**: Nautic, Avalon, Adamaster (manufacturer spelling requires confirmation), Breeze, with **basin and shower matching range and colour per bathroom**.
- **Sanindusa** URB.Y toilets 140014004 / 140052004; Marina Star trays; Safira enclosures; URB.Y and URB.Y Plus bathtubs 8076000000 / 8046000000.
- **Kitbanho** Olimpo, Sara, Dali, Pompeia vanity ranges; Kloss STD alt.10 and alt.2 washbasins.
- **Compincar** Lisa, Model 301, Model 302 interior doors.

## Implementation status (2026-10-09)

- **Coastal Natural, Ocean and Refined**: existing photographic hero and three individual mood-board artworks live under `public/images/interiors/`; an overall editorial board is currently composed from the three existing images rather than a dedicated flat-lay.
- **Contemporary Pure, Graphite, Mineral**: five separate optimised WebP assets each (interior hero, overall flat-lay, Finishes, Kitchens and Bathrooms) published and wired to the branch preview.
- **Signature Atelier**: five separate optimised WebP assets published and wired.
- **Signature Gallery and Noir; Tropical Canopy, Lagoon, Terracotta**: supplier drafts, matching page templates and placeholder swatches exist; **no new photographic asset set** has been published yet. Do not mark these as finished.
- `/interiors/` landing page is deliberately awaiting final imagery.
- The client-approved page design is implemented in `src/components/InteriorsDesignPresentation.astro`; do not redesign.
- Keep `main` / production untouched without the owner's approval.

## Verification checklist before calling a collection finished

- Hero is an **interior**, looks materially compatible with the board's selected tile and cabinet tones.
- Overall board matches the three product-specific boards.
- Finishes board shows **floor tile, wall tile, paint, render, Cortizo frame and Compincar door**.
- Kitchen board includes **front, handles, countertop, sink and Ginger kitchen faucet**.
- Bathroom board includes **Kitbanho vanity, Kloss basin, matching Bruma tap/shower range and selected wall tile**.
- Fixed Sto RAL 9003 is never rendered as an optional colour.
- Only approved supplier ranges appear in the specification list; actual model-specific claims are clearly marked for review.
- Distinct photographic artwork does not accidentally duplicate another design.
- Cloudflare preview build and browser rendering checked separately. GitHub's green Cloudflare check does **not** prove the user's Cloudflare account UI is available.
