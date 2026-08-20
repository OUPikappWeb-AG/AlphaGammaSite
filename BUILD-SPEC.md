# oupikapp.com — Build Spec & Handoff Doc

**Project:** Public-facing website for Alpha Gamma Chapter, Pi Kappa Phi — University of Oklahoma
**Domain:** `oupikapp.com` (GoDaddy DNS → Vercel)
**Stack:** Astro + Tailwind + TypeScript, static output
**Owner at time of writing:** Nicholas Schoeffler
**Status:** Spec v1 — ready to hand to Claude Code

---

## 0. How to use this document

- **Claude Code:** read Sections 1–9 before writing code. Build in the phase order in Section 10.
- **Future chapter officer:** you want `EDITING.md` in the repo, not this file. This is the *why*; that is the *how*.
- **Anything marked 🔴 OPEN** needs a human answer before that piece gets built.

---

## 1. What this site is for

### The single job

> A parent hears "I'm rushing Pi Kappa Phi," googles it, lands here, and closes the tab feeling **relieved**.

Everything else is secondary. If a design or copy choice doesn't serve that, cut it.

### Audiences, ranked

| # | Audience | What they need | Where they land |
|---|---|---|---|
| 1 | **Parents** | Safety, academics, cost, outcomes | `/parents`, but they'll enter via `/` |
| 2 | **PNMs** | Brotherhood, the house, what you do | `/`, `/join` |
| 3 | **Alumni & donors** | Proof it's still worth their name | `/ability-experience`, `/about` |
| 4 | **Current members** | One button to the portal | Nav, top-right |

### Explicit non-goals for v1

- ❌ Member management, dues, rosters — that is `app.oupikapp.com`, a separate future product
- ❌ Login, auth, or any database
- ❌ Blog / news feed (nobody will maintain it; dead blogs actively hurt trust)
- ❌ Event calendar with dates and times (security risk, always stale)
- ❌ Photo gallery in v1 — phase 3

---

## 2. Content strategy

### The parent checklist

Most chapter sites lead with brotherhood photos and stop. Parents are scanning for a different list. Hit all of it:

| Item | Why it matters | Data location |
|---|---|---|
| Chapter GPA **vs. all-men's average vs. all-fraternity average** | Context is the whole point. A bare "3.21" means nothing. | `chapter.json → academics` |
| Anti-hazing position, stated plainly | The #1 unspoken fear. Say it directly, in your own words, above the fold on `/parents`. | `/parents` MDX |
| **Full dues breakdown** | Transparency here outperforms any photo. New member semester vs. active semester, what's included, payment plan availability. | `chapter.json → dues` |
| Service hours per year | Core ask | `chapter.json → service` |
| Ability Experience funds raised | Core ask | `chapter.json → abilityExperience` |
| Retention / graduation rate | Signals the chapter isn't a revolving door | `chapter.json → academics` |
| Alumni outcomes | Companies, grad schools, cities | `chapter.json → alumniOutcomes` |
| **A named human with a real email** | Converts anxiety into a conversation | `chapter.json → contact` |
| Housing details | Live-in requirement? Meal plan? Cost? | `/about` MDX |

### The Ability Experience is your best asset — give it a page

The Ability Experience is Pi Kappa Phi's national philanthropy, and it is unusually strong material for a parent audience. Most chapters bury it in a stat card. Don't.

Give it `/ability-experience` and cover:

- What it is, in one plain paragraph — no jargon
- **Journey of Hope** — cyclists ride across the country
- **Build America** / **Gear Up Florida** — the other summer programs
- **War of the Roses** — the campus-level event
- What *Alpha Gamma specifically* did: dollars raised, hours served, who participated, which local partners
- One photo of your guys actually doing it — not a stock cyclist

A parent reading that their son's fraternity does this is the moment you win.

### Copy voice

- Plain, declarative, specific. Numbers over adjectives.
- Never: "unparalleled brotherhood," "we strive to," "second to none," "like no other."
- Write like a good admissions office, not like a fraternity.
- Sentence case for headings. Active voice. No exclamation points.

---

## 3. Site map (v1)

```
/                       Home
/about                  Chapter history, the house, values
/ability-experience     Philanthropy — the deep page
/parents                For Parents — safety, academics, cost
/join                   Recruitment — how to rush, contact, dates
/404
```

**Phase 3 additions:** `/leadership`, `/alumni`, `/gallery`

### Navigation

```
[ ΠΚΦ Alpha Gamma ]   About   Ability Experience   For Parents   Join        [ Member Sign In ↗ ]
```

