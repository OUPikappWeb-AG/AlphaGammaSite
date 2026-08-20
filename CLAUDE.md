# CLAUDE.md

Guidance for Claude Code working in this repository.

---

## What this is

The public marketing site for the **Alpha Gamma Chapter of Pi Kappa Phi at the University of Oklahoma**, deploying to `oupikapp.com`.

**Read `BUILD-SPEC.md` before doing substantial work.** It is the authoritative brief — audience, content strategy, design direction, and phase order. This file records what has actually been built, what was decided, and what is still open.

### The single job

> A parent hears "I'm rushing Pi Kappa Phi," googles it, lands here, and closes the tab feeling **relieved**.

Audiences ranked: parents → potential new members → alumni/donors → current members. The audience knows little or nothing about fraternities. Everything on the site exists to earn their trust.

Register to aim for: **a small college's admissions site crossed with an annual report.** Explicitly *not* a "fraternity website."

### Not in scope

No auth, no database, no dues/rosters (that is ChapterLink, a separate product), no blog, no public event calendar, no photo gallery before Phase 5.

---

## Stack — verified versions, not assumptions

These were installed and confirmed on 2026-08-18. Several are newer than the model's training data, so **check the installed package before relying on remembered APIs.**

| Package | Version | Note |
|---|---|---|
| `astro` | **7.2.2** | Newer than training cutoff — verify APIs against `node_modules` |
| `tailwindcss` | **4.3.3** | v4: **CSS-first config, no `tailwind.config.mjs`** |
| `@tailwindcss/vite` | 4.3.3 | Tailwind is a Vite plugin, not an Astro integration |
| `zod` | 4.x | Use `z.url()` / `z.email()`; `z.string().url()` is **deprecated** |
| Node | 24.17.0 | `.nvmrc` pins major 24 |

`@fontsource-variable/ibm-plex-mono` **does not exist** — IBM Plex Mono has no variable build. The repo uses the static `@fontsource/ibm-plex-mono` at weights 400 and 500. Do not "fix" this by reinstalling the variable package.

---

## Commands

```bash
npm run dev      # localhost:4321
npm run build    # astro check && astro build — typechecks, then builds
npm run preview
```

`npm run build` must finish with **0 errors, 0 warnings, 0 hints**. It was in that state at the end of the last session; keep it there.

---

## Where things live

```
src/
├─ data/
│  ├─ chapter.json        ← THE source of truth for every number, name, link
│  └─ chapter.schema.ts   ← Zod schema + the documentation for that file
├─ lib/
│  ├─ chapter.ts          ← validated loader + formatters + launch check
│  ├─ url.ts              ← path normaliser (see Gotchas)
│  ├─ nav.ts              ← nav items + `ready` flags
│  └─ images.ts           ← filename → optimized asset
├─ layouts/Base.astro     ← SEO, OG, JSON-LD, fonts, skip link
├─ components/            ← ChapterRecord, StatLine, Nav, Footer, Wordmark,
│                            CTAButton, PhotoBand, PendingFields
├─ pages/                 ← index, join, 404
└─ styles/global.css      ← Tailwind import + @theme tokens + base styles
```

---

## Hard rules

These are non-negotiable. Several protect real people or the chapter's standing.

1. **Never invent a statistic, name, date, or dollar figure.** Everything unknown stays `TODO` / `null`. The site's entire value is that its numbers are trustworthy.
2. **No number is ever hardcoded in a component.** It comes from `chapter.json`, through `src/lib/chapter.ts`, and renders with its `asOf` stamp.
3. **Placeholder prose stays as text marked "Example."** The owner writes the real copy. Do not draft persuasive fraternity marketing copy on their behalf unless asked.
4. **A `TODO` must never render to a visitor.** Components omit placeholder fields instead. Verify after building (see Verification below).
5. **No alcohol visible in any photo, ever.** Parent-facing site and national risk-management policy.
6. **Every image requires meaningful alt text** — enforced by the `PhotoBand` prop type.
7. **Accessibility is a floor, not a nice-to-have:** visible focus rings, skip link, one `<h1>` per page, 4.5:1 contrast for body text, `prefers-reduced-motion` respected.
8. **Do not add client-side JavaScript** beyond what exists (nav toggle, scroll reveal). The build currently emits **zero `.js` files**.
9. **Do not use the Pi Kappa Phi coat of arms or official marks.** Spec §11 flags this as unconfirmed with national HQ. The wordmark is deliberately plain Greek letters instead.

