/**
 * Schema for `src/data/housing.json` — the chapter house photographs.
 *
 * Photographs are the only thing on this page that a schema can usefully
 * guard, so that is all this file describes. The house address comes from
 * `chapter.json → contact.houseAddress` and the Pi Kappa Phi Properties link
 * from `chapter.json → links.properties`; neither is duplicated here, because
 * one fact must have exactly one home.
 *
 * TWO RULES ARE ENFORCED IN TYPES RATHER THAN TRUSTED TO MEMORY
 * -------------------------------------------------------------
 * - `alt` is required. Hard rule 6: an image without alt text is unusable to
 *   a screen reader, and a parent using one is exactly who this site is for.
 * - Filenames are validated against `src/assets/photos/` at build time by
 *   `getPhoto()`, so a typo fails the build instead of shipping a broken
 *   image.
 *
 * ⚠️ Hard rule 5: no alcohol visible in any photograph, ever. A schema cannot
 * check that. It is on the officer adding the file.
 */

import { z } from 'zod';

const filled = z.string().trim().min(1);

export const housePhotoSchema = z.object({
  /** Filename only, e.g. "house-front.jpg". The file lives in src/assets/photos/. */
  file: filled.regex(
    /^[^/]+[.](jpe?g|png|webp|avif)$/i,
    'file must be a bare filename ending in an image extension, e.g. "house-front.jpg" — not a path.',
  ),

  /**
   * What is actually in the frame. Describe the subject, not the medium:
   * "The chapter house from the corner of Elm and Boyd", never "photo of house".
   */
  alt: filled,

  /** Optional visible caption, typeset in mono beneath the image. */
  caption: filled.optional(),
});

export type HousePhoto = z.infer<typeof housePhotoSchema>;

export const housingSchema = z.object({
  /** ISO date an officer last checked this file end to end. */
  lastReviewed: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'lastReviewed must look like 2026-08-21.'),

  /**
   * House photographs in display order. The first is rendered large and
   * eagerly loaded, so put the best exterior shot first — it is the image a
   * parent forms their impression from.
   */
  photos: z.array(housePhotoSchema),
});

export type Housing = z.infer<typeof housingSchema>;
