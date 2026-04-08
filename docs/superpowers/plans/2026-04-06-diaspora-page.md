# Diaspora Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/[locale]/diaspora` landing page for Hyeland — a diaspora-audience variant of the local page with 5 new section components, adapted existing sections, and pomegranate (`#8B2535`) as the diaspora accent color.

**Architecture:** New page at `app/[locale]/diaspora/page.tsx`, new section components under `components/sections/diaspora/`, all content in `content/en/diaspora.json` and `content/hy/diaspora.json`. Existing section components (HowItWorks, DashboardShowcase, Progress, Farmer, Seasonal, Trust, FAQ, About) are reused unchanged — diaspora content is delivered via JSON. Three shared components (DashboardCard, SectionTag, CTAFooter) receive minimal new props. No new routing infra needed — the locale layout covers the route automatically.

**Tech Stack:** Next.js 15 App Router, TypeScript, Framer Motion, inline styles + CSS variables, `next/font/google`, no test framework.

---

## File Map

### Create
| File | Purpose |
|---|---|
| `app/[locale]/diaspora/page.tsx` | Page entry point — assembles all sections |
| `components/sections/diaspora/DiasporaHero.tsx` | Hero with diaspora copy + pomegranate tag |
| `components/sections/diaspora/DiasporaProblem.tsx` | 3-card section about homeland disconnection |
| `components/sections/diaspora/HarvestOptions.tsx` | 4-card grid: Reinvest / Donate / Sell & Hold / Gift |
| `components/sections/diaspora/DiasporaOwnership.tsx` | "Real ownership" — 4 trust points, replaces Health |
| `components/sections/diaspora/GiftMechanic.tsx` | Gift a plot — 2-col with gift card mockup |
| `components/sections/diaspora/PhaseTwo.tsx` | Muted "coming later" teaser section |
| `content/en/diaspora.json` | Full EN content for all diaspora sections |
| `content/hy/diaspora.json` | HY placeholder (EN copy, needs translation) |

### Modify
| File | Change |
|---|---|
| `globals.css` | Add `--pomegranate`, `--pomegranate-light`, `--pomegranate-pale`, `.btn-pomegranate` |
| `components/ui/SectionTag.tsx` | Add `pomegranate` variant |
| `components/ui/DashboardCard.tsx` | Make `nextDelivery` optional; add `harvestOption?: { label: string; description: string }` |
| `components/sections/CTAFooter.tsx` | Add `variant?: 'gold' | 'pomegranate'` prop |
| `types/content.ts` | Add diaspora-specific interfaces + `DiasporaContent` |
| `lib/content.ts` | Add `getDiasporaContent(locale)` |
| `content/en/nav.json` | Update `diasporaLinks` to approved anchors |
| `content/hy/nav.json` | Same update in Armenian |

---

## Task 1: Design Tokens + SectionTag Pomegranate Variant

**Files:**
- Modify: `app/globals.css`
- Modify: `components/ui/SectionTag.tsx`

- [ ] **Step 1: Add pomegranate tokens to globals.css**

In `app/globals.css`, add after the `--gold-pale` line:

```css
  /* Pomegranate — diaspora accent */
  --pomegranate:      #8B2535;
  --pomegranate-light:#D4748A;
  --pomegranate-pale: #F9EDF0;
```

At the end of the file, after `.btn-ghost` block, add:

```css
/* Pomegranate CTA button */
.btn-pomegranate {
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.btn-pomegranate:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(139,37,53,0.42);
  background: var(--pomegranate-light) !important;
}
```

- [ ] **Step 2: Add pomegranate variant to SectionTag**

In `components/ui/SectionTag.tsx`, change the `SectionTagProps` interface:

```tsx
interface SectionTagProps {
  children: React.ReactNode;
  variant?: 'green' | 'gold' | 'cream' | 'pomegranate';
  className?: string;
  style?: React.CSSProperties;
}
```

In the `colors` object, add:

```tsx
pomegranate: {
  dot: 'var(--pomegranate)',
  text: 'var(--pomegranate)',
  line: 'var(--pomegranate-light)',
},
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /home/victus/dev/armenia && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd /home/victus/dev/armenia && git add app/globals.css components/ui/SectionTag.tsx && git commit -m "feat: add pomegranate design tokens and SectionTag variant"
```

---

## Task 2: DashboardCard harvestOption Prop

**Files:**
- Modify: `components/ui/DashboardCard.tsx`

- [ ] **Step 1: Update DashboardCardProps — make nextDelivery optional, add harvestOption**

In `components/ui/DashboardCard.tsx`, update the interface and destructuring:

```tsx
export interface DashboardCardProps {
  plotName: string;
  status: string;
  crops: string[];
  stats: DashboardCardStats;
  progress: {
    label: string;
    percentage: number;
  };
  nextDelivery?: {
    day: string;
    description: string;
  };
  harvestOption?: {
    label: string;
    description: string;
  };
  className?: string;
  style?: React.CSSProperties;
}
```

Update destructuring in the function signature:

```tsx
export default function DashboardCard({
  plotName,
  status,
  crops,
  stats,
  progress,
  nextDelivery,
  harvestOption,
  className = '',
  style,
}: DashboardCardProps) {
```

- [ ] **Step 2: Replace the "Next delivery" footer with conditional render**

Replace the entire `{/* Next delivery */}` block (lines 233–268 in the original) with:

```tsx
      {/* Bottom row — delivery or harvest option */}
      {harvestOption ? (
        <div
          style={{
            padding: '8px 16px 12px',
            background: 'var(--pomegranate-pale)',
            borderTop: '1px solid rgba(139,37,53,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '0.9rem' }}>✦</span>
          <div>
            <div
              style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--pomegranate)',
                marginBottom: '1px',
              }}
            >
              Harvest option
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 400,
                color: 'var(--ink2)',
              }}
            >
              <strong style={{ fontWeight: 700 }}>{harvestOption.label}</strong>{' '}
              · {harvestOption.description}
            </div>
          </div>
        </div>
      ) : nextDelivery ? (
        <div
          style={{
            padding: '8px 16px 12px',
            background: 'var(--gold-pale)',
            borderTop: '1px solid rgba(196,154,60,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '0.9rem' }}>📦</span>
          <div>
            <div
              style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--soil)',
                marginBottom: '1px',
              }}
            >
              Next delivery
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 400,
                color: 'var(--ink2)',
              }}
            >
              <strong style={{ fontWeight: 700 }}>{nextDelivery.day}</strong>{' '}
              · {nextDelivery.description}
            </div>
          </div>
        </div>
      ) : null}
```

