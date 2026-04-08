# Hero Section Redesign — Design Spec

**Date:** 2026-04-08  
**Status:** Approved  
**Scope:** Local landing page Hero section only (`components/local/Hero.tsx`)

---

## Goal

Replace the current oversized, mixed-message Hero with a calm, premium layout. One clear message: **own real land in Armenia and eat what it grows**.

---

## Layout

Two-column grid inside a shared wrapper:

- **Left** — all text content (tag, headline, tagline, body, CTAs, stats)
- **Right** — dashboard card floating over a soft landscape background

Navbar lives above the grid, inside the same outer wrapper. No change to navbar content.

---

## Typography (T2)

| Element | Style |
|---|---|
| Audience tag | 9px sans, 0.18em tracking, uppercase, green, line prefix |
| H1 | 26–28px Georgia/serif, weight 400, line-height 1.28, max-width ~260px |
| Italic tagline | 14px Georgia italic, weight 300, green, separate element below H1 |
| Body | 12px sans, weight 300, line-height 1.8, muted grey, max-width ~240px |
| CTA primary | 10px sans uppercase, green pill |
| CTA secondary | 12px, green underline |
| Stat value | 18px Georgia, green |
| Stat label | 9px sans uppercase, very muted |

---

## Copy (B direction)

```
Tag:     "For those living in Armenia"
H1:      "Know what
          you eat."
Tagline: "Grown on your land."
Body:    Own a real farming plot outside Yerevan.
         A farmer tends it for you.
         Harvest comes to your door weekly.
CTA:     [Join the pre-pilot]  See how it works
```

**Stats row (3 items):**
- `2 m²` / Your plot  
- `Weekly` / Deliveries  
- `Real` / Farmer assigned

---

## Right Side — Dashboard Card + BG1

**Background (BG1):** Soft landscape SVG illustration.
- Base fill: `#EEF4E8`
- Far mountains: `#C8D8BC` at 55% opacity
- Near mountains: `#B4C8A4` at 65% opacity
- Field ground: `#C4DCAA` at 75% opacity
- Field row lines: `#A0C080` strokes, horizontal
- Trees: ellipses, `#6B9E5A`
- Sun glow: warm cream circles top-right
- Vignette: radial gradient edges fade to `#E8F0E0`
- Horizon line: `#B0C898` subtle stroke

**Dashboard Card (floating, rotated -1°, white, rounded-14px, shadow):**

| Section | Content |
|---|---|
| Header (dark green `#2D5A27`) | "Your plot" label + "Plot 7 — Armavir" name + "Growing 🌱" badge |
| Growth stage | Progress bar (62%), "Flowering · 62%" label |
| Crops + Plot size | 2-col grid: "Tomatoes · Herbs" / "2 m²" |
| Next delivery | 📦 icon + "Thursday · ~1.5 kg" |

Card width: ~220px. Optional ghost card behind it for depth (180px, rotated +2°, 65% opacity).

---

## Colors

All from existing brand palette — no new colors.

| Token | Value |
|---|---|
| `--bg-cream` | `#FBF8F2` |
| `--green-deep` | `#2D5A27` |
| `--green-mid` | `#3D7A35` |
| `--text-dark` | `#1A1A14` |
| `--text-muted` | `#6B6B58` |
| `--text-faint` | `#9B9B82` |
| Right bg | `#EEF4E8` |

---

## Component Changes

### `components/local/Hero.tsx`

- Replace `ArmenianLandscape` import with inline SVG landscape (or extract to `HeroLandscape.tsx`)
- Remove any oversized headline classes
- Apply T2 sizing and weight
- Rework right side: background SVG + floating card
- Stats row: border-top separator, 3-column flex
- No animated elements, no parallax — static layout only

### `content/en/local.json` + `content/hy/local.json`

Update `hero` block fields to match new copy. Armenian translation for `hy` locale.

### No other files touched.

---

## Out of Scope

- No changes to other sections (Problem, How It Works, etc.)
- No animation
- No new dependencies
- Mobile responsiveness: collapse to single column, card below text — handled in CSS
