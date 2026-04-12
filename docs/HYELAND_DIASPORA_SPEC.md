# Hyeland — Diaspora Page Spec

> Status: **AWAITING ALEX APPROVAL** — no code to be written until approved.

---

## 1. Codebase Findings

### Route Convention
The Navbar already hardcodes the route: `/${locale}/diaspora`. The file to create is:
```
app/[locale]/diaspora/page.tsx
```
The locale layout (`app/[locale]/layout.tsx`) covers it automatically — no new layout needed.

### Component Pattern
Each section is a separate file in `components/sections/`. The page file (`app/[locale]/page.tsx`) imports all sections and composes them with `sectionVisibility` guards. The diaspora page should follow the same pattern: one new page file, new section files per section, reusing shared components directly.

### Styling Approach
Inline styles with CSS custom properties (`var(--green-deep)` etc.), no Tailwind. Framer Motion for all scroll-triggered animations. CSS utility classes in `globals.css` for hover states (`.btn-primary`, `.card-lift`, etc.). All new sections should follow this same pattern.

### Font Loading
Handled in `app/[locale]/layout.tsx` via `lib/fonts.ts`:
- `Playfair_Display` → `--font-playfair` (weights 400, 500, 600 — normal + italic)
- `Lato` → `--font-lato` (weights 300, 400, 700)

The locale layout is shared — **no font changes needed** for the diaspora page.

### Existing Shared Components — Reusable As-Is
| Component | Location | Notes |
|---|---|---|
| `Navbar` | `components/layout/Navbar.tsx` | Already has `page="diaspora"` prop and `diasporaLinks`/`diasporaCta` content fields |
| `ArmenianDivider` | `components/layout/ArmenianDivider.tsx` | variants: `green`, `gold`, `ink` |
| `SectionTag` | `components/ui/SectionTag.tsx` | variants: `green`, `gold`, `cream` |
| `DashboardCard` | `components/ui/DashboardCard.tsx` | Will need a diaspora-specific demo data object |
| `ArmenianLandscape` | `components/ui/ArmenianLandscape.tsx` | SVG landscape illustration |
| `VegetableIllustration` | `components/ui/VegetableIllustration.tsx` | SVG vegetable icons |
| `LocaleSwitcher` | `components/ui/LocaleSwitcher.tsx` | — |

### `next/image` and `next/font`
- `next/font`: **In use** (`lib/fonts.ts`)
- `next/image`: **Not in use** — the codebase uses plain `<img>` tags throughout

---

## 2. Design System Audit

### Color Tokens (from `globals.css`)

| Token | Hex | Used On |
|---|---|---|
| `--green-deep` | `#2D5A27` | Dark section backgrounds, primary CTA bg |
| `--green` | `#3D7A35` | Section tags, icons, hover states |
| `--green-mid` | `#5A9B50` | Decorative accents, dividers |
| `--green-light` | `#A8D4A0` | Borders, divider lines |
| `--green-pale` | `#E8F5E4` | Section backgrounds, icon bg |
| `--gold` | `#C49A3C` | Dark-section tags, Trust section accents, gold CTA, divider on dark |
| `--gold-light` | `#F0D98A` | Gold button hover state |
| `--gold-pale` | `#FBF3DC` | (unused in current sections) |
| `--soil` | `#8B5E3C` | Farmer/Problem card accents |
| `--soil-pale` | `#F5EBE0` | Problem, Farmer section backgrounds |
| `--cream` | `#FBF8F2` | Hero, Seasonal, FAQ, CTAFooter text bg |
| `--cream2` | `#F0EBE0` | Convenience, Trust section backgrounds |
| `--ink` | `#1A1A14` | Primary headings |
| `--ink2` | `#4A4A3A` | Body text, subheadings |
| `--ink3` | `#6E6E5A` | Tertiary text, ghost links |

### Typography

