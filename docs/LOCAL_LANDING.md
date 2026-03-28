# Own a Piece of Armenia — Local Residents Landing Page

## Project Overview

- **Platform name:** Own a Piece of Armenia (Հայաստանի Մի Կտոր)
- **Target audience:** People currently living in Armenia
- **Core value proposition:** "I know exactly what I'm eating. I watched it grow."
- **Model:** Users own a small, real farming plot. A real local farmer tends it. They receive weekly small deliveries (1–2 kg at a time as crops ripen) and can track everything on a personal dashboard.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (utility-first) + CSS custom properties in `globals.css` |
| Fonts | Playfair Display (serif, headings) + Lato (sans-serif, body) via Google Fonts |
| Animations | Framer Motion |

---

## Design Tokens

All tokens live as CSS custom properties in `app/globals.css` and are referenced via `var(--token-name)` throughout all components. No hardcoded hex values in component files.

### Colors

```css
/* Greens */
--green-deep:   #2D5A27   /* Primary dark green — nav, CTAs, footer */
--green:        #3D7A35   /* Primary green — buttons, accents */
--green-mid:    #5A9B50   /* Mid green — progress bars, pills */
--green-light:  #A8D4A0   /* Light green — borders, secondary accents */
--green-pale:   #E8F5E4   /* Pale green — section backgrounds */

/* Golds */
--gold:         #C49A3C   /* Primary gold — highlights, markers */
--gold-light:   #F0D98A   /* Light gold — glows, tags */
--gold-pale:    #FBF3DC   /* Pale gold — section tints */

/* Earths */
--soil:         #8B5E3C   /* Soil brown — farmer section accents */
--soil-pale:    #F5EBE0   /* Pale soil — warm section backgrounds */

/* Neutrals */
--cream:        #FBF8F2   /* Main page background */
--cream2:       #F0EBE0   /* Alternate neutral section bg */
--ink:          #1A1A14   /* Primary text */
--ink2:         #4A4A3A   /* Secondary text */
--ink3:         #8A8A72   /* Tertiary text, captions */
```

### Typography Scale

```css
/* Display heading — H1 */
font-family: 'Playfair Display', Georgia, serif;
font-weight: 300;
font-size: clamp(2.6rem, 4.5vw, 4.2rem);
line-height: 1.15;

/* Section heading — H2 */
font-family: 'Playfair Display', Georgia, serif;
font-weight: 300;
font-size: clamp(1.8rem, 3vw, 2.8rem);
line-height: 1.25;

/* Body text */
font-family: 'Lato', sans-serif;
font-weight: 300;
font-size: 1rem;
line-height: 1.85;

/* Label / tag */
font-family: 'Lato', sans-serif;
font-weight: 700;
font-size: 0.7rem;
letter-spacing: 0.18em;
text-transform: uppercase;
```

---

## Component Plan

### Layout

| File | Purpose |
|---|---|
| `components/layout/Navbar.tsx` | Fixed navigation bar with logo, links, CTA, and diaspora link |
| `components/layout/ArmenianDivider.tsx` | SVG ornamental divider used between every major section |

### Sections (in page order)

| File | Section |
|---|---|
| `components/sections/Hero.tsx` | Two-column: headline + CTAs (left) + landscape illustration + dashboard card (right) |
| `components/sections/Problem.tsx` | Three problem cards on soil-pale background with vegetable illustrations |
| `components/sections/HowItWorks.tsx` | Four-step grid with step numbers, icons, titles, descriptions |
| `components/sections/Dashboard.tsx` | Dark green bg, text left + large dashboard mockup right |
| `components/sections/Health.tsx` | Four health benefit cards with vegetable illustrations |
| `components/sections/Convenience.tsx` | Two-column: text left + four convenience items right |
| `components/sections/Progress.tsx` | Three-year timeline: 2m² → 6m² → 15m² with features per year |
| `components/sections/Farmer.tsx` | Farmer portrait card left + bio/quote text right |
| `components/sections/RegionsMap.tsx` | SVG map of Armenia with accurate borders + region markers |
| `components/sections/SeasonalCalendar.tsx` | Four season cards with crop pills |
| `components/sections/TrustSection.tsx` | Dark green bg, three trust cards, honest pre-pilot messaging |
| `components/sections/FAQ.tsx` | Accordion with six questions |
| `components/sections/About.tsx` | Founder section: Alex — web dev background, Bardzunk/Arahet hiking, land connection |
| `components/sections/CTAFooter.tsx` | Dark green, large headline, email capture CTA |

### UI Primitives

| File | Purpose |
|---|---|
| `components/ui/VegetableIllustration.tsx` | SVG illustrations: tomato, cucumber, carrot, greens, potato |
| `components/ui/DashboardCard.tsx` | Mini dashboard mockup card, accepts props for plot name, crops, stats, progress, delivery |
| `components/ui/SectionTag.tsx` | Small uppercase label with a gold accent line before the text |

---

## Section Descriptions

### 1. Navbar
Fixed position. Frosted glass effect (blur backdrop, subtle bottom border). Logo aligned left: "Own a Piece of " in `--ink` + "Armenia" in `--green`. Center links: **How it works** / **Dashboard** / **Progress** / **FAQ** (smooth-scroll anchors). Right side: text link "For the diaspora →" + filled pill button "Join the pre-pilot" in `--green-deep`. Mobile: nav links hidden, logo + CTA only remain. On scroll: subtle shadow appears via `useEffect`.

### 2. Hero
Two-column layout (60/40 split on desktop).

