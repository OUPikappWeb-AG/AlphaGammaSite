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

At the repo root, `netlify.toml` is the deploy config — build command, Node
version, cache and security headers, and the `pretty_urls` override described
under Gotchas. Settings there **override the Netlify dashboard**, deliberately:
a UI toggle is invisible to the next officer, a file in the repo is not.

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
| `STRICT_CONTENT` launch gate is **opt-in**, not always-on | An always-on "no TODO in production" assert would block the Phase 1 deploys needed now. Set `STRICT_CONTENT=1` as a Netlify environment variable at real launch. |
| Nav items carry a `ready: boolean` flag | Phase 2/3 pages don't exist yet. A 404 on a trust-building site is worse than a missing link. Flip the flag when a page ships. |
| Added `contact.chapterEmail` to the schema | The footer needs a chapter alias, but the spec's sample JSON had no field for it. |
| Added `PendingFields.astro`, a **dev-only** banner | The public site hides `TODO`s; without this an officer loses track of what's missing. Stripped from production builds. |
| Added `.gitattributes` with `eol=lf` | The whole handoff plan depends on editing files on github.com, which writes LF. Without normalisation, browser edits and Windows edits produce whitespace-only diffs. |
| Placeholder `og-default.png` generated with sharp | Real social card should eventually use a photo. Current one is ink/gold typographic. |

### Hosting decision (2026-08-21)

| Decision | Rationale |
|---|---|
| **Netlify, not Vercel and not Cloudflare Pages** | Netlify is free, keeps push-to-deploy, and — unlike Cloudflare Pages — attaches an apex domain while DNS stays **external**. The owner explicitly does not want to move nameservers off GoDaddy. |
| **Nameservers stay at GoDaddy** | Cloudflare Pages requires the domain to be a Cloudflare zone before it will serve an apex custom domain. That means recreating every DNS record including MX, which spec §8 flags in red. Netlify takes a plain A record instead, so the GoDaddy zone gets edited, never rebuilt. |
| Repo stays **private on the personal account** for now | The owner's call, 2026-08-21. See the 🔴 landmine under Deployment status — this decision has a delayed cost, not a zero cost. |
| `pretty_urls = false` in `netlify.toml` | Netlify's default would 301 `/join` → `/join/`, pointing every canonical tag at a redirect. See Gotchas. |
| Long-cache headers on `/_astro/*` | Filenames are content-hashed, so a changed file is a changed URL and these are safe to cache forever. That path is most of the first-paint payload — ~97 KB of it fonts. |
| **No Content-Security-Policy** | The nav toggle and scroll reveal are inline scripts, and a static site cannot issue per-request nonces. Any CSP strict enough to be worth having would break them. Revisit only if those inline scripts go. |

---

## Gotchas already hit

**Path normalisation — do not bypass `src/lib/url.ts`.**
Setting `build.format: 'file'` caused two bugs at once: canonical tags published as `https://oupikapp.com/index.html`, and `aria-current="page"` **never rendered at all**, silently killing the nav's active state. Both came from `Astro.url.pathname` varying with build format. Fixed by routing every path comparison and every published URL through `canonicalPath()`. If you add a page or touch nav logic, use that helper.

**Zod 4 deprecations.** `z.string().url()` and `z.string().email()` emit hints. Use `z.url()` and `z.email()`.

**Inline scripts in `<head>`** need an explicit `is:inline` directive when they carry attributes, or `astro check` emits a hint.

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

Hosting is decided (Netlify — see Decisions). What is left, in order:

1. **Connect the repo to Netlify.** Owner-only step: it needs a Netlify login and
   the Netlify GitHub App installed on `oupikappweb`. `netlify.toml` already
   carries the build settings, so accept whatever Netlify auto-detects — do not
   retype the build command into the UI, where it would silently take priority.
2. **Confirm the site builds on Netlify's Linux runner**, not just on the owner's
   Windows machine. Watch for the Node version: `netlify.toml` pins 24.
3. **Wire in the real numbers.** The owner holds GPA, service hours, Ability
   Experience dollars, and photos. Single highest-leverage change on the site and
   it needs no new code — only `chapter.json`, plus each figure's `asOf` and
   `source`.
4. **Then** point `oupikapp.com` (spec §8: copy the exact records **Netlify**
   shows, never IPs from a doc — including this one — and do not touch MX
   records).