- [ ] **Step 3: Verify TypeScript compiles — confirm local Hero still works**

```bash
cd /home/victus/dev/armenia && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors. The local Hero passes `nextDelivery` — that prop is still accepted.

- [ ] **Step 4: Commit**

```bash
cd /home/victus/dev/armenia && git add components/ui/DashboardCard.tsx && git commit -m "feat: add optional harvestOption prop to DashboardCard"
```

---

## Task 3: CTAFooter Pomegranate Variant

**Files:**
- Modify: `components/sections/CTAFooter.tsx`

- [ ] **Step 1: Add variant prop to CTAFooter**

In `components/sections/CTAFooter.tsx`, update the Props interface:

```tsx
interface Props {
  content: CtaFooterContent;
  variant?: 'gold' | 'pomegranate';
}
```

Update the function signature:

```tsx
export default function CTAFooter({ content, variant = 'gold' }: Props) {
```

- [ ] **Step 2: Make button color and class conditional**

Replace the `<a href={content.buttonHref}` button element with:

```tsx
            <a
              href={content.buttonHref}
              className={variant === 'pomegranate' ? 'btn-pomegranate' : 'btn-gold'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-lato)',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: variant === 'pomegranate' ? 'white' : 'var(--green-deep)',
                background: variant === 'pomegranate' ? 'var(--pomegranate)' : 'var(--gold)',
                padding: '16px 40px',
                borderRadius: '100px',
                textDecoration: 'none',
                boxShadow: variant === 'pomegranate'
                  ? '0 4px 24px rgba(139,37,53,0.3)'
                  : '0 4px 24px rgba(196,154,60,0.3)',
              }}
            >
              {content.buttonLabel}
              <span style={{ fontSize: '1rem' }}>→</span>
            </a>
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /home/victus/dev/armenia && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors. Local page passes no `variant` prop → defaults to `'gold'`, unchanged.

- [ ] **Step 4: Commit**

```bash
cd /home/victus/dev/armenia && git add components/sections/CTAFooter.tsx && git commit -m "feat: add pomegranate variant to CTAFooter"
```

---

## Task 4: Content Types

**Files:**
- Modify: `types/content.ts`

- [ ] **Step 1: Add diaspora content interfaces**

At the end of `types/content.ts`, append:

```typescript
/* ─── Diaspora page ──────────────────────────────────────────── */

export interface HarvestOption {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface HarvestOptionsContent {
  tag: string;
  heading: string;
  intro: string;
  options: HarvestOption[];
}

export interface OwnershipItem {
  id: string;
  title: string;
  description: string;
}

export interface DiasporaOwnershipContent {
  tag: string;
  heading: string;
  intro: string;
  items: OwnershipItem[];
}

export interface GiftMechanicContent {
  tag: string;
  heading: string;
  intro: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  note: string;
}

export interface PhaseTwoContent {
  tag: string;
  heading: string;
  body: string;
  note: string;
}

export interface DiasporaSectionVisibility {
  hero: boolean;
  problem: boolean;
  howItWorks: boolean;
  harvestOptions: boolean;
  dashboardShowcase: boolean;
  ownership: boolean;
  giftMechanic: boolean;
  progress: boolean;
  farmer: boolean;
  seasonal: boolean;
  trust: boolean;
  phaseTwo: boolean;
  faq: boolean;
  about: boolean;
  ctaFooter: boolean;
}

export interface DiasporaContent {
  sectionVisibility: DiasporaSectionVisibility;
  hero: HeroContent;
  problem: ProblemContent;
  howItWorks: HowItWorksContent;
  harvestOptions: HarvestOptionsContent;
  dashboardShowcase: DashboardShowcaseContent;
  ownership: DiasporaOwnershipContent;
  giftMechanic: GiftMechanicContent;
  progress: ProgressContent;
  farmer: FarmerContent;
  seasonal: SeasonalContent;
  trust: TrustContent;
  phaseTwo: PhaseTwoContent;
  faq: FaqContent;
  about: AboutContent;
  ctaFooter: CtaFooterContent;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/victus/dev/armenia && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /home/victus/dev/armenia && git add types/content.ts && git commit -m "feat: add diaspora content types"
```

---

## Task 5: getDiasporaContent + Nav Update

**Files:**
- Modify: `lib/content.ts`
- Modify: `content/en/nav.json`
- Modify: `content/hy/nav.json`

- [ ] **Step 1: Add getDiasporaContent to lib/content.ts**

Add the import at the top:

```typescript
import type { NavContent, HowItWorksContent, LocalContent, DiasporaContent } from '@/types/content';
```

Append at the end of the file:

```typescript
export async function getDiasporaContent(locale: Locale): Promise<DiasporaContent> {
  return readJson<DiasporaContent>(locale, 'diaspora');
}
```

- [ ] **Step 2: Update diasporaLinks in content/en/nav.json**

Replace the `diasporaLinks` array:

```json
"diasporaLinks": [
  { "id": "dl-1", "label": "How it works", "href": "#how-it-works" },
  { "id": "dl-2", "label": "Your harvest", "href": "#harvest-options" },
  { "id": "dl-3", "label": "The gift", "href": "#gift" },
  { "id": "dl-4", "label": "Progress", "href": "#progress" },
  { "id": "dl-5", "label": "FAQ", "href": "#faq" }
]
```

- [ ] **Step 3: Update diasporaLinks in content/hy/nav.json**

Same change — replace `diasporaLinks` with identical structure (labels in Armenian will be updated via admin later):

```json
"diasporaLinks": [
  { "id": "dl-1", "label": "Ինչպես է աշխատում", "href": "#how-it-works" },
  { "id": "dl-2", "label": "Ձեր բերքը", "href": "#harvest-options" },
  { "id": "dl-3", "label": "Նվերը", "href": "#gift" },
  { "id": "dl-4", "label": "Ճանապարհային քարտ", "href": "#progress" },
  { "id": "dl-5", "label": "ՀՏՀ", "href": "#faq" }
]
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /home/victus/dev/armenia && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
cd /home/victus/dev/armenia && git add lib/content.ts content/en/nav.json content/hy/nav.json && git commit -m "feat: add getDiasporaContent and update diaspora nav links"
```

---

## Task 6: content/en/diaspora.json

**Files:**
- Create: `content/en/diaspora.json`

- [ ] **Step 1: Create the full EN diaspora content file**

