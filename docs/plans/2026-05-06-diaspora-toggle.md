# Diaspora Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a single Dashboard toggle that disables diaspora routing (404) and the navbar switch link across both locales.

**Architecture:** Boolean `diasporaEnabled` flag stored in a new locale-free `content/settings.json` (R2 override + filesystem fallback, matching existing `how-it-works.json` pattern). Diaspora page calls `notFound()` when off; Navbar receives an optional prop (default `true`) and conditionally renders the switch link. Admin Dashboard hosts an optimistic toggle that POSTs to the existing `/api/admin/save` endpoint.

**Tech Stack:** Next.js 15 App Router, TypeScript, Cloudflare R2, NextAuth, inline styles with CSS custom properties.

**No test framework installed** in this repo — verification is `npm run build`, `npm run lint`, and manual browser checks against `npm run dev`.

**Spec:** `docs/specs/2026-05-06-diaspora-toggle-design.md`

**Task order rationale:** Navbar's prop is updated *before* the page call sites pass it, so every intermediate commit is type-clean.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `content/settings.json` | Create | Default flag values (filesystem fallback) |
| `types/content.ts` | Modify (append) | Add `SiteSettings` interface |
| `lib/content.ts` | Modify (append) | Add `getSiteSettings()` getter |
| `app/api/admin/save/route.ts` | Modify (one branch) | Revalidation paths for `'settings'` |
| `components/layout/Navbar.tsx` | Modify | New optional `diasporaEnabled` prop; conditionally render switch link |
| `app/[locale]/diaspora/page.tsx` | Modify | `notFound()` when disabled; pass flag to Navbar |
| `app/[locale]/page.tsx` | Modify | Fetch settings; pass flag to Navbar |
| `components/admin/DiasporaToggle.tsx` | Create | Client component: optimistic toggle UI + save POST |
| `app/admin/(panel)/page.tsx` | Modify | Make async, fetch settings, mount toggle above Quick Links |
| `docs/updates/2026-05-06-diaspora-toggle.md` | Create | Documentation update draft |

---

## Task 1: Add `SiteSettings` type & default JSON

**Files:**
- Create: `content/settings.json`
- Modify: `types/content.ts` (append at end of file)

- [ ] **Step 1: Create the default settings JSON**

Create `content/settings.json` with this exact content:

```json
{
  "diasporaEnabled": true
}
```

- [ ] **Step 2: Append `SiteSettings` interface to `types/content.ts`**

Append at end of file (after line 349):

```ts

/* ─── Site settings (locale-free, R2-overridable) ───────────── */

export interface SiteSettings {
  diasporaEnabled: boolean;
}
```

- [ ] **Step 3: Verify TypeScript still compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add content/settings.json types/content.ts
git commit -m "feat: add SiteSettings type with diasporaEnabled default"
```

---

## Task 2: Add `getSiteSettings()` getter

**Files:**
- Modify: `lib/content.ts`

- [ ] **Step 1: Add `SiteSettings` to the existing type import**

Locate the import line in `lib/content.ts` (currently around line 4):

```ts
import type { NavContent, HowItWorksContent, LocalContent, DiasporaContent, PlotFieldConfig } from '@/types/content';
```

Replace with:

```ts
import type { NavContent, HowItWorksContent, LocalContent, DiasporaContent, PlotFieldConfig, SiteSettings } from '@/types/content';
```

- [ ] **Step 2: Append `getSiteSettings` at end of file**

Add to the bottom of `lib/content.ts`:

```ts
export async function getSiteSettings(): Promise<SiteSettings> {
  const fsPath = join(CONTENT_DIR, 'settings.json');
  const fsData = JSON.parse(await readFile(fsPath, 'utf-8')) as SiteSettings;
  try {
    const text = await r2GetText('content/settings.json');
    if (text) return { ...fsData, ...JSON.parse(text) };
  } catch {
    // R2 error — use filesystem only
  }
  return fsData;
}
```

- [ ] **Step 3: Verify TypeScript still compiles**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add lib/content.ts
git commit -m "feat: add getSiteSettings reader with R2 override and fs fallback"
```