5. Then Phase 2 — `/parents` and `/ability-experience`. The owner must write the
   anti-hazing paragraph themselves; do not draft it for them.

---

## Current status

**Phase 0 and Phase 1 are code-complete but NOT deployed.** Build is clean; 3 pages generate.

Both phases' gates in `BUILD-SPEC.md` §10 are about *shipping*, not about code:

- Phase 0 gate — "Site resolves at `oupikapp.com` over HTTPS" — **not met.**
- Phase 1 gate — "Shippable. Push it live." — **not met.**

Hosting is now **decided — Netlify** (2026-08-21), and `netlify.toml` is in the
repo, but **no Netlify account has been connected**, so nothing is serving yet.

Re-verified 2026-08-21 against the Vercel account, unchanged: one team
(`nwschprojects-7699's projects`, a personal hobby account) holding one project
(`chapter-app`, which is ChapterLink — a different product). Vercel is no longer
this site's host; that account matters only to ChapterLink now.

Do not record these phases as done until the domain actually serves the site.

Measured at end of session:

- `TODO` strings reaching built HTML: **0** across all pages
- JavaScript files emitted: **0** (both scripts inline)
- First-paint payload: **~142 KB** uncompressed, 97 KB of it fonts
- `astro check`: 0 errors / 0 warnings / 0 hints
- Sitemap contains only `/` and `/join`; 404 correctly excluded

### Built

`index.astro`, `join.astro`, `404.astro`, `Base.astro`, all eight components, the full data layer (`chapter.json` + Zod schema + validated loader), `images.ts`, `url.ts`, `nav.ts`, favicon, robots.txt, OG card, apple-touch icon, and `netlify.toml` (2026-08-21).

### Not yet built

- **Phase 2:** `/parents`, `/ability-experience` ← the two pages that do the actual persuading
- **Phase 3:** `/about`, leadership, FAQ — plus `src/content/` collections, `leadership.json`, `faq.json`, `history.json`, `FAQ.astro`
- **Phase 4:** `README.md`, `EDITING.md`, `HANDOFF.md`, `.github/workflows/semester-review.yml`, analytics, Search Console. **Spec calls these a deliverable, not an afterthought — do not skip.**
  - ⚠️ The spec says "Vercel Analytics (free tier, one line in the layout)". That
    is off the table now. **Netlify Analytics is $9/mo per site, not free**, so
    analytics is an unresolved choice, not a one-liner — and hard rule 8 (no
    client-side JavaScript) rules out most drop-in scripts. Ask the owner before
    adding anything.

---

## Git status — read before touching version control

**History now exists and is pushed** (2026-08-20). `main` tracks `origin/main`; 32 files tracked; working tree clean.

```
43e7299  Document push access decision and the misleading private-repo 404
9f2a4a5  Initial commit: Phase 0 and Phase 1
```

- Remote is `https://github.com/oupikappweb/AlphaGammaSite.git`. The repo **exists and is private** — that is why an unauthenticated `git ls-remote` reported *repository not found*. It was never missing.
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

### 🔴 `oupikappweb` is a User account, not an Organization

`BUILD-SPEC.md` §7 states the chapter **Organization** is "already created ✓". **That is factually wrong.** Verified 2026-08-20:

```bash
curl -s https://api.github.com/users/oupikappweb | grep '"type"'
#   "type": "User",
```

This is not pedantry — it changes what is possible:

- On a **personal** repo, collaborators get push access only. There is no Admin role to grant; that dropdown exists only on Organization repos.
- **Git integrations need admin rights** on the repo — they install a webhook and a deploy key. So `Nswchoeffler` can push, but cannot connect this repo to a host. Now that the host is **Netlify**, the practical form of this is: the Netlify GitHub App has to be installed by `oupikappweb` (on a personal repo, only the owner can); on an Org repo an Org owner installs it, or a member requests it and an owner approves.

The owner has since created a separate GitHub Org and added `Nswchoeffler` to it as admin. **The repo had not been transferred into that Org as of the end of the session** — the remote still points at `oupikappweb`. Confirm before assuming.

Two things that block the transfer if overlooked:

1. The transfer must be initiated by the repo's owner — signed in as `oupikappweb`, repo → Settings → Danger Zone → Transfer ownership.
2. `oupikappweb` must be a member of the destination Org with permission to create repos there, or the Org will not appear as a valid destination. It can be removed afterward; the repo stays.

After any transfer, update the local remote — GitHub redirects the old URL, but a stale remote pointing at a personal account will mislead the next officer.

---

## Deployment status — decided, not yet live (verified 2026-08-21)

`oupikapp.com` **is registered at GoDaddy and the owner controls DNS.** It has
never been pointed anywhere. **DNS stays at GoDaddy** — that constraint is what
selected the host.

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
| **Netlify + private repo on personal acct** ← chosen | ✅ | ✅ | ❌ *(for now)* | Breaks on Org transfer |
| Netlify + **public** Org repo | ✅ | ✅ | ✅ | Repo must be public |
| Netlify + private Org repo | ~$19/mo | ✅ | ✅ | Money |
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

### 🔴 The landmine this decision leaves behind

The repo is **private and on the `oupikappweb` personal account**, which Netlify's
free tier supports. **Organization-owned private repos, it does not.** So the day
someone transfers this repo into the chapter GitHub Org — the transfer spec §7
asks for, and which is still on the to-do list — **Netlify builds will start
failing.**

The owner accepted this knowingly on 2026-08-21 in exchange for shipping now.
Whoever does that transfer must do one of these *at the same time*:

- **Make the repo public** (nothing in it is secret — `chapter.json` holds only
  data the site already publishes, there are no keys and no database), or
- **Pay for Netlify's paid tier** (~$19/mo), or
- **Move to Cloudflare Pages** and accept the nameserver migration.

The failure will not be self-explanatory. Netlify reports it as a build/permission
error, not as "your plan does not cover this." **Do not debug it as a build
problem.**

### Where this session stopped

`netlify.toml` is written, committed and pushed. The build is verified clean
locally (0 errors / 0 warnings / 0 hints, 3 pages, 0 `.js` files, 0 `TODO`s in
`dist/`). No Netlify account has been connected yet — that step needs the owner,
because it opens a browser and installs the Netlify GitHub App.

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

### 🔴 Do not point `oupikapp.com` yet

Every value in `chapter.json` is still `null`, so the Chapter Record — the one designed risk the whole page is built around — renders "Not yet reported" straight down the column. A parent landing on that during rush gets the *opposite* of the reassurance this site exists to create.

Order to follow: **deploy to a `*.netlify.app` URL → wire in the real numbers → then point the domain.** The owner holds the GPA, service hours, Ability Experience dollars, and photos already.

---

## Open questions — ask, don't assume

1. ~~**Git commit identity.**~~ Resolved 2026-08-20 — see Git status above.
2. ~~**The remote may not exist.**~~ Resolved 2026-08-20 — it exists and is private. Note that `gh` CLI is still not installed on this machine, so pushing relies on Git Credential Manager.
3. **Account ownership (spec §7) — partially resolved, still the biggest risk.**
   - Domain: GoDaddy, owner controls DNS. **Whose account and whose card is still unconfirmed.** Ask.
   - GitHub: an Org now exists with `Nswchoeffler` as admin, but the repo may still sit under the `oupikappweb` User account. Confirm, don't assume.
   - Hosting: **Netlify**, decided 2026-08-21, but the account is not created yet and will start out personal. The Vercel hobby account remains in play only for ChapterLink.
   - Email alias: unconfirmed.
   - The two-admin rule is met nowhere yet.
4. ~~**Vercel Pro vs. Cloudflare Pages/Netlify.**~~ Resolved 2026-08-21 — **Netlify**, free tier, DNS staying at GoDaddy. See the Hosting decision table. This is a documented deviation from `BUILD-SPEC.md` §8, which assumes Vercel throughout; the spec's DNS warnings still apply verbatim, only the record values change. Note it also splits hosting away from ChapterLink, which is on Vercel — acceptable here because this site is `output: 'static'` with no adapter, no functions and no runtime, so there is nothing for the two to share.
5. **Content still uncollected:** founding year, dues breakdown, comparison GPAs, retention/graduation rates, alumni outcomes, recruitment chair details, house address, Instagram handle, housing details, anti-hazing paragraph, and whether national HQ permits use of official marks. Full list in `BUILD-SPEC.md` §11.

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