```json
{
  "sectionVisibility": {
    "hero": true,
    "problem": true,
    "howItWorks": true,
    "harvestOptions": true,
    "dashboardShowcase": true,
    "ownership": true,
    "giftMechanic": true,
    "progress": true,
    "farmer": true,
    "seasonal": true,
    "trust": true,
    "phaseTwo": true,
    "faq": true,
    "about": true,
    "ctaFooter": true
  },
  "hero": {
    "tag": "For the Armenian diaspora",
    "h1Line1": "Your land is still",
    "h1Line2": "there. So is",
    "h1Italic": "your name on it.",
    "subtitle": "Own a real farming plot in Armenia. A local farmer tends it. Watch it grow from anywhere in the world — and at harvest, decide what happens to it.",
    "primaryCtaLabel": "Claim your plot",
    "primaryCtaHref": "#join",
    "secondaryCtaLabel": "See how it works",
    "secondaryCtaHref": "#how-it-works",
    "stats": [
      { "value": "101%", "label": "Traceable" },
      { "value": "4", "label": "Harvest Options" },
      { "value": "Real", "label": "Your plot" }
    ]
  },
  "problem": {
    "tag": "The quiet distance",
    "heading": "The land doesn't disappear. The connection does.",
    "cards": [
      {
        "id": "p1",
        "vegetable": "tomato",
        "title": "Your children have never seen it",
        "description": "Growing up abroad means Armenia stays abstract — a word, a story, a photograph. Without something real to point to, the homeland fades with each generation."
      },
      {
        "id": "p2",
        "vegetable": "greens",
        "title": "Every visit feels like the first time",
        "description": "You love it but you don't belong to it. There's no anchor — no plot of land, no corner of Armenia that is yours to return to every season."
      },
      {
        "id": "p3",
        "vegetable": "cucumber",
        "title": "You can't give roots you don't hold",
        "description": "You want to pass something real to the next generation. But without a living, tangible tie to the land, there's nothing concrete to hand down."
      }
    ]
  },
  "howItWorks": {
    "tag": "How it works",
    "heading": "Four steps to owning a piece of Armenia.",
    "intro": "No travel required. No farming experience. Just a real plot with your name on it.",
    "steps": [
      {
        "id": "step-1",
        "title": "Choose your plot in Armenia",
        "description": "Browse plots in Armenian farming regions. Pick your preferred size and what grows on it — tomatoes, cucumbers, herbs, leafy greens."
      },
      {
        "id": "step-2",
        "title": "Your farmer tends it",
        "description": "A real on-the-ground farmer handles everything — soil, planting, irrigation, care. Weekly photo updates show exactly what's happening on your plot."
      },
      {
        "id": "step-3",
        "title": "Watch your plot grow",
        "description": "Live status, farmer diary updates, harvest notifications. Follow every stage of the season from anywhere in the world on your personal dashboard."
      },
      {
        "id": "step-4",
        "title": "Decide what happens at harvest",
        "description": "Reinvest it into next season, donate to a local Armenian family, convert to account credit, or gift the value to someone who deserves a piece of the Highland."
      }
    ]
  },
  "harvestOptions": {
    "tag": "Your harvest",
    "heading": "What happens at harvest time.",
    "intro": "Diaspora plots don't ship physically in Phase 1. Four options let you put your harvest to meaningful use.",
    "options": [
      {
        "id": "ho-1",
        "icon": "↺",
        "title": "Reinvest",
        "description": "Put the harvest value back into your plot. Expand it, add a new crop variety, or grow it toward next season."
      },
      {
        "id": "ho-2",
        "icon": "♥",
        "title": "Donate",
        "description": "Your harvest goes to a local Armenian family in need. You receive a photo of the delivery as proof of impact."
      },
      {
        "id": "ho-3",
        "icon": "◎",
        "title": "Sell & Hold Credit",
        "description": "We convert your harvest to account credit. Use it next season, upgrade your plot, or carry it forward indefinitely."
      },
      {
        "id": "ho-4",
        "icon": "✦",
        "title": "Gift Card",
        "description": "Turn your harvest value into a Hyeland gift. A plot for a family member, a friend — anyone who deserves a piece of the Highland."
      }
    ]
  },
  "dashboardShowcase": {
    "tag": "Your dashboard",
    "heading": "Your plot, in your pocket.",
    "intro": "Watch every stage of your season from wherever you are. Your farmer updates it. You follow along.",
    "features": [
      "Live photos from your plot, posted by your farmer",
      "Farmer diary — seasonal notes, weather reports, growth milestones",
      "Harvest notifications when your crops are ready",
      "One-tap harvest option selection — reinvest, donate, gift, or hold credit",
      "Season timeline and estimated harvest weight"
    ]
  },
  "ownership": {
    "tag": "Real ownership",
    "heading": "Your name. Your plot. Your Armenia.",
    "intro": "This isn't symbolic. Your plot has coordinates, a farmer, and a record. You own a specific piece of land — not a share of a basket.",
    "items": [
      {
        "id": "do-1",
        "title": "Named and registered",
        "description": "Your plot is registered to you by name. You receive the exact GPS coordinates and a plot reference number."
      },
      {
        "id": "do-2",
        "title": "Photo evidence every week",
        "description": "Your farmer documents every stage — planting, first shoots, flowering, harvest. You see it as it happens."
      },
      {
        "id": "do-3",
        "title": "Legal accountability",
        "description": "Your farmer agreement covers the full season. If something goes wrong, we tell you first — no surprises."
      },
      {
        "id": "do-4",
        "title": "Transferable legacy",
        "description": "A Hyeland plot can be gifted, passed down, or extended into a family holding across multiple seasons."
      }
    ]
  },
  "giftMechanic": {
    "tag": "The gift",
    "heading": "Give someone roots.",
    "intro": "A Hyeland plot is the only gift that keeps a living connection to Armenia. Give one to a parent in Yerevan, a child growing up abroad, or a friend who misses home.",
    "features": [
      "Choose a plot and crop type on their behalf",
      "A personalised gift confirmation sent to them by email",
      "They get their own dashboard to watch the plot grow",
      "At harvest, they choose what happens to it"
    ],
    "ctaLabel": "Gift a plot",
    "ctaHref": "#join",
    "note": "Use your harvest credit, or purchase a gift plot directly."
  },
  "progress": {
    "tag": "The roadmap",
    "heading": "We're building this in public.",
    "intro": "We're at the beginning. Here's where we are, and where we're going.",
    "milestones": [
      {
        "id": "m1",
        "year": "2025",
        "size": "20 plots",
        "label": "Phase 1 — Now",
        "features": [
          "Diaspora pre-pilot launch",
          "20 diaspora plots in Armavir",
          "All 4 harvest options available",
          "Weekly farmer updates via dashboard",
          "Pre-pilot members shape the roadmap"
        ]
      },
      {
        "id": "m2",
        "year": "2026",
        "size": "100 plots",
        "label": "Phase 2 — Coming",
        "features": [
          "Physical shipping to diaspora countries",
          "100 diaspora plots across multiple regions",
          "Multi-season plot holdings",
          "Family plot packages",
          "Expanded harvest options"
        ]
      },
      {
        "id": "m3",
        "year": "2027",
        "size": "500+ plots",
        "label": "Phase 3 — Vision",
        "features": [
          "500+ plots across Armenia",
          "Full diaspora shipping network",
          "Custom crop requests",
          "Plot gifting marketplace",
          "Generational transfer system"
        ]
      }
    ]
  },
  "farmer": {
    "tag": "Your farmer",
    "name": "Aram Mkrtchyan",
    "region": "Armavir",
    "experience": "18 years growing",
    "quote": "Every plot I tend has a name behind it. Someone far away is watching. I take that seriously.",
    "bio": "Aram manages plots in the Armavir region — one of Armenia's most fertile valleys. He tends dozens of individual plots and treats each one as his own. When you're across the world wondering about your land, it's Aram who's there — planting, watering, documenting, and caring for it season after season."
  },
  "seasonal": {
    "tag": "What grows on your plot",
    "heading": "Four seasons of real Armenian produce.",
    "intro": "These are the crops growing on your plot across the year. You'll see them at every stage — from first shoots to full harvest.",
    "seasons": [
      {
        "id": "s1",
        "name": "Spring",
        "months": "Mar — May",
        "color": "#5A9B50",
        "crops": ["Spinach", "Lettuce", "Radishes", "Spring onion", "Parsley"]
      },
      {
        "id": "s2",
        "name": "Summer",
        "months": "Jun — Aug",
        "color": "#C49A3C",
        "crops": ["Tomatoes", "Cucumbers", "Bell peppers", "Zucchini", "Basil"]
      },
      {
        "id": "s3",
        "name": "Autumn",
        "months": "Sep — Nov",
        "color": "#8B5E3C",
        "crops": ["Eggplant", "Pumpkin", "Beetroot", "Cabbage", "Carrots"]
      },
      {
        "id": "s4",
        "name": "Winter",
        "months": "Dec — Feb",
        "color": "#4A6FA5",
        "crops": ["Preserved goods", "Dried herbs", "Root cellar stock", "Winter greens"]
      }
    ]
  },
  "trust": {
    "tag": "Pre-pilot",
    "heading": "What Phase 1 means for diaspora.",
    "intro": "We're being clear about what this is. Phase 1 diaspora plots come with honest constraints — and real value.",
    "points": [
      {
        "id": "tp-1",
        "title": "No physical shipping in Phase 1",
        "description": "Diaspora plots don't ship produce during Phase 1. All harvest value is handled through our four digital options: reinvest, donate, sell & hold credit, or gift."
      },
      {
        "id": "tp-2",
        "title": "Limited to 20 diaspora plots",
        "description": "The pre-pilot is capped at 20 diaspora plots globally. Early members directly shape what Phase 2 looks like."
      },
      {
        "id": "tp-3",
        "title": "Armavir region only",
        "description": "All Phase 1 plots are in the Armavir valley. Additional regions open in Phase 2 as we grow the farmer network."
      },
      {
        "id": "tp-4",
        "title": "You're a founding member, not a customer",
        "description": "Pre-pilot members have direct access to us. Your feedback on the product, the harvest options, and the experience shapes every decision we make."
      }
    ]
  },
  "phaseTwo": {
    "tag": "Phase 2 — Coming Later",
    "heading": "Physical shipping is on the roadmap.",
    "body": "We're building toward direct delivery from your plot to your door — wherever you are in the world. This isn't available yet in Phase 1, but it's the direction we're heading. Pre-pilot diaspora members will be first in line.",
    "note": "Expected: 2026"
  },
  "faq": {
    "tag": "FAQ",
    "heading": "Questions from the diaspora.",
    "items": [
      {
        "id": "faq-d1",
        "question": "Can I visit my plot in Armenia?",
        "answer": "Yes. Your plot has exact GPS coordinates. You're welcome to visit during any of your trips to Armenia — just let us know in advance and Aram will show you around. We'd love for you to see it in person."
      },
      {
        "id": "faq-d2",
        "question": "What happens to my harvest — do I have to decide in advance?",
        "answer": "No. We notify you when your harvest is ready and give you time to choose. You pick one of the four options — reinvest, donate, sell & hold credit, or gift — directly from your dashboard. You can change your mind up until the harvest date."
      },
      {
        "id": "faq-d3",
        "question": "Can I gift a plot to someone as a present?",
        "answer": "Yes — and it's one of our favourite use cases. You can gift a plot to anyone: a parent in Armenia, a sibling abroad, or a friend who wants a living connection to the land. They get their own dashboard and choose what happens to their harvest."
      },
      {
        "id": "faq-d4",
        "question": "Is this a one-time purchase or a subscription?",
        "answer": "It's seasonal. You pay per growing season. At the end of each season you can renew, expand, or let the plot go. There's no automatic renewal — we ask you each time."
      },
      {
        "id": "faq-d5",
        "question": "Will physical delivery to my country ever be available?",
        "answer": "Yes — that's Phase 2. We're working toward it but it's not available yet. We won't promise a date, but diaspora pre-pilot members will be first to access it when it launches."
      },
      {
        "id": "faq-d6",
        "question": "Can I own more than one plot?",
        "answer": "In Phase 1 we're limiting it to one plot per person to keep the pre-pilot manageable. Once we expand in Phase 2, you'll be able to hold multiple plots or build a family holding."
      }
    ]
  },
  "about": {
    "tag": "The founder",
    "name": "Aleksandr Melikyan",
    "role": "Founder",
    "paragraph1": "I've spent nine years building software products. In 2022 I started hiking in the Armenian mountains — Aragats, Geghama, Khustup. Something shifted.",
    "paragraph2": "I kept thinking about the gap between the land I was walking on and the people who should feel connected to it — both those living in Armenia and those living far from it. Hyeland is my attempt to close that gap.",
    "paragraph3": "I'm building this publicly, slowly, and honestly. The pre-pilot is how I test whether the idea is real. If you're reading this, you're early — and that matters.",
    "trustText": "Building in public since 2024"
  },
  "ctaFooter": {
    "tag": "Join the pre-pilot",
    "heading": "Own a piece of the Highland.",
    "subtitle": "Phase 1 is limited to 20 diaspora plots. No payment yet — just register your interest and we'll reach out directly.",
    "buttonLabel": "Claim your plot",
    "buttonHref": "#",
    "note": "No payment required to register. We'll contact you personally."
  }
}
```

