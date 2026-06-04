# Local Landing Pivot Implementation Plan

> Discovery + planning deliverable. **No production code is changed by this document.**
> All proposed copy is **DRAFT DIRECTION — not approved final text.**
> All numbers (pricing, buffer %, delivery fee, per-crop kg prices) are **PLACEHOLDERS** pending the Spring 2027 pricing pass.
> **Per-sqm yield ranges are NOT a placeholder — they are removed entirely** because sqm is now a financial unit, not a physical plot (see §4.3 + §8).
> Diaspora landing is **out of scope** — this plan only touches local landing (`/hy`, `/en`).

---

## 0. Spec & Source-Document Status

The brief references several spec files. Status against the working tree on branch `chore/security-and-analytics` at 2026-06-04:

| File | Status | Notes |
|---|---|---|
| `PRICING_MODEL_PIVOT.md` | **STUB committed** at `docs/PRICING_MODEL_PIVOT.md` on branch `feat/landing-pivot` | Stub committed 2026-06-04; awaiting Alex to fill in canonical pricing model, off-season assortment, launch timing, farm identity. The 8 mandatory rules from §6 / §4.3 / §5.1 / §8 / §10 are already canonicalized in the stub so future sessions can reference them. |
| `LANDING_VISION.md` | **MISSING from repo** | Not found. |
| `APP_VISION.md` | **MISSING from repo** | Not found. |
| `LANDING_INDEX.md` | **Present** (parent workspace) | Located at `/home/victus/hyeland/docs/LANDING_INDEX.md` — generic, no per-section detail; still aligned with brand intent ("calm, grounded, human"). Section list still says "Plot Field / Selection: 'this is a real place'" — partially outdated under new model. |
| `docs/LOCAL_LANDING.md` | **Present** (this repo) | Old spec; partially outdated. Hard-encodes 2m² plots, $21/mo, "Aram Mkrtchyan / Armavir", and `2m² → 6m² → 15m²` ladder. Treated with skepticism per brief. |
| `docs/HYELAND_DIASPORA_SPEC.md` | Present | Diaspora — **out of scope**, untouched. |
| `docs/ADMIN_PANEL.md` | Present | Admin tab structure. |

---

## 1. Content Pipeline Reminder

Repo content pipeline (verified by reading `lib/content.ts`):

```
filesystem JSON (content/{locale}/local.json, nav.json + content/settings.json, how-it-works.json)
                              │
                              ▼
                shallow merge: { ...fsData, ...r2Data }
                              │
                              ▼
                rendered to user (live)
```

- **Locales defined** in `lib/i18n.ts`: **`hy`** (default for local) and **`en`** only. Russian is *not* a locale in landing despite being in the App.
- R2 bucket: `hyeland-media`. Override keys: `content/<locale>/<file>.json`.
- The merge is **shallow at the top level** — any object the admin writes to R2 (e.g. `hero`) overrides the entire FS object. New fields added to FS later WILL appear (top-level keys not in R2 fall through).
- Live R2 inspection done read-only via direct `GetObject` (script deleted after use). All 5 keys with FS defaults plus `nav.json` (both locales), `local.json` (both locales), `diaspora.json` (both locales), `settings.json`, `activity-log.json` had overrides. `farmer.json`, `faq-local.json`, `faq-diaspora.json`, `plots.json`, `how-it-works.json` returned NoSuchKey (no R2 override — those admin tabs are wired but no edits saved yet, or unused).
- `data/plot-field.json` is **not** R2-overridable — bundled at build time (`lib/content.ts:55` notes "Phase 2: switch to r2GetText when admin editing is added"). Any change must be a code commit.

Last admin edit per `activity-log.json` R2 object: **2026-05-18T15:30Z** (Local Page). Live content is reasonably current.

---

## 2. Page Assembly (entry: `app/[locale]/page.tsx`)

Render order with section visibility flags (LIVE per `content/<loc>/local.json` R2 override):

| # | Section | Component | Visibility (live HY = EN) | Notes |
|---|---|---|---|---|
| 1 | Hero | `components/sections/Hero.tsx` | ✅ on | Inline dashboard mockup hard-coded |
| 2 | Problem | `components/sections/Problem.tsx` | ✅ on | |
| 3 | HowItWorks | `components/sections/HowItWorks.tsx` | ✅ on | |
| 4 | DashboardShowcase | `components/sections/DashboardShowcase.tsx` | ✅ on | |
| 5 | Health | `components/sections/Health.tsx` | ✅ on | |
| 6 | Convenience | `components/sections/Convenience.tsx` | ✅ on | |
| 7 | Progress | `components/sections/Progress.tsx` | ✅ on | Tier ladder `2 մ² → 6 մ² → 15 մ²` |
| 8 | PlotField | `components/plots/PlotField.tsx` | ❌ **OFF (live)** | `plotMap: false` in R2 — already hidden! |
| 9 | Farmer | `components/sections/Farmer.tsx` | ❌ **OFF (live)** | `farmer: false` in R2 — already hidden! |
| 10 | Seasonal | `components/sections/Seasonal.tsx` | ❌ **OFF (live)** | `seasonal: false` in R2 — already hidden! |
| 11 | Trust | `components/sections/Trust.tsx` | ✅ on | |
| 12 | FAQ | `components/sections/FAQ.tsx` | ✅ on | |
| 13 | About | `components/sections/About.tsx` | ✅ on | |
| 14 | CTAFooter | `components/sections/CTAFooter.tsx` | ❌ **OFF (live)** | `ctaFooter: false` in R2 — already hidden! |

> ⚠ **Surprising finding.** Four sections — PlotField, Farmer, Seasonal, CTAFooter — are **already hidden on live** for both locales. This is significant context: the live landing today is *shorter* than the FS-default render. PlotField (the biggest old-model anchor) is *not visible to users right now*. Visibility is already off; the *underlying assets still need a human decision* — remain hidden, be reframed, or be repurposed without exclusive-plot semantics. See §13/4 + §13/5.

---

## 3. Section Inventory

For each section: repo path, content source path, locales, FS-default copy fingerprint, live R2 override delta, admin field that controls it.

### 3.1 Navbar (`components/layout/Navbar.tsx`)

- **Content source**: `content/<locale>/nav.json`
- **Locales**: `hy`, `en`
- **Admin tab**: `/admin/navigation`
- **FS defaults — HY**:
  - `localCta = "Ամրագրել հողամասս"` · `localCtaHref = "#join"`
  - `localLinks`: How it works, Dashboard, Progress, **The farmer (`ll-5`)**, Pre-pilot, FAQ
  - `diasporaLinkText = "Սփյուռքի համար"`
- **FS defaults — EN**: same shape, English labels, `localCtaHref = "#join"`
- **LIVE override deltas (both locales)**:
  - `localCtaHref` → **`https://app.hyeland.am/`** (external — diverges from `#join`)
  - `diasporaCtaHref` → **`https://app.hyeland.am/`**
  - `localLinks` — **"The farmer" (`ll-5`) link REMOVED** (consistent with Farmer section hidden)
- Admin field controlling each link href: per-link `href` input on `/admin/navigation` (commit `7756b2c` made CTA hrefs editable).

### 3.2 Hero (`components/sections/Hero.tsx`)

- **Content source**: `content.hero` inside `content/<locale>/local.json`
- **Admin tab**: `/admin/local` → **Hero**
- **FS defaults — HY**: `h1Line1 "Գիտես, թե" / h1Line2 "ինչ ես ուտում։" / h1Italic "Աճեցրած քո հողի վրա։"`. Stats: `2 մ² · Քո հողակտոր`, `Շաբաթական · Առաքումներ`, `Իրական · Ֆերմեր կողքին`. CTAs `Ամրագրել հողամասս` / `Տեսնել, թե ինչպես է աշխատում`.
- **FS defaults — EN**: `Know what / you eat. / Grown on your land.` Stats: `2 m² · Your plot`, `Weekly · Deliveries`, `Real · Farmer assigned`.
- **LIVE override deltas**: `primaryCtaHref` overridden to `https://app.hyeland.am/` in BOTH locales (FS = `#join`).
- **Visual asset**: inline SVG landscape + hard-coded mockup dashboard inside `Hero.tsx` (NOT the reusable `DashboardCard`). Hard-coded strings inside the mockup: `"Plot 7 — Armavir"`, `"Growing 🌱"`, `"Flowering · 62%"`, `"Tomatoes · Herbs"`, `"2 m²"`, `"Thursday · ~1.5 kg"`, `"Next delivery"`. **All in English, not localized.**

### 3.3 Problem (`components/sections/Problem.tsx`)

- **Source**: `content.problem` in `local.json`. **Admin tab**: Problem.
- **Locales**: hy + en.
- **No live deltas** vs FS for either locale.
- **Visual asset**: `<VegetableIllustration name="tomato | cucumber | greens" />` (SVG, in `components/ui/VegetableIllustration.tsx`).

### 3.4 HowItWorks (`components/sections/HowItWorks.tsx`)