- "Member Sign In" is **visually separate** — outline button, right-aligned, not a nav link
- Opens in a new tab. `target="_blank" rel="noopener noreferrer"`
- URL comes from `chapter.json → links.memberPortal` — never hardcoded in a component
- Member sign in is to Chapterlink the other site Nicholas built. it is reachable at https://chapterlink.app/signin

### Footer

- Contact email (chapter alias, not personal)
- House address
- Link to `pikapp.org` and `abilityexperience.org`
- Instagram
- **Disclaimer:** "This site is maintained by the Alpha Gamma Chapter of Pi Kappa Phi at the University of Oklahoma. It is not an official publication of Pi Kappa Phi Fraternity."
- `Last reviewed: {chapter.json → lastReviewed}` — pulled from data, renders automatically

---

## 4. Design direction

**Do not build a "fraternity website."** Build something closer to a small college's admissions site crossed with an annual report. That register is what reassures parents, and it's what nobody else in OU Greek life is doing.

### Thesis

The chapter's numbers *are* the argument. So typeset them like a **record**, not like marketing. Ledger rules, tabular figures, an "as of" date under every stat. The design should feel accountable.

### Palette

Derived from Pi Kappa Phi's actual colors — gold and white primary, royal blue auxiliary, red rose as the flower.

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0E1626` | Primary ground, headings |
| `royal` | `#1D3B6E` | Secondary surfaces, links |
| `gold` | `#C8A247` | Accent rules, stat emphasis — **used sparingly** |
| `paper` | `#F7F5F0` | Page background |
| `slate` | `#5B6472` | Secondary text, captions |
| `rose` | `#8C1D2E` | **Reserved exclusively for Ability Experience.** Nowhere else. |

Reserving rose for philanthropy means the color itself carries meaning — a reader learns it without being told.

### Type

All free via Google Fonts. Self-host with `@fontsource` for performance.

| Role | Face | Notes |
|---|---|---|
| Display | **Newsreader** | Headlines, chapter name. Institutional with real character. |
| Body | **Public Sans** | Paragraphs, nav. Clean, not Inter. |
| Data | **IBM Plex Mono** | All statistics, labels, eyebrows, "as of" dates. Tabular figures on. |

The mono face on every number is the signature move. It makes the stats read as *reported* rather than *claimed*.

### Signature element

**The Chapter Record** — a full-width band on the home page presenting the core stats as a ledger: hairline gold rules, mono numerals, small-caps labels, and an `as of` stamp on each line. Not gradient stat cards. Not big-number-with-tiny-label.

### Discipline

- One risk, spent on the Chapter Record. Everything else quiet.
- Photography does the emotional work; the layout stays restrained.
- Motion: scroll-reveal on the Chapter Record only. Respect `prefers-reduced-motion`.
- Border radius: minimal (2–4px). Avoid the soft-rounded SaaS look.
- **Avoid:** cream + high-contrast serif + terracotta accent. That's the current AI-design default and it reads as generic.

---

## 5. Content architecture — the handoff crux

**Design rule:** every routine edit must be doable from **github.com in a browser, on a phone, in under 60 seconds**, without cloning, installing, or running anything.

### Repo structure

```
oupikapp-web/
├─ README.md                  ← START HERE. What this is, how to run, how to deploy.
├─ EDITING.md                 ← Task-based runbook for non-developers. THE handoff doc.
├─ HANDOFF.md                 ← Accounts, ownership, officer-turnover checklist.
├─ astro.config.mjs
├─ tailwind.config.mjs
├─ package.json
├─ public/
│  ├─ favicon.svg
│  ├─ robots.txt
│  └─ og-default.jpg
└─ src/
   ├─ assets/
   │  └─ photos/              ← ALL images. Drop file here, reference filename in data.
   ├─ components/
   │  ├─ ChapterRecord.astro  ← the signature stat band
   │  ├─ StatLine.astro
   │  ├─ Nav.astro
   │  ├─ Footer.astro
   │  ├─ PhotoBand.astro
   │  ├─ CTAButton.astro
   │  └─ FAQ.astro
   ├─ layouts/
   │  └─ Base.astro           ← SEO, OG tags, fonts, skip-link
   ├─ pages/
   │  ├─ index.astro
   │  ├─ about.astro
   │  ├─ ability-experience.astro
   │  ├─ parents.astro
   │  ├─ join.astro
   │  └─ 404.astro
   ├─ content/                ← MDX for long-form prose
   │  ├─ config.ts            ← Zod schemas
   │  └─ pages/
   │     ├─ about.mdx
   │     ├─ parents.mdx
   │     └─ ability-experience.mdx
   ├─ data/
   │  ├─ chapter.json         ← THE single source of truth for numbers & contact
   │  ├─ leadership.json
   │  ├─ faq.json
   │  └─ history.json
   ├─ lib/
   │  └─ images.ts            ← resolves filename → optimized asset
   └─ styles/
      └─ global.css
```