- [ ] **Step 2: Verify JSON is valid**

```bash
cd /home/victus/dev/armenia && node -e "JSON.parse(require('fs').readFileSync('content/en/diaspora.json', 'utf-8')); console.log('valid')"
```

Expected: `valid`

- [ ] **Step 3: Commit**

```bash
cd /home/victus/dev/armenia && git add content/en/diaspora.json && git commit -m "feat: add EN diaspora content JSON"
```

---

## Task 7: content/hy/diaspora.json

**Files:**
- Create: `content/hy/diaspora.json`

- [ ] **Step 1: Create HY diaspora content (EN placeholder — needs Armenian translation via admin)**

Copy the English content wholesale. The admin panel supports editing this file. Armenian translations should be filled in via admin after the page is live.

```bash
cp /home/victus/dev/armenia/content/en/diaspora.json /home/victus/dev/armenia/content/hy/diaspora.json
```

- [ ] **Step 2: Update HY-specific fields that differ from EN**

In `content/hy/diaspora.json`, update the hero tag to Armenian:

```json
"hero": {
  "tag": "Հայ սփյուռքի համար",
  ...
}
```

And the `trust.tag` and `faq.tag` labels to match `content/hy/local.json` style (can be verified by comparing HY local.json).

- [ ] **Step 3: Verify JSON is valid**

