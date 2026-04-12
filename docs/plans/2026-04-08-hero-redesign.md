# Hero Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the oversized, mixed-message Hero with a calm, premium two-column layout — smaller T2 serif headline, italic tagline as a separate element, and a floating dashboard card on a soft landscape background (BG1).

**Architecture:** `Hero.tsx` is rewritten in-place. The `HeroContent` type is left unchanged (reuse existing fields: `h1Line1`, `h1Line2`, `h1Italic` as tagline, `subtitle` as body). Content JSON files updated with B-direction copy. `ArmenianLandscape` removed; right side uses an inline SVG landscape background. `DashboardCard` component no longer used in Hero — replaced with a self-contained inline card matching the new mockup.

**Tech Stack:** Next.js, TypeScript, Framer Motion (kept for subtle fade-in), CSS-in-JS inline styles (existing pattern)

---

## File Map

| File | Action | What changes |
|---|---|---|
| `components/sections/Hero.tsx` | **Modify** | Full layout rewrite |
| `content/en/local.json` | **Modify** | New B-direction copy in `hero` block |
| `content/hy/local.json` | **Modify** | Armenian translation of new copy |

Nothing else touches `HeroContent` type, admin forms, or `DashboardCard.tsx`.

---

## Task 1: Update English hero copy

**Files:**
- Modify: `content/en/local.json` — `hero` block only

- [ ] **Step 1: Edit `content/en/local.json` — replace the `hero` object**

Replace the entire `hero` block (leave all other keys untouched):

```json
"hero": {
  "tag": "For those living in Armenia",
  "h1Line1": "Know what",
  "h1Line2": "you eat.",
  "h1Italic": "Grown on your land.",
  "subtitle": "Own a real farming plot outside Yerevan.\nA farmer tends it for you.\nHarvest comes to your door weekly.",
  "primaryCtaLabel": "Join the pre-pilot",
  "primaryCtaHref": "#join",
  "secondaryCtaLabel": "See how it works",
  "secondaryCtaHref": "#how-it-works",
  "stats": [
    { "value": "2 m²", "label": "Your plot" },
    { "value": "Weekly", "label": "Deliveries" },
    { "value": "Real", "label": "Farmer assigned" }
  ]
}
```

- [ ] **Step 2: Verify JSON is valid**

```bash
node -e "require('./content/en/local.json')" && echo "valid"
```
Expected: `valid`

- [ ] **Step 3: Commit**

```bash
git add content/en/local.json
git commit -m "content: update hero copy to B-direction (Know what you eat)"
```

---

## Task 2: Update Armenian hero copy

**Files:**
- Modify: `content/hy/local.json` — `hero` block only

- [ ] **Step 1: Edit `content/hy/local.json` — replace the `hero` object**

Replace the entire `hero` block:

```json
"hero": {
  "tag": "Հայաստանում ապրողների համար",
  "h1Line1": "Գիտես, թե",
  "h1Line2": "ինչ ես ուտում։",
  "h1Italic": "Աճեցրած քո հողի վրա։",
  "subtitle": "Ունեցիր իրական հողակտոր Երևանի մոտ։\nՖերմերը հոգ է տանում դրա մասին։\nԲերքը շաբաթական գալիս է քո դուռը։",
  "primaryCtaLabel": "Միանալ նախնական փուլին",
  "primaryCtaHref": "#join",
  "secondaryCtaLabel": "Տեսնել, թե ինչպես է աշխատում",
  "secondaryCtaHref": "#how-it-works",
  "stats": [
    { "value": "2 մ²", "label": "Քո հողակտոր" },
    { "value": "Շաբաթական", "label": "Առաքումներ" },
    { "value": "Իրական", "label": "Ֆերմեր կողքին" }
  ]
}
```

- [ ] **Step 2: Verify JSON is valid**

```bash
node -e "require('./content/hy/local.json')" && echo "valid"
```
Expected: `valid`

- [ ] **Step 3: Commit**

```bash
git add content/hy/local.json
git commit -m "content: update Armenian hero copy to match B-direction redesign"
```

---

## Task 3: Rewrite Hero.tsx

**Files:**
- Modify: `components/sections/Hero.tsx`

