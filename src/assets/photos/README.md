# Photographs

Every photo on the site lives in this folder and is referenced **by filename
only** — never by path, and never with an `import` statement. Astro resizes it,
converts it to WebP, and writes the correct `width`/`height` automatically.

```jsonc
// src/data/housing.json
{ "file": "house-front.jpg", "alt": "The chapter house seen from the street" }
```

If a filename does not match a file in here, the build fails and names the
files that *are* available. That is deliberate: a typo is caught before it
ships a broken image.

## Rules

1. **No alcohol visible. Ever.** Check backgrounds, tables, shelves and hands,
   not just the subject. This is a parent-facing site and it is national
   risk-management policy.
2. **Alt text is required**, and the schema enforces it. Describe what is
   happening — "The chapter house from the corner at dusk" — not "photo of
   house".
3. **Max 2000px wide, under 400 KB.** Larger files slow the page down for no
   visible gain, since they are resized at build time anyway.
4. **Consent for anyone identifiable.** Ask before publishing a face.
5. **Lowercase, hyphenated filenames**: `house-front.jpg`, not `IMG_4821.JPG`.
   The name is the thing an officer types into a JSON file a year from now.

## Formats

`.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`. Prefer JPEG for photographs.