```bash
cd /home/victus/dev/armenia && node -e "JSON.parse(require('fs').readFileSync('content/hy/diaspora.json', 'utf-8')); console.log('valid')"
```

Expected: `valid`

- [ ] **Step 4: Commit**

```bash
cd /home/victus/dev/armenia && git add content/hy/diaspora.json && git commit -m "feat: add HY diaspora content JSON (EN placeholder, needs translation)"
```

---

## Task 8: DiasporaHero Component

**Files:**
- Create: `components/sections/diaspora/DiasporaHero.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client';

import { motion } from 'framer-motion';
import ArmenianLandscape from '@/components/ui/ArmenianLandscape';
import DashboardCard from '@/components/ui/DashboardCard';
import SectionTag from '@/components/ui/SectionTag';
import { EASE } from '@/lib/animations';
import type { HeroContent } from '@/types/content';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay },
  }),
};

const DEMO_CARD = {
  plotName: 'Plot 12 — Armavir',
  status: 'Growing 🌱',
  crops: ['Tomatoes', 'Herbs'],
  stats: { plotSize: '2 m²', seasonWeek: 'Week 14', estimatedYield: '~4 kg', harvestDate: 'Aug 12' },
  progress: { label: 'Flowering', percentage: 62 },
  harvestOption: { label: 'Donate', description: 'To a family in Gyumri' },
};

interface Props {
  content: HeroContent;
}

export default function DiasporaHero({ content }: Props) {
  return (
    <section style={{ background: 'var(--cream)', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '64px' }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        padding: '60px 24px 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
        gap: '48px 64px',
        alignItems: 'center',
      }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} style={{ marginBottom: '28px' }}>
            <SectionTag variant="pomegranate">{content.tag}</SectionTag>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={0.1}
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 300,
              fontSize: 'clamp(2.6rem, 4.5vw, 4.2rem)',
              lineHeight: 1.15,
              color: 'var(--ink)',
              margin: '0 0 28px',
            }}
          >
            {content.h1Line1}<br />
            {content.h1Line2}<br />
            <em style={{ color: 'var(--pomegranate)', fontStyle: 'italic' }}>{content.h1Italic}</em>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.22}
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 300,
              fontSize: '1.05rem',
              lineHeight: 1.85,
              color: 'var(--ink2)',
              margin: '0 0 36px',
              maxWidth: '460px',
            }}
          >
            {content.subtitle}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.34}
            variants={fadeUp}
            style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap', marginBottom: '48px' }}
          >
            <a
              href={content.primaryCtaHref}
              className="btn-pomegranate"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-lato)',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'white',
                background: 'var(--pomegranate)',
                padding: '14px 32px',
                borderRadius: '100px',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(139,37,53,0.25)',
              }}
            >
              {content.primaryCtaLabel}
              <span style={{ fontSize: '1rem' }}>→</span>
            </a>

            <a
              href={content.secondaryCtaHref}
              className="btn-ghost"
              style={{
                fontFamily: 'var(--font-lato)',
                fontWeight: 400,
                fontSize: '0.9rem',
                color: 'var(--ink2)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--ink3)',
                paddingBottom: '2px',
                letterSpacing: '0.02em',
              }}
            >
              {content.secondaryCtaLabel}
            </a>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.46}
            variants={fadeUp}
            style={{ display: 'flex', borderTop: '1px solid rgba(139,37,53,0.2)', paddingTop: '24px' }}
          >
            {content.stats.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  paddingRight: i < content.stats.length - 1 ? '24px' : '0',
                  marginRight: i < content.stats.length - 1 ? '24px' : '0',
                  borderRight: i < content.stats.length - 1 ? '1px solid rgba(139,37,53,0.2)' : 'none',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 400,
                  fontSize: '1.35rem',
                  color: 'var(--pomegranate)',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: 'var(--font-lato)',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--ink3)',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, x: 48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          style={{ position: 'relative' }}
        >
          <div style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            background: 'radial-gradient(ellipse at 40% 60%, var(--pomegranate-pale), var(--cream))',
            boxShadow: '0 24px 80px rgba(139,37,53,0.1), 0 4px 16px rgba(139,37,53,0.06)',
            aspectRatio: '4/3',
          }}>
            <ArmenianLandscape width="100%" height="100%" style={{ display: 'block' }} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: -2.5 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
            style={{ position: 'absolute', bottom: '-20px', right: '-16px', zIndex: 10 }}
          >
            <DashboardCard
              {...DEMO_CARD}
              style={{ boxShadow: '0 20px 60px rgba(26,26,20,0.18), 0 4px 16px rgba(26,26,20,0.1)' } as React.CSSProperties}
            />
          </motion.div>

          <div style={{ position: 'absolute', top: '-12px', left: '24px', display: 'flex', gap: '6px' }}>
            {[12, 8, 5].map((size, i) => (
              <div key={i} style={{
                width: size,
                height: size,
                borderRadius: '50%',
                background: 'var(--pomegranate)',
                opacity: 0.5 - i * 0.1,
              }} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/victus/dev/armenia && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /home/victus/dev/armenia && git add components/sections/diaspora/DiasporaHero.tsx && git commit -m "feat: add DiasporaHero section component"
```

