# Bauhu Interiors — Architectural drawing schedule mapping

## Purpose

Translate a customer's simple six-category Design Studio selections into the structured schedules already used by Bauhu's architectural team. This schema is informed by a supplied 49-page architectural drawing set dated October 2026 (A21, A23, A36, A41–A45). The original client drawings, their location, and client identity **must not** be placed in the public website repository, nor shown in the public Design Studio.

## Key distinction

**Customer-facing**: collection, room/area, product photograph, proposed material/colour, notes, and a clearly marked draft/approval status.

**Architect / procurement-facing**: exact manufacturer reference, dimensions, finish code, units, quantities, room IDs, drawing schedule item, approval record, contract inclusion, and BOM linkage.

These are two views over one selection record. Do not require customers to enter construction quantities, technical dimensions or manufacturer codes just to express their design preferences.

## Canonical selection record (proposed)

```json
{
  "project_id": "assigned internally",
  "category": "bathrooms",
  "room_id": "assigned from architectural room schedule",
  "position_id": "unique scheduled item",
  "selection_label": "Client-readable product description",
  "manufacturer": "approved manufacturer",
  "product_family": "range or collection",
  "manufacturer_product_code": "exact approved catalogue reference",
  "colour_finish_name": "finish description",
  "colour_finish_code": "supplier / RAL / paint code when applicable",
  "dimensions_mm": null,
  "unit": "each",
  "quantity": null,
  "drawing_sheet": "source schedule",
  "source_catalogue_url": null,
  "source_verified_at": null,
  "commercial_status": "included_or_review_required",
  "approval_status": "draft",
  "approved_revision": null,
  "bom_reference": null,
  "scope_owner": "Bauhu or by others, contract controlled",
  "notes": null
}
```

This is a **proposed schema**, not a deployed backend contract.

## Existing drawing practice mapped into the Studio

| Architectural reference | Real-life schedule fields | Proposed system output |
| --- | --- | --- |
| A21 Openings | opening ID, type, size, count, frame finish RAL, door style, handle reference | Exterior + interior door schedules |
| A23 Room finishes | room ID, floor tile, grout, ceiling paint, wall paint, wet-area tile | Room-by-room finish schedule |
| A36 Bathroom schedule | manufacturer/model/reference, finish, dimensions, quantity, room assignment | Bathroom fixture and fitting schedule |
| A37–A40 Bathroom plans and axonometrics | room layouts and placement | Room-specific visual coordination; no automatic geometric inference |
| A41–A42 Kitchen plans and 3D | cabinetry layout, position, dimensions | Architect-reviewed kitchen schedule |
| A43 Kitchen finishes | upper/lower front, carcass, worktop, handles, sink, mixer, tiling | Component-specific kitchen specification |
| A45 Finishes | interior and exterior ceramics, grout, façade coating, paint codes, aluminium RAL, joinery | Consolidated client approval schedule |

## What this adds beyond the current prototype

1. One room can have more than one material: floor ceramic, wall ceramic, feature tile, grout and paint can all be different records.
2. A finish may apply to multiple rooms; reuse a material record but schedule quantities separately.
3. A kitchen front is not enough: distinguish upper fronts, base fronts, islands, carcasses, counters, handles, sink and mixer.
4. Bathrooms require separate fixtures with different dimensions and quantities for each room; avoid treating a whole bathroom as one selected item.
5. Exact supplier codes and quantities belong in the approved output; conceptual swatches in the public Studio must not be misrepresented as accurate samples.
6. Scope is item-specific: a drawing may show a product or finish that Bauhu does not supply. Preserve the **by-others** flag distinctly from an optional paid upgrade.
7. Document status must move through draft → design review → client approval → released specification. Do not automatically treat a local-browser draft as approval or procurement authorisation.

## Design recommendation

Use the existing Studio for visual decisions. When the client selects a home/project, progressively reveal room-level choices (particularly kitchen and multiple bathrooms), while keeping the rest of the interface simple. After the final customer choice, Bauhu's team should check technical compatibility, quantities, supply scope and any exceptions, then issue a versioned approval schedule.

## Privacy and use of reference drawings

The supplied drawing set is for **internal process understanding**, not a public case-study asset. Never publish its pages, client details, project address or proprietary technical sheets without permission. This mapping intentionally contains no customer-specific selection records.