The entire file is replaced. Key decisions:
- Remove `ArmenianLandscape` and `DashboardCard` imports
- Inline SVG landscape (BG1) inside the right column
- Inline dashboard card (doesn't need DashboardCard component — that has a 4-item stats grid layout that doesn't match the new design)
- H1 is 26–28px Georgia weight 400, max-width 260px
- `h1Italic` field is rendered as a separate italic tagline element below H1
- `subtitle` field is rendered as body text (supports `\n` → `<br />`)
- Keep `motion` fade-in animation

- [ ] **Step 1: Replace `components/sections/Hero.tsx` with the new implementation**

```tsx
'use client';

import { motion } from 'framer-motion';
import SectionTag from '@/components/ui/SectionTag';
import { EASE } from '@/lib/animations';
import type { HeroContent } from '@/types/content';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE, delay },
  }),
};

interface Props {
  content: HeroContent;
}

export default function Hero({ content }: Props) {
  const bodyLines = content.subtitle.split('\n');

  return (
    <section style={{ background: 'var(--cream)', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '64px' }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
        padding: '60px 24px 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
        gap: '40px 56px',
        alignItems: 'center',
      }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} style={{ marginBottom: '20px' }}>
            <SectionTag variant="green">{content.tag}</SectionTag>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={0.1}
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 400,
              fontSize: 'clamp(1.6rem, 2.8vw, 1.85rem)',
              lineHeight: 1.28,
              color: 'var(--ink)',
              margin: '0 0 8px',
              maxWidth: '260px',
            }}
          >
            {content.h1Line1}<br />
            {content.h1Line2}
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.18}
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: '0.9rem',
              color: 'var(--green)',
              margin: '0 0 24px',
            }}
          >
            {content.h1Italic}
          </motion.p>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.26}
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 300,
              fontSize: '0.78rem',
              lineHeight: 1.8,
              color: 'var(--ink2)',
              margin: '0 0 32px',
              maxWidth: '240px',
            }}
          >
            {bodyLines.map((line, i) => (
              <span key={i}>{line}{i < bodyLines.length - 1 && <br />}</span>
            ))}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.34}
            variants={fadeUp}
            style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}
          >
            <a
              href={content.primaryCtaHref}
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-lato)',
                fontWeight: 600,
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'white',
                background: 'var(--green-deep)',
                padding: '10px 22px',
                borderRadius: '100px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {content.primaryCtaLabel}
            </a>

            <a
              href={content.secondaryCtaHref}
              style={{
                fontFamily: 'var(--font-lato)',
                fontWeight: 400,
                fontSize: '0.78rem',
                color: 'var(--green)',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              {content.secondaryCtaLabel}
            </a>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.44}
            variants={fadeUp}
            style={{ display: 'flex', borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: '24px' }}
          >
            {content.stats.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  paddingRight: i < content.stats.length - 1 ? '20px' : '0',
                  paddingLeft: i > 0 ? '20px' : '0',
                  borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                }}
              >
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 400,
                  fontSize: '1.15rem',
                  color: 'var(--green-deep)',
                  marginBottom: '2px',
                }}>
                  {stat.value}
                </span>
                <span style={{
                  fontFamily: 'var(--font-lato)',
                  fontWeight: 400,
                  fontSize: '0.58rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--ink3)',
                }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right column ── */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', minHeight: '400px' }}
        >
          {/* BG1: soft landscape SVG */}
          <svg
            viewBox="0 0 500 420"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            aria-hidden="true"
          >
            <rect width="500" height="420" fill="#EEF4E8" />
            {/* Far mountains */}
            <polygon points="0,240 80,185 160,210 240,168 320,205 400,172 500,192 500,275 0,275" fill="#C8D8BC" opacity="0.55" />
            {/* Near mountains */}
            <polygon points="0,258 60,222 130,242 210,206 290,235 380,212 500,228 500,305 0,305" fill="#B4C8A4" opacity="0.65" />
            {/* Field ground */}
            <rect x="0" y="292" width="500" height="128" fill="#C4DCAA" opacity="0.75" />
            {/* Field row lines */}
            <g stroke="#A0C080" strokeWidth="0.9" opacity="0.55">
              <line x1="0" y1="308" x2="500" y2="308" />
              <line x1="0" y1="322" x2="500" y2="322" />
              <line x1="0" y1="336" x2="500" y2="336" />
              <line x1="0" y1="350" x2="500" y2="350" />
              <line x1="0" y1="364" x2="500" y2="364" />
              <line x1="0" y1="378" x2="500" y2="378" />
              <line x1="0" y1="392" x2="500" y2="392" />
              <line x1="0" y1="406" x2="500" y2="406" />
            </g>
            {/* Trees left */}
            <ellipse cx="55" cy="278" rx="22" ry="30" fill="#6B9E5A" opacity="0.65" />
            <ellipse cx="72" cy="284" rx="16" ry="22" fill="#5A8A4A" opacity="0.55" />
            {/* Trees right */}
            <ellipse cx="445" cy="275" rx="20" ry="26" fill="#6B9E5A" opacity="0.6" />
            {/* Sun glow */}
            <circle cx="420" cy="65" r="50" fill="#FFF8E8" opacity="0.5" />
            <circle cx="420" cy="65" r="28" fill="#F5E8C0" opacity="0.4" />
            {/* Vignette */}
            <defs>
              <radialGradient id="heroVg" cx="50%" cy="50%" r="75%">
                <stop offset="30%" stopColor="transparent" />
                <stop offset="100%" stopColor="#E8F0E0" stopOpacity="0.55" />
              </radialGradient>
            </defs>
            <rect width="500" height="420" fill="url(#heroVg)" />
            {/* Horizon line */}
            <line x1="0" y1="292" x2="500" y2="292" stroke="#B0C898" strokeWidth="0.8" opacity="0.5" />
          </svg>

          {/* Floating dashboard card */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '220px',
              background: 'white',
              borderRadius: '14px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.13)',
              overflow: 'hidden',
              fontFamily: 'var(--font-lato), sans-serif',
              transform: 'rotate(-1deg)',
            }}>
              {/* Card header */}
              <div style={{ background: '#2D5A27', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '3px' }}>Your plot</div>
                  <div style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>Plot 7 — Armavir</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '20px', padding: '3px 9px', color: '#A8D4A0', fontSize: '10px', whiteSpace: 'nowrap' }}>Growing 🌱</div>
              </div>
              {/* Growth stage */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #F0EBE0' }}>
                <div style={{ color: '#9B9B82', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '5px' }}>Growth stage</div>
                <div style={{ background: '#E8F5E4', borderRadius: '4px', height: '5px', marginBottom: '4px' }}>
                  <div style={{ background: '#3D7A35', width: '62%', height: '100%', borderRadius: '4px' }} />
                </div>
                <div style={{ color: '#3D7A35', fontSize: '9px', fontWeight: 600 }}>Flowering · 62%</div>
              </div>
              {/* Crops + size */}
              <div style={{ padding: '10px 16px', borderBottom: '1px solid #F0EBE0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <div style={{ color: '#9B9B82', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '3px' }}>Crops</div>
                  <div style={{ fontSize: '10px', color: '#1A1A14', fontWeight: 500 }}>Tomatoes · Herbs</div>
                </div>
                <div>
                  <div style={{ color: '#9B9B82', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '3px' }}>Plot size</div>
                  <div style={{ fontSize: '10px', color: '#1A1A14', fontWeight: 500 }}>2 m²</div>
                </div>
              </div>
              {/* Next delivery */}
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '30px', height: '30px', background: '#FBF3DC', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>📦</div>
                <div>
                  <div style={{ color: '#9B9B82', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Next delivery</div>
                  <div style={{ color: '#1A1A14', fontSize: '10px', fontWeight: 500 }}>Thursday · ~1.5 kg</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
```

- [ ] **Step 2: Check TypeScript compiles**

```bash
cd /home/victus/dev/armenia && npx tsc --noEmit 2>&1 | head -30
```
Expected: no errors (or only pre-existing unrelated errors)

- [ ] **Step 3: Verify the page renders locally**

```bash
npm run dev
```
Open http://localhost:3000 and http://localhost:3000/hy — confirm Hero renders with new layout, correct copy, no console errors.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "feat: redesign Hero section — T2 typography, B copy, dashboard card + BG1 landscape"
```

---

## Task 4: Final check + deploy prompt

- [ ] **Step 1: Full build check**

```bash
npm run build 2>&1 | tail -20
```
Expected: build completes without errors.

- [ ] **Step 2: Ask user about deployment**

> "Build passes. Deploy to test (feat/ branch) or live (main branch)?"