---

## Task 9: DiasporaProblem Component

**Files:**
- Create: `components/sections/diaspora/DiasporaProblem.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import VegetableIllustration from '@/components/ui/VegetableIllustration';
import { EASE, VIEWPORT, staggerVariants } from '@/lib/animations';
import type { ProblemContent } from '@/types/content';
import type { VegetableType } from '@/components/ui/VegetableIllustration';

interface Props {
  content: ProblemContent;
}

export default function DiasporaProblem({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="green" />

      <section id="problem" style={{ background: 'var(--pomegranate-pale)', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ marginBottom: '64px', maxWidth: '560px' }}
          >
            <SectionTag variant="pomegranate" style={{ marginBottom: '20px' }}>
              {content.tag}
            </SectionTag>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              lineHeight: 1.25,
              color: 'var(--ink)',
              margin: '0',
            }}>
              {content.heading}
            </h2>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '28px',
          }}>
            {content.cards.map((card, i) => (
              <motion.div
                key={card.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                variants={staggerVariants}
              >
                <div
                  className="card-lift"
                  style={{
                    background: 'var(--cream)',
                    borderRadius: '16px',
                    padding: '36px 32px 40px',
                    border: '1px solid rgba(139,37,53,0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ marginBottom: '28px' }}>
                    <VegetableIllustration type={card.vegetable as VegetableType} size={72} />
                  </div>

                  <div style={{
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 300,
                    fontSize: '3rem',
                    lineHeight: 1,
                    color: 'var(--pomegranate)',
                    opacity: 0.12,
                    marginBottom: '12px',
                    userSelect: 'none',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 400,
                    fontSize: '1.2rem',
                    lineHeight: 1.35,
                    color: 'var(--ink)',
                    margin: '0 0 14px',
                  }}>
                    {card.title}
                  </h3>

                  <p style={{
                    fontFamily: 'var(--font-lato)',
                    fontWeight: 300,
                    fontSize: '0.95rem',
                    lineHeight: 1.8,
                    color: 'var(--ink2)',
                    margin: 0,
                  }}>
                    {card.description}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '28px', borderTop: '1px solid rgba(139,37,53,0.1)', marginBottom: '-4px' }}>
                    <div style={{ width: '32px', height: '2px', background: 'var(--pomegranate)', borderRadius: '2px', opacity: 0.3 }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/victus/dev/armenia && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
cd /home/victus/dev/armenia && git add components/sections/diaspora/DiasporaProblem.tsx && git commit -m "feat: add DiasporaProblem section component"
```

---

## Task 10: HarvestOptions Component

**Files:**
- Create: `components/sections/diaspora/HarvestOptions.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import { EASE, VIEWPORT, staggerVariants } from '@/lib/animations';
import type { HarvestOptionsContent } from '@/types/content';

interface Props {
  content: HarvestOptionsContent;
}

export default function HarvestOptions({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="gold" />

      <section id="harvest-options" style={{ background: 'var(--green-deep)', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ textAlign: 'center', marginBottom: '64px' }}
          >
            <SectionTag variant="gold" style={{ marginBottom: '20px', justifyContent: 'center' }}>
              {content.tag}
            </SectionTag>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              lineHeight: 1.25,
              color: 'white',
              margin: '0 0 16px',
            }}>
              {content.heading}
            </h2>
            <p style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 300,
              fontSize: '1rem',
              lineHeight: 1.85,
              color: 'rgba(255,255,255,0.55)',
              margin: 0,
              maxWidth: '520px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              {content.intro}
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: '20px',
          }}>
            {content.options.map((option, i) => (
              <motion.div
                key={option.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                variants={staggerVariants}
              >
                <div
                  className="milestone-card"
                  style={{
                    borderRadius: '16px',
                    padding: '36px 28px 40px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-lato)',
                    fontSize: '1.5rem',
                    color: 'var(--gold)',
                    marginBottom: '20px',
                    lineHeight: 1,
                  }}>
                    {option.icon}
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 400,
                    fontSize: '1.2rem',
                    lineHeight: 1.3,
                    color: 'white',
                    margin: '0 0 14px',
                  }}>
                    {option.title}
                  </h3>

                  <div style={{ width: '24px', height: '1px', background: 'rgba(196,154,60,0.4)', marginBottom: '16px' }} />

                  <p style={{
                    fontFamily: 'var(--font-lato)',
                    fontWeight: 300,
                    fontSize: '0.9rem',
                    lineHeight: 1.8,
                    color: 'rgba(255,255,255,0.65)',
                    margin: 0,
                  }}>
                    {option.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/victus/dev/armenia && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
cd /home/victus/dev/armenia && git add components/sections/diaspora/HarvestOptions.tsx && git commit -m "feat: add HarvestOptions section component"
```

---

## Task 11: DiasporaOwnership Component

**Files:**
- Create: `components/sections/diaspora/DiasporaOwnership.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import { EASE, VIEWPORT, staggerVariants } from '@/lib/animations';
import type { DiasporaOwnershipContent } from '@/types/content';

interface Props {
  content: DiasporaOwnershipContent;
}

export default function DiasporaOwnership({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="ink" />

      <section id="ownership" style={{ background: 'var(--green-pale)', padding: '96px 24px' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: '48px 80px',
          alignItems: 'start',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <SectionTag variant="pomegranate" style={{ marginBottom: '24px' }}>
              {content.tag}
            </SectionTag>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              lineHeight: 1.25,
              color: 'var(--ink)',
              margin: '0 0 20px',
            }}>
              {content.heading}
            </h2>
            <p style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 300,
              fontSize: '1.05rem',
              lineHeight: 1.85,
              color: 'var(--ink2)',
              margin: 0,
              maxWidth: '380px',
            }}>
              {content.intro}
            </p>
            <div style={{ marginTop: '40px', width: '48px', height: '3px', background: 'var(--pomegranate)', borderRadius: '2px', opacity: 0.4 }} />
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {content.items.map((item, i) => (
              <motion.div
                key={item.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                variants={staggerVariants}
              >
                <div
                  className="card-lift"
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '28px 24px 32px',
                    border: '1px solid rgba(139,37,53,0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--pomegranate-pale)',
                    border: '1px solid var(--pomegranate-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 400,
                    fontSize: '0.85rem',
                    color: 'var(--pomegranate)',
                    marginBottom: '18px',
                    flexShrink: 0,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 400,
                    fontSize: '1.05rem',
                    lineHeight: 1.35,
                    color: 'var(--ink)',
                    margin: '0 0 10px',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-lato)',
                    fontWeight: 300,
                    fontSize: '0.9rem',
                    lineHeight: 1.75,
                    color: 'var(--ink2)',
                    margin: 0,
                  }}>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/victus/dev/armenia && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
cd /home/victus/dev/armenia && git add components/sections/diaspora/DiasporaOwnership.tsx && git commit -m "feat: add DiasporaOwnership section component"
```

