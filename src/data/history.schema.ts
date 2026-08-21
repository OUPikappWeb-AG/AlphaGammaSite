/**
 * Schema for `src/data/history.json` — the Alpha Gamma timeline.
 *
 * WHY MILESTONES LIVE IN DATA, NOT IN THE PAGE
 * --------------------------------------------
 * Same reason every number does: an officer must be able to add a milestone
 * from github.com in a browser without touching component code, and a
 * malformed edit must fail the build rather than publish a wrong date.
 *
 * A DATE IS A FACT, NOT COPY
 * --------------------------
 * Hard rule 1 — never invent a statistic, name, date, or dollar figure —
 * applies with particular force here. A plausible-looking placeholder year is
 * worse than no year at all, because a parent reads it as true. So this file
 * ships EMPTY, and the timeline renders only what an officer has actually
 * verified. There is no "example milestone" for the same reason there is no
 * example GPA of 0.00.
 *
 * Sources worth checking when filling this in: the chapter's charter
 * certificate, the OU Sooner yearbook archive, OU Fraternity & Sorority
 * Programs and Services, and Pi Kappa Phi national's chapter roll.
 */

import { z } from 'zod';

const filled = z.string().trim().min(1);

/**
 * One event on the timeline.
 *
 * `year` is a string rather than a number so it can express a span
 * ("1968–1972") and so it typesets exactly as written. It is validated to
 * look like a year, which catches the most common paste error.
 */
export const milestoneSchema = z.object({
  /** "1920", or a span like "1968-1972" / "1968–1972". */
  year: filled.regex(
    /^\d{4}(\s*[–-]\s*\d{4})?$/,
    'year must be a four-digit year, e.g. "1920", or a span, e.g. "1968-1972".',
  ),

  /** A short headline. Sentence case, no exclamation points. */
  title: filled,

  /** One to three plain sentences. What happened, and why it mattered. */
  body: filled,

  /**
   * Where this came from — charter certificate, yearbook, national records.
   * Not published, but it is what makes the date defensible if anyone asks,
   * and it tells the next officer whether a claim was ever checked.
   */
  source: filled.optional(),

  /** Optional photo filename from src/assets/photos/. Filename only. */
  photo: filled.optional(),

  /** Required whenever `photo` is set — enforced below. */
  photoAlt: filled.optional(),
});

export type Milestone = z.infer<typeof milestoneSchema>;

export const historySchema = z.object({
  /** ISO date an officer last checked this file end to end. */
  lastReviewed: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'lastReviewed must look like 2026-08-21.'),

  /**
   * Chapter milestones, oldest first. The loader sorts them, so the order
   * here does not matter — add new entries wherever is convenient.
   */
  milestones: z.array(
    milestoneSchema.refine((m) => !m.photo || !!m.photoAlt, {
      message:
        'photoAlt is required when photo is set. An image without alt text is ' +
        'unusable to a screen reader.',
      path: ['photoAlt'],
    }),
  ),
});

export type History = z.infer<typeof historySchema>;