### Copy voice

Plain, declarative, specific. Numbers over adjectives. Sentence case headings. Active voice. No exclamation points. Never "unparalleled brotherhood," "we strive to," "second to none."

---

## Design system

Tokens are defined in `@theme` in `src/styles/global.css`. There is no JS config file — Tailwind v4 generates utilities from the CSS custom properties.

| Token | Hex | Use | Contrast on paper |
|---|---|---|---|
| `ink` | `#0E1626` | Ground, headings | 16.59:1 |
| `royal` | `#1D3B6E` | Secondary surfaces, links | 10.13:1 |
| `paper` | `#F7F5F0` | Page background | — |
| `slate` | `#5B6472` | Secondary text, captions | 5.49:1 |
| `gold` | `#C8A247` | **Rules and accents only** | **2.21:1 — FAILS** |
| `gold-text` | `#7E621B` | Gold-looking *text* on paper | 5.28:1 |
| `rose` | `#8C1D2E` | **The Ability Experience only** | 8.27:1 |

Two rules that carry meaning:

- **Gold never carries body text on paper.** It is a hairline-rule and accent colour. It *is* legal as text on `ink` (7.51:1). Use `gold-text` when gold-coloured words are needed on a light ground.
- **Rose is reserved exclusively for The Ability Experience.** Not for errors, not for emphasis, not for anything else. Used consistently, the colour teaches the reader what it means without explanation. Breaking this destroys the effect site-wide.

**Type:** Newsreader (display), Public Sans (body), IBM Plex Mono (all numbers, labels, eyebrows, `as of` stamps). Mono on every figure is the signature move — it makes data read as *reported* rather than *claimed*.

**Discipline:** one risk, spent on the Chapter Record; everything else quiet. Border radius 2–4px. Motion only on the Chapter Record reveal. Avoid the cream + high-contrast-serif + terracotta look — that is the generic AI-design default.

---

## Decisions made (2026-08-18 session)

Recorded so a future session doesn't silently undo them.

| Decision | Rationale |
|---|---|
| Tailwind **v4 CSS-first**, no `tailwind.config.mjs` | Spec assumed v3. Installed version is 4.3.3, where CSS `@theme` is the supported path. |
| Placeholder stats are `"value": null`, **not** `0.00` | Spec sample used `0.00`. Rendering "GPA 0.00" to a parent is worse than rendering nothing. `null` renders "Not yet reported". |
| `memberPortal` = `https://chapterlink.app/signin` | Spec §3 and the owner both confirm ChapterLink. The `gateway.pikapp.org` value in the spec's sample JSON (line 243) is stale — do not restore it. |
| Added derived token `gold-text #7E621B` | Spec §9 predicted gold would fail contrast. Confirmed at 2.21:1. |
| `STRICT_CONTENT` launch gate is **opt-in**, not always-on | An always-on "no TODO in production" assert would block the Phase 1 deploys needed now. Set `STRICT_CONTENT=1` in Vercel at real launch. |
| Nav items carry a `ready: boolean` flag | Phase 2/3 pages don't exist yet. A 404 on a trust-building site is worse than a missing link. Flip the flag when a page ships. |
| Added `contact.chapterEmail` to the schema | The footer needs a chapter alias, but the spec's sample JSON had no field for it. |
| Added `PendingFields.astro`, a **dev-only** banner | The public site hides `TODO`s; without this an officer loses track of what's missing. Stripped from production builds. |
| Added `.gitattributes` with `eol=lf` | The whole handoff plan depends on editing files on github.com, which writes LF. Without normalisation, browser edits and Windows edits produce whitespace-only diffs. |
| Placeholder `og-default.png` generated with sharp | Real social card should eventually use a photo. Current one is ink/gold typographic. |

---