---

## Task 12: GiftMechanic Component

**Files:**
- Create: `components/sections/diaspora/GiftMechanic.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import { EASE, VIEWPORT } from '@/lib/animations';
import type { GiftMechanicContent } from '@/types/content';

interface Props {
  content: GiftMechanicContent;
}

function GiftCardMockup() {
  return (
    <div style={{
      width: '100%',
      maxWidth: '360px',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 24px 64px rgba(139,37,53,0.18), 0 4px 16px rgba(139,37,53,0.1)',
    }}>
      {/* Card header */}
      <div style={{
        background: 'var(--pomegranate)',
        padding: '28px 28px 24px',
      }}>
        <div style={{
          fontFamily: 'var(--font-lato)',
          fontWeight: 700,
          fontSize: '0.65rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)',
          marginBottom: '12px',
        }}>
          Hyeland Gift Plot
        </div>
        <div style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 300,
          fontSize: '1.6rem',
          lineHeight: 1.2,
          color: 'white',
        }}>
          Plot #12 — Armavir
        </div>
        <div style={{
          fontFamily: 'var(--font-lato)',
          fontWeight: 300,
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.65)',
          marginTop: '6px',
        }}>
          Tomatoes · Herbs
        </div>
      </div>

      {/* Card body */}
      <div style={{
        background: 'var(--cream)',
        padding: '20px 28px 24px',
        borderTop: '1px solid rgba(139,37,53,0.12)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}>
          <div style={{
            fontFamily: 'var(--font-lato)',
            fontWeight: 700,
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--ink3)',
          }}>
            Gifted by
          </div>
          <div style={{ flex: 1, height: '1px', background: 'var(--pomegranate-light)', opacity: 0.4 }} />
        </div>
        <div style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 400,
          fontSize: '1.1rem',
          color: 'var(--ink)',
          marginBottom: '4px',
        }}>
          Armen Hakobyan
        </div>
        <div style={{
          fontFamily: 'var(--font-lato)',
          fontWeight: 300,
          fontSize: '0.82rem',
          color: 'var(--ink3)',
          marginBottom: '20px',
        }}>
          To his mother, Ani — for the land she loves
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--pomegranate-pale)',
          border: '1px solid rgba(139,37,53,0.2)',
          borderRadius: '100px',
          padding: '5px 14px',
          fontFamily: 'var(--font-lato)',
          fontWeight: 700,
          fontSize: '0.68rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--pomegranate)',
        }}>
          <span style={{ fontSize: '0.75rem' }}>✦</span>
          Season 2025
        </div>
      </div>
    </div>
  );
}

export default function GiftMechanic({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="ink" />

      <section id="gift" style={{ background: 'var(--soil-pale)', padding: '96px 24px' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
          gap: '48px 80px',
          alignItems: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <SectionTag variant="pomegranate" style={{ marginBottom: '24px' }}>
              {content.tag}
            </SectionTag>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              lineHeight: 1.25,
              color: 'var(--ink)',
              margin: '0 0 20px',
            }}>
              {content.heading}
            </h2>
            <p style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 300,
              fontSize: '1.05rem',
              lineHeight: 1.85,
              color: 'var(--ink2)',
              margin: '0 0 36px',
            }}>
              {content.intro}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
              {content.features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.07 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
                >
                  <div style={{
                    flexShrink: 0,
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--pomegranate)',
                    opacity: 0.7,
                    marginTop: '8px',
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-lato)',
                    fontWeight: 300,
                    fontSize: '0.975rem',
                    lineHeight: 1.7,
                    color: 'var(--ink2)',
                  }}>
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={content.ctaHref}
                className="btn-pomegranate"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-lato)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'white',
                  background: 'var(--pomegranate)',
                  padding: '14px 32px',
                  borderRadius: '100px',
                  textDecoration: 'none',
                  alignSelf: 'flex-start',
                  boxShadow: '0 4px 20px rgba(139,37,53,0.22)',
                }}
              >
                {content.ctaLabel}
                <span style={{ fontSize: '1rem' }}>→</span>
              </a>
              <p style={{
                fontFamily: 'var(--font-lato)',
                fontWeight: 300,
                fontSize: '0.82rem',
                color: 'var(--ink3)',
                margin: 0,
              }}>
                {content.note}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <GiftCardMockup />
          </motion.div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/victus/dev/armenia && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
cd /home/victus/dev/armenia && git add components/sections/diaspora/GiftMechanic.tsx && git commit -m "feat: add GiftMechanic section component"
```

---

## Task 13: PhaseTwo Component

**Files:**
- Create: `components/sections/diaspora/PhaseTwo.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import { EASE, VIEWPORT } from '@/lib/animations';
import type { PhaseTwoContent } from '@/types/content';

interface Props {
  content: PhaseTwoContent;
}

export default function PhaseTwo({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="ink" />

      <section id="phase-two" style={{ background: 'var(--cream2)', padding: '72px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div style={{
              border: '1px dashed rgba(26,26,20,0.2)',
              borderRadius: '16px',
              padding: '40px 40px 44px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(26,26,20,0.05)',
                border: '1px solid rgba(26,26,20,0.1)',
                borderRadius: '100px',
                padding: '4px 14px',
                alignSelf: 'flex-start',
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--ink3)' }} />
                <span style={{
                  fontFamily: 'var(--font-lato)',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--ink3)',
                }}>
                  {content.tag}
                </span>
              </div>

              <h2 style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 300,
                fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                lineHeight: 1.3,
                color: 'var(--ink2)',
                margin: 0,
              }}>
                {content.heading}
              </h2>

              <p style={{
                fontFamily: 'var(--font-lato)',
                fontWeight: 300,
                fontSize: '0.975rem',
                lineHeight: 1.85,
                color: 'var(--ink3)',
                margin: 0,
              }}>
                {content.body}
              </p>

              <div style={{
                paddingTop: '4px',
                fontFamily: 'var(--font-lato)',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink3)',
                opacity: 0.6,
              }}>
                {content.note}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/victus/dev/armenia && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
cd /home/victus/dev/armenia && git add components/sections/diaspora/PhaseTwo.tsx && git commit -m "feat: add PhaseTwo section component"
```