| Class/Usage | Font | Weight | Size | Notes |
|---|---|---|---|---|
| `.text-display` / H1 | Playfair Display | 300 | clamp(2.6rem, 4.5vw, 4.2rem) | Line height 1.15 |
| `.text-h2` / H2 | Playfair Display | 300 | clamp(1.8rem, 3vw, 2.8rem) | Line height 1.25 |
| `.text-label` / SectionTag | Lato | 700 | 0.7rem | 0.18em tracking, uppercase |
| Body large | Lato | 300 | 1.05rem | 1.85 line-height |
| Body | Lato | 300 | 1rem | 1.85 line-height |
| Body small | Lato | 300 | 0.9–0.95rem | 1.75–1.8 line-height |
| Caps label (inline) | Lato | 400–700 | 0.75–0.8rem | 0.06–0.08em tracking |

### Section Padding Convention
All sections: `padding: '96px 24px'`  
Hero: `padding: '60px 24px 80px'` (top: `64px` for navbar offset + `60px`)  
CTAFooter: `padding: '96px 24px 104px'`

### Button Variants

| Class | Style |
|---|---|
| `.btn-primary` | `background: var(--green-deep)`, white text, pill, 14px/32px, Lato 700 uppercase 0.08em |
| `.btn-gold` | `background: var(--gold)`, `color: var(--green-deep)`, same shape, 16px/40px |
| `.btn-ghost` | No bg, `color: var(--ink2)`, 1px borderBottom, hover → green |
| `.btn-nav` | `background: var(--green-deep)`, white, 9px/20px pill, smaller |

### Card Patterns

| Class | Behavior |
|---|---|
| `.card-lift` | `box-shadow` + `translateY(-4px)` on hover |
| `.card-lift-green` | Same but with green-tinted shadow |
| `.card-lift-subtle` | Transform only, no shadow change (used for dynamic-color cards) |
| `.hiw-card` | Box-shadow only, no transform |

### Armenian Ornament — `ArmenianDivider`
Single component. 480×32px SVG. Features:
- Central 8-pointed star medallion with outer ring + 8 rays
- Left/right vine-wave paths with diamond polygon accents
- Horizontal rules to edges
- Color adapts via `variant` prop: `green` → `var(--green-mid)`, `gold` → `var(--gold)`, `ink` → `var(--ink2)`

---

## 3. Diaspora Accent Color

**Chosen accent: `#8B2535` — Pomegranate Crimson**

| Token to add | Hex | Paired light | Pale bg |
|---|---|---|---|
| `--pomegranate` | `#8B2535` | `#D4748A` (light) | `#F9EDF0` (pale) |

**Reasoning:**
- The pomegranate (*noor*) is Armenia's national symbol — it appears in Ararat brandy, duduk compositions, Saryan paintings, and khachkars. It is unmistakably Armenian without being generic.
- At a glance it reads immediately as crimson/red — completely distinct from gold (`#C49A3C`) which reads as amber/yellow. No chance of confusion.
- Warm and premium: deep enough to hold weight on cream backgrounds, bright enough to glow as an accent on dark (`var(--green-deep)`) backgrounds.
- Carries emotional weight fitting the diaspora value drivers: love, legacy, longing — red resonates with these in a way gold (which reads as wealth/harvest) does not.
- Replaces the role gold plays on the local page: section tag accent color, CTA button, active states.

**Usage rules for diaspora:**
- `SectionTag` diaspora variant → `pomegranate` dot and text (new variant needed)
- CTA buttons → pomegranate background with white text (new `.btn-pomegranate` class)
- `ArmenianDivider` on dark sections → gold (keep existing, gold still works here)
- `ArmenianDivider` on light sections → consider adding `pomegranate` variant

---

## 4. Section Plan

### Local page sections → Diaspora treatment

