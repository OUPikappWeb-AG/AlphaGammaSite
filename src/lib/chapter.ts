/**
 * Loads, validates, and formats `src/data/chapter.json`.
 *
 * Import `chapter` from here — never import the raw JSON directly. Going
 * through this module guarantees the data was schema-checked first, so a
 * malformed edit fails the build instead of rendering a wrong number.
 */

import raw from '../data/chapter.json';
import { chapterSchema, type Chapter, type Stat } from '../data/chapter.schema';

/**
 * Validate once, at module load. Astro imports this during the build, so a bad
 * `chapter.json` stops `npm run build` before anything is written to disk.
 */
function load(): Chapter {
  const result = chapterSchema.safeParse(raw);

  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  • ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');

    throw new Error(
      `\nsrc/data/chapter.json is not valid.\n\n${problems}\n\n` +
        `Fix the fields listed above, then commit again. See EDITING.md.\n`,
    );
  }

  return result.data;
}

export const chapter: Chapter = load();

/* ------------------------------------------------------------------ *
 * Placeholder handling
 * ------------------------------------------------------------------ */

/** The marker an officer leaves behind for "we haven't collected this yet". */
export const TODO = 'TODO';

/** True when a text field is still a placeholder. */
export const isTodo = (value: string): boolean => value.trim() === TODO;

/**
 * True when a statistic has no reported value yet.
 *
 * Components use this to render an honest "Not yet reported" rather than a
 * misleading "0". Never publish a zero you did not measure.
 */
export const isPending = (s: Stat): boolean => s.value === null;

/* ------------------------------------------------------------------ *
 * Formatting
 *
 * All numbers on this site are typeset in IBM Plex Mono with tabular figures,
 * so they align in a column and read as reported rather than claimed.
 * ------------------------------------------------------------------ */

export type StatFormat = 'gpa' | 'integer' | 'currency' | 'percent';

const decimal = new Intl.NumberFormat('en-US');

const gpa = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** What to show in place of a number that has not been reported yet. */
export const PENDING_LABEL = 'Not yet reported';

/** Render a stat's value for display. Returns `PENDING_LABEL` when unknown. */
export function formatStat(s: Stat, format: StatFormat = 'integer'): string {
  if (s.value === null) return PENDING_LABEL;

  switch (format) {
    case 'gpa':
      return gpa.format(s.value);
    case 'currency':
      return currency.format(s.value);
    case 'percent':
      return `${decimal.format(s.value)}%`;
    default:
      return decimal.format(s.value);
  }
}

/* ------------------------------------------------------------------ *
 * Derived figures
 * ------------------------------------------------------------------ */

/**
 * How many years the chapter has been at OU, derived from
 * `identity.founded`.
 *
 * WHY THIS IS COMPUTED AND NOT WRITTEN DOWN
 * -----------------------------------------
 * "On campus for over 100 years" is the single most persuasive line the
 * history page has, which is exactly why it must never be typed by hand.
 * Hardcode "100" and it is wrong the following year and nobody notices.
 * Derived from the charter year, it can only ever be right — and it returns
 * null while `founded` is still TODO, so the claim is simply not made rather
 * than guessed.
 *
 * Computed at build time. The site is static, so the number refreshes on the
 * next deploy, which the semester-review workflow will trigger anyway.
 */
export function yearsOnCampus(asOf: Date = new Date()): number | null {
  if (isTodo(chapter.identity.founded)) return null;

  const founded = Number.parseInt(chapter.identity.founded.slice(0, 4), 10);
  if (!Number.isFinite(founded)) return null;

  const years = asOf.getFullYear() - founded;
  return years > 0 ? years : null;
}

/**
 * The charter year as a plain string, or null while it is still a placeholder.
 * Kept separate from `yearsOnCampus` so a page can show one without the other.
 */
export function foundedYear(): string | null {
  return isTodo(chapter.identity.founded) ? null : chapter.identity.founded;
}

/**
 * Render the "as of" stamp that sits under every stat.
 * Returns null while the period is still a placeholder, so the component can
 * omit the line entirely rather than print "as of TODO".
 */
export function formatAsOf(s: Stat): string | null {
  return isTodo(s.asOf) ? null : `as of ${s.asOf}`;
}

/* ------------------------------------------------------------------ *
 * Launch readiness check
 *
 * Spec §9: "a build-time assert that no TODO string reaches production on
 * launch-critical fields."
 *
 * This is deliberately OPT-IN, because the site ships to production during
 * Phase 1 while most values are still being collected — a hard failure now
 * would block the very deploys we need. Turn it on for real launch by setting
 * STRICT_CONTENT=1 in the Vercel project's environment variables. From that
 * point on, any TODO left in a launch-critical field fails the build.
 * ------------------------------------------------------------------ */

/** Fields that must be real before the site is considered publicly launched. */
const LAUNCH_CRITICAL: ReadonlyArray<readonly [label: string, value: string]> = [
  ['identity.founded', chapter.identity.founded],
  ['links.instagram', chapter.links.instagram],
  ['contact.recruitmentChair.name', chapter.contact.recruitmentChair.name],
  ['contact.recruitmentChair.email', chapter.contact.recruitmentChair.email],
  ['contact.chapterEmail', chapter.contact.chapterEmail],
  ['contact.houseAddress', chapter.contact.houseAddress],
];

/** Names of launch-critical fields still holding a TODO placeholder. */
export function pendingLaunchFields(): string[] {
  return LAUNCH_CRITICAL.filter(([, value]) => isTodo(value)).map(([label]) => label);
}

/** Throws when STRICT_CONTENT is set and placeholders remain. */
export function assertLaunchReady(): void {
  if (!import.meta.env.STRICT_CONTENT) return;

  const pending = pendingLaunchFields();
  if (pending.length === 0) return;

  throw new Error(
    `\nSTRICT_CONTENT is on, but these fields in src/data/chapter.json are ` +
      `still TODO:\n\n${pending.map((f) => `  • ${f}`).join('\n')}\n\n` +
      `Fill them in, or unset STRICT_CONTENT to deploy anyway.\n`,
  );
}

assertLaunchReady();