---

## Task 14: Page Assembly

**Files:**
- Create: `app/[locale]/diaspora/page.tsx`

- [ ] **Step 1: Create the diaspora page**

```tsx
import { getNavContent, getDiasporaContent } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import { LOCALES } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import DiasporaHero from '@/components/sections/diaspora/DiasporaHero';
import DiasporaProblem from '@/components/sections/diaspora/DiasporaProblem';
import HowItWorks from '@/components/sections/HowItWorks';
import HarvestOptions from '@/components/sections/diaspora/HarvestOptions';
import DashboardShowcase from '@/components/sections/DashboardShowcase';
import DiasporaOwnership from '@/components/sections/diaspora/DiasporaOwnership';
import GiftMechanic from '@/components/sections/diaspora/GiftMechanic';
import Progress from '@/components/sections/Progress';
import Farmer from '@/components/sections/Farmer';
import Seasonal from '@/components/sections/Seasonal';
import Trust from '@/components/sections/Trust';
import PhaseTwo from '@/components/sections/diaspora/PhaseTwo';
import FAQ from '@/components/sections/FAQ';
import About from '@/components/sections/About';
import CTAFooter from '@/components/sections/CTAFooter';

export const revalidate = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function DiasporaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  const [nav, diaspora] = await Promise.all([
    getNavContent(locale),
    getDiasporaContent(locale),
  ]);

  const v = diaspora.sectionVisibility;

  return (
    <>
      <Navbar content={nav} page="diaspora" locale={locale} />
      <main>
        {v.hero !== false && <DiasporaHero content={diaspora.hero} />}
        {v.problem !== false && <DiasporaProblem content={diaspora.problem} />}
        {v.howItWorks !== false && <HowItWorks content={diaspora.howItWorks} />}
        {v.harvestOptions !== false && <HarvestOptions content={diaspora.harvestOptions} />}
        {v.dashboardShowcase !== false && <DashboardShowcase content={diaspora.dashboardShowcase} />}
        {v.ownership !== false && <DiasporaOwnership content={diaspora.ownership} />}
        {v.giftMechanic !== false && <GiftMechanic content={diaspora.giftMechanic} />}
        {v.progress !== false && <Progress content={diaspora.progress} />}
        {v.farmer !== false && <Farmer content={diaspora.farmer} />}
        {v.seasonal !== false && <Seasonal content={diaspora.seasonal} />}
        {v.trust !== false && <Trust content={diaspora.trust} />}
        {v.phaseTwo !== false && <PhaseTwo content={diaspora.phaseTwo} />}
        {v.faq !== false && <FAQ content={diaspora.faq} />}
        {v.about !== false && <About content={diaspora.about} />}
        {v.ctaFooter !== false && <CTAFooter content={diaspora.ctaFooter} variant="pomegranate" />}
      </main>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles with zero errors**

```bash
cd /home/victus/dev/armenia && npx tsc --noEmit 2>&1
```

Expected: no output (zero errors).

- [ ] **Step 3: Start dev server and open the page**

```bash
cd /home/victus/dev/armenia && npm run dev
```

Open `http://localhost:3000/en/diaspora` — verify all 15 sections render, no console errors.

- [ ] **Step 4: Verify local page still works**

Open `http://localhost:3000/en` — confirm local page is unchanged.

- [ ] **Step 5: Commit**

```bash
cd /home/victus/dev/armenia && git add app/[locale]/diaspora/page.tsx && git commit -m "feat: add diaspora page route and section assembly"
```

---

## Task 15: Final Commit

- [ ] **Step 1: Run TypeScript check one final time**

```bash
cd /home/victus/dev/armenia && npx tsc --noEmit 2>&1
```

Expected: no output.

- [ ] **Step 2: Verify both routes render in dev**

- `http://localhost:3000/en` — local page intact
- `http://localhost:3000/en/diaspora` — diaspora page with all 15 sections
- `http://localhost:3000/hy/diaspora` — Armenian locale renders (EN content as placeholder)
- Navbar switch link `For the diaspora →` on local page goes to `/en/diaspora`
- Navbar switch link `For those living in Armenia →` on diaspora page goes back to `/en`

- [ ] **Step 3: Ask Alex: deploy to test (feat/ branch) or live (main branch)?**

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| Route `/{locale}/diaspora` | Task 14 |
| `getDiasporaContent()` | Task 5 |
| New content JSON (en + hy) | Tasks 6, 7 |
| Pomegranate `#8B2535` tokens | Task 1 |
| SectionTag pomegranate variant | Task 1 |
| DashboardCard `harvestOption` prop | Task 2 |
| CTAFooter pomegranate variant | Task 3 |
| DiasporaHero with new demo card | Task 8 |
| DiasporaProblem (3 disconnection cards) | Task 9 |
| HowItWorks adapted (4 new steps) | Content in Task 6 |
| HarvestOptions NEW (exactly 4) | Tasks 4, 10 |
| DashboardShowcase adapted | Content in Task 6 |
| DiasporaOwnership NEW | Tasks 4, 11 |
| GiftMechanic NEW with gift card mockup | Tasks 4, 12 |
| Progress adapted (Phase 2 shipping bullet) | Content in Task 6 |
| Farmer adapted | Content in Task 6 |
| Seasonal adapted | Content in Task 6 |
| Trust adapted (diaspora transparency) | Content in Task 6 |
| PhaseTwo NEW (muted, clearly future) | Tasks 4, 13 |
| FAQ replaced (6 diaspora questions) | Content in Task 6 |
| About unchanged | Content in Task 6 |
| CTAFooter adapted + pomegranate | Tasks 3, 6 |
| Nav diasporaLinks updated | Task 5 |
| No delivery language anywhere | Verified in content |
| Harvest section exactly 4 options | Task 10 + Task 6 |
| Section order: HarvestOptions after HowItWorks | Task 14 |
| Hero stat: `4 Harvest Options` | Task 6 |

No gaps found.
