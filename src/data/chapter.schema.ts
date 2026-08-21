/**
 * Schema for `src/data/chapter.json` — the single source of truth for every
 * number, name, and link on this website.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * `chapter.json` is designed to be edited from github.com, in a browser, on a
 * phone, by someone who has never written code. That is a good thing, but it
 * means a typo can reach the repository unreviewed. This schema is the safety
 * net: if an edit is malformed, `npm run build` stops with a readable error and
 * Vercel refuses to deploy. A broken edit therefore fails loudly instead of
 * silently publishing a wrong number to parents.
 *
 * You should not need to touch this file to update content. You only touch it
 * if you are adding a genuinely NEW kind of field.
 *
 * THE `Stat` SHAPE
 * ----------------
 * Every published statistic is an object, never a bare number:
 *
 *     { "value": 3.21, "asOf": "Spring 2026", "source": "OU FSPL report" }
 *
 * - `value`  the number itself, or `null` if it has not been reported yet
 * - `asOf`   the period the number describes — rendered under the stat
 * - `source` where it came from — for accountability if anyone asks
 *
 * `value` is nullable on purpose. An unknown GPA must render as "Not yet
 * reported", never as "0.00". A zero is a claim; null is an honest absence.
 */

import { z } from 'zod';

/** A string that must not be left blank. */
const filled = z.string().trim().min(1);

/**
 * One published statistic.
 *
 * @param opts.min  optional lower bound, used to catch impossible entries
 * @param opts.max  optional upper bound (e.g. a GPA above 4.0 is a typo)
 */
const stat = (opts: { min?: number; max?: number } = {}) =>
  z.object({
    value: z
      .number()
      .min(opts.min ?? 0, `Value cannot be below ${opts.min ?? 0}.`)
      .max(opts.max ?? Number.MAX_SAFE_INTEGER)
      .nullable(),
    asOf: filled.describe('The period this number describes, e.g. "Spring 2026".'),
    source: filled
      .optional()
      .describe('Where this number came from, e.g. "OU FSPL report".'),
  });

export const statSchema = stat();
export type Stat = z.infer<typeof statSchema>;

export const chapterSchema = z.object({
  /**
   * ISO date (YYYY-MM-DD) of the last time an officer reviewed this file
   * end to end. Rendered in the footer. Update it every semester — a visibly
   * stale date is the point, because it pressures the next officer to refresh.
   */
  lastReviewed: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'lastReviewed must look like 2026-08-18.'),

  identity: z.object({
    chapterName: filled,
    school: filled,
    /** Year Alpha Gamma was chartered at OU. */
    founded: filled,
    /** Year Pi Kappa Phi was founded nationally. Should stay 1904. */
    nationalFounded: filled,
  }),

  links: z.object({
    /**
     * Where the "Member Sign In" button points. This is ChapterLink.
     * Change it here and it changes everywhere on the site at once —
     * it is never hardcoded in a component.
     */
    memberPortal: z.url(),
    national: z.url(),
    abilityExperience: z.url(),
    /**
     * Pi Kappa Phi Properties — the fraternity's housing arm. Linked from
     * /housing so a parent can verify who actually manages the building
     * rather than taking the chapter's word for it.
     */
    properties: z.url(),
    /** Full URL to the chapter Instagram, or "TODO" until one exists. */
    instagram: z.union([z.url(), z.literal('TODO')]),
  }),

  contact: z.object({
    recruitmentChair: z.object({
      name: filled,
      /** Use a chapter alias, never a personal address — officers graduate. */
      email: z.union([z.email(), z.literal('TODO')]),
      phone: filled,
    }),
    chapterEmail: z.union([z.email(), z.literal('TODO')]),
    houseAddress: filled,
  }),

  academics: z.object({
    /** Chapter GPA. Bounded at 4.0 so a fat-fingered 32.1 fails the build. */
    chapterGPA: stat({ max: 4.0 }),
    /** All-men's campus average — the context that makes chapterGPA mean something. */
    allMensAverage: stat({ max: 4.0 }),
    /** All-fraternity campus average. */
    allFraternityAvg: stat({ max: 4.0 }),
    /** Percentage, 0–100. */
    retentionRate: stat({ max: 100 }),
    /** Percentage, 0–100. */
    gradRate: stat({ max: 100 }),
  }),

  service: z.object({
    hoursPerYear: stat(),
    hoursPerMember: stat(),
  }),

  /** The Ability Experience — Pi Kappa Phi's national philanthropy. */
  abilityExperience: z.object({
    /** US dollars, whole numbers. Do not include a "$" or commas. */
    raisedThisYear: stat(),
    raisedAllTime: stat(),
    journeyOfHopeRiders: stat(),
  }),

  membership: z.object({
    activeMembers: stat(),
    pledgeClassSize: stat(),
  }),

  dues: z.object({
    /** Dollars per semester for a new member (higher — includes one-time fees). */
    newMemberSemester: stat(),
    /** Dollars per semester for an initiated active member. */
    activeSemester: stat(),
    /** What the dues cover. One short phrase per entry. */
    includes: z.array(filled).min(1),
    paymentPlansAvailable: z.boolean(),
    /** One sentence on hardship or financial-aid options, if any exist. */
    notes: filled,
  }),

  alumniOutcomes: z.object({
    companies: z.array(filled).min(1),
    gradSchools: z.array(filled).min(1),
  }),
});

export type Chapter = z.infer<typeof chapterSchema>;
