# Hyeland — Project Context for Claude

## What is Hyeland?

A Next.js web app that gives users a personal share in a real organic farm in Armenia. Users allocate their share across crops at season start; the farm grows and delivers. Two audiences: local Armenia residents and diaspora.

**Brand:** Hyeland = Hye (հայ, Armenian) + land, also Highland = Armenian Highlands (Հայկական լեռնաշխարհ). Dual meaning is intentional — works for both local and diaspora audiences without translation.
**Tagline:** "Own a piece of the Highland" (the word "piece" is interpreted: a share + relationship, not exclusive land ownership)

## Pivot Status (current)

The product pivoted from "buy a fixed 2m² physical plot, get weekly delivery" → "buy a share in the farm's annual organic production, allocate across crops, receive seasonal harvest + off-season processed goods." See `LANDING_PIVOT_PLAN.md` (root) for the discovery + section-by-section roadmap and `docs/PRICING_MODEL_PIVOT.md` (stub awaiting Alex) for the canonical model.

**Pilot launch:** Spring 2027 (was 2026).
**Region:** Kotayk (was Armavir).
**Capacity:** 30 places.
**Landing today:** pre-launch validation surface. PlotField map, Farmer, Seasonal sections are hidden in live R2 (`sectionVisibility.*: false`). CTAFooter is the landing-side waitlist signup form.

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
      page.tsx            — Admin dashboard (quick links + diaspora toggle)
      waitlist/page.tsx   — Spring 2027 waitlist signups (multi-select, approve/decline/delete, CSV)
      local/page.tsx      — Edit local landing (14 tabs)
      diaspora/page.tsx   — Edit diaspora landing (15 tabs)
      navigation/page.tsx — Edit nav links
      how-it-works/       — Edit how-it-works section

  api/
    join/route.ts                — Public POST: writes signups to R2 `waitlist/signups.json`
    admin/waitlist/route.ts      — Auth-protected POST: bulk delete/approve/decline
    admin/save/route.ts          — Auth-protected POST: writes content to R2
    admin/content/route.ts       — Auth-protected GET: reads FS+R2 merged content
    admin/upload/route.ts        — Auth-protected POST: image upload to R2

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
  settings.json
  activity-log.json

# R2-only (not in repo):
#   waitlist/signups.json       — waitlist signups, written by /api/join

scripts/
  migrate-blob-to-r2.ts   — One-time migration from Vercel Blob → R2 (historical)
  list-waitlist.mjs       — Read-only CLI to print signups (`node scripts/list-waitlist.mjs`)
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

### Sidebar (current):
Dashboard · Waitlist · Navigation · Local Page · Diaspora Page · Settings.
(Removed in pivot cleanup: Farmer Profile, Available Plots, FAQ — they pointed to non-existent routes.)

### Local page tabs (14):
Hero, Problem, How It Works, Dashboard, Health, Convenience, Progress, Plot Map, Farmer, Seasonal, Trust, FAQ, About, CTA

### Diaspora page tabs (15):
Hero, Problem, How It Works, Health, Convenience, Seasonal, Farmer, About, Trust, Dashboard Showcase, Progress, FAQ, CTA Footer, Ownership/Gift/Phase 2, Harvest Options

### Waitlist (`/admin/waitlist`)

Reads `waitlist/signups.json` directly from R2 (server component, `force-dynamic`). Bulk actions hit `POST /api/admin/waitlist` with `{ action, emails[] }` — supports `delete`, `approve`, `decline`. Signups have an optional `status` field (default `'pending'`). CSV download + mailto-BCC are also available. The `/api/join` endpoint sets `status: 'pending'` on new signups and dedupes by email.

---

## PlotField (Hidden under new model)

Built for the old "exclusive 2m² physical plot" model, which the pivot invalidated. **Currently hidden** in live: `sectionVisibility.plotMap: false` in R2 for both locales.

**Do NOT re-enable for local landing.** Deletion is deferred — `app/[locale]/diaspora/page.tsx` still imports `PlotField` and calls `getPlotFieldConfig()`. The assets (illustration SVG, satellite image, GPS corners) may eventually be repurposed as proof-of-place visuals for the Transparency Pact (positive share framing, not exclusive ownership). Tracked as Open Question §13/5 in `LANDING_PIVOT_PLAN.md`.

The old config (kept for diaspora until that pivot lands):
- 210 plots (14×15), 2m² each, $21/mo (per-plot price NOT used in new model)
- GPS corners point to the historical Armavir partner field; the new pilot region is **Kotayk** (separate site, GPS TBC)
- Image: `/public/images/field-illustration.svg` (1024×718), satellite fallback `/public/images/field-satellite.jpg`

**Architecture rule (still applies if reused):** static image + SVG overlay, not a map library. Grid math / renderer / interaction are separated.

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

## Next Phases (per LANDING_PIVOT_PLAN.md)

**Phase 1 (mostly done in this branch):** copy fixes (Trust, About, Convenience, FAQ, Hero stats), CTAFooter re-enable, waitlist persistence, admin Waitlist page, region rename to Kotayk.

**Phase 2 (Pre-launch, structural):** Transparency Pact section (gated on farm-identity confirmation), Off-Season Story section, §6 Mandatory Framing block, Progress milestone reframe (drop sqm ladder), Hero mockup rewrite, per-locale `<title>` + meta.

**Phase 3 (Launch-ready, after Spring 2027 pricing):** Crop Allocation Explainer with real numbers, Pricing block, Drone video integration, Vercel-Blob → R2 image migration.

**Out of scope for this pivot task:** diaspora landing, App's claim flow (still old-model).
