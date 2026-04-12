# Hyeland — Project Context for Claude

## What is Hyeland?

A Next.js web app for selling fractional land plots in Armenia to diaspora Armenians and locals.

**Brand:** Hyeland = Hye (հայ, Armenian) + land, also Highland = Armenian Highlands (Հայկական լեռնաշխարհ). Dual meaning is intentional — works for both local and diaspora audiences without translation.
**Tagline:** "Own a piece of the Highland"

---

## Tech Stack

- **Framework:** Next.js (App Router), TypeScript
- **Styling:** Inline styles (no Tailwind or CSS modules)
- **Storage:** Cloudflare R2 (S3-compatible) for admin-edited content overrides
- **Hosting:** Hetzner — manual deploy (SSH → git pull → restart)
- **CI/CD:** GitHub Actions triggers Coolify deploy webhook on push to main
- **Auth:** next-auth (admin panel)
- **Animations:** Framer Motion

---

## Repository Structure

```
app/
  [locale]/
    page.tsx              — Local landing page
    diaspora/page.tsx     — Diaspora landing page
  admin/
    (auth)/login/         — Admin login
    (panel)/
      page.tsx            — Admin dashboard
      local/page.tsx      — Edit local landing (13 tabs)
      diaspora/page.tsx   — Edit diaspora landing (15 tabs)
      navigation/page.tsx — Edit nav links
      how-it-works/       — Edit how-it-works section

components/
  layout/
    Navbar.tsx            — Logo (currently 53px height), nav links, locale switcher
    LocaleSwitcher.tsx
  sections/
    local/                — Local landing sections
    diaspora/             — Diaspora landing sections
  plots/
    PlotField.tsx         — Entry point (dynamic import, ssr:false)
    PlotFieldStatic.tsx   — SVG renderer with hover/select/sold/reserved states

lib/
  r2.ts                   — r2Put(), r2GetText(), S3Client
  content.ts              — readJson() with R2 override + fs fallback merge
  blob-content.ts         — readBlobOrFs() helper
  i18n.ts                 — LOCALES = ['hy', 'en']
  session.ts              — requireSession()
  plot-grid.ts            — bilinear interpolation, haversine, grid generation
  plot-projection.ts      — GPS → SVG pixel projection

data/
  plot-field.json         — Static config: GPS corners, grid size, plot overrides

content/
  [locale]/nav.json
  [locale]/local.json
  [locale]/diaspora.json
  how-it-works.json
  activity-log.json

scripts/
  migrate-blob-to-r2.ts   — One-time migration from Vercel Blob → R2
  generate-illustration.py
  fetch-satellite.py
```

---

## Content Strategy

Content JSON files live in `content/` (filesystem, git-tracked). R2 is the **override layer** for admin edits — it does not replace the filesystem, it merges on top.

**Merge logic in `lib/content.ts`:**
1. Read filesystem JSON → provides defaults (new fields survive admin saves)
2. Read R2 object at same key → provides admin overrides
3. Return `{ ...fsData, ...r2Data }`

**R2 keys** mirror filesystem paths: `content/hy/local.json`, `content/how-it-works.json`, etc.

**`data/plot-field.json`** is static — bundled at build time, NOT R2-managed. To update GPS or pricing, edit file and redeploy.

---

## Admin Panel (`/admin`)

Protected by next-auth session. Tabs save to R2, then call `/api/admin/save` which:
1. Writes JSON to R2
2. Appends to activity log
3. Calls `revalidatePath()` for affected pages + `revalidatePath('/', 'layout')` + `revalidatePath('/[locale]', 'layout')` + `revalidatePath('/[locale]/diaspora', 'page')`

### Local page tabs (13):
Hero, Problem, How It Works, Dashboard, Health, Convenience, Progress, Plot Map, Farmer, Seasonal, Trust, FAQ, About, CTA

### Diaspora page tabs (15):
Hero, Problem, How It Works, Health, Convenience, Seasonal, Farmer, About, Trust, Dashboard Showcase, Progress, FAQ, CTA Footer, Ownership/Gift/Phase 2, Harvest Options

---

## PlotField Feature (Complete)

Real GPS field in Armenia. 210 plots (14 cols × 15 rows), 2m² each, $21/mo.

**GPS corners (from KML):**
- TL: 40.25260122, 44.53419455
- TR: 40.25267617, 44.53440019
- BR: 40.25254870, 44.53461399
- BL: 40.25243123, 44.53429019

**Image:** `/public/images/field-illustration.svg` (1024×718) — topographic style, brand green/gold
**Satellite fallback:** `/public/images/field-satellite.jpg`

**Plot states:** available (white), sold (red), reserved (gold), selected (yellow stroke #FFE066)
**Mobile UX:** info bar below map. Desktop: overlay panel bottom-left.
**CTA:** appears only on tap-selected plot (not hover).

**Architecture rule:** Static image + SVG overlay, NOT a map library. Grid math / renderer / interaction are separated. Renderers are swappable via PlotField.tsx entry point.

---

## Localization

Two locales: `hy` (Armenian) and `en` (English). URL structure: `/hy`, `/en`, `/hy/diaspora`, `/en/diaspora`.

---

## Git Conventions

- Commit prefixes: `feat:`, `fix:`, `chore:`
- Always commit and push after changes
- Before every push, ask: "Push to main (live)?"
- Never push to main without confirmation

---

## Phase 2 (Not Started)

- Admin panel for plot status overrides (sold/available/reserved per plot)
- `PlotFieldMap.tsx` — Leaflet renderer for owner dashboard (map navigation context, not landing page)
