/**
 * Loads and validates `src/data/history.json`.
 *
 * Import `history` from here — never the raw JSON — so the data is always
 * schema-checked before it reaches a page.
 */

import raw from '../data/history.json';
import { historySchema, type History, type Milestone } from '../data/history.schema';

function load(): History {
  const result = historySchema.safeParse(raw);

  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  • ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');

    throw new Error(
      `\nsrc/data/history.json is not valid.\n\n${problems}\n\n` +
        `Fix the fields listed above, then commit again. See EDITING.md.\n`,
    );
  }

  return result.data;
}

export const history: History = load();

/** Leading four-digit year, used for sorting. "1968–1972" sorts as 1968. */
const startYear = (m: Milestone): number => Number.parseInt(m.year.slice(0, 4), 10);

/**
 * Milestones oldest first, so an officer can append to the JSON in any order
 * without thinking about position.
 */
export const milestones = (): Milestone[] =>
  [...history.milestones].sort((a, b) => startYear(a) - startYear(b));

/** True while no milestone has been recorded yet. */
export const hasMilestones = (): boolean => history.milestones.length > 0;