## Gotchas already hit

**Path normalisation — do not bypass `src/lib/url.ts`.**
Setting `build.format: 'file'` caused two bugs at once: canonical tags published as `https://oupikapp.com/index.html`, and `aria-current="page"` **never rendered at all**, silently killing the nav's active state. Both came from `Astro.url.pathname` varying with build format. Fixed by routing every path comparison and every published URL through `canonicalPath()`. If you add a page or touch nav logic, use that helper.

**Zod 4 deprecations.** `z.string().url()` and `z.string().email()` emit hints. Use `z.url()` and `z.email()`.

**Inline scripts in `<head>`** need an explicit `is:inline` directive when they carry attributes, or `astro check` emits a hint.

---

## Current status

**Phase 0 and Phase 1 are complete** (per `BUILD-SPEC.md` §10). Build is clean; 3 pages generate.

Measured at end of session:

- `TODO` strings reaching built HTML: **0** across all pages
- JavaScript files emitted: **0** (both scripts inline)
- First-paint payload: **~142 KB** uncompressed, 97 KB of it fonts
- `astro check`: 0 errors / 0 warnings / 0 hints
- Sitemap contains only `/` and `/join`; 404 correctly excluded

### Built

`index.astro`, `join.astro`, `404.astro`, `Base.astro`, all eight components, the full data layer (`chapter.json` + Zod schema + validated loader), `images.ts`, `url.ts`, `nav.ts`, favicon, robots.txt, OG card, apple-touch icon.

### Not yet built

- **Phase 2:** `/parents`, `/ability-experience` ← the two pages that do the actual persuading
- **Phase 3:** `/about`, leadership, FAQ — plus `src/content/` collections, `leadership.json`, `faq.json`, `history.json`, `FAQ.astro`
- **Phase 4:** `README.md`, `EDITING.md`, `HANDOFF.md`, `.github/workflows/semester-review.yml`, Vercel Analytics, Search Console. **Spec calls these a deliverable, not an afterthought — do not skip.**

---

## Git status — read before touching version control

- Repo initialised on `main`. Remote set to `https://github.com/oupikappweb/AlphaGammaSite.git`. The repo **exists and is private** — that is why an unauthenticated `git ls-remote` reported *repository not found*. It was never missing.
- **Commit identity is resolved** (2026-08-20) and set **repo-locally**, so the owner's personal global identity is untouched:

  ```
  user.name   oupikappweb
  user.email  oupikapp.web@gmail.com
  ```

- **Do not commit or push without asking.** The identity question is settled, but the owner still decides when history is written.

---

## Open questions — ask, don't assume

1. ~~**Git commit identity.**~~ Resolved 2026-08-20 — see Git status above.
2. ~~**The remote may not exist.**~~ Resolved 2026-08-20 — it exists and is private. Note that `gh` CLI is still not installed on this machine, so pushing relies on Git Credential Manager.
3. **Account ownership (spec §7).** Domain, GitHub org, Vercel team, and email alias must all be chapter-owned with two admins, not on a personal card. This is the most common way a chapter site dies.
4. **Content still uncollected:** founding year, dues breakdown, comparison GPAs, retention/graduation rates, alumni outcomes, recruitment chair details, house address, Instagram handle, housing details, anti-hazing paragraph, and whether national HQ permits use of official marks. Full list in `BUILD-SPEC.md` §11.

The owner has confirmed they hold photos, service hours, Ability Experience dollars, and GPA figures — they chose to wire them in later rather than during the last session.

---

## Working preferences

The owner has asked for: **questions over assumptions**, thoroughness over speed, industry-standard code, and placeholder "Example" copy rather than invented prose. Surface trade-offs and let them decide rather than quietly picking.

---

## Verification before declaring work done

Run the build, then confirm — don't assume:

```bash
npm run build
```

Then check the output for the things that actually matter here:

- No `TODO` in any file under `dist/`
- Exactly one `<h1>` per page
- Canonical URLs are extensionless and slash-free (`/join`, not `/join.html` or `/join/`)
- `aria-current="page"` appears on the active nav item
- No unexpected `.js` files in `dist/`