---

## Task 3: Add revalidation paths for `settings` saves

**Files:**
- Modify: `app/api/admin/save/route.ts`

- [ ] **Step 1: Add the `settings` branch**

In `app/api/admin/save/route.ts`, locate `getRevalidatePaths`:

```ts
function getRevalidatePaths(file: string, locale?: Locale): string[] {
  if (file === 'local') return locale ? [`/${locale}`] : ['/hy', '/en'];
  if (file === 'nav') return ['/hy', '/en', '/hy/diaspora', '/en/diaspora'];
  if (file === 'diaspora') return ['/hy/diaspora', '/en/diaspora'];
  if (file === 'farmer') return ['/hy', '/en', '/hy/diaspora', '/en/diaspora'];
  if (file === 'how-it-works') return ['/hy', '/en', '/hy/diaspora', '/en/diaspora'];
  return [];
}
```

Add a new `if` line for `settings` immediately after the `how-it-works` line. Final function:

```ts
function getRevalidatePaths(file: string, locale?: Locale): string[] {
  if (file === 'local') return locale ? [`/${locale}`] : ['/hy', '/en'];
  if (file === 'nav') return ['/hy', '/en', '/hy/diaspora', '/en/diaspora'];
  if (file === 'diaspora') return ['/hy/diaspora', '/en/diaspora'];
  if (file === 'farmer') return ['/hy', '/en', '/hy/diaspora', '/en/diaspora'];
  if (file === 'how-it-works') return ['/hy', '/en', '/hy/diaspora', '/en/diaspora'];
  if (file === 'settings') return ['/hy', '/en', '/hy/diaspora', '/en/diaspora'];
  return [];
}
```

- [ ] **Step 2: Verify TypeScript still compiles**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/save/route.ts
git commit -m "feat: revalidate home and diaspora pages on settings save"
```

---

## Task 4: Add `diasporaEnabled` prop to Navbar (optional, default true)

**Files:**
- Modify: `components/layout/Navbar.tsx`

The prop is **optional with default `true`** so call sites can be updated independently in the next two tasks without breaking type-checks here.

- [ ] **Step 1: Extend the props interface**

Locate:

```ts
interface NavbarProps {
  content: NavContent;
  page?: 'local' | 'diaspora';
  locale: Locale;
}
```

Replace with:

```ts
interface NavbarProps {
  content: NavContent;
  page?: 'local' | 'diaspora';
  locale: Locale;
  diasporaEnabled?: boolean;
}
```

- [ ] **Step 2: Destructure with a default**

Locate the function signature:

```tsx
export default function Navbar({ content, page = 'local', locale }: NavbarProps) {
```

Replace with:

```tsx
export default function Navbar({ content, page = 'local', locale, diasporaEnabled = true }: NavbarProps) {
```

- [ ] **Step 3: Gate the desktop switch link**

Find this block (inside the desktop right cluster):

```tsx
            <Link href={switchHref} style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 400,
              fontSize: '0.8rem',
              color: 'var(--ink3)',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}>
              {switchText} →
            </Link>
```

Wrap it in a conditional:

```tsx
            {diasporaEnabled && (
              <Link href={switchHref} style={{
                fontFamily: 'var(--font-lato)',
                fontWeight: 400,
                fontSize: '0.8rem',
                color: 'var(--ink3)',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
              }}>
                {switchText} →
              </Link>
            )}
```

- [ ] **Step 4: Gate the mobile switch link**

Find this block (inside `.mobile-right`):

```tsx
            <Link href={switchHref} style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 400,
              fontSize: '0.75rem',
              color: 'var(--ink3)',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}>
              {switchText} →
            </Link>