### `src/data/chapter.json` — the one file that matters

Every number on the site comes from here. One file. Heavily commented via a sibling `chapter.schema.ts` with Zod, so a bad edit fails the build with a readable error instead of shipping broken.

```jsonc
{
  "lastReviewed": "2026-08-17",

  "identity": {
    "chapterName": "Alpha Gamma",
    "school": "University of Oklahoma",
    "founded": "TODO",
    "nationalFounded": "1904"
  },

  "links": {
    "memberPortal": "https://gateway.pikapp.org",
    "national": "https://pikapp.org",
    "abilityExperience": "https://abilityexperience.org",
    "instagram": "TODO"
  },

  "contact": {
    "recruitmentChair": {
      "name": "TODO",
      "email": "recruitment@oupikapp.com",
      "phone": "TODO"
    },
    "houseAddress": "TODO"
  },

  "academics": {
    "chapterGPA":        { "value": 0.00, "asOf": "Spring 2026", "source": "OU FSPL report" },
    "allMensAverage":    { "value": 0.00, "asOf": "Spring 2026", "source": "OU FSPL report" },
    "allFraternityAvg":  { "value": 0.00, "asOf": "Spring 2026", "source": "OU FSPL report" },
    "retentionRate":     { "value": 0,    "asOf": "2025-26",     "source": "Chapter records" },
    "gradRate":          { "value": 0,    "asOf": "2025-26",     "source": "Chapter records" }
  },

  "service": {
    "hoursPerYear":   { "value": 0, "asOf": "2025-26", "source": "Chapter service log" },
    "hoursPerMember": { "value": 0, "asOf": "2025-26", "source": "Chapter service log" }
  },

  "abilityExperience": {
    "raisedThisYear":  { "value": 0, "asOf": "2025-26", "source": "Chapter treasurer" },
    "raisedAllTime":   { "value": 0, "asOf": "2026",    "source": "Chapter treasurer" },
    "journeyOfHopeRiders": { "value": 0, "asOf": "2026", "source": "Chapter records" }
  },

  "membership": {
    "activeMembers": { "value": 0, "asOf": "Fall 2026", "source": "Chapter roster" },
    "pledgeClassSize": { "value": 0, "asOf": "Fall 2025", "source": "Chapter roster" }
  },

  "dues": {
    "newMemberSemester": { "value": 0, "asOf": "Fall 2026" },
    "activeSemester":    { "value": 0, "asOf": "Fall 2026" },
    "includes": ["TODO", "TODO"],
    "paymentPlansAvailable": true,
    "notes": "TODO — one sentence on financial aid or hardship options if any exist."
  },

  "alumniOutcomes": {
    "companies": ["TODO"],
    "gradSchools": ["TODO"]
  }
}
```

### Why `asOf` and `source` on every stat

Three reasons, all load-bearing:

1. **Credibility.** The site renders "3.21 — as of Spring 2026" under each number. Parents trust dated figures.
2. **Accountability.** If someone asks where a number came from, the answer is in the repo.
3. **Anti-rot.** Stale dates are *visible*. A site claiming "as of Spring 2024" in 2028 embarrasses itself into being updated.

### Images

- Drop the file in `src/assets/photos/`
- Reference it by **filename only** in JSON or MDX: `"photo": "house-front.jpg"`
- `src/lib/images.ts` resolves via `import.meta.glob` and hands it to `astro:assets` for optimization
- Successor never touches an import statement

**Photo rules — put these in EDITING.md in bold:**

