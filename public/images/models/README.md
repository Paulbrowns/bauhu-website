# Bauhu model image folders

Each Bauhu model has its own folder inside `public/images/models/`.

Use this structure:

```txt
public/images/models/{model-slug}/
  {model-slug}.webp
  1.webp
  2.webp
  3.webp
  4.webp
  floorplan.webp
```

Example:

```txt
public/images/models/bauhu-sunset-cove/
  bauhu-sunset-cove.webp
  1.webp
  2.webp
  3.webp
  4.webp
  floorplan.webp
```

The model selector page uses `{model-slug}.webp`.

The `/homes/{slug}` page uses the hero image, the numbered images, and the floor plan image.

Missing gallery images are hidden automatically on the page. Missing hero images fall back to `/images/model-placeholder.svg`.