```

Wrap it in a conditional:

```tsx
            {diasporaEnabled && (
              <Link href={switchHref} style={{
                fontFamily: 'var(--font-lato)',
                fontWeight: 400,
                fontSize: '0.75rem',
                color: 'var(--ink3)',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
              }}>
                {switchText} →
              </Link>
            )}
```

- [ ] **Step 5: Verify TypeScript and lint**

Run: `npx tsc --noEmit`
Expected: exits 0 (existing call sites still compile because the new prop is optional).

Run: `npm run lint`
Expected: exits 0.

- [ ] **Step 6: Commit**

```bash
git add components/layout/Navbar.tsx
git commit -m "feat: gate navbar diaspora switch link on diasporaEnabled prop"
```

---

## Task 5: Enforce flag on `/[locale]/diaspora`

**Files:**
- Modify: `app/[locale]/diaspora/page.tsx`

- [ ] **Step 1: Add `getSiteSettings` to the imports**

Locate:

```ts
import { getNavContent, getDiasporaContent, getPlotFieldConfig } from '@/lib/content';
```

Replace with:

```ts
import { getNavContent, getDiasporaContent, getPlotFieldConfig, getSiteSettings } from '@/lib/content';
```

- [ ] **Step 2: Fetch settings and short-circuit when disabled**

Inside `DiasporaPage`, locate this block:

```ts
  const fieldConfig = getPlotFieldConfig();
  const [nav, diaspora] = await Promise.all([
    getNavContent(locale),
    getDiasporaContent(locale),
  ]);
```

Replace with:

```ts
  const fieldConfig = getPlotFieldConfig();
  const [nav, diaspora, settings] = await Promise.all([
    getNavContent(locale),
    getDiasporaContent(locale),
    getSiteSettings(),
  ]);

  if (!settings.diasporaEnabled) notFound();
```

`notFound` is already imported at the top of the file — no new import needed.

- [ ] **Step 3: Pass `diasporaEnabled` to Navbar**

Find:

```tsx
      <Navbar content={nav} page="diaspora" locale={locale} />
```

Replace with:

```tsx
      <Navbar content={nav} page="diaspora" locale={locale} diasporaEnabled={settings.diasporaEnabled} />
```

- [ ] **Step 4: Verify TypeScript still compiles**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add app/[locale]/diaspora/page.tsx
git commit -m "feat: 404 the diaspora page when toggle is off"
```

---

## Task 6: Wire flag through `/[locale]` (home page)

**Files:**
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Add `getSiteSettings` to the imports**

Locate:

```ts
import { getNavContent, getLocalContent, getPlotFieldConfig } from '@/lib/content';
```

Replace with:

```ts
import { getNavContent, getLocalContent, getPlotFieldConfig, getSiteSettings } from '@/lib/content';
```

- [ ] **Step 2: Fetch settings**

Locate:

```ts
  const fieldConfig = getPlotFieldConfig();
  const [nav, local] = await Promise.all([
    getNavContent(locale),
    getLocalContent(locale),
  ]);
```

Replace with:

```ts
  const fieldConfig = getPlotFieldConfig();
  const [nav, local, settings] = await Promise.all([
    getNavContent(locale),
    getLocalContent(locale),
    getSiteSettings(),
  ]);
```

- [ ] **Step 3: Pass flag to Navbar**

Find:

```tsx
      <Navbar content={nav} page="local" locale={locale} />
```

Replace with:

```tsx
      <Navbar content={nav} page="local" locale={locale} diasporaEnabled={settings.diasporaEnabled} />
```

- [ ] **Step 4: Verify TypeScript still compiles**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add app/[locale]/page.tsx
git commit -m "feat: pass diasporaEnabled flag to home Navbar"
```

---

## Task 7: Build the `DiasporaToggle` admin component

**Files:**
- Create: `components/admin/DiasporaToggle.tsx`

- [ ] **Step 1: Create the client component**

Create `components/admin/DiasporaToggle.tsx` with this exact content:

```tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import AdminCard from './AdminCard';

