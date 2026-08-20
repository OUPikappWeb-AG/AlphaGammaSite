/**
 * Resolves a photo *filename* to an optimizable image asset.
 *
 * WHY
 * ---
 * Adding a photo should be a two-step job for a non-developer:
 *
 *   1. Upload the file to `src/assets/photos/`
 *   2. Write its filename in a data or content file: "house-front.jpg"
 *
 * No import statements, no build knowledge, no touching component code. This
 * module closes that gap by globbing the photo folder at build time and
 * handing the result to `astro:assets`, which produces resized, lazy-loaded
 * WebP with correct width and height attributes.
 *
 * If the filename does not exist, the build fails with a message naming the
 * available files — a typo is caught here rather than shipping a broken image.
 */

import type { ImageMetadata } from 'astro';

/**
 * Eagerly import every photo so the lookup is a plain object at build time.
 * `eager: true` is required: a lazy glob would return promises, which cannot
 * be handed straight to `<Image />`.
 */
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/photos/*.{jpeg,jpg,JPG,JPEG,png,PNG,webp,avif}',
  { eager: true },
);

/** filename (e.g. "house-front.jpg") → image metadata */
const photos: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [
    path.split('/').pop() as string,
    mod.default,
  ]),
);

/** Every photo filename currently available, sorted. Used in error messages. */
export const availablePhotos = (): string[] => Object.keys(photos).sort();

/**
 * Look up a photo by filename.
 *
 * @param filename  Just the name, e.g. "house-front.jpg" — not a path.
 * @throws if no such file exists in `src/assets/photos/`.
 */
export function getPhoto(filename: string): ImageMetadata {
  const found = photos[filename];

  if (!found) {
    const available = availablePhotos();
    throw new Error(
      `\nPhoto not found: "${filename}"\n\n` +
        `Every photo must live in src/assets/photos/ and be referenced by ` +
        `filename only.\n\n` +
        (available.length
          ? `Available photos:\n${available.map((f) => `  • ${f}`).join('\n')}\n`
          : `That folder currently has no photos in it.\n`) +
        `\nCheck the spelling, including the file extension. See EDITING.md.\n`,
    );
  }

  return found;
}

/** Non-throwing variant, for optional photos that may not be set yet. */
export function findPhoto(filename: string | undefined | null): ImageMetadata | null {
  if (!filename) return null;
  return photos[filename] ?? null;
}