**Left column:**
- Small tag: green dot + "For those living in Armenia"
- H1 (Playfair Display, display size): "You know exactly" / "what you're eating." / "You watched it grow." — third line italic, colored `--green`
- Subtitle paragraph in `--ink2`
- Two CTA buttons: primary pill "Join the pre-pilot" (green fill) + ghost "See how it works" (underlined text link)
- Trust stats row (3 items): "100% Traceable" / "Weekly Deliveries" / "Real — Your plot"

**Right column:**
- Background: soft radial gradient (green-pale to cream)
- `<ArmenianLandscape />` SVG: mountains, field rows with perspective, tree clusters, crop plants, plot boundary with gold corner markers, Armenian ornament diamond band at top
- `<DashboardCard />` floating over the illustration (absolute positioned, slight rotation, shadow)
- Entrance animations: left column fades up staggered, right column fades in from the right

### 3. Problem
Background: `--soil-pale`. Three cards, each with:
- A vegetable SVG illustration
- A bold short problem statement (e.g. "You don't know where it came from")
- One supporting sentence
Section intro: "Most Armenians buy their vegetables without knowing anything about them."

### 4. How It Works
Background: `--cream`. Four steps in a 2×2 grid:
1. Choose your plot — select size, region, crop type
2. A farmer takes care of it — real person, real field
3. Track everything on your dashboard — photos, growth stages, weather
4. Receive weekly deliveries — 1–2 kg as crops ripen

### 5. Dashboard
Background: `--green-deep`. Left: H2 + description of dashboard features. Right: Large interactive-looking mockup showing the full dashboard (plot photo, plot stats, growth timeline, next delivery info, live activity feed). Shows what the user would see after signing up.

### 6. Health
Background: `--green-pale`. H2: "You'll eat like your grandparents did." Four cards: No pesticides / Harvested fresh / Varieties lost to supermarkets / Seasonal eating. Each card has a vegetable illustration.

### 7. Convenience
Background: `--cream`. Two-column. Left: H2 + introductory paragraph about how it fits urban Armenian life. Right: four items with icons:
- No market trips for your produce
- Predictable weekly delivery
- Adjust delivery timing
- Pause anytime (travel, etc.)

### 8. Progress
Background: `--gold-pale`. Header: "Your plot grows with you." Three-column timeline showing Year 1 / Year 2 / Year 3:
- Year 1: 2m² starter plot, tomatoes + cucumbers + herbs
- Year 2: 6m² expanded, add carrots + peppers + eggplant
- Year 3: 15m² full plot, seasonal variety, winter storage crop option

### 9. Farmer
Background: `--soil-pale`. Left: farmer portrait card (name, region, photo placeholder, years of experience). Right: H2, biography paragraph, quote block. Farmer is named Aram Mkrtchyan, Armavir region, grows tomatoes and cucumbers.

### 10. Regions Map
Background: `--cream`. SVG map of Armenia with accurate polygon borders and neighboring country outlines (Turkey, Azerbaijan, Georgia, Iran). Markers at: Armavir (first active region), Ararat, Kotayk, Yerevan. Tooltip or label on hover. Note: "Launching in Armavir — more regions coming."

### 11. Seasonal Calendar
Background: `--green-pale`. H2: "Your plot through the seasons." Four season cards (Spring / Summer / Autumn / Winter), each listing crop pills — what's growing or dormant in that season.

### 12. Trust Section
Background: `--green-deep` (dark). Three trust cards:
- "This is a real pre-pilot. We're starting small."
- "Your farmer has a name and a face."
- "You can cancel anytime — no pressure."
Honest, direct language. No marketing fluff.

### 13. FAQ
Background: `--cream`. Accordion with six questions:
1. How big is 2m²?
2. What happens if a crop fails?
3. Can I choose which vegetables I want?
4. How does delivery work?
5. Is this available in my city?
6. What does "pre-pilot" mean?

### 14. About
Background: `--cream2`. Founder section for Alex:
- Started in code (9 years web development)
- Co-founded Bardzunk and Arahet hiking movement
- Discovered Armenian connection to land through hiking
- Started this platform as a way to make that connection permanent and practical
Short, personal, honest.

### 15. CTAFooter
Background: `--green-deep`. Large Playfair Display headline: "Your plot is waiting." Email input + CTA button. Small text: "Join the pre-pilot. Limited plots available." Social links if applicable.

---

## Armenian Ornament Design Language

All section dividers use a consistent SVG motif rendered as `<ArmenianDivider />`:

```
◆━━━━━━━━━━◈━━━━━━━━━━◆
```

Specifically: a central medallion (8-pointed star inscribed in a circle) with symmetric vine-and-wave lines extending left and right, and small diamond shapes (◆) spaced along the lines.

- On **light backgrounds**: rendered in `--green-mid` or `--ink3`
- On **dark backgrounds** (`--green-deep`): rendered in `--gold-light`

The motif draws from Armenian manuscript borders and khachkar geometric traditions — not cartoonish folk patterns, but the refined geometric vocabulary of medieval Armenian decorative arts.

---

## Responsive Breakpoints

```
Mobile:  < 768px  — Single column, hamburger nav, reduced padding
Tablet:  768–1100px — Two column where needed, adjusted spacing
Desktop: > 1100px  — Full two-column layouts, max-width container
```

Container max-width: `1280px`, centered, with `px-6` on mobile → `px-12` on desktop.

---

## Implementation Status

| Component | Status |
|---|---|
| `Navbar` | ✅ Implemented |
| `Hero` | ✅ Implemented |
| `ArmenianLandscape` | ✅ Implemented (used in Hero) |
| `DashboardCard` | ✅ Implemented (used in Hero) |
| `SectionTag` | ✅ Implemented (used in Hero) |
| All other sections | 🔜 Planned |