- **Export at max 2000px wide, under 400KB, before committing.** Use [squoosh.app](https://squoosh.app).
- **No alcohol visible in any photo. Ever.** Non-negotiable — parent site and national risk-management policy.
- **Written consent before publishing an identifiable member.** A text message saying yes is fine; save it.
- Every photo needs alt text. It's a required field in the schema; the build will fail without it.

### The CMS hedge

Content lives in Astro Content Collections with Zod schemas from day one. If a future exec board is non-technical, **Sveltia CMS** (free, GitHub-backed, no server) can be added in ~2 hours and gives them a visual editor pointed at the exact same files. No migration. Note this in `HANDOFF.md` so a successor knows the door exists.

---

## 6. Documentation deliverables

Claude Code must produce all three. These are as much a deliverable as the site.

### `README.md` — one page, max

- What this is, who it's for
- `npm install` → `npm run dev` → `npm run build`
- How deploys work (push to `main` → Vercel auto-deploys)
- Where to find EDITING.md and HANDOFF.md
- Node version

### `EDITING.md` — task-based, written for someone who has never used git

Structure it as **"I want to…"** headings, each with numbered steps referencing the GitHub web UI:

- I want to change the service hours number
- I want to update the chapter GPA
- I want to add a photo
- I want to change the recruitment chair's contact info
- I want to update dues for next semester
- I want to fix a typo
- I want to add an FAQ question
- I want to change the Member Sign In link
- **Something broke and the site won't update** → check Vercel deployment log, link included

Every entry: exact file path, exact field, what "commit" means in one sentence, and what happens next (2-min auto-deploy).

### `HANDOFF.md` — the officer-turnover doc

- **Accounts inventory:** GitHub org, Vercel, GoDaddy, Google Workspace / email alias — with *who owns each* and *what email it's under*
- **Renewal dates:** domain expiration, any paid services
- **Turnover checklist:** what to transfer, in what order, when
- **Semester maintenance ritual:** update `lastReviewed`, refresh all stats, verify links, swap seasonal photos
- The Sveltia CMS escape hatch, described above

### Automated maintenance nudge

Add `.github/workflows/semester-review.yml` — a scheduled GitHub Action that opens an issue on **August 1** and **January 1** each year:

> "Semester content review due. Update `chapter.json` stats, refresh `lastReviewed`, verify Member Sign In link, check photos."

Costs nothing. Survives every officer transition. This is the highest-leverage 20 lines in the repo.

---

## 7. 🔴 Account ownership — read this before building anything

**The most common way a chapter website dies is not code. It's that the guy who built it graduated and the domain was on his personal credit card.**

Fix this now, before writing a line:

| Asset | Must be owned by | Not |
|---|---|---|
| GoDaddy domain | Chapter account, chapter email, chapter card or house corp card | Your personal GoDaddy |
| GitHub | The chapter **Organization** (already created ✓) | Your personal repo |
| Vercel | Vercel **Team**, connected to the GitHub org | Your personal hobby account |
| Email alias | Chapter Google Workspace or forwarding alias | Your OU email |

Add at least two admins to every one of these — you and one other officer, ideally an alumni advisor who won't graduate. Record all of it in `HANDOFF.md`.

If the GoDaddy registration is currently on your personal email, **move it before the site launches.** It gets exponentially harder later.

---

## 8. Deployment — GoDaddy → Vercel

### Order of operations

1. Push repo to the chapter GitHub Org
2. In Vercel (Team account), import the repo — Astro is auto-detected, no config needed
3. Add `oupikapp.com` and `www.oupikapp.com` as domains in Vercel project settings
4. **Vercel will display the exact DNS records to create.** Use those values.
5. In GoDaddy → Domain → DNS → Manage Zones, add the records Vercel gave you

### DNS notes

- **Do not trust IP addresses written in any document, including this one.** Vercel's apex A record has historically been `76.76.21.21`, but always copy the current value from the Vercel dashboard.
- `www` is typically a CNAME to `cname.vercel-dns.com` — again, confirm in Vercel.
- ⚠️ **Do not delete MX records.** If chapter email runs on this domain, removing MX kills it instantly.
- ⚠️ **Do not use GoDaddy's "Forwarding" feature.** It breaks HTTPS and SEO. Use real DNS records only.
- 🔒 **Reserve `app.oupikapp.com`.** That subdomain is spoken for by the future member-management platform. Leave a comment in `HANDOFF.md` so a successor doesn't point it somewhere.
- Propagation is usually minutes on GoDaddy, occasionally up to a few hours. SSL provisions automatically once DNS resolves.

### Post-launch

- Enable **Vercel Analytics** (free tier, one line in the layout) — you'll want to know if the parents page is actually getting traffic
- Add `@astrojs/sitemap`
- Submit to Google Search Console — parents will search "OU Pi Kappa Phi"

---

## 9. Technical requirements

### SEO / metadata

- Unique `<title>` and meta description per page, in `Base.astro` via props
- Open Graph + Twitter card tags — when a parent texts the link, it must preview well. This matters more than it sounds.
- `Organization` JSON-LD schema with name, address, logo, sameAs links
- `@astrojs/sitemap`
- Semantic HTML: one `<h1>` per page, real heading hierarchy

### Accessibility — quality floor, non-negotiable

- Every image has meaningful alt text (enforced by Zod schema)
- Visible keyboard focus rings
- Skip-to-content link
- Color contrast ≥ 4.5:1 for body text — **verify gold on paper; it likely fails and needs darkening for text use.** Gold is a rule-and-accent color, not a text color.
- `prefers-reduced-motion` respected

### Performance

- Target Lighthouse ≥ 95 on mobile. Parents check phones.
- Zero client-side JS by default (Astro's whole point). Only the mobile nav toggle needs it.
- Self-host fonts via `@fontsource`, preload the display face
- All images through `astro:assets` → WebP, lazy, explicit width/height

### Build safety

- Zod schemas on all content collections — a malformed edit fails the build with a readable message rather than silently shipping
- Astro's link checker or a simple build-time assert that no `TODO` string reaches production on launch-critical fields

---

## 10. Build order

Rush is happening now. Ship something real on day one and layer.

| Phase | Scope | Est. | Gate |
|---|---|---|---|
| **0** | Repo scaffold, Astro + Tailwind + fonts, `Base.astro`, DNS live, placeholder deployed | 1–2 hr | Site resolves at `oupikapp.com` over HTTPS |
| **1** | Home page + `/join` + Member Sign In button + footer + `chapter.json` wired | 3–4 hr | **Shippable. Push it live.** |
| **2** | `/parents` + `/ability-experience` | 3–4 hr | The two pages that actually do the work |
| **3** | `/about` (house, history), leadership, FAQ | 2–3 hr | |
| **4** | README, EDITING.md, HANDOFF.md, GitHub Action, analytics, Search Console | 2 hr | **Do not skip. This is the actual deliverable.** |
| **5** | Photo gallery, alumni page | later | Only if someone will maintain it |

---

## 11. Content you still need to collect

Photos, service hours, Ability Experience dollars, and GPA stats are confirmed in hand. Remaining gaps:

- [ ] 🔴 Exact Member Sign In URL (ChapterLink vs. Chapter Gateway)
- [ ] Alpha Gamma chapter founding year at OU
- [ ] Full dues breakdown — both tiers, what's included, payment plan policy
- [ ] Comparison GPA figures (all-men's average, all-fraternity average) from OU's Fraternity & Sorority Programs report
- [ ] Retention and graduation rate
- [ ] Alumni outcomes — 8–12 companies, a few grad schools
- [ ] Recruitment chair name, chapter email alias, phone
- [ ] House address
- [ ] Chapter Instagram handle
- [ ] Anti-hazing paragraph — write it yourself, in plain language. Don't paste national's policy text.
- [ ] Housing details: live-in requirement, meal plan, cost
- [ ] Official Pi Kappa Phi mission statement — pull verbatim from `pikapp.org`
- [ ] 🔴 Confirm with national HQ whether the chapter may use the coat of arms / official marks on a public site

---

## 12. Kickoff prompt for Claude Code

Paste this to begin:

```
Read BUILD-SPEC.md in full before writing any code.

Build Phase 0 and Phase 1 only (Section 10).

Stack: Astro, Tailwind, TypeScript, static output, deploying to Vercel.

Requirements:
- Follow the design direction in Section 4 exactly — palette tokens, the three
  typefaces, and the "Chapter Record" signature element. Do not substitute a
  cream/serif/terracotta look.
- All statistics render from src/data/chapter.json. No number is ever hardcoded
  in a component. Every stat displays its "asOf" value beneath it.
- Set up Zod schemas for chapter.json and all content collections now, even
  though most values are TODO placeholders.
- Build the image resolution helper in src/lib/images.ts as described in
  Section 5 — filename-only references, no imports in data files.
- The Member Sign In button reads its URL from chapter.json → links.memberPortal.
- Accessibility floor from Section 9 is a hard requirement, not a nice-to-have.
  Check gold-on-paper contrast and darken the gold for any text use.

Populate every unknown value with a clearly-marked TODO placeholder. Do not
invent statistics, names, or dates.

Stop after Phase 1 and show me the home page before continuing.
```

---

## 13. Decision log

Record why, so a successor doesn't undo it.

| Decision | Rationale |
|---|---|
| Astro over Next.js | Static content site, zero JS needed, faster builds, simpler for a successor to reason about |
| No CMS in v1 | Current maintainer is comfortable with GitHub. Sveltia can be added later with zero content migration. |
| JSON data files over MDX for stats | One file, one source of truth, editable on a phone, schema-validated |
| `asOf` on every stat | Credibility with parents + makes staleness visible + forces maintenance |
| Rose color reserved for Ability Experience | Color carries meaning; reader learns the association without being told |
| Vercel over Netlify/Cloudflare | Already in use elsewhere in this stack; team account keeps ownership chapter-side |
| Dues published in full | Transparency is the single highest-trust signal available for a parent audience |
| No public event calendar | Security risk and guaranteed to go stale |
