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
│                            CTAButton, PhotoBand, PendingFields, Timeline
├─ pages/                 ← index, join, history, housing, safety, 404
└─ styles/global.css      ← Tailwind import + @theme tokens + base styles
```

At the repo root, `netlify.toml` is the deploy config — build command, Node
version, cache and security headers, and the `pretty_urls` override described
under Gotchas. Settings there **override the Netlify dashboard**, deliberately:
a UI toggle is invisible to the next officer, a file in the repo is not.

---

## Hard rules

These are non-negotiable. Several protect real people or the chapter's standing.

1. **Never invent a statistic, name, date, or dollar figure.** Everything unknown stays `TODO` / `null`. The site's entire value is that its numbers are trustworthy.
2. **No number is ever hardcoded in a component.** It comes from `chapter.json`, through `src/lib/chapter.ts`, and renders with its `asOf` stamp.
3. ~~**Placeholder prose stays as text marked "Example."**~~ **Superseded 2026-09-09 — the owner asked for drafts.** There is no "Example" copy left on the site. What is there now is a first draft written to be revised, not final text. Do not revert it to placeholders, and do not raise its temperature: it is deliberately humble and deliberately dash-free (owner's request). Anything describing chapter conduct is still the owner's to sign off. The **anti-hazing statement** on `/safety` was drafted at the owner's explicit request on 2026-09-28 and **approved by the owner as written on 2026-10-06**: any change to it is the owner's to make, not ours to polish.
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
| Placeholder stats are `"value": null`, **not** `0.00` | Spec sample used `0.00`. Rendering "GPA 0.00" to a parent is worse than rendering nothing. `null` now causes the row to be **omitted** — see the 2026-08-24 reversal below. |
| `memberPortal` = `https://chapterlink.app/signin` | Spec §3 and the owner both confirm ChapterLink. The `gateway.pikapp.org` value in the spec's sample JSON (line 243) is stale — do not restore it. |
| Added derived token `gold-text #7E621B` | Spec §9 predicted gold would fail contrast. Confirmed at 2.21:1. |
| `STRICT_CONTENT` launch gate is **opt-in**, not always-on | An always-on "no TODO in production" assert would block the Phase 1 deploys needed now. Set `STRICT_CONTENT=1` as a Netlify environment variable at real launch. |
| Nav items carry a `ready: boolean` flag | Phase 2/3 pages don't exist yet. A 404 on a trust-building site is worse than a missing link. Flip the flag when a page ships. |
| Added `contact.chapterEmail` to the schema | The footer needs a chapter alias, but the spec's sample JSON had no field for it. |
| Added `PendingFields.astro`, a **dev-only** banner | The public site hides `TODO`s; without this an officer loses track of what's missing. Stripped from production builds. |
| Added `.gitattributes` with `eol=lf` | The whole handoff plan depends on editing files on github.com, which writes LF. Without normalisation, browser edits and Windows edits produce whitespace-only diffs. |
| Placeholder `og-default.png` generated with sharp | Real social card should eventually use a photo. Current one is ink/gold typographic. |

### First draft of the prose (2026-09-09)

Every `Example` placeholder is gone. Owner asked for human-sounding, humble,
**no-dash** copy so the site could be shown around for feedback. What was
written, and the constraints it was written under:

| Where | What it now says |
|---|---|
| `index` hero, philanthropy, recruitment band | Chapter framing, The Ability Experience, an invitation to visit |
| `ChapterRecord` header | Rewritten — the old text promised "this page says so rather than estimating," which the 2026-08-24 omit-reversal made **false**. It now describes omission correctly. |
| `join` lede, three steps, contact paragraph | Reach out → visit → accept a bid. No dates, no durations. |
| `history` lede + national context | Owner's facts kept, spelling fixed. The national paragraph was **verbatim marketing text lifted from pikapp.org** and violated the copy-voice rule; replaced with the verifiable founding facts. |
| `housing` lede + properties paragraph | Owner's facts kept, spelling fixed, claim about safety standards softened to what the chapter can actually vouch for. |

Rules the copy follows, so an edit does not quietly break them:

- **No dashes at all in visible prose.** Em, en, or hyphenated compounds.
  Owner's explicit request. (Two `—` remain in output: an HTML comment and the
  Wordmark `aria-label`, both pre-existing.)
- **No new numbers.** The only figures in prose are 1977 (The Ability
  Experience), and the charter dates the owner supplied. Everything
  quantitative still comes from `chapter.json`.
- **Externally verifiable claims only.** Founding facts checked against
  `abilityexperience.org` and Wikipedia; OU's Interfraternity Council
  recruitment is referenced without dates because those go stale annually.
- **Humility is load-bearing.** `/history` says the century "has not been
  unbroken"; `/index` says "including about the parts we are still working
  on"; `/join` says deciding against a fraternity "is a perfectly good
  outcome." A parent believes the good numbers *because* of lines like these.
  Do not edit them out as negative.

⚠️ Also repaired here: `src/pages/join.astro` had an **uncommitted broken
line** in the working tree (`l} variant="outline"...`) that would have failed
the build. Restored to the `<CTAButton href={chapter.links.memberPortal}>` it
was.

### Pre-launch review and fixes (2026-09-28)

A four-angle review (build/SEO, content, live site and DNS, accessibility)
ran before the domain cutover. What it changed:

**🔴 The published GPA was wrong.** `chapter.json` said 3.23 and credited OU's
Fraternity and Sorority Programs report. OU's own public Spring 2026 Community
Scholarship Report says **3.0016**, 15th of 16 IFC chapters. 3.23 matched no
Pi Kappa Phi line in the Spring 2026, Fall 2025 or Spring 2025 reports. Any
parent can download that PDF, so this was the single most damaging thing on the
site. Corrected to `3.0016`, and the **All-Fraternity average 3.2662** is now
published beside it (owner's call: show it with the comparison). There is no
all-men's average in that report; `allMensAverage` stays `null`.

> **Lesson:** check every figure against the document its `source` names,
> before publishing. Report URL pattern:
> `ou.edu/content/dam/studentlife/fsps/fsps-assets/fsps-site-documents/fsps-grade-reports/`

| Decision | Rationale |
|---|---|
| **No student name on the site.** `recruitmentChair.name` removed from the schema and JSON; `/join` says "Our recruitment chair" | Owner's call. A name goes stale at every officer turnover and publishes a private student. Do not add it back. |
| **New `/safety` page** + `chapter.json → safety` block | Owner asked for it. Almost everything on it points *outside* the chapter: Oklahoma statute 21 O.S. § 1190, OU's hazing policy, OU's federally required **Campus Hazing Transparency Report** (Pi Kappa Phi was not listed on it, 2026-09-28; the page links the report rather than claiming that, so it cannot go stale), Pi Kappa Phi's statement of position, and three report routes the chapter does not control. The "Where we stand" section was a draft for the owner, **approved as written 2026-10-06**. |
| Hero second button → `/safety` ("Safety and conduct") | It used to send a parent off-site to abilityexperience.org before they had scrolled. That section has its own link further down. |
| Reveal hiding is now **opt-in** (`.reveal-ready` on `<html>`, set by the reveal script itself) | The old default hid `.reveal` and relied on `.no-js`, which a *different* script removed. Printing `/` produced a blank Chapter Record, and a failed module script would have hidden it permanently. Verified in headless Chrome: visible with JS off and in print. |
| Mobile menu works **without JavaScript** | It used the `hidden` attribute, so with JS off a phone could reach no page but home. Now `.no-js` shows it open and hides the Menu button. It also moved inside the `<nav>` landmark. |
| Gold focus ring on `.bg-ink` | Royal on ink measured 1.64:1, under the 3:1 minimum. Keyboard users lost their place in the footer. |
| Schema rejects a reported value whose `asOf` is `"TODO"` | Otherwise a number could publish undated, breaking hard rule 2 silently. |
| `STRICT_CONTENT` compares to `'1'` exactly | `STRICT_CONTENT=0` used to turn the gate *on*. |
| "Service and chapter" column is titled "Philanthropy and chapter" until a service figure exists | It showed no service figure. |
| `PhotoBand` takes a `sizes` prop; the `/housing` grid passes its real width | Grid photos render at 532px but told the browser 1152px, so they downloaded about 2× the needed file. |
| 404 no longer publishes a canonical or `og:url` | It pointed at `https://oupikapp.com/404`, which does not exist. |
| **Not done on purpose:** `*.netlify.app` → `oupikapp.com` 301 in `netlify.toml` | Correct to add, but **only at cutover**. Added now, it would redirect the working netlify.app site to a domain still serving GoDaddy's page. |

Copy fixes, same session: Gear Up Florida crosses the state, not the country;
"it is the honest version" → "it shows where each figure came from"; "Start
here" → "How to visit"; "Visit the site" → "Pi Kappa Phi Properties";
"two-storey" in alt text. All dead `EDITING.md` references now point at real
files, and the remaining Vercel mentions in code comments say Netlify.

**⚠️ Astro drops the space before an inline `<a>` that starts on a new line.**
Source text `through\n<a …>its page</a>` renders as "throughits page". Put `{' '}`
at the end of the preceding line. This bit twice on `/safety` and once on `/join`
in the same session. Only a screenshot showed it; the build and `astro check`
say nothing.

### The first real numbers, and a reversed decision (2026-08-24)

The owner filled in the first live figures. What is now published, all of it
dated and sourced:

| Figure | Value | `asOf` |
|---|---|---|
| Chapter GPA | ~~3.23~~ **3.00** (corrected 2026-09-28, see below) | Spring 2026 |
| Raised for The Ability Experience | $5,784 | Spring 2026 |
| Active members | 93 | Spring 2026 |
| New member class | 10 | Spring 2026 |
| Dues — new member / active semester | $2,000 / $1,600 | Fall 2026 — ⚠️ in `chapter.json` but **rendered on no page** yet |

Also filled: `founded` 1923, house address, Instagram, chapter email.

**🔄 Reversal: the Chapter Record now OMITS unreported figures instead of
labelling them "Not yet reported."** Owner's call, 2026-08-24. With four real
figures against six blanks, the "Not yet reported" lines stopped reading as
rigour and started reading as an empty chapter. `ChapterRecord.astro` filters
on `isPending()`, drops any column left empty, and omits the whole band if
nothing is reported at all.

Two consequences worth knowing:

- **The rows are still declared in `ChapterRecord.astro` and the fields still
  live in `chapter.json`.** Filling in a value is all it takes to bring its
  line back — that was an explicit requirement, not a side effect.
- **Sources are now derived from the visible figures only**, so the band never
  credits a record it is showing nothing from. Adding a figure can therefore
  add a source line on its own.

`StatLine.astro` keeps its "Not yet reported" branch. It is currently unused —
kept because it is the correct rendering if a pending stat is ever deliberately
passed.

⚠️ **Deliberately withheld:** the recruitment chair's phone is `"TODO"` on
purpose (owner's call, 2026-08-24) — it was a personal mobile. `join.astro`
already guards on `isTodo()`, so the field stays in place and simply does not
render.

**`chapterEmail` is a Gmail address, knowingly.** Spec §7 and the schema
comment both want a chapter alias, and `recruitment@oupikapp.com` reads far
more institutional — but it is the only address the house actually has today.
Revisit when the alias exists; do not "fix" it to an address that does not
receive mail.

### Hosting decision (2026-08-21)

| Decision | Rationale |
|---|---|
| **Netlify, not Vercel and not Cloudflare Pages** | Netlify is free, keeps push-to-deploy, and — unlike Cloudflare Pages — attaches an apex domain while DNS stays **external**. The owner explicitly does not want to move nameservers off GoDaddy. |
| **Nameservers stay at GoDaddy** | Cloudflare Pages requires the domain to be a Cloudflare zone before it will serve an apex custom domain. That means recreating every DNS record including MX, which spec §8 flags in red. Netlify takes a plain A record instead, so the GoDaddy zone gets edited, never rebuilt. |
| **Repo goes public** | Forced by the above: the repo is already Org-owned and private, and Netlify puts private Org repos behind Pro ($20/mo). Public is free, immediate, and costs nothing real — the repo contains no keys, no database, and only data the site already publishes. Owner's call, 2026-08-21. |
| `pretty_urls = false` in `netlify.toml` | Netlify's default would 301 `/join` → `/join/`, pointing every canonical tag at a redirect. See Gotchas. |
| Long-cache headers on `/_astro/*` | Filenames are content-hashed, so a changed file is a changed URL and these are safe to cache forever. That path is most of the first-paint payload — ~97 KB of it fonts. |
| **No Content-Security-Policy** | The nav toggle and scroll reveal are inline scripts, and a static site cannot issue per-request nonces. Any CSP strict enough to be worth having would break them. Revisit only if those inline scripts go. |

---

## Gotchas already hit

**Path normalisation — do not bypass `src/lib/url.ts`.**
Setting `build.format: 'file'` caused two bugs at once: canonical tags published as `https://oupikapp.com/index.html`, and `aria-current="page"` **never rendered at all**, silently killing the nav's active state. Both came from `Astro.url.pathname` varying with build format. Fixed by routing every path comparison and every published URL through `canonicalPath()`. If you add a page or touch nav logic, use that helper.

**Zod 4 deprecations.** `z.string().url()` and `z.string().email()` emit hints. Use `z.url()` and `z.email()`.

**🔴 `chapter.json` is JSON — it cannot hold comments, and it has no optional
fields.** This bit twice in one session (2026-08-24) and will bite again,
because commenting out a line you have no data for is the obvious instinct:

- **`//` is a syntax error in JSON.** The file stops parsing entirely — not
  just the commented line. It also strands whatever bracket the commented
  block opened.
- **Every field in `chapter.schema.ts` is required.** Deleting a field, or a
  whole block like `service`, fails the Zod parse just as hard as bad syntax.
- **`"value": null` is the only way to say "not reported yet."** It is what
  the schema is built around, and since the 2026-08-24 reversal it makes the
  row disappear from the page — which is what commenting-out was reaching for
  anyway.
- **Never pre-format a number.** `"$5,784"` fails the schema (`value` is
  `number | null`) *and* would double-format — `formatStat()` applies the `$`
  and the comma itself. Write `5784`.

Failure mode to recognise: Netlify reports this as a build error and **keeps
serving the previous deploy**, so the site simply appears to stop updating.
Run `npm run build` locally before pushing any `chapter.json` edit.

**Inline scripts in `<head>`** need an explicit `is:inline` directive when they carry attributes, or `astro check` emits a hint.

**Astro passes no image quality to sharp unless you set one, and sharp's own
WebP default is 80.** That is high enough that the 1920w variant re-encoded
*larger than its source JPEG* — 516 KB from a 398 KB original, behind a single
eager hero, against a ~142 KB whole-site first-paint budget. `PhotoBand.astro`
now sets `quality={65}`, which cuts every variant ~25% with no visible loss
(verified on the 1280w hero: smooth sky gradient, sharp lettering). The
presets, for reference, are `low: 25, mid: 50, high: 80, max: 100`.

Two things measured here so nobody re-derives them:

- **A cleaner source JPEG produces a *larger* WebP, not a smaller one.** Tested
  at 1920w/q65: a 399 KB q62 source → 392 KB, a 608 KB q80 source → 413 KB, a
  984 KB q92 source → 425 KB. So the "under 400 KB" source rule in
  `src/assets/photos/README.md` *helps* output size. Do not relax it hoping to
  shrink the delivered image — it does the opposite.
- **Remaining lever, if the hero is still too heavy:** drop `1920w` from
  `widths` in `PhotoBand.astro`. The container maxes at 1152px, so this only
  affects high-DPI screens, and it caps retina at 189 KB instead of 392 KB.
  Not taken — it is a real quality trade-off on the one photo a parent judges
  the house by.

**sharp holds a read lock on a file it opened by path**, so
`sharp('x.jpg').…toFile('x.jpg')` fails on Windows with `UNKNOWN: unknown error`.
Read into a buffer first (`sharp(fs.readFileSync(p))`), then write.

**Netlify injects a 33.7 KB script unless you stop it.** The "Netlify Drawer"
(heads-up display) is added *post-build*, so `npm run build` still reports zero
`.js` files while the live page loads
`/.netlify/scripts/hud?variant=public` — 33,737 bytes against a ~142 KB
first-paint budget, a 23% increase, and a straight violation of hard rule 8.
Disable at **Project configuration → Build & deploy → Continuous deployment →
Collaboration tools → Configure → Netlify Drawer**. There is no `netlify.toml`
key for it, so this one *is* a dashboard setting — re-check it if the site is
ever recreated.

**Netlify overrides the HSTS header on `*.netlify.app`.** `netlify.toml` sets
`Strict-Transport-Security: max-age=31536000` with no `includeSubDomains`,
deliberately, because `app.oupikapp.com` is reserved for ChapterLink. The
netlify.app host serves `max-age=31536000; includeSubDomains; preload` regardless
— that domain is on the HSTS preload list, so Netlify has to. Every *other*
custom header applied verbatim, so this is specific to their domain. 🔴 **Re-verify
on `oupikapp.com` once DNS is pointed.** If `includeSubDomains` is forced there
too, it silently commits `app.oupikapp.com` to HTTPS-only before ChapterLink
exists.

⚠️ **It has already happened, from GoDaddy** (verified 2026-09-28). The GoDaddy
Website Builder page currently on `oupikapp.com` sends
`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`. Any
browser that has visited it has cached HTTPS-only for `app.oupikapp.com` for two
years. The domain is **not** on the preload list, so this is limited to those
browsers. Practical upshot: ChapterLink on `app.` must serve HTTPS from day one
(it will on Vercel anyway). Nothing in `netlify.toml` needs to change.

**Netlify "Pretty URLs" fights `trailingSlash: 'never'`.** It is ON by default.
Astro's directory output emits `dist/join/index.html`, and Pretty URLs turns
that into a 301 from `/join` to `/join/` — while the canonical tag and the
sitemap both say `/join`. Every canonical URL would then point at a redirect,
which is exactly the SEO split `trailingSlash: 'never'` exists to prevent.
Disabled in `netlify.toml` via `[build.processing.html] pretty_urls = false`.
Do not "fix" a trailing-slash complaint by switching it back on — and note that
Netlify does **not** allow a redirect rule to add or remove a trailing slash,
so this setting is the only lever there is.

---

## Next session — start here

Hosting is decided (Netlify — see Decisions). As of 2026-09-28 the site-side
fixes from the pre-launch review are done (see "Pre-launch review and fixes").
What is left before the domain goes live, in order:

0. **Owner sign-off, blocking cutover:**
   - ~~Revise the DRAFT "Where we stand" statement on `/safety`.~~ **Approved
     as written by the owner, 2026-10-06.** Any later change is still theirs.
   - ~~**`/history` has factual problems.**~~ **Fixed 2026-10-06 with the
     owner's dates:** active 1923–1938, 1971–1984, 1988–2007 and since 2011
     (matches Wikipedia's chapter list and OU's IFC page), 27th chapter, not
     23rd. Cut on the owner's instruction: the Depression as the cause, the
     1980 "Master Chapter" award, and the coed claim. Do not restore them
     without a source. The big "103 years at OU" figure counted about 40
     dormant years, so the band now shows the charter year instead;
     `yearsOnCampus()` is left in `chapter.ts`, unused on purpose.
     ⚠️ One line to confirm: the owner wrote "1714 is bother for 1984 and
     1988", read as 1714 Chautauqua being the house in both the 1971–1984
     and 1988–2007 periods. The page says exactly that.
   - `/housing`: ~~confirm Pi Kappa Phi Properties actually owns 736 Elm~~
     **Owner confirmed 2026-10-06 that it does** (its site does not list OU, so
     this rests on the owner's word). "Owned and run by alumni" was cut the
     same day; it is a staffed organization with a board.
   - Dues: `includes`, whether rent or meals are covered, the payment-plan
     terms, and hardship `notes`. Then render them (they currently appear
     nowhere).
   - `raisedThisYear` $5,784 is stamped "Spring 2026". Confirm the period.
   - Bump `lastReviewed` in all three JSON files once signed off.
1. ~~**Update the local remote.**~~ Done — `origin` is
   `https://github.com/OUPikappWeb-AG/AlphaGammaSite.git` (verified 2026-08-24).
2. **Disable the Netlify Drawer** — Project configuration → Build & deploy →
   Continuous deployment → Collaboration tools. It injects 33.7 KB of JS and
   breaks hard rule 8. Dashboard-only; no `netlify.toml` equivalent. Confirmed
   still injecting **33,737 bytes** on 2026-08-24, measured against the live
   host.
3. **Wire in the remaining numbers.** Photos, GPA, Ability Experience dollars,
   membership and dues are all in as of 2026-08-24 — see the Decisions table.
   Still `null`: **service hours**, hours per member, all-men's and
   all-fraternity comparison GPAs, retention and graduation rates, Ability
   Experience all-time and Journey of Hope riders. Each needs a value, an
   `asOf`, and a `source`. Since the 2026-08-24 reversal these rows are simply
   absent from the page until filled, so nothing looks broken meanwhile — but
   the comparison GPAs are what make 3.23 *mean* something, so they are the
   highest-value ones left.
4. **Then** point `oupikapp.com` (spec §8: copy the exact records **Netlify**
   shows, never IPs from a doc — including this one — and do not touch MX
   records). Immediately afterwards, re-check the HSTS header for a forced
   `includeSubDomains`, which would affect `app.oupikapp.com`.
5. Then Phase 2 — `/parents` and `/ability-experience`. The owner must write the
   anti-hazing paragraph themselves; do not draft it for them.

---

## Current status

**Deployed on netlify.app; not yet on `oupikapp.com`.** The site is live at
`https://musical-zabaione-49f618.netlify.app` (since 2026-08-21). The build is
clean and **6 pages** generate as of 2026-09-28: index, join, history, housing,
safety, and 404.

Both phases' gates in `BUILD-SPEC.md` §10 are about *shipping*:

- Phase 1 gate — "Shippable. Push it live." — met in substance on netlify.app.
- Phase 0 gate — "Site resolves at `oupikapp.com` over HTTPS" — **not met.**
  It names the domain specifically, and the domain still serves GoDaddy's page.

Re-verified 2026-08-21 against the Vercel account, unchanged: one team
(`nwschprojects-7699's projects`, a personal hobby account) holding one project
(`chapter-app`, which is ChapterLink — a different product). Vercel is no longer
this site's host; that account matters only to ChapterLink now.

Do not record these phases as done until the domain actually serves the site.

Measured 2026-08-24 (5 pages now — `/history` and `/housing` shipped):

- `TODO` strings reaching built HTML: **0** across all pages
- JavaScript files emitted: **0** (both scripts inline)
- `astro check`: 0 errors / 0 warnings / 0 hints
- Exactly one `<h1>` per page; canonicals extensionless and slash-free
- First-paint payload **on the text pages: ~142 KB** uncompressed, 97 KB of it
  fonts. `/housing` is now much heavier — it carries three photographs, one of
  them eager. See below.

**`/housing` image weight**, after `quality={65}`:

| Viewer | Eager hero (`house-front.jpg`) |
|---|---|
| Mobile at 1× density, 640w | 39 KB |
| **Typical phone at 3× density, 1280w** | **~194 KB** |
| Standard desktop, 1280w | 189 KB |
| Retina desktop, 1920w | 392 KB |

⚠️ The old "mobile = 39 KB" row was only true at 1× density, which almost no
phone has. Measured 2026-09-28 on an emulated 360px, 3× phone: `/housing`
transferred **503 KB** in total. Chrome's mobile lazy-load distance fetched both
"lazy" grid photos immediately. That was before the grid `sizes` fix, which cuts
those two roughly in half. First paint on the text pages has also grown to about
**158 KB uncompressed** (about 124 KB brotli), from ~142 KB. The growth is HTML,
not fonts.

The other two photos are lazy. 392 KB on a retina hero is the accepted cost of
the page whose entire job is showing a parent the building; the lever to halve
it again is recorded under Gotchas and was deliberately not pulled.

### Built

`index.astro`, `join.astro`, `404.astro`, `history.astro`, `housing.astro`,
`Base.astro`, all eight components, the full data layer (`chapter.json` +
`history.json` + `housing.json`, each with a Zod schema and validated loader),
`images.ts`, `url.ts`, `nav.ts`, favicon, robots.txt, OG card, apple-touch icon,
and `netlify.toml` (2026-08-21).

**House photographs are in** (2026-08-24) — `house-front.jpg` as the eager
lead, `house-livingroom.jpg` and `house-studyroom.jpg` in the two-column grid
beneath it, wired through `src/data/housing.json`. All three were checked frame
by frame at full resolution against hard rule 5: **no alcohol anywhere**,
including shelves, tables and backgrounds. No identifiable faces — the chapter
composite on the study-room wall is unreadable at every size the site renders.
Sources were resized from 2500px/~2 MB to 2000px and under 400 KB to meet the
rule in `src/assets/photos/README.md`.

### Not yet built

- **Phase 2:** `/parents`, `/ability-experience` ← the two pages that do the actual persuading
- **Phase 3:** `/about`, leadership, FAQ — plus `src/content/` collections, `leadership.json`, `faq.json`, `FAQ.astro`. (`history.json` is already built.)
- **Phase 4:** `README.md`, `EDITING.md`, `HANDOFF.md`, `.github/workflows/semester-review.yml`, analytics, Search Console. **Spec calls these a deliverable, not an afterthought — do not skip.**
  - ⚠️ The spec says "Vercel Analytics (free tier, one line in the layout)". That
    is off the table now. **Netlify Analytics is $9/mo per site, not free**, so
    analytics is an unresolved choice, not a one-liner — and hard rule 8 (no
    client-side JavaScript) rules out most drop-in scripts. Ask the owner before
    adding anything.

---

## Git status — read before touching version control

**History exists and is pushed.** `main` tracks `origin/main`.

⚠️ **The repo now lives at `OUPikappWeb-AG/AlphaGammaSite`** (Organization), not
under `oupikappweb`. See the transfer note below — and do not trust `git remote -v`
to tell you this.

- Remote is `https://github.com/OUPikappWeb-AG/AlphaGammaSite.git` and the
  repo is **public** (since 2026-08-21; see Hosting). *Historical:* it was
  once private under `oupikappweb`, which is why an unauthenticated
  `git ls-remote` then reported *repository not found*. It was never missing.
  Run `git log` for history; do not maintain a commit list here.
- `.vs/` (Visual Studio local state, including a sqlite file) was accidentally caught by `git add -A` on the first commit. It is now in `.gitignore` and the root commit was amended to drop it. **Do not use bare `git add -A` here without checking `git status` first.**
- **Commit identity is resolved** (2026-08-20) and set **repo-locally**, so the owner's personal global identity is untouched:

  ```
  user.name   oupikappweb
  user.email  oupikapp.web@gmail.com
  ```

- **Do not commit or push without asking.** The identity question is settled, but the owner still decides when history is written.
- **Push access runs through the owner's personal account** (2026-08-20 decision). Windows Credential Manager on this machine stores only `Nswchoeffler` credentials, so `Nswchoeffler` was added as a collaborator on the private repo rather than storing a second credential for `oupikappweb`.
  - Commit *authorship* is still `oupikappweb` — this affects only who is permitted to push.
  - This is a known, accepted deviation from `BUILD-SPEC.md` §7, which wants everything chapter-owned. Revisit at officer turnover: if `Nswchoeffler` loses access, pushes break.
  - Symptom to recognise: GitHub returns **"Repository not found"** for a private repo on *any* auth failure — unauthenticated, wrong account, or an unaccepted collaborator invite. It almost never means the repo is actually missing.

### ✅ The Org transfer HAS happened (discovered 2026-08-21)

**`OUPikappWeb-AG` is a real Organization and `AlphaGammaSite` now lives inside
it.** This was discovered by accident: a `git push` succeeded but printed

```
remote: This repository moved. Please use the new location:
remote:   https://github.com/OUPikappWeb-AG/AlphaGammaSite.git
```

Verified: `curl -s https://api.github.com/users/OUPikappWeb-AG` returns
`"type": "Organization"`, and the repo 404s unauthenticated, i.e. still private.

**The lesson: `git remote -v` is not evidence of where a repo lives.** GitHub
redirects the old URL indefinitely, so a stale remote keeps working silently and
every conclusion drawn from it is wrong. Two sessions of planning assumed a
personal-account repo on that basis. Check the API or the push output, not the
remote.

⚠️ **The local remote may still point at `oupikappweb`.** Update it:

```bash
git remote set-url origin https://github.com/OUPikappWeb-AG/AlphaGammaSite.git
```

#### Historical: why the User-vs-Organization distinction mattered

`BUILD-SPEC.md` §7 states the chapter **Organization** is "already created ✓". **That is factually wrong.** Verified 2026-08-20:

```bash
curl -s https://api.github.com/users/oupikappweb | grep '"type"'
#   "type": "User",
```

This is not pedantry — it changes what is possible:

- On a **personal** repo, collaborators get push access only. There is no Admin role to grant; that dropdown exists only on Organization repos.
- **Git integrations need admin rights** on the repo — they install a webhook and a deploy key. So `Nswchoeffler` can push, but cannot connect this repo to a host. Now that the host is **Netlify**, the practical form of this is: the Netlify GitHub App has to be installed by `oupikappweb` (on a personal repo, only the owner can); on an Org repo an Org owner installs it, or a member requests it and an owner approves.

The owner created the Org (`OUPikappWeb-AG`), added `Nswchoeffler` to it as admin,
**and completed the transfer** — see above. Spec §7's "chapter Organization" box is
now genuinely ticked for GitHub.

Kept for reference, since a future repo may need the same move:

1. The transfer must be initiated by the repo's owner — repo → Settings → Danger Zone → Transfer ownership.
2. The initiating account must be a member of the destination Org with permission to create repos there, or the Org will not appear as a valid destination. It can be removed afterward; the repo stays.
3. Afterwards, update the local remote. GitHub redirects the old URL forever, so nothing visibly breaks — which is exactly why it misleads.

---

## Deployment status — live on netlify.app, domain not yet pointed (2026-08-21)

`oupikapp.com` **is registered at GoDaddy and the owner controls DNS.** It is
*not* unpointed. It serves a GoDaddy Website Builder page and carries live
Microsoft 365 email; see "What is actually on `oupikapp.com` today" below.
**DNS stays at GoDaddy** — that constraint is what selected the host.

Vercel account state, re-checked 2026-08-21 and unchanged — kept only so nobody
re-investigates it:

- **One team:** `nwschprojects-7699's projects` (`team_iT2rLR4T4MQkGMkGcnkOIE0A`) — a personal hobby account, exactly what §7 says not to use.
- **One project:** `chapter-app` — that is ChapterLink, a *different* product.
- **No Vercel project exists for this site**, and none should be created.

### Why not Vercel — a platform constraint, not a misconfiguration

*Kept as the reasoning behind the 2026-08-21 decision. Do not re-litigate it
without a new fact.* The free-and-Git-connected combination does not exist on
Vercel:

- Repo on a **personal** account → Vercel needs repo admin; personal-repo collaborators cannot have admin. Blocked.
- Repo in an **Organization** → fixes admin, but **Vercel's Hobby plan will not do Git integration with Org-owned repos.** Prompts for Pro.

### The options as actually verified (2026-08-21)

⚠️ **An earlier version of this table said "Cloudflare Pages / Netlify + Org —
free." That was wrong about Netlify** and is corrected below. Netlify puts
**organization-owned private repos behind its paid tier** (announced 3 Oct 2022;
Starter builds from those repos fail outright) — the same squeeze Vercel applies,
just priced differently.

| Path | Free? | Push-to-deploy? | Chapter-owned? | Blocker |
|---|---|---|---|---|
| **Netlify + public Org repo** ← chosen | ✅ | ✅ | ✅ | Repo must be public |
| Netlify + private Org repo | $20/mo (Pro) | ✅ | ✅ | Money — and at $20 Vercel Pro is the better buy |
| Netlify + private repo on personal acct | ✅ | ✅ | ❌ | Gives up chapter ownership |
| Cloudflare Pages + Org repo | ✅ | ✅ | ✅ | Apex domain forces nameservers to Cloudflare |
| Vercel Pro + Org | ~$20/mo | ✅ | ✅ | Money |
| Deploy from Vercel CLI | ✅ | ❌ | ✅ | Kills the handoff model |
| Repo on personal account + Vercel Hobby | ✅ | ✅ | ❌ | Not chapter-owned |

**Why not Cloudflare Pages**, which is the only free-and-fully-chapter-owned row:
its docs are explicit that *"if you are deploying to an apex domain … you will
need to add your site as a Cloudflare zone and configure your nameservers."*
`oupikapp.com` — not `www` — is what a parent types, so that applies. The owner
declined the nameserver move on 2026-08-21. Netlify serves an apex domain from a
plain A record with DNS left at GoDaddy, which is the whole reason it won.

**Push-to-deploy is not a nicety here.** The entire handoff model — officers editing `chapter.json` on github.com and the site updating itself — depends on it. A CLI-only deploy silently breaks the thing this project exists to enable, so treat it as a temporary unblock, never the final state.

### Two Vercel facts, now only relevant to ChapterLink

- **A Vercel Team is created *under* an existing account** — it is not a second signup. The owner was blocked trying to register a second Vercel account (phone verification, only one phone number). That was the wrong approach entirely; two Vercel accounts cannot share an email.
- **Projects transfer between Vercel teams** (`POST /projects/{id}/transfer-request`, then accept).

### 🔴 The repo must be PUBLIC for Netlify to build it

Netlify's pricing page lists **"Private organization repos" as a Pro feature —
$20/mo.** Free and Personal ($9) do not include it. The repo is Org-owned and
private, so **Netlify free cannot build it as things stand.**

**Decision (owner, 2026-08-21): make the repo public.** It is free, immediate,
keeps DNS at GoDaddy, and keeps the repo chapter-owned in the Org. Nothing in the
repo is secret — `chapter.json` holds only data the site already publishes to
visitors, there are no keys, no tokens, no database.

⚠️ **Do not make this repo private again** without also changing hosts or paying.
It will look like the site simply stopped updating. Netlify reports the failure as
a build/permission error, **not** as "your plan does not cover this" — so it is
very easy to burn hours debugging it as a build problem.

Why the alternatives lost:

- **Netlify Pro / Vercel Pro (~$20/mo).** At that price Netlify has no advantage
  left over Vercel — the only reason Netlify won was being free. If the chapter
  ever does fund hosting, reopen the comparison rather than defaulting to Netlify.
- **Cloudflare Pages.** Free *and* handles private Org repos — the only option
  that does both — but its apex-domain requirement forces the nameserver move the
  owner declined.
- **Moving the repo back to a personal account.** Undoes the chapter ownership
  that spec §7 calls the single most common way a chapter website dies.

### ✅ Verified live on Netlify (2026-08-21)

First deploy succeeded on Netlify's Linux runner — the build is now proven off the
owner's Windows machine. Checked against the live host, not the local `dist/`:

| Check | Result |
|---|---|
| `/join` returns 200, **not** a 301 to `/join/` | ✅ `pretty_urls = false` worked |
| Canonicals point at `https://oupikapp.com/...` | ✅ not the netlify.app host |
| Unknown path serves the 404 page | ✅ |
| `TODO` strings in delivered HTML | ✅ 0 on every page |
| Dev-only `PendingFields` banner | ✅ absent from production |
| `<h1>` per page | ✅ exactly 1 |
| `aria-current="page"` on `/join` | ✅ present |
| `/_astro/*` cache header | ✅ `public,max-age=31536000,immutable` |
| `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` | ✅ served as configured |
| Zero client-side JS | ❌ **Netlify injects a 33.7 KB HUD script** — see Gotchas |
| HSTS as configured | ⚠️ **overridden on netlify.app** — see Gotchas |

One more Netlify default worth knowing: **new sites start behind "Visitor access"
protection** and return `401` with a redirect to `app.netlify.com/edge-access` for
everyone, including you in a logged-out browser. It is not a build failure and
nothing in `netlify.toml` causes it. Site configuration → Access & security →
**Visitor access**. (There is no separate "Site protection" item despite what
older docs say.)

### Where this session stopped

`netlify.toml` is written, committed and pushed. The build is verified clean
locally (0 errors / 0 warnings / 0 hints, 3 pages, 0 `.js` files, 0 `TODO`s in
`dist/`).

Done this session: repo made public, Netlify connected, first deploy green,
live output verified. Outstanding, in order:

1. **Disable the Netlify Drawer** (dashboard) — restores the zero-JS guarantee.
2. **Wire the real numbers into `chapter.json`.** Blocks pointing the domain.
3. **Point `oupikapp.com`**, then immediately re-check the HSTS header.

**Netlify CLI is not installed and is not needed.** Use the Git integration, not
`netlify deploy` — a CLI deploy has the same defect as the Vercel CLI path: it
breaks the officer-edits-`chapter.json`-on-github.com handoff model that this
project exists to enable.

### Pointing the domain, when the numbers are in

Netlify with **external DNS** (GoDaddy keeps the nameservers):

- **Apex** `oupikapp.com` → GoDaddy does not support ALIAS/ANAME/flattened CNAME,
  so this is a plain **A record** on host `@`.
- **`www`** → **CNAME** to the project's `*.netlify.app` hostname.
- Netlify adds `www` automatically when you assign the apex, so **both** records
  are required.

⚠️ **Copy the actual values out of the Netlify dashboard.** Netlify's published
apex IP has historically been `75.2.60.5`, but spec §8 is right that no IP in any
document — this one included — should be trusted over what the dashboard shows.

⚠️ **Do not delete MX records** and **do not use GoDaddy's "Forwarding" feature**
(it breaks HTTPS and SEO). 🔒 Leave `app.oupikapp.com` alone — it is reserved for
ChapterLink.

One Netlify caveat worth knowing: with external DNS, an apex domain cannot use
Netlify's direct DNS routing, so Netlify recommends a subdomain as primary. For a
3-page static site this is not worth reversing the nameserver decision over.

### 🔴 What is actually on `oupikapp.com` today (verified 2026-09-28)

**Earlier notes called the domain "never pointed anywhere". That was wrong.**
Snapshot taken via 8.8.8.8 before cutover:

- **The apex serves a GoDaddy Website Builder "Launching Soon" page** from
  *two* A records, `13.248.243.5` and `76.223.105.230`. `www` is a CNAME to the
  apex.
  - **Unpublish the builder site, or disconnect the domain from it, *before*
    editing DNS.** Otherwise GoDaddy can lock or re-add its A records.
  - **Replace both A records.** One left behind round-robins about half of
    visitors to GoDaddy.
  - Re-check DNS the next day.
- **The domain already runs live Microsoft 365 email**, set up through GoDaddy
  (tenant `NETORG19591553.onmicrosoft.com`) and filtered by Proofpoint:
  - MX records `mx1/2/3-usg2.ppe-hosted.com`
  - SPF, and DMARC at `p=quarantine`
  - `autodiscover`, `lyncdiscover`, `sip`, `msoid`, two SRV records, `email`,
    `pay`, `_domainconnect`

  **Touch none of them.** Someone set up a mailbox on this domain. **Owner:
  find out whose it is.** It bears on account ownership (spec §7), and a real
  `@oupikapp.com` address may already exist for `chapterEmail`.
- No CAA, no AAAA, no DNSSEC, so nothing blocks Netlify's Let's Encrypt
  certificate. `app.oupikapp.com` is NXDOMAIN; leave it.
- Registration: GoDaddy, expires **2028-09-10**, registrar lock on. Auto-renew
  status and the paying card are not visible from outside. Check them in the
  account.
- The OG image and canonicals point at `oupikapp.com`, which 404s from GoDaddy
  until cutover. **Don't share links for feedback until then.** Facebook and
  LinkedIn cache the missing preview for days.

Cutover order:

1. Disable the Netlify Drawer.
2. Export the GoDaddy zone.
3. Unpublish the builder.
4. Add `oupikapp.com` in Netlify as primary.
5. Swap both A records for the dashboard IP, and point `www` at the netlify.app
   host.
6. Add the netlify.app → `oupikapp.com` 301 to `netlify.toml`.
7. Verify HSTS, the `www` redirect, `/og-default.png`, and that the Drawer is
   gone.

---

## Open questions — ask, don't assume

1. ~~**Git commit identity.**~~ Resolved 2026-08-20 — see Git status above.
2. ~~**The remote may not exist.**~~ Resolved 2026-08-20 — it exists and is private. Note that `gh` CLI is still not installed on this machine, so pushing relies on Git Credential Manager.
3. **Account ownership (spec §7) — partially resolved, still the biggest risk.**
   - Domain: GoDaddy, owner controls DNS. **Whose account and whose card is still unconfirmed.** Ask.
   - ~~GitHub.~~ **Resolved 2026-08-21.** The repo is in the `OUPikappWeb-AG` Organization with `Nswchoeffler` as admin. Spec §7's GitHub row is genuinely satisfied.
   - Hosting: **Netlify**, decided 2026-08-21, but the account is not created yet and will start out personal. The Vercel hobby account remains in play only for ChapterLink.
   - Email alias: unconfirmed.
   - The two-admin rule is met nowhere yet.
4. ~~**Vercel Pro vs. Cloudflare Pages/Netlify.**~~ Resolved 2026-08-21 — **Netlify**, free tier, DNS staying at GoDaddy. See the Hosting decision table. This is a documented deviation from `BUILD-SPEC.md` §8, which assumes Vercel throughout; the spec's DNS warnings still apply verbatim, only the record values change. Note it also splits hosting away from ChapterLink, which is on Vercel — acceptable here because this site is `output: 'static'` with no adapter, no functions and no runtime, so there is nothing for the two to share.
5. **Content still uncollected** (as of 2026-09-28):
   - what the dues include, and hardship notes
   - the all-men's GPA average (not in OU's scholarship report)
   - retention and graduation rates
   - service hours
   - alumni outcomes
   - a named chapter or alumni advisor, and whether there is a house director or live-in adult
   - the owner's revision of the `/safety` statement
   - whether national HQ permits use of official marks

   Full list in `BUILD-SPEC.md` §11. Already in: founding year, address,
   Instagram, GPA with comparison, photos.

---

## Working preferences

The owner has asked for: **questions over assumptions**, thoroughness over speed, and industry-standard code. Surface trade-offs and let them decide rather than quietly picking. (The earlier request for placeholder "Example" copy was superseded on 2026-09-09; see hard rule 3.)

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