| # | Section | Decision | Reason / What Changes |
|---|---|---|---|
| 1 | **Hero** | `ADAPT` | Same 2-col structure. Copy shifts to emotional ownership + family legacy. Stats change (no "Weekly Deliveries"). DashboardCard demo data changes to show harvest option picker instead of "Next Delivery." Primary CTA → "Claim your plot." |
| 2 | **Problem** | `REPLACE` | Local problem = bad supermarket food. Diaspora problem = disconnection from homeland — your children don't know the land, cultural identity fades, you can't bring Armenia home. Three cards reframe the emotional loss, not the food quality problem. |
| 3 | **HowItWorks** | `ADAPT` | Same 4-step grid. Steps change: (1) Choose your plot in Armenia, (2) Your farmer tends it and sends you updates, (3) Watch your plot grow from anywhere in the world, (4) At harvest, decide what to do with it. No delivery language. |
| 4 | **HarvestOptions** | `NEW` | 4-card grid showing the exact 4 options. Placed here so users understand what happens to the harvest immediately after learning how it works. |
| 5 | **DashboardShowcase** | `ADAPT` | Keep dark section + DashboardCard visual. Features list changes: live photos from your plot, farmer diary updates, harvest notifications, one-tap harvest option selection. |
| 6 | **DiasporaOwnership** | `REPLACE` (was Health) | Health/pesticides irrelevant. Replace with: what real ownership means — your name on the land registry, plot coordinates, photo evidence, legal accountability. |
| 7 | **GiftMechanic** | `REPLACE` (was Convenience) | Door delivery irrelevant. Replace with: The Gift section. Gifting a plot to a parent in Yerevan, a child abroad, a friend who misses home. Gift card mockup visual. |
| 8 | **Progress** | `KEEP` + note | The 3-milestone growth timeline applies equally. Add one bullet to Phase 2 card: "Physical shipping to diaspora countries." Clearly labeled as future. |
| 9 | **Farmer** | `ADAPT` | Keep farmer profile structure. Reframe copy: "This is the person who tends your land." |
| 10 | **Seasonal** | `ADAPT` | Keep 4-season card grid. Reframe intro: not "what you'll eat" but "what's growing on your plot this season." |
| 11 | **Trust** | `ADAPT` | Pre-pilot transparency stays but content is diaspora-specific: Phase 1 limited to diaspora plots, no physical shipping yet, all 4 harvest options available. |
| 12 | **PhaseTwo** | `NEW` | Muted "Coming in Phase 2" teaser. Single card, dashed border, clearly not-yet-available styling. |
| 13 | **FAQ** | `REPLACE` | Diaspora-specific questions. See below. |
| 14 | **About** | `KEEP` | Founder story is universal. |
| 15 | **CTAFooter** | `ADAPT` | Copy shifts: "Own your piece of the Highland." Pomegranate CTA button replaces gold. |

---

### HarvestOptions section detail (NEW)

Dark section (green-deep bg), 4-card grid, pomegranate accent.

| Option | Icon concept | Copy |
|---|---|---|
| **Reinvest** | Cycle/arrow | Put the harvest value back into your plot. Expand it, add a crop type, grow it for next season. |
| **Donate** | Heart/hands | Your harvest goes to a local Armenian family in need. You receive a photo of the delivery as proof. |
| **Sell & hold credit** | Coin/ledger | We convert your harvest to account credit. Use it next season, upgrade your plot, or save it. |
| **Gift card** | Ribbon/envelope | Turn your harvest value into a Hyeland gift — a plot for a family member, a friend, anyone who deserves a piece of the Highland. |

### GiftMechanic section detail (NEW)

Light section (soil-pale or cream2 bg). Layout: left copy column + right visual. Visual: a gift card / envelope mockup or a 2-up DashboardCard showing "Gifted by: [name] → [recipient]." Copy: frame the gift as a cultural act — giving someone roots, not just a product.

### PhaseTwo section detail (NEW)

Muted section. Possible treatment: light grey-cream bg (`var(--cream2)`), card with dashed border in `--ink3` color, `SectionTag` with text "Phase 2 — Coming Later." Single block: physical shipping to diaspora countries — no date promise. One-sentence note: "We're not there yet, but we're building toward it."

### Diaspora FAQ questions (proposed)

1. Can I visit my plot in Armenia?
2. What happens to my harvest — do I have to decide in advance?
3. Can I gift a plot to someone as a present?
4. Is this a subscription or a one-time purchase?
5. Will physical delivery to my country ever be available?
6. Can I own more than one plot?

---

