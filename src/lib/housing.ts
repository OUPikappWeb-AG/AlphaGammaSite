/**
 * Loads and validates `src/data/housing.json`.
 *
 * Import `housing` from here — never the raw JSON — so the data is always
 * schema-checked before it reaches a page.
 */

import raw from '../data/housing.json';
import { housingSchema, type Housing, type HousePhoto } from '../data/housing.schema';

function load(): Housing {
  const result = housingSchema.safeParse(raw);

  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  • ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');

    throw new Error(
      `\nsrc/data/housing.json is not valid.\n\n${problems}\n\n` +
        `Fix the fields listed above, then commit again. See EDITING.md.\n`,
    );
  }

  return result.data;
}

export const housing: Housing = load();

/** House photographs in the order they were listed. */
export const housePhotos = (): HousePhoto[] => housing.photos;

/** True once at least one photograph has been added. */
export const hasHousePhotos = (): boolean => housing.photos.length > 0;