interface DiasporaToggleProps {
  initialEnabled: boolean;
}

export default function DiasporaToggle({ initialEnabled }: DiasporaToggleProps) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initialEnabled);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function toggle() {
    if (saving) return;
    const next = !enabled;
    setError(null);
    setSaving(true);
    setEnabled(next); // optimistic

    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: 'settings',
          content: { diasporaEnabled: next },
          section: 'site-settings',
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Save failed (${res.status})`);
      }

      startTransition(() => router.refresh());
    } catch (e) {
      setEnabled(!next); // rollback
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminCard style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1A1A14', marginBottom: '4px' }}>
            Diaspora page
          </div>
          <div style={{ fontSize: '0.8rem', color: '#9B9B82' }}>
            Routing + navbar link toggle for both locales (en, hy)
          </div>
          {error && (
            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#B23A3A' }}>
              {error}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggle}
          disabled={saving}
          aria-pressed={enabled}
          style={{
            position: 'relative',
            width: '56px',
            height: '30px',
            borderRadius: '999px',
            border: 'none',
            cursor: saving ? 'wait' : 'pointer',
            background: enabled ? '#2D5A27' : '#C7C2B5',
            transition: 'background 0.2s ease',
            opacity: saving ? 0.7 : 1,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '3px',
              left: enabled ? '29px' : '3px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              transition: 'left 0.2s ease',
            }}
          />
        </button>
      </div>
    </AdminCard>
  );
}
```

- [ ] **Step 2: Verify TypeScript still compiles**

Run: `npx tsc --noEmit`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add components/admin/DiasporaToggle.tsx
git commit -m "feat: add DiasporaToggle admin component with optimistic save"
```

---

## Task 8: Mount the toggle on the Dashboard

**Files:**
- Modify: `app/admin/(panel)/page.tsx`

- [ ] **Step 1: Convert page to async and mount toggle**

Replace the entire contents of `app/admin/(panel)/page.tsx` with:

```tsx
import AdminCard from '@/components/admin/AdminCard';
import DiasporaToggle from '@/components/admin/DiasporaToggle';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/content';

const QUICK_LINKS = [
  { label: 'Navigation', href: '/admin/navigation', desc: 'Logo, nav links, CTA buttons' },
  { label: 'Local Page', href: '/admin/local', desc: 'Hero, Problem, FAQ and more' },
  { label: 'Diaspora Page', href: '/admin/diaspora', desc: 'Hero, Testimonials, How it works' },
  { label: 'Farmer Profile', href: '/admin/farmer', desc: 'Name, photo, quote, region' },
  { label: 'Available Plots', href: '/admin/plots', desc: 'Manage plot availability' },
  { label: 'Settings', href: '/admin/settings', desc: 'Pilot status, social links' },
];

export default async function AdminDashboard() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#1A1A14' }}>Dashboard</h1>
        <p style={{ margin: '6px 0 0', fontSize: '0.875rem', color: '#9B9B82' }}>
          Welcome back. Jump into any section to edit content.
        </p>
      </div>

      <DiasporaToggle initialEnabled={settings.diasporaEnabled} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {QUICK_LINKS.map((item) => (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
            <AdminCard
              style={{
                cursor: 'pointer',
                transition: 'box-shadow 0.2s ease, transform 0.15s ease',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1A1A14', marginBottom: '4px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#9B9B82' }}>{item.desc}</div>
              <div style={{ marginTop: '14px', fontSize: '0.75rem', color: '#C49A3C', fontWeight: 700 }}>
                Edit →
              </div>
            </AdminCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript and lint**

Run: `npx tsc --noEmit`
Expected: exits 0.

Run: `npm run lint`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add app/admin/\(panel\)/page.tsx
git commit -m "feat: mount diaspora toggle above Quick Links on Dashboard"
```

---

## Task 9: Full build + manual verification

**Files:** none modified (verification only)

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: build succeeds, no type errors.

- [ ] **Step 2: Start dev server**

Run: `npm run dev`
Wait for "Ready" message.

- [ ] **Step 3: Verify ON state (default)**

- `http://localhost:3000/en` — "For the diaspora →" link visible (desktop and mobile width).
- `http://localhost:3000/hy` — "Սփյուռքի համար →" link visible.
- `http://localhost:3000/en/diaspora` — page renders normally.
- `http://localhost:3000/hy/diaspora` — page renders normally.

- [ ] **Step 4: Verify OFF state via admin**

- Log in at `http://localhost:3000/admin/login`.
- `http://localhost:3000/admin` — toggle card visible above Quick Links, switch in green/ON position.
- Click toggle — switch animates to OFF (gray), no error message.
- `http://localhost:3000/en` — switch link gone (desktop + mobile).
- `http://localhost:3000/hy` — switch link gone.
- `http://localhost:3000/en/diaspora` — Next.js 404 page.
- `http://localhost:3000/hy/diaspora` — Next.js 404 page.

- [ ] **Step 5: Verify ON returns**

- Back to admin, click toggle again — switch animates to ON.
- Re-verify the four URLs from Step 3 — everything restored.

- [ ] **Step 6: Reload-persistence check**

After toggling OFF, hard-refresh `http://localhost:3000/admin` (Ctrl+Shift+R) — toggle still shows OFF (R2 round-trip preserves state).
Toggle back ON before stopping the server.

- [ ] **Step 7: No commit needed for verification — but if any fix-ups were made, commit them**

```bash
git status
# If changes exist:
git add -A
git commit -m "fix: <describe verification fix>"
```

---

## Task 10: Documentation draft

Per the project's "After Task Completion" rule (CLAUDE.md), produce a documentation draft (do **not** apply changes).

**Files:**
- Create: `docs/updates/2026-05-06-diaspora-toggle.md`

- [ ] **Step 1: Write the update draft**

Create `docs/updates/2026-05-06-diaspora-toggle.md` with this content:

```markdown
# Diaspora Toggle — Update Draft

**Date:** 2026-05-06
**Spec:** docs/specs/2026-05-06-diaspora-toggle-design.md
**Plan:** docs/plans/2026-05-06-diaspora-toggle.md

## What changed
- New `content/settings.json` with `diasporaEnabled` flag.
- New `getSiteSettings()` reader (R2 override + fs fallback).
- `/[locale]/diaspora` returns 404 when flag is off.
- Navbar conditionally renders the local↔diaspora switch link.
- New `DiasporaToggle` component on `/admin` Dashboard.
- `'settings'` save now revalidates home + diaspora pages.

## Outdated repo docs
- `docs/ADMIN_PANEL.md` — does not mention site-level settings or the Dashboard toggle. Suggest a new "Site Settings" section.
- `docs/HYELAND_DIASPORA_SPEC.md` — should note the diaspora page can be administratively disabled site-wide (404 + hidden navbar link).

## Outdated obsidian notes
- (Alex to confirm) Any "Hyeland admin" or "diaspora launch" notes that describe the diaspora page as always-on.

## Proposed updates
- (Repo) Add admin-toggle section to `docs/ADMIN_PANEL.md`.
- (Repo) One-line note in `docs/HYELAND_DIASPORA_SPEC.md` referencing the toggle.
- (Obsidian) Mirror the same admin-toggle section.

Awaiting approval before applying.
```

- [ ] **Step 2: Commit the draft**

```bash
git add docs/updates/2026-05-06-diaspora-toggle.md
git commit -m "docs: draft update notes for diaspora toggle"
```

- [ ] **Step 3: Report back**

Tell Alex: implementation complete, manual verification passed, doc draft at `docs/updates/2026-05-06-diaspora-toggle.md`. Ask:
1. Apply the proposed doc updates?
2. Push to main (live)?

Do **not** push until Alex says so.