- **Source**: `content.howItWorks` in `local.json` (NB: there's *also* a locale-free `content/how-it-works.json` used only by the diaspora page).
- **Admin tab**: Local Page → How It Works.
- **No live deltas** vs FS for either locale.
- 4 steps in both locales (different copy).

### 3.5 DashboardShowcase (`components/sections/DashboardShowcase.tsx`)

- **Source**: `content.dashboardShowcase` in `local.json`. **Admin tab**: Dashboard.
- **No live deltas**. Lists 5 features per locale.

### 3.6 Health (`components/sections/Health.tsx`)

- **Source**: `content.health`. **Admin tab**: Health.
- **No live deltas**. 4 cards: No pesticides / Harvested ripe / Seasonal variety / Full traceability.

### 3.7 Convenience (`components/sections/Convenience.tsx`)

- **Source**: `content.convenience`. **Admin tab**: Convenience.
- **No live deltas**. 4 items.
- Item c4 explicitly says: "Start with 2 m² and expand as you want."

### 3.8 Progress (`components/sections/Progress.tsx`)

- **Source**: `content.progress`. **Admin tab**: Progress.
- **No live deltas**.
- **Milestones (both locales)**:
  - Year 1 / `2 m²` / `Getting started` (HY `Սկիզբ`)
  - Year 2 / `6 m²` / `Growing roots` (HY `Զարգացում`)
  - Year 3 / `15 m²` / `Your farm` (HY `Քո ֆերման`)

### 3.9 PlotField (`components/plots/PlotField.tsx`, `PlotFieldStatic.tsx`)

- **Source**: section header from `content.plotMap` in `local.json`; grid config from `data/plot-field.json` (**static, not R2-overridable**).
- **Admin tab**: Local Page → Plot Map (text only); no admin tab for the grid config.
- **Live visibility**: **OFF** (`plotMap: false` in R2). Section header copy still in R2 but not rendered.
- **`data/plot-field.json`** encodes:
  - `plotSizeM2 = 2`
  - `defaultPriceUSD = 21` (rendered as `$21/mo`)
  - `discountTiers`: 2 plots → 5%, 3 → 10%, 4 → 15% (per-count, not per-sqm)
  - `plotOverrides`: 7 plots flagged `sold` or `reserved`
  - `fieldCorners` = real GPS coordinates of the Armavir field (~40.252°N, 44.534°E)
- Visual asset: `/public/images/field-illustration.svg` (8 KB, topographic) + `field-satellite.jpg` (148 KB, KML-extracted).

### 3.10 Farmer (`components/sections/Farmer.tsx`)

- **Source**: `content.farmer` in `local.json`. **Admin tab**: Local Page → Farmer (or potentially `/admin/farmer` sidebar entry, though `content/farmer.json` does not exist on FS or R2).
- **Live visibility**: **OFF** (`farmer: false` in R2).
- FS HY: `Արամ Մկրտչյան · Արմավիրի մարզ · 18 տարվա ֆերմերային փորձ`. Image: vercel-blob URL.
- Image still hosted on **Vercel Blob** (`zlpkrecnzh3d1psv.public.blob.vercel-storage.com`) despite repo having migrated to R2 (`scripts/migrate-blob-to-r2.ts` exists). Possibly stale URL; verify whether Vercel Blob is still paid for.

### 3.11 Seasonal (`components/sections/Seasonal.tsx`)

- **Source**: `content.seasonal` in `local.json`. **Admin tab**: Seasonal.
- **Live visibility**: **OFF** (`seasonal: false` in R2).
- Four season cards, each with a color and 3–6 crop pills.

### 3.12 Trust (`components/sections/Trust.tsx`)

- **Source**: `content.trust` in `local.json`. **Admin tab**: Trust.
- **LIVE override deltas (HY)**:
  - `points[1].title`: FS `"Մեկնարկ՝ 2026 թ. գարուն"` → LIVE `"Մեկնարկ՝ 2026 թ."` (removed "գարուն")
  - `points[1].description`: shortened in LIVE; September 2026 date removed.
- **FS divergence between locales (BASELINE, not override)**: HY says **"Սահմանափակ 50 հողամաս"** + "Առաջին 50 մասնակիցները"; EN FS says **"Limited to 20 plots"** + "first 20 participants". The 20-vs-50 mismatch already exists on FS and is preserved into live for both locales.

### 3.13 FAQ (`components/sections/FAQ.tsx`)

- **Source**: `content.faq` in `local.json`. **Admin tab**: Local Page → FAQ (the separate `/admin/faq` sidebar entry writes to a `content/faq-local.json` that does not exist on FS or R2 — likely unused).
- **LIVE override deltas (HY)**:
  - `items[1] (f2)` answer: FS includes `"...որ ամեն շաբաթ իմաստալից բերք տա։"` → LIVE drops `"ամեն շաբաթ"` (every week).
  - `items[4] (f5)` answer: minor rephrase (`"ուղարկվում են պահածոյացված ապրանքներ"` → `"առաջիկայում ուղարկվելու են պահածոյացված ապրանքներ"`).
- FAQ items by id: f1 (no farming experience), f2 (size of 2m²), f3 (vegetable preferences), f4 (can I visit), f5 (winter), f6 (is plot really mine).

### 3.14 About (`components/sections/About.tsx`)

- **Source**: `content.about` in `local.json`. **Admin tab**: About.
- **LIVE override deltas (HY)**:
  - `paragraph1`: FS says `"Ինն տարի"` (9 years) → LIVE `"Տասնմեկ տարի"` (11 years). Whole paragraph rewritten.
  - `paragraph2`, `paragraph3`: significantly rewritten on LIVE.
  - `trustText`: FS `"Նախնական փուլ՝ 2026 թ. գարուն · 50 հողամաս · Արմավիրի մարզ"` → LIVE `"Նախնական փուլ՝ 2026 թ. · 50 հողամաս · Արմավիրի մարզ"` (removed "գարուն")
- **LIVE override deltas (EN)**:
  - `trustText`: FS `"Pre-pilot opening spring 2025 · 20 plots · Armavir region"` → LIVE `"Pilot opening 2026 · 50 plots · Armavir region"` (changed "Pre-pilot"→"Pilot", "spring 2025"→"2026", "20"→"50")
  - `paragraph1`: FS says `"Nine years"` → LIVE `"For eleven years"`; whole paragraph rewritten.
- Image: vercel-blob URL.

### 3.15 CTAFooter (`components/sections/CTAFooter.tsx`)

- **Source**: `content.ctaFooter` in `local.json`. **Admin tab**: CTA.
- **Live visibility**: **OFF** (`ctaFooter: false` in R2).
- FS HY heading: `"Եղիր առաջին 20-ի մեջ։"`; EN: `"Be one of the first 20."`. Both point to `#join` anchor.

### 3.16 Site Settings

- **Source**: `content/settings.json`. **Admin tab**: Settings.
- FS: `{ diasporaEnabled: true }`. **LIVE override: `diasporaEnabled: false`** → diaspora link is hidden in the navbar today.

---

## 4. Old-Model Anchors Found

### 4.1 Named anchors

| Anchor | Where | Current state | Why it conflicts | Proposed resolution |
|---|---|---|---|---|
| **PlotField** + **`data/plot-field.json`** | `components/plots/PlotField.tsx` + `PlotFieldStatic.tsx`; config in `data/plot-field.json` (NOT R2-editable). **Also imported by `app/[locale]/diaspora/page.tsx`** (verified — diaspora calls `getPlotFieldConfig()` and renders the same component). | Hidden in live for local (`plotMap: false`). Config still bundled: 14×15 = 210 plots × 2 m² × $21/mo + plot-count discount tiers. | **The "exclusive 1×1m plot" mechanic is invalidated** under the new model: sqm is now a financial unit / farm share, not a literal square of dirt. Per-plot $21/mo headline price is wrong (delivery now separate; sqm is annual budget). Per-count discounts (`2 plots → 5%`) don't fit a model where users pick *how many sqm*, not *how many plots*. | **Phase 1: keep hidden, decouple from local landing render** — leave files in place. **Do NOT delete** `PlotField.tsx`, `PlotFieldStatic.tsx`, `lib/plot-grid.ts`, `lib/plot-projection.ts`, or `data/plot-field.json` in this task. Reasons: (a) diaspora landing still imports them and is out of scope; (b) the underlying assets (field illustration, satellite image, GPS corners, status overlays) may be re-purposed under the new model as proof-of-place / farm map / non-exclusive share visualization for the Transparency Pact. **Deletion is a separate, human-approved decision after the visual-fiction direction is settled** — surface it in Open Questions (§13). What this plan DOES propose for local: keep `plotMap: false`, do not introduce a new "sqm picker" component in Phase 1, and reserve the slot for either a Transparency Pact visual or a Crop Allocation Explainer once pricing lands (see §7 two-state framing). |
| **DashboardCard preview** | `components/ui/DashboardCard.tsx` (reusable) + inline hard-coded mockup in `components/sections/Hero.tsx` (lines ~244–289) | Hero shows: `Plot 7 — Armavir`, `Growing 🌱`, `Flowering · 62%`, `Tomatoes · Herbs`, `Plot size 2 m²`, `Next delivery Thursday · ~1.5 kg`. All English regardless of locale. `DashboardCard.tsx` also exports a 2×2 stats grid with `Plot size / Season week / Est. yield / Harvest date` labels. | The "Plot 7 — Armavir" framing implies an exclusive physical plot the user owns — invalidated. Per-kg "est. yield" + per-week "next delivery" specifics promise output the new model cannot guarantee at user level (sqm is a budget; the farm decides actual area, weather decides actual kg). | Rewrite the Hero mockup to convey **trust + desire**, not pricing. **Do NOT show a placeholder budget** in Hero — TBD numbers belong further down the page or hidden behind the waitlist. Suitable mockup contents: a user's selected crop preferences (tomatoes / greens / peppers pills), the latest farm-side update (e.g. "Farm update — June: drone footage available"), a growth milestone for the user's *selected crops* (e.g. **"Your selected tomatoes — flowering"** — keep growth tracking, just decouple it from a single physical plot), and a transparency proof tag (e.g. **"Monthly drone updates · Open farm visits"** or **"Real organic · Proven through updates"** — do **not** use "audited" or "certified" wording: no audit or certification has been confirmed; drone + visits + the Transparency Pact are proof, but they are not an audit). Drop: "Plot 7 — Armavir" exclusivity framing, weekly-delivery specifics, hard-coded "1.5 kg" promise, "Est. yield" 2×2 stat. The reusable `DashboardCard.tsx` is fine to keep as a primitive; re-skin only when consumed here. Localize the mockup labels (HY + EN). |
| **Tier ladder `2m² → 6m² → 15m²` / `Starter / Grower / Farmer`** | `components/sections/Progress.tsx` driven by `content.progress.milestones` | Live HY: `Սկիզբ · 2 մ²` → `Զարգացում · 6 մ²` → `Քո ֆերման · 15 մ²`. EN: `Getting started` → `Growing roots` → `Your farm`. Features per tier still talk about `Weekly 1–2 kg`, `Named plot certificate`, `Guest harvest visits`. | Tier semantics are gone. The new sqm picker is open-ended (1–5+). Labels imply a fixed progression which doesn't match the new model where users pick any sqm from year 1. "Named plot certificate" still implies physical exclusive ownership. "Weekly 1–2 kg" contradicts the new seasonal harvest + off-season processed-goods model. | Either (a) **remove** Progress as a milestone-tier section entirely, or (b) **reframe** as a "what year 1 → year 2 → year 3 looks like with the *same* farm partner" timeline: deepening relationship, expanded transparency (drone footage frequency), more crop variety choices, optional in-person visit. No size ladder. No "certificate." No fixed weekly kg. Recommendation: **(b) reframe** because the multi-year framing reinforces the long-relationship promise, but **rename + restructure copy**, drop the `size` field from `ProgressMilestone` (or repurpose as `headline`). |

### 4.2 Copy anchors

| Anchor | Locations | Resolution |
|---|---|---|
| `Weekly Deliveries` / `Շաբաթական Առաքումներ` | Hero stat #2 (`hero.stats[1]`) in both locales; Convenience c1, c2; HowItWorks step 3; Progress m1 features; Hero mockup `Next delivery Thursday`; FAQ f5 implicitly | Remove "weekly" framing. Replace stat with something that holds under new model — e.g. `12 mo · annual cycle`, `Real organic · Transparent`, `From your share`. **Do not use "audited" or "certified" wording** — no audit or certification has been confirmed. The literal weekly delivery during peak harvest can stay in fine print, but cannot be a *headline promise*. |
| `Real — Your plot` / `Իրական — Ֆերմեր կողքին` | Hero stat #3 | Keep the emotional anchor but reword to not promise an exclusive physical plot. Draft: `Real organic · Verified` / `Իրական օրգանական · Հաստատված`. |
| `Get your plot` / `Reserve my plot` / `Ամրագրել հողամասս` / `Limited plots available` | Nav CTA, Hero primary CTA, plotMap reserveCtaText, CTAFooter buttonLabel, CTAFooter note. Live CTA href is `https://app.hyeland.am/`. | See **§7 — CTA Strategy**. Short version: replace "Reserve" / "Claim" verbs with **"Join the waitlist"** semantics until pricing + product are real. Specific framings like "Spring 2027 priority" or "priority access" are still up for discussion — surface as Open Question (§13/2). The current live CTA pointing to `app.hyeland.am` is misleading if the app still allows old-model claims. |
| `2 m²` everywhere | Hero stat #1, hero mockup, Convenience c4, Progress m1, FAQ f2 question, plotMap subtitle, About paragraph (implicitly via "Pilot opening") | The number `2` is no longer canonical — sqm picker is open-ended. Stop using `2 m²` as a default headline. FAQ f2 ("How big is 2m²?") must be **rewritten** to "What does 1 sqm mean under our model?" (financial-share explanation, not physical-table comparison). |
| `Aram Mkrtchyan / Armavir / 18 years` | `farmer.*` in local.json | **TBC — do not assume continuity.** Brief did not confirm whether the new-model farm partner is the same Aram, the same farm, or the same region. Position name, farm name, region, years-of-experience, photo, and any "not used" claims as **placeholder until confirmed with stakeholders**. Re-positioning as part of the Transparency Pact (§5.1) only after identity is locked. Image URL is currently on Vercel Blob — confirm migration status (see Risk §11.2). |
| `Limited to 20 plots` (EN) / `Սահմանափակ 50 հողամաս` (HY) | trust point t1 in both locales | **20-vs-50 mismatch is a pre-existing bug** between locales. The number itself is also placeholder under new model (waitlist capacity TBD). Reframe to "Spring 2027 pilot · capacity TBD" until target is fixed. |
| `Launching spring 2026` / `Մեկնարկ՝ 2026 թ.` | trust point t2; About `trustText` | **Materially wrong** — pilot is Spring 2027. Must update both locales. About.trustText (EN) live says "Pilot opening 2026" — same issue. |
| `pre-pilot` / `Նախնական փուլ` / `Pre-pilot` | Trust heading + intro, About trustText, Nav link "Pre-pilot", FAQ f4 ("During the pre-pilot phase"), CTAFooter tag | Keep the concept but reframe: this is **validation/waitlist phase** ahead of Spring 2027 pilot. Rephrase to remove implication that pre-pilot members get something *now*. |
| `$21/mo` per-plot | `data/plot-field.json defaultPriceUSD` (PlotField hidden but config still bundled) | Do not use or surface this price on the local landing. Keep the config in place because the diaspora landing still consumes it (verified §11.7/§12). Its long-term removal or repurposing is a separate human-approved decision (§13/5). New model is annual budget allocated to chosen sqm — per-month per-plot price is invalidated as a consumer-facing concept. |
| `Named plot certificate` (Progress m2) | EN local.json | Implies exclusive physical plot. Remove. |
| `1–2 kg per week` | HowItWorks step 3; Progress m1; About wording | **Remove from public Pre-launch copy.** Do not replace with ranges — any "1–2 kg" / "X–Y kg" framing re-anchors the user to a per-week or per-sqm output promise, which the new model cannot guarantee. In the **Launch-ready** allocation flow, the only kg numbers shown are the **exact kg quantities the user chose** within their confirmed annual budget, never as a system-side promise. |
| `Pre-pilot opening spring 2025` (EN FS) | About `trustText` FS default | Stale even before pivot (current date 2026-06-04). Live R2 already overrode to "Pilot opening 2026"; that's now also wrong (must be 2027). |
| FAQ f6 `"The land itself remains with the farming partner, but the crops grown on your plot are entirely yours."` | EN trust answer for "Is my plot really mine?" | **FAQ f6 is one of the few places where the share-vs-exclusive mechanic is allowed to be explicit** (per §6). Rewrite plainly: a sqm at Hyeland represents a personal share in the farm's annual organic production; the land itself belongs to the farm partner; the harvest tied to your share comes to you. Avoid "you own a share" / "you own a budget" wording on the public landing body (legal-ownership feel). Negation is acceptable inside this FAQ answer because the user has actively asked the question — it is not load-bearing on Hero. See §6. |

### 4.3 Generic patterns

| Pattern | Where it appears | Resolution direction |
|---|---|---|
| "Weekly delivery" / shabaթական araqum | Hero stats, Convenience, HowItWorks step 3, Hero mockup, FAQ f5, Progress | Reframe to: peak-season harvest cadence (when crops actually ripen) + off-season processed goods. Remove "weekly" as a headline. |
| "Your land" / physical-exclusivity framing | About paragraph 2 (HY/EN talk about touching Armenian soil), Trust intro, Hero h1Italic `Աճեցրած քո հողի վրա` ("Grown on your land"), FAQ f6, PlotField subtitle `"2 sqm of real soil, yours to own"` | **The emotional land-connection narrative stays** — "Own a piece of the Highland", the hiking origin story in About, the Armenian-soil emotional pull are all preserved. They are the brand. What gets revised: phrases that explicitly claim *exclusive personal land ownership* ("yours to own", "this exact plot"). Replace with positive share + relationship framing per §6 (e.g. h1Italic: from "Grown on your land" → "Grown for your share / Աճեցրած քո բաժնի համար" — final wording TBC). **Do not introduce loud negations** on Hero or body copy ("not your land" / "not 1×1m"); keep mechanical clarification to FAQ f6 + checkout + Terms. |
| `$X per kg` hardcoded | Not currently in copy; only `defaultPriceUSD = 21` per plot in `data/plot-field.json` | Already noted under §4.1 — keep config file but it stops being read because PlotField stays hidden. New model has no per-kg headline. |
| Generic "organic" claims without proof | Health h1 (`Առանց թունաքիմիկատների` / "No pesticides"), Hero stat `Real — Your plot` | New positioning requires **Transparency Pact** with placeholder identity (TBC): "not used" list (e.g. no glyphosate, no urea, no synthetic pesticides, no synthetic fertilizers — final list pending farmer confirmation), farm name + farmer name + photo (TBC), monthly drone footage, open farm visits offer. See §5.1. |
| Yield calculators with fixed per-sqm output | Hero mockup "Est. yield" field; Progress m1 "1–2 kg deliveries" | **Remove entirely. Do NOT replace with per-sqm kg ranges** ("X kg / sqm / season"). Under the new model the sqm is a financial unit / share — kg-per-sqm framing reintroduces exactly the implicit "physical plot → output" relationship that the pivot rejects. The user picks kg of each crop *within their annual budget* at season start; the farm decides how much physical land that needs. Landing copy must not promise kg/sqm or any per-sqm output. Crop kg only appears as part of the allocation flow at *the user-chosen kg* level, never as "your sqm yields N kg." |

---

## 5. Gaps Found

> **Two-state framing applies to this entire section.** Every gap below is annotated as **Pre-launch (now → Feb/Spring 2027)** or **Launch-ready (after pricing finalized)**. Mixing pricing + sqm picker + waitlist on a single page right now would read as untrustworthy and incoherent ("buy this thing whose price we'll tell you later"). See §7 for the two-state explanation.

### 5.1 Transparency Pact (new section, missing) — *Pre-launch + Launch-ready*

- **What's needed**: farm name, farmer name + photo, region; explicit "not used" list; monthly drone updates; open-farm visit offer.
- **Where it should live**: directly after Hero, *before* Problem. This is the primary trust foundation under the new model.
- **Admin tab**: new tab on `/admin/local` (proposed id `transparencyPact`), or reuse the existing **Farmer** tab as the home for this (since farmer info + farm location overlap).
- **All identifying details are TBC** (see §4.2 row on farmer identity). Do not bake in a specific name, farm, or region in copy until confirmed.
- **Draft direction (HY)**:
  > "Մեր ֆերման · [region — TBC] · [farmer name — TBC]-ի խնամքով։
  > Ինչ չենք օգտագործում՝ [list — TBC, օրինակ՝ գլիֆոսատ, միզանյութ, թունաքիմիկատներ, սինթետիկ պարարտանյութեր]։
  > Ամեն ամիս՝ թռիչքային տեսանյութ դաշտից։ Ուզու՞մ ես այցելել — բաց ենք։"
- **Draft direction (EN)**:
  > "Our farm · [region — TBC] · cared for by [farmer name — TBC].
  > What we don't use: [list — TBC, e.g. glyphosate, urea, synthetic pesticides, synthetic fertilizers].
  > Monthly drone update from the field. Want to visit — we're open."
- **Hard gating rule**: the Transparency Pact is a **required Pre-launch section in principle**, but **it must NOT ship to production** until *all* of the following are confirmed:
  1. Farm identity (name, region).
  2. Farmer identity (name, photo, years of experience).
  3. Visit policy (whether on-site visits are actually offered, and the conditions).
  4. Drone-update commitment (cadence, where the footage is published, who produces it).
  5. Every single item on the "not used" list — each must be one the farmer has explicitly verified.
- **If any of the five is missing, the section does not ship.** A Pre-launch landing *without* a Transparency Pact is materially better than one with a Transparency Pact full of general "organic" marketing claims — the latter directly contradicts the pivot's positioning.
- **Risk**: any unverified item is a legal + reputational exposure under "organic" claims.

### 5.2 Crop Allocation Explainer (new section, missing) — *Launch-ready only*

- **What's needed**: a visual flow showing `pick sqm → see annual budget → allocate across crops → farm fulfills`.
- **Where it should live**: in the **Launch-ready** landing (post Feb 2027 pricing). In the **Pre-launch** landing (now), this is replaced by a much simpler "How the share model works" explanation — see §6 framing block — with **no live numbers**, no interactive picker, and no budget display.
- **Why split into two states**: pre-launch, putting a sqm picker + TBD budget + crop sliders on the page produces an "everything is placeholder" feel that erodes trust. A pre-launch user does not need to allocate — they need to *understand the model* and decide whether to join the waitlist. The full interactive allocation flow goes live only once the actual pricing table arrives (Feb 2027) and we can show real numbers.
- **Admin tab**: new tab `cropAllocation`, or repurpose the existing `plotMap` slot.
- **Launch-ready draft direction**: a 3-step flow.
  1. "Pick your sqm (1–5+)" — visual sqm picker, *non-grid*, no exclusive-square implication.
  2. "See your annual budget" — single number from confirmed pricing table + monthly equivalent + separate delivery fee shown separately.
  3. "Allocate across crops" — sliders/checkboxes for tomatoes, cucumbers, peppers, greens, off-season processed jars *(illustrative, per §5.3 — final list TBC)*.
- **Allocation labelling rule**: any user-selected kg shown in the allocation flow **must be labelled as an *allocation* or *planned* quantity, not a guaranteed delivered quantity**. Crop failure and substitution policy must be explained nearby — either inline in the allocation UI or as a linked FAQ item directly adjacent. UI copy direction: "Your allocation (planned)" / "Քո հատկացում (պլանավորված)" — never "Your delivery" or "You'll receive". This protects users (and the platform) from the implicit promise that user-chosen kg = delivered kg.
- **Implementation**: the *picker UI* is the heaviest piece. After pricing is confirmed, Phase 3 builds it as a real component. Until then, **do not ship a placeholder picker** — see §6 / §7.

### 5.3 Off-Season Story (new section, missing) — *Pre-launch + Launch-ready*

- **What's needed**: explain *why* monthly billing covers the winter — farmer pre-funding allowing seed/equipment purchase + off-season deliveries of processed goods + smaller off-season installments.
- **Where it should live**: between Seasonal (if kept) and Trust, or as a sub-section under HowItWorks step 4.
- **Admin tab**: new tab `offSeason`.
- **Processed-goods list is ILLUSTRATIVE, not guaranteed.** The items below (jam, pickles, dried fruit, garlic powder, lecho, թթու / etc.) are working examples until the farmer confirms the actual off-season assortment. Final public copy must visibly distinguish *examples* from *guaranteed items* — e.g. "examples may include…" — or omit specific items entirely until the assortment is locked. Do not let copy promise that the user will receive every item listed.
- **Draft direction (HY)** *(items are illustrative, not committed)*:
  > "Ձմեռն էլ ենք հաշվում։
  > Ամսական վճարդ՝ ամբողջ տարին։ Ինչու՞։ Որպեսզի ֆերմերը կարողանա սերմ ու սարք ապահովել ձմռանը։
  > Ինչ կարող ես ստանալ ձմռանը *(օրինակներ, վերջնական ցանկը՝ ֆերմերի հաստատումից հետո)*՝ մուրաբա, թթու, չորացրած պտուղ, սխտորի փոշի, լեչո, թթու բանջարեղեն — քո բաժնեմասից։"
- **Important**: the existing FAQ f5 partially covers this; move it from FAQ → standalone section because it's load-bearing for the value prop, not a corner-case question.

### 5.4 Drone Video Integration (new asset, missing) — *Pre-launch + Launch-ready*

- **What's needed**: vertical 1080×1920 drone footage of the farm.
- **Current state**: **no drone video found in `public/` or in R2.** `public/images/` has only `field-illustration.svg`, `field-satellite.jpg`, `hyeland-logo.svg`.
- **Where it should live**: Hero background or right column (currently inline SVG landscape); also one frame as a poster image inside the Transparency Pact section.
- See special-requirements list in §10.

### 5.5 Pricing Block Redesign (replaces "plot pricing" feel) — *Launch-ready only*

- **What's needed (post-Feb-2027)**: annual sqm price + monthly equivalent + **separate** delivery fee. **No** per-kg headline price.
- **Where it should live (Launch-ready)**: inside the Crop Allocation Explainer (§5.2) and/or just before the CTAFooter.
- **In the Pre-launch landing this section does not exist.** Do not ship placeholder numbers on the public landing. If pricing must be hinted at all pre-launch, the only acceptable surface is **inside a post-waitlist email** ("here's what pricing will look like once finalized") — never on the public page. See §7 + §8.
- **Draft direction (Launch-ready)**:
  > "1 sqm = `[final amount] AMD/yr`
  > Paid as `[monthly amount] AMD/mo` × 12 months.
  > Delivery fee is separate, set per delivery."
- All three values stay **gated behind firm confirmation**; see §8.

### 5.6 Honest "What You're Buying" Block (mandatory) — *Pre-launch + Launch-ready*

- **What's needed**: an explicit, visible statement of what a sqm is under the new model — see **§6 Mandatory Framing Rule**.
- **Where it should live**: as a standalone block immediately after Hero (Pre-launch) and as a header to the Crop Allocation Explainer (Launch-ready).
- **Must NOT be buried in FAQ.** This is the load-bearing block of the entire pivot — it stays on the public page from day 1.

---

## 6. Mandatory Framing Rule — Positive, Land-Connected

The landing must explain — visibly, not buried — what a sqm at Hyeland *is*, framed positively. The emotional land-connection narrative ("Own a piece of the Highland", touching Armenian soil, the years-of-hiking origin story in About) is **not** a problem to dismantle — it's the brand. Reframing must protect it, not undermine it.

**Two principles**:
1. **No legal or exclusive physical ownership claims.** Don't say "this land is yours" or "you own this 1×1m square" in copy or visuals.
2. **No prominent negations.** Do **not** lead with "this is NOT your land" / "NOT an exclusive 1×1m plot" / "you don't own dirt" — that wording loudly contradicts the brand promise and trains every visitor to mistrust the offer. The mechanical "share, not exclusive land" clarification belongs in FAQ f6, in the checkout / waitlist confirmation copy, and in Terms — not as a Hero-adjacent headline.

**On the landing, frame the share positively, in the same emotional register as the existing brand:**

**Draft direction (HY)**:
> "1 քառ.մ Hyeland-ում՝ քո անհատական մասնակցությունն այս ֆերմայի տարեկան օրգանական արտադրությանը։
> Սեզոնի սկզբին այն հատկացնում ես այն բերքերին, որ ուզում ես։
> Տարվա ընթացքում հետևում ես, թե ինչպես է աճում քո բաժնեմասը՝
> թռիչքային տեսանյութեր, ֆերմերի գրառումներ, քո բերքը՝ հասունանալիս։
> Իրական կապ ես կառուցում այս ֆերմայի և այս հողի հետ։"

**Draft direction (EN)**:
> "1 sqm at Hyeland is your personal share in this farm's annual organic production.
> At season start, you allocate it across the crops you actually want.
> Through the year you follow how your share grows —
> drone footage, the farmer's notes, your harvest as it ripens.
> You build a real relationship with this farm, and with this land."

**Wording note**: avoid "you own a budget" / "you own a share" — they read as legal/financial ownership. Prefer "your personal share" / "what you participate in" / "Քո անհատական մասնակցությունը" — the share concept stays, without an ownership/equity feel.

**Where the share-vs-exclusive mechanic IS allowed to appear** (explicitly, not buried):
- **FAQ f6 answer** — "Is my plot really mine?" is exactly the right place for an honest, plain-language explanation that a sqm represents a share in annual production, that the land itself belongs to the farm, and that you receive the harvest tied to your share. Negation phrasing is fine here.
- **Waitlist / checkout confirmation copy** — a brief honest clarification on what the user is agreeing to.
- **Terms of service** — full legal clarification.
- On the main landing body copy, **lead with what the share IS, not what it isn't.**

**Visual constraint** (unchanged in substance, softened in phrasing): illustrations, maps, and grids should reinforce the share-and-relationship framing, not exclusive ownership.
- The PlotField map should not return as a clickable 14×15 grid where each cell is labelled as "yours."
- The Hero mockup should not show "Plot 7 — Armavir" framed as an exclusive labelled square the user owns.
- The Armavir field SVG (`/public/images/field-illustration.svg`) and the satellite image can appear as **proof-of-place** — "here's the real farm you're sharing in." Use them whole, not gridded into individual ownership tiles.
- A future "share visualization" (Phase 3 or later) can show the user's portion *within* the farm without implying any single square is theirs alone.

**Tagline preservation**: "Own a piece of the Highland" stays. The word **"piece"** is interpreted (a share, a stake, a real relationship). The body copy must support this re-interpretation honestly — through what it affirms about the share + relationship + land, not by loudly denying physical ownership.

---

## 7. CTA Strategy Proposal — Two-State Landing

This is a top-level question, not a section-level edit. It also frames every other gap above: the landing has **two distinct states** under the pivot, and we must not collapse them.

### 7.1 Two-state framing

| State | Window | Landing's job | What appears | What does NOT appear |
|---|---|---|---|---|
| **Pre-launch** | Now → ~Feb/Spring 2027 | Validation + waitlist building | Hero (trust + desire); **Transparency Pact — only after all identity, visit, drone, and "not used" claims are confirmed (§5.1 hard-gating)**; Mandatory §6 framing block; simple "How the share model works"; Problem; Off-Season Story (with illustrative-not-guaranteed item labelling); About; Trust (without specific count promises); waitlist CTA + qualifier form | Any pricing number (real or placeholder); sqm picker / interactive allocator; per-crop kg prices; "First N plots" capacity claims; promises of pilot pricing; per-sqm yield ranges; "audited" / "certified" wording |
| **Launch-ready** | After Feb 2027 pricing confirmed | Conversion to confirmed sign-ups | Everything in Pre-launch + Crop Allocation Explainer with real numbers + Pricing block with confirmed amount + monthly + separate delivery fee | TBD placeholders, "coming soon" pricing teases |

Mixing the two — putting a sqm picker + TBD budget + crop prices + waitlist on the same page right now — produces a "buy this thing whose price we'll tell you later" feel that erodes trust. The brief itself calls out the validation/waitlist purpose; the pricing flow belongs in the second state.

### 7.2 Current state

- FS CTAs: `#join` anchor (which scrolls to CTAFooter form).
- LIVE CTAs (R2 override): `https://app.hyeland.am/` — points to the App.
- CTAFooter is currently HIDDEN on live, so the `#join` anchor is broken in fallback mode.

### 7.3 Problem under new model

There is **nothing to claim until Spring 2027**. CTA copy like `Reserve my plot` / `Ամրագրել հողամասս` is misleading: the user clicks, lands in the App, but the App's pricing/sqm-picker doesn't reflect the new model yet (no real prices, no Transparency Pact gating).

### 7.4 Proposed strategy (Pre-launch state)

1. **Replace "Reserve" / "Claim" with "Join the waitlist"** semantics in all CTA copy:
   - Primary CTA: **"Join the Spring 2027 waitlist"** / HY: **"Միանալ 2027-ի մեկնարկի սպասելացուցակին"** *(draft direction; final wording to confirm)*
   - Secondary CTA: **"See how it'll work"** / HY: **"Տես, թե ինչպես է աշխատելու"**
2. **Validation form** consistent with the running Meta Lead Ads campaign:
   - email capture + 1–2 qualifying questions (e.g. "Which crops would you want?", "Where in Armenia are you?")
   - Captures intent and helps validate assumptions before pricing commit.
3. **Do NOT promise** "first 50 get priority access" or "pilot pricing." Neither is confirmed in the brief or current spec — surface both as Open Questions (§13). "Priority access" *language* is fine to discuss; specific capacity numbers and price-tier promises are not.
4. **Decide the App CTA target** (see §13):
   - If `app.hyeland.am` will be restructured by Spring 2027 to support new-model sqm picking → keep external CTA target, **but only after the App's pricing flow is rewritten**.
   - If the App will not be ready → CTAs must point to a waitlist form on the landing itself (re-enable CTAFooter — but see §13 / §9 for whether re-enabling is automatic or a deliberate choice).
5. **Whether CTAFooter is the waitlist surface** depends on §13. Don't auto-re-enable.

### 7.5 Launch-ready state (post-Feb-2027 pricing)

- Primary CTA can shift to "Reserve your share for 2027 season" pointing into the App's new-model flow.
- Pricing block, allocation flow, and crop-price ranges only appear in this state.

---

## 8. Placeholder Handling

**Recommendation: no placeholder pricing numbers on the public Pre-launch landing.** The table below is structured around that — most rows resolve to "hide until confirmed," and only appear in the Launch-ready state once real numbers arrive.

| Number | Where it would appear (Launch-ready) | Proposed handling (Pre-launch → Launch-ready) |
|---|---|---|
| `10,000 AMD/sqm` (annual) | Pricing block (§5.5), Crop Allocation Explainer | **Pre-launch: do not display anywhere on the public page**, including with "TBD" tags. May appear in post-waitlist follow-up emails. **Launch-ready: show real number** once confirmed. |
| Buffer % (20–30%) | Internal — never user-facing | Do not show in either state. Bake into the headline price once finalized. |
| Delivery fee | Pricing block (Launch-ready) | Pre-launch: do not show. Launch-ready: display as `+ delivery fee (set per delivery)` — never bundled into the sqm headline. |
| Per-crop kg prices | Crop Allocation Explainer (Launch-ready) | Pre-launch: do not show. Launch-ready: shown as actual prices from confirmed farmer table; if ranges are used, mark explicitly as "previous season — current season set at planting time." |
| Yield ranges per sqm | (was: Pricing block / Allocation flow) | **Remove entirely from the plan.** Per the new model, sqm is a financial unit, not a physical plot — there is no kg-per-sqm relationship to publish. The user picks kg of each crop within their annual budget; the farm decides how much physical land is needed. Landing copy must not promise "X kg / sqm / season." |
| `2 m²` as the only sqm size | Hero stat, Convenience, Progress, FAQ f2, plotMap subtitle | Pre-launch: drop `2 m²` headline references; replace with framing-block messaging (see §6). Launch-ready: sqm picker is open-ended (1–5+). |

**Treat the entire Pre-launch landing as a validation surface.** No commercial number should appear on the public page until confirmed.

Directional pricing in post-waitlist emails is **not a default channel** — it requires explicit human approval before any "here's the expected pricing" message goes out. Until approved, follow-up emails should focus on validation questions (crop preferences, location, intent) and waitlist confirmation, not on pricing guidance. Surface as an Open Question if/when the team wants to test it (§13).

---

## 9. Proposed Section-by-Section Changes

Ordered by render position. State column: **PL** = Pre-launch (now), **LR** = Launch-ready (post-Feb-2027 pricing). KEEP / REVISE / REMOVE / ADD with rationale.

| # | Section | Action | State | Notes |
|---|---|---|---|---|
| 1 | **Hero** | **REVISE (heavy)** | PL+LR | Replace inline mockup with trust+desire content (see §4.1 DashboardCard row): selected-crops preview, farm/drone update teaser, **"Your selected tomatoes — flowering"** style growth milestone (keep growth tracking, reframe it), transparency proof tag. **No placeholder budget on Hero.** Rewrite h1Italic away from "your land" exclusivity. Stat #2 (`Weekly Deliveries`) → drop or replace. Stat #1 (`2 m²`) → drop. CTA → waitlist (see §7.4). Localize mockup labels. |
| — | **Transparency Pact** | **ADD (new, after Hero)** | PL+LR | See §5.1. Highest-trust section. Identity details stay TBC until confirmed. |
| 2 | **Problem** | **KEEP, minor revise** | PL+LR | The 3 problem cards stay valid. Optional: add a 4th card explicit about "wholesale 'organic' claims with no proof" to motivate Transparency Pact directly. |
| 3 | **HowItWorks** | **REVISE** | PL+LR | Step 1 → describe the *share model* (not a sqm picker yet in PL). Step 3 → drop "Weekly" framing; reframe to peak-season harvest + off-season processed goods. Step 4 → drop "reinvest to expand your plot" (financial-share model doesn't have an "expand my dirt" verb); reframe to "stay year over year with the same farm partner." |
| — | **Crop Allocation Explainer** | **ADD (new)** | **LR only** | See §5.2. Replaces nothing in PL. Goes live with real pricing only. |
| 4 | **DashboardShowcase** | **REVISE** | PL+LR | Drop "Estimated harvest weight per crop type" and "Upcoming delivery day" specifics. Reframe to: farm transparency feed, share/allocation status, **growth stages of user-selected crops** (keep growth tracking — just don't anchor it to one physical plot), drone updates, off-season processed-goods schedule. |
| 5 | **Health** | **KEEP, minor revise** | PL+LR | 4 cards still valid. Item h4 ("Full traceability") should now explicitly link to Transparency Pact. Drop generic-organic claims; rely on the proof list. |
| 6 | **Convenience** | **REVISE** | PL+LR | Item c4 "Start with 2 m² and expand" → reframe to "Adjust your share size at the end of each season." Drop "Predictable weekly deliveries" specifics. |
| 7 | **Progress** | **REVISE OR REMOVE** | PL+LR | Drop `size` field from milestones (`2 → 6 → 15 m²` ladder gone). Reframe as long-relationship timeline OR remove the section. Recommendation: revise (don't remove growth/year-over-year story — it's emotionally valuable). |
| 8 | **PlotField slot (currently hidden)** | **KEEP HIDDEN, DECOUPLE** | PL: hidden; LR: see §5.2 | **Do NOT delete `PlotField.tsx`, `PlotFieldStatic.tsx`, `lib/plot-grid.ts`, `lib/plot-projection.ts`, `data/plot-field.json`** in this task. Diaspora still imports them. PL: keep `plotMap: false` in R2 (already so). LR: slot may host the Crop Allocation Explainer (§5.2). Deletion is a separate human-approved decision (see §13). |
| — | **Off-Season Story** | **ADD (new, after Seasonal slot or replacing some FAQ items)** | PL+LR | See §5.3. Pulls FAQ f5 into a real section. |
| 9 | **Farmer** | **REVISE** *(re-enable visibility is a §13 Open Question)* | PL+LR | Currently hidden in live. **Do not auto-re-enable.** Whether the section returns standalone or merges into the Transparency Pact is an Open Question. If kept standalone: drop generic "tends your land" framing; clarify the farmer's role under the new model. Photo + name + region are TBC. |
| 10 | **Seasonal** | **REVISE** *(re-enable visibility is a §13 Open Question)* | PL+LR | Currently hidden in live. **Do not auto-re-enable.** Whether the current crop calendar has enough confirmed data to display is an Open Question. If re-enabled: drop "Stored preserves" as vague — replace with the explicit off-season jar list once Off-Season Story exists. |
| 11 | **Trust** | **REVISE** | PL+LR | Fix the 20-vs-50 mismatch between locales. Point t2: change to **Spring 2027 launch** (delete "spring 2026" / "2026 թ."). Point t1: replace specific plot count with capacity-TBD framing — do NOT introduce "first 50" or "pilot pricing" promises. Add a point about the validation phase being intentional. |
| 12 | **FAQ** | **REVISE** | PL+LR | f1: keep. f2: rewrite from "How big is 2m²" → "What does 1 sqm mean here?" (positive share + relationship framing per §6; lead with what the share *is*, not what it isn't). f3: keep. f4: update timing. f5: move to standalone Off-Season Story; replace with FAQ about timing. f6: this is one of the few places where the share-vs-exclusive mechanic IS allowed explicit (per §6) — rewrite plainly and honestly. Add new FAQs: "Why monthly billing through winter?", "What if a crop fails?", "Why Spring 2027 not 2026?". |
| 13 | **About** | **KEEP, revise stale numbers** | PL+LR | Founder copy is strong; minor edits only. **Critical**: update `trustText` in both locales to remove "2026" date (currently EN live says "Pilot opening 2026"; HY live says "2026 թ.") — should be "Spring 2027 pilot." Confirm Alex's years-of-experience number (FS says 9, live says 11 — agree on one and sync). |
| 14 | **CTAFooter** | **REVISE** *(re-enable visibility is a §13 Open Question)* | PL+LR | Currently hidden in live. **Do not auto-re-enable.** Whether CTAFooter is the landing-side waitlist surface vs an external form is an Open Question. If re-enabled: use waitlist-priority CTA (§7.4); update heading to remove "20" specific number; do NOT introduce "first 50 / pilot pricing" promises. |

---

## 10. Drone Video Special Requirements

If drone video is added to Hero or any section, the plan must address each of:

| Requirement | Decision direction |
|---|---|
| **Poster image** | Static frame from the drone footage, sized to match the responsive container. Used for first paint and when `prefers-reduced-motion: reduce` is set. |
| **Mobile vs desktop crop** | Source is 1080×1920 vertical. Mobile hero can use it native. Desktop hero needs either (a) a centered + letterboxed treatment, (b) a different horizontal asset, or (c) cropped excerpt. Recommend: **commission a horizontal cut** for desktop; never letterbox in a hero. |
| **`prefers-reduced-motion`** | If reduce → render poster image only; do not autoplay. Test via DevTools. |
| **Autoplay rules** | `muted`, `loop`, `playsinline`, `preload="metadata"`. **Recommendation, not requirement**: where the Network Information API is supported, consider checking `navigator.connection.saveData` and `navigator.connection.effectiveType` before autoplaying (skip autoplay on `'slow-2g' \| '2g'` or when `saveData === true`). The Network Information API is not universally supported (notably absent on Safari/iOS), so the implementation **must degrade safely** when `navigator.connection` is undefined — default behavior in that case is to autoplay normally per the other constraints in this table. |
| **LCP impact** | Video must NOT be the LCP element. Static poster image must be the LCP. Add `fetchpriority="high"` to the poster and lazy-load the video itself. |
| **Accessibility** | `aria-label` / `aria-describedby` describing the footage. No critical information conveyed only by video (every claim must also be in text). |
| **File size / CDN** | Source ~366MB. Need: 480p preview (~1–2MB), 720p web (~5–8MB), 1080p mobile-native (~10–15MB). Serve via Cloudflare R2 with CDN cache headers. Use `<source media="...">` for breakpoint selection. |

---

## 11. Risks

### 11.1 SEO + social previews

- Hero copy change → loses indexed long-tail keywords ("own a plot Armenia"). New copy should preserve "own a piece of the Highland" tagline for brand-recall continuity.
- Update `<title>` and `<meta description>` in `app/[locale]/layout.tsx` (current layout has no per-locale meta — gap). Update OG image to use the drone footage poster.

### 11.2 Image hosting drift

- Farmer + About images are still on **Vercel Blob** (`zlpkrecnzh3d1psv.public.blob.vercel-storage.com`) despite repo migration to R2. Verify whether Vercel Blob bill is still being paid. If not, those URLs will 404 silently when the storage is decommissioned.
- `scripts/migrate-blob-to-r2.ts` exists but the URLs in live R2 content still point to Vercel Blob — migration was incomplete or content was edited again post-migration with old URLs.

### 11.3 LCP impact from drone video

- Mitigated by serving poster as LCP and lazy-loading video.
- Test with Lighthouse before going live.

### 11.4 i18n coverage

- Russian (`ru`) is NOT a locale in landing despite the App supporting it (`messages/{en,hy,ru}.ts`). New copy stays HY + EN only.
- Per-locale FS divergence is real (20 plots vs 50 plots; "9 years" vs "11 years"). New writes must keep both locales in sync — add a check or process.

### 11.5 Admin override drift

- Live R2 has 7 distinct overrides on top of FS (sectionVisibility, hero href, trust t2, faq f2 + f5, about trustText, about paragraphs). Any FS-only update will be invisible to users until either (a) R2 override is cleared, or (b) FS adds top-level keys that aren't in R2 (shallow merge means R2 wins on overlap).
- **Mitigation for code-side rewrites**: when changing copy keys, change the FS file *and* clear or update R2 for that key. The admin panel can do this. Document a "live override audit" step in each future content task.

### 11.6 Hidden sections + dead anchors

- `#join` anchor target (CTAFooter) is currently hidden → CTAs pointing to `#join` (FS) scroll to nothing. Live R2 already redirects CTAs to `app.hyeland.am` to work around this. Re-enabling CTAFooter fixes the FS path too.
- The Navbar still has a link to **"Pre-pilot" → `#trust`**; works. **Dashboard link → `#dashboard`** — verify the `DashboardShowcase` section actually has `id="dashboard"`.

### 11.7 PlotField deletion is OUT of scope for this task

- Earlier draft incorrectly proposed deleting `PlotField.tsx`, `PlotFieldStatic.tsx`, `lib/plot-grid.ts`, `lib/plot-projection.ts`, `data/plot-field.json`. **Diaspora landing also imports and renders `PlotField`** (verified at `app/[locale]/diaspora/page.tsx:21,40,63`). Deletion would break diaspora rendering.
- Decision: **keep all five files in place**. Local page already has `plotMap: false` in R2, so the section does not render for local users. No further action needed in this pivot task.
- Whether to delete eventually is a follow-up, after: (a) diaspora pivot decisions land, and (b) the visual-fiction direction is settled (the assets may be re-purposed as proof-of-place / Transparency Pact visuals — see §4.1 PlotField row).

### 11.8 Diaspora landing coupling

- Diaspora landing shares `getPlotFieldConfig()`, `DashboardCard.tsx`, `Hero.tsx` (different content variant via `DiasporaHero`), and 7 cross-imported section components (`HowItWorks`, `DashboardShowcase`, `Progress`, `Farmer`, `Seasonal`, `Trust`, `FAQ`, `About`, `CTAFooter`, `PlotField`). **Any structural change to these shared components risks breaking diaspora.**
- See §12 — every change to a shared component must enumerate its consumers and stay backward-compatible until the diaspora pivot is also done.

---

## 12. Shared-Component Impact Matrix

The brief requires identifying consumers of shared components before any breaking change.

| Component | Consumed by | Impact of new-model changes |
|---|---|---|
| `components/sections/Hero.tsx` | Local (`app/[locale]/page.tsx`) + Diaspora (`app/[locale]/diaspora/page.tsx`) — both render `Hero` with their own content shape | Hero rewrite must be **prop-driven** (already is — takes `HeroContent`). Removing fields like `stats[1]` or changing the mockup structure WILL affect diaspora rendering. Recommendation: extend `HeroContent` with optional new fields (`pactTeaser?`, `allocationTeaser?`) but do not remove existing keys until diaspora is also revised. |
| `components/ui/DashboardCard.tsx` | Used only inside Hero today (verified). | Safe to revise without breaking other pages. |
| `components/sections/Progress.tsx` | Both local + diaspora pages. | If `size` field is dropped from milestones, both content files must be updated together. Either keep field optional in type, or remove it everywhere at once. |
| `components/plots/PlotField.tsx` + `PlotFieldStatic.tsx` | **Both local + diaspora** (`app/[locale]/diaspora/page.tsx:21,63`). Earlier draft of this matrix incorrectly said "local landing only" — corrected. | **NOT safe to delete** in this task. Local hides via `plotMap: false`; diaspora still renders. Any change to the prop shape would break diaspora. |
| `components/sections/Farmer.tsx`, `Seasonal.tsx`, `Trust.tsx`, `FAQ.tsx`, `About.tsx`, `CTAFooter.tsx` | Both local + diaspora (per `app/[locale]/diaspora/page.tsx` consumers). | Any prop-shape change requires updating diaspora content/types in lockstep. Copy-only changes are safe. |
| `data/plot-field.json` | `lib/content.ts:getPlotFieldConfig()` → called by **both** local and diaspora page files. Corrected from earlier draft. | **NOT safe to delete** in this task. |
| `types/content.ts` `LocalContent` / `DiasporaContent` | Type-level, used everywhere. | Drop `plotMap?` only after diaspora is also done with the map. Drop `stats[]` only after both pages are revised. |

---

## 13. Open Questions for Human

> Item 0 is a hard blocker on opening any implementation task.

0. **Commit `PRICING_MODEL_PIVOT.md` to repo (BLOCKER)**. The brief references it; the file does not exist anywhere under `/home/victus/hyeland/`. Until it's committed, any future session reading this plan will be forced to re-derive intent from a chat-history brief. Action: add `docs/PRICING_MODEL_PIVOT.md`, link from `LANDING_INDEX.md`, then open the implementation task.

1. **Spring 2027 launch — confirmed?** Brief states "Spring 2027 pilot." Trust copy currently says "2026" in both locales (live override). What month-week target should we communicate? "Spring 2027" generic, or a tighter window like "April 2027"?

2. **The 20-vs-50 plot baseline mismatch** between locales — what's the right number for the new model? "Capacity TBD" until validation completes, or a firm target? Note: **do not commit to "first 50 priority slots" or "pilot pricing" promises** until you explicitly approve them.

3. **`app.hyeland.am` CTA target** — is the App being rewritten before Spring 2027 to reflect the new-model sqm picker + Transparency Pact? If yes → keep external CTA, drive prep work. If no → CTAs must point to a landing-side waitlist surface (then §13/4 and §13/12 below apply).

4. **Should hidden sections be re-enabled, and how?** Live R2 currently hides four sections (`farmer`, `seasonal`, `ctaFooter`, `plotMap`). Their hidden state may be intentional and not just stale-copy-driven. Decisions needed before Phase 1 ships:
   - **Farmer** — return as a standalone section, or fold into the Transparency Pact?
   - **Seasonal** — does the current crop calendar reflect real planned crops for the new model, or is it stale?
   - **CTAFooter** — is this the landing-side waitlist surface (then re-enable + rewrite), or is the waitlist external (then keep hidden)?
   - **PlotMap (`plotMap`)** — keep hidden under the new model (recommended); confirm.

5. **PlotField + `data/plot-field.json` long-term fate** — deletion was rejected for this task (diaspora still imports). Eventually, should those files be (a) deleted entirely after diaspora pivots away, (b) re-purposed as proof-of-place / Transparency Pact farm map (non-grid), or (c) re-purposed as a non-exclusive "share visualization"? Don't commit to deletion yet.

6. **Drone footage** — does the 366MB source actually exist somewhere already, or does it need to be filmed? If filmed: by whom, when, with what authorization at the Armavir field?

7. **Farm identity + farmer "not used" list — all TBC.** Is the new-model farm partner the same Aram Mkrtchyan in the same Armavir region? Or has the farm/region/farmer changed? Until confirmed, leave name, region, photo, years of experience, farm name, and the "not used" list as placeholder slots and don't render the public claims.

8. **Should Progress section stay or go?** Under new model, the size ladder is meaningless. Recommendation: revise into long-relationship timeline. Confirm direction.

9. **Diaspora pivot timing** — brief says diaspora is "out of scope, still an open question." Shared components mean a diaspora pivot that lands later forces lockstep type/component changes. If diaspora is months out → use additive type changes only now.

10. **Russian locale** — landing is HY + EN only despite App supporting RU. Should the new content also be drafted in RU for future, or keep landing 2-locale?

11. **Admin tab restructuring** — should the Admin Local Page tabs add `transparencyPact` and `offSeason`, and remove `plotMap`? `cropAllocation` is Launch-ready only. Or stuff new content into existing tabs?

12. **About paragraph 1 — 9 vs 11 years** — live has "11 years" in both locales; FS still has "9 years." What's the canonical number now?

13. **Vercel Blob → R2 migration completion** — should the farmer + about images be migrated to R2 as part of this rewrite, or left alone?

14. **`#join` anchor strategy** — keep `#join` and re-enable CTAFooter as the target (depends on §13/4 CTAFooter decision), or switch all CTAs to external (waitlist form on `app.hyeland.am/waitlist` or similar)?

15. **Growth tracking framing** — Confirm: growth stages stay in the product story (Hero mockup, DashboardShowcase) but are tied to *the user's selected crops* rather than a single physical plot (e.g. "Your selected tomatoes — flowering"). Confirm direction.

---

## 14. Implementation Phases

Two-state framing from §7: **Pre-launch** phases (Phase 1, 2) ship before Feb 2027 pricing lands; **Launch-ready** phase (Phase 3) ships after.

**Implementation blocker before Phase 1**: commit `PRICING_MODEL_PIVOT.md` to repo (§13/0).

### Phase 1 — Copy-only fixes (Pre-launch · low risk, no shared-component breakage)

1. Fix `trust.points[1]` ("Launching spring 2026" / "Մեկնարկ՝ 2026 թ.") → "Spring 2027 launch" *(final wording from §13/1)* in **both** FS files AND clear/update R2 overrides.
2. Resolve the 20-vs-50 baseline mismatch — pick one number (or "capacity TBD") and align both locales in FS + R2. **Do not commit to "first 50 / pilot pricing"** unless explicitly approved (§13/2).
3. Update `about.trustText` in both locales to remove the 2026 date (live currently says "Pilot opening 2026" EN, "2026 թ." HY).
4. Update Hero stats: drop `2 m²` and `Weekly Deliveries` headlines; pick 3 new stats under §4.2 direction. **No placeholder budget** anywhere in Hero (§4.1 DashboardCard row).
5. Update Hero CTA copy to waitlist framing (§7.4) in HY + EN.
6. Update Convenience c4 ("Start with 2 m² and expand") to drop the 2m² specific.
7. FAQ f2 rewrite ("How big is 2 m²?" → "What does 1 sqm mean here?") in both locales — using §6 share-framing wording, not per-sqm yield numbers.
8. FAQ f6 rewrite ("Is my plot really mine?" → honest share-vs-exclusive answer) in both locales.
9. Decide section-visibility re-enablement per §13/4 — `ctaFooter`, `farmer`, `seasonal`. **Do NOT auto-flip these to `true`.** Each is a deliberate choice with its own copy/content prerequisites.

**Dependencies**: §13/0 unblocked; §13/2, §13/4, §13/7 answered. **Risk**: low. **Effort**: per-section S.

### Phase 2 — Structural changes (Pre-launch · medium risk, type + shared-component changes)

1. Add Transparency Pact section: new component, new content schema, new admin tab. **Build with `transparencyPact: false` in the FS `sectionVisibility` defaults and do NOT enable it in R2.** The component and admin schema can land in code; the section must remain hidden in production until the §5.1 hard-gating checklist (farm identity, farmer identity, visit policy, drone cadence, every "not used" item verified) is complete. Identity details stay TBC (§13/7).
2. Add the Mandatory §6 framing block as a standalone section (component + content schema).
3. Add Off-Season Story section: new component, new content schema, new admin tab.
4. Reframe Progress milestones (drop `size` ladder, reframe as relationship timeline). Keep growth-tracking story intact, just decouple from "Year 1 = 2m²" framing (§4.1 DashboardCard row, §13/15). Requires diaspora coordination.
5. Reframe Hero mockup (replace hard-coded "Plot 7 / Flowering 62% / Thursday 1.5kg" with new-model trust+desire preview per §4.1). Keep growth tracking as "Your selected tomatoes — flowering." Localize the mockup. Requires diaspora coordination.
6. Update `app/[locale]/layout.tsx` with per-locale `<title>` + `<meta description>` + OG image.
7. **Do NOT delete** `PlotField.tsx`, `PlotFieldStatic.tsx`, `lib/plot-grid.ts`, `lib/plot-projection.ts`, `data/plot-field.json`. Diaspora still imports them. The Crop Allocation Explainer is **Launch-ready only** and lives in Phase 3.

**Dependencies**: Phase 1 copy complete. Diaspora team aware. **Risk**: medium. **Effort**: per-section M.

### Phase 3 — Launch-ready + asset-heavy work (post-Feb-2027 pricing)

1. Pricing block (§5.5): real annual sqm price + monthly equivalent + separate delivery fee.
2. Crop Allocation Explainer (§5.2): interactive picker (sqm range, crop sliders/checkboxes) using **confirmed** pricing. No TBD placeholders.
3. Drone video: commission/extract, encode 3 breakpoints, upload to R2, integrate into Hero + Transparency Pact with all §10 requirements satisfied. (Can start earlier if drone footage is available; no pricing dependency.)
4. Migrate Vercel Blob image URLs to R2 (farmer + about images) — see §11.2 / §13/13.

**Dependencies**: Spring 2027 pricing finalized (§13/1). **Risk**: higher (asset commission, LCP impact, pricing-tied UX). **Effort**: per-section L.

---

## 15. Effort Estimate

| Section | Action | S/M/L |
|---|---|---|
| Hero | Heavy revise + mockup rewrite (PL) | **L** |
| Transparency Pact | Add new (PL) | **M** |
| Mandatory §6 framing block | Add new (PL) | **S** |
| Problem | Minor revise (PL) | **S** |
| HowItWorks | Revise (PL) | **M** |
| Crop Allocation Explainer | Add new — interactive picker, real prices (**LR only**) | **L** |
| DashboardShowcase | Revise (PL) | **S** |
| Health | Minor revise (PL) | **S** |
| Convenience | Revise (PL) | **S** |
| Progress | Revise (drop size ladder, keep relationship timeline) (PL) | **M** |
| PlotField slot | Keep hidden, decouple, **do not delete** (PL) | **S** |
| Off-Season Story | Add new (PL) | **M** |
| Farmer | Revise — re-enable visibility is §13/4 decision (PL) | **S** |
| Seasonal | Revise — re-enable visibility is §13/4 decision (PL) | **S** |
| Trust | Copy fixes + restructure points (PL) | **S** |
| FAQ | Rewrite f2, f6; add new items (PL) | **M** |
| About | Copy fixes only (PL) | **S** |
| CTAFooter | Revise — re-enable visibility is §13/4 decision (PL) | **S** |
| Pricing block | Real numbers (**LR only**) | **M** |
| Drone video integration | Asset + 3-breakpoint encode + Hero/Pact integration | **L** |
| Image migration to R2 | Farmer + About | **S** |

(*PL* = Pre-launch · *LR* = Launch-ready)

---

## 16. Admin Editor Impact Summary

For each affected content field, the admin tab/field that needs updating after deploy. **All paths under `/admin/local`** unless noted.

| Section / field | Admin tab | Field |
|---|---|---|
| Hero CTA href + label, stats, h1*, subtitle | Local Page → Hero | per-field inputs |
| Problem cards | Local Page → Problem | card editor |
| HowItWorks steps | Local Page → How It Works | step editor |
| DashboardShowcase features | Local Page → Dashboard | features list |
| Health items | Local Page → Health | items list |
| Convenience items | Local Page → Convenience | items list |
| Progress milestones (drop `size`?) | Local Page → Progress | milestone editor — **schema change required if `size` field is dropped from type** |
| Plot Map → KEEP HIDDEN | Local Page → Plot Map | leave tab and content in place; `plotMap: false` already in R2. Removing the tab is a separate decision (§13/5). |
| Farmer | Local Page → Farmer | text + image |
| Seasonal | Local Page → Seasonal | season editor |
| Trust points | Local Page → Trust | point editor |
| FAQ items | Local Page → FAQ | item editor |
| About paragraphs + trustText | Local Page → About | textareas |
| CTAFooter | Local Page → CTA | heading, subtitle, button, note, href |
| Section visibility flags | Local Page (top of editor) | toggles |
| Transparency Pact (new) | Local Page → **NEW tab** (PL) | farm name, "not used" list, drone-update offer, visit-offer toggle. All identity fields TBC (§13/7). |
| §6 Mandatory framing block (new) | Local Page → **NEW tab** (PL) | headline + share-vs-exclusive copy. |
| Crop Allocation Explainer (new) | Local Page → **NEW tab (LR only)** | sqm range, real pricing display, copy. Not built in Pre-launch. |
| Off-Season Story (new) | Local Page → **NEW tab** (PL) | jar list, billing rationale copy. |
| Navbar CTA href | Navigation | localCtaHref input (per commit 7756b2c) |
| Diaspora link visibility | Settings | diasporaEnabled toggle (currently false in live) |

**Post-deploy admin checklist for any future content task**:
1. Identify whether the field has a live R2 override (check `content/<locale>/local.json` via admin panel "current value").
2. If yes — edit via admin so R2 is updated. FS-only edits will be invisible to users when R2 is overriding the same top-level key.
3. After deploy of a code-side schema change, audit `activity-log.json` and `local.json` R2 objects for stale top-level keys.

---

*End of plan. Awaiting human review before any code or content changes are made.*