## 5. Component List

### Reused from Existing (no changes)
- `Navbar` — already has `page="diaspora"` support
- `ArmenianDivider` — all three variants
- `SectionTag` — needs one new variant: `pomegranate`
- `DashboardCard` — reused with new demo data object
- `ArmenianLandscape` — used in Hero
- `VegetableIllustration` — used in diaspora Problem cards if needed
- `LocaleSwitcher`

### Adapted (same structure, new content props)
| Component | What changes |
|---|---|
| `Hero` | Diaspora demo card data, copy, stats — **no structural change** |
| `HowItWorks` | Step copy only — identical grid/card structure |
| `DashboardShowcase` | Features list copy, demo card data |
| `Farmer` | Tag + framing copy |
| `Seasonal` | Intro copy only |
| `Trust` | All 4 transparency points rewritten for diaspora |
| `CTAFooter` | Copy + button color (pomegranate vs gold) |

These can be driven by **content JSON** changes if the content system supports it, without needing new component files. The existing components accept `content` props — just provide diaspora content.

### New Components (to be written)
| Component | File | Notes |
|---|---|---|
| `DiasporaProblem` | `components/sections/diaspora/DiasporaProblem.tsx` | 3-card grid, emotional disconnection framing, pomegranate accent bars |
| `DiasporaOwnership` | `components/sections/diaspora/DiasporaOwnership.tsx` | Replaces Health. "What ownership really means." Feature list or 2×2 grid. |
| `GiftMechanic` | `components/sections/diaspora/GiftMechanic.tsx` | Replaces Convenience. Gift mechanic as first-class section. |
| `HarvestOptions` | `components/sections/diaspora/HarvestOptions.tsx` | 4-card grid on dark bg. Exactly 4 options. |
| `PhaseTwo` | `components/sections/diaspora/PhaseTwo.tsx` | Muted "coming later" teaser. Single block, dashed border. |

### New Content Types (for `types/content.ts`)
- `DiasporaHeroContent`
- `DiasporaProblemContent`
- `DiasporaOwnershipContent`
- `GiftMechanicContent`
- `HarvestOptionsContent`
- `PhaseTwoContent`

### New CSS (for `globals.css`)
- `--pomegranate: #8B2535`
- `--pomegranate-light: #D4748A`
- `--pomegranate-pale: #F9EDF0`
- `.btn-pomegranate` hover class
- `SectionTag` `pomegranate` variant (inline in component or via globals)

---

## 6. Open Questions

1. **Navbar links for diaspora page** — ✅ Decided: `How it Works → #how-it-works`, `Your Harvest → #harvest-options`, `The Gift → #gift`, `Progress → #progress`, `FAQ → #faq`. Alex will adjust labels via admin panel after launch.

2. **Content system** — ✅ Decided: new `content/en/diaspora.json` + `content/hy/diaspora.json` files. Add `getDiasporaContent(locale)` to `lib/content.ts` — 3 lines, mirrors `getLocalContent()` exactly.

3. **DashboardCard demo for diaspora Hero** — ✅ Decided: replace `nextDelivery` field with `harvestOption: { selected: 'Donate', description: 'Donated to a family in Gyumri' }`. DashboardCard component will need a conditional render — show harvest option row instead of delivery row when `harvestOption` prop is present.

4. **Locale defaults for diaspora** — ✅ Decided: no middleware exists on the main site either. Routes are locale-prefixed only: `/en/diaspora` and `/hy/diaspora`. No redirect needed — consistent with existing behaviour.

5. **Pomegranate color** — ✅ Approved: `#8B2535`.

6. **GiftMechanic visual** — ✅ Decided: gift card mockup (envelope style). "Plot #12 — Armavir. Gifted by Armen to his mother." Custom SVG/div, no DashboardCard reuse.

7. **Section ordering** — ✅ Decided: `HarvestOptions` goes right after `HowItWorks` (position 4), before `DashboardShowcase`.

8. **Hero stats** — ✅ Decided: `101% Traceable` / `4 Harvest Options` / `Real Your plot`. No delivery language.
