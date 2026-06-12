# Bauhu model image folders

Each Bauhu model should have its own folder inside `public/images/models/`.

Use this structure:

```txt
public/images/models/{model-slug}/
  {model-slug}-hero.webp
  {model-slug}-01.webp
  {model-slug}-02.webp
  {model-slug}-03.webp
  {model-slug}-floor-plan.webp
```

Example:

```txt
public/images/models/bauhu-sunset-cove/
  bauhu-sunset-cove-hero.webp
  bauhu-sunset-cove-01.webp
  bauhu-sunset-cove-02.webp
  bauhu-sunset-cove-03.webp
  bauhu-sunset-cove-floor-plan.webp
```

The model selector page uses `{model-slug}-hero.webp`.

The `/homes/{slug}` page uses the hero image, three numbered images, and the floor plan image.

Missing gallery images are hidden automatically on the page. Missing hero images fall back to `/images/model-placeholder.svg`.
