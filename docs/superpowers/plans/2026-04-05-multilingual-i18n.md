# Multilingual (i18n) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `hy`/`en` locale routing to both the local and diaspora pages, with a language toggle button in the Navbar and locale-aware admin editors.

**Architecture:** URL-based locale via `app/[locale]/` App Router segment. Middleware redirects `/` → `/hy` and `/diaspora` → `/en/diaspora`. Content files live in `content/{locale}/`. Admin editors gain a locale selector that controls which file is fetched/saved.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, JSON content files

---

## File map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `lib/i18n.ts` | Locale constants + `switchLocale` utility |
| Create | `middleware.ts` | Redirect `/` → `/hy`, `/diaspora` → `/en/diaspora` |
| Create | `content/en/local.json` | English local content (current `content/local.json`) |
| Create | `content/en/nav.json` | English nav content (current `content/nav.json`) |
| Create | `content/hy/local.json` | Armenian local content (placeholder copy of en) |
| Create | `content/hy/nav.json` | Armenian nav content (placeholder copy of en) |
| Delete | `content/local.json` | Replaced by locale subfolders |
| Delete | `content/nav.json` | Replaced by locale subfolders |
| Modify | `lib/content.ts` | Add `locale` param to all getters |
| Modify | `app/layout.tsx` | Remove `<html>`/`<body>` — delegated to `[locale]/layout.tsx` |
| Create | `app/[locale]/layout.tsx` | Sets `<html lang={locale}>`, renders `<body>` |
| Create | `app/[locale]/page.tsx` | Local page (moved from `app/page.tsx`) |
| Delete | `app/page.tsx` | Replaced by `app/[locale]/page.tsx` |
| Create | `components/ui/LocaleSwitcher.tsx` | HY/EN toggle button |
| Modify | `components/layout/Navbar.tsx` | Add `locale` prop + `LocaleSwitcher`, fix switch link |
| Modify | `app/api/admin/content/route.ts` | Add `locale` query param |
| Modify | `app/api/admin/save/route.ts` | Add `locale` body param, update revalidation paths |
| Modify | `app/admin/(panel)/local/page.tsx` | Add locale selector, pass locale to fetch/save |
| Modify | `app/admin/(panel)/navigation/page.tsx` | Add locale selector, pass locale to fetch/save |

---

## Task 1: Create `lib/i18n.ts`

**Files:**
- Create: `lib/i18n.ts`

- [ ] **Step 1: Create the file**

```ts
export const LOCALES = ['hy', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE_LOCAL: Locale = 'hy';
export const DEFAULT_LOCALE_DIASPORA: Locale = 'en';

/** Replace the locale segment in a pathname. */
export function switchLocale(pathname: string, newLocale: Locale): string {
  const segments = pathname.split('/');
  // segments[0] is '' (before leading slash), segments[1] is the locale
  segments[1] = newLocale;
  return segments.join('/');
}

/** Extract locale from pathname, or return null if not a valid locale. */
export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split('/')[1];
  return LOCALES.includes(segment as Locale) ? (segment as Locale) : null;
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd /home/victus/dev/armenia && npx tsc --noEmit
```

Expected: no errors related to `lib/i18n.ts`

- [ ] **Step 3: Commit**

```bash
git add lib/i18n.ts
git commit -m "feat: add locale constants and switchLocale utility"
```

---

## Task 2: Restructure content files

**Files:**
- Create: `content/en/local.json` (copy of `content/local.json`)
- Create: `content/en/nav.json` (copy of `content/nav.json`)
- Create: `content/hy/local.json` (copy of en — Armenian translations filled later via admin)
- Create: `content/hy/nav.json` (copy of en — Armenian translations filled later via admin)
- Delete: `content/local.json`
- Delete: `content/nav.json`

- [ ] **Step 1: Create locale directories and copy files**

```bash
mkdir -p content/en content/hy
cp content/local.json content/en/local.json
cp content/nav.json content/en/nav.json
cp content/local.json content/hy/local.json
cp content/nav.json content/hy/nav.json
```

- [ ] **Step 2: Delete old flat files**

```bash
rm content/local.json content/nav.json
```

- [ ] **Step 3: Commit**

```bash
git add content/
git commit -m "feat: split content files into en/ and hy/ locale folders"
```

---

## Task 3: Update `lib/content.ts`

**Files:**
- Modify: `lib/content.ts`

- [ ] **Step 1: Rewrite the file to accept locale**

Replace the entire contents of `lib/content.ts` with:

```ts
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { NavContent, HowItWorksContent, LocalContent } from '@/types/content';
import type { Locale } from '@/lib/i18n';

const CONTENT_DIR = join(process.cwd(), 'content');

async function readJson<T>(locale: Locale, file: string): Promise<T> {
  const raw = await readFile(join(CONTENT_DIR, locale, `${file}.json`), 'utf-8');
  return JSON.parse(raw) as T;
}

export async function getNavContent(locale: Locale): Promise<NavContent> {
  return readJson<NavContent>(locale, 'nav');
}

export async function getHowItWorksContent(): Promise<HowItWorksContent> {
  // How-it-works is not locale-specific yet
  const raw = await readFile(join(CONTENT_DIR, 'how-it-works.json'), 'utf-8');
  return JSON.parse(raw) as HowItWorksContent;
}

export async function getLocalContent(locale: Locale): Promise<LocalContent> {
  return readJson<LocalContent>(locale, 'local');
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd /home/victus/dev/armenia && npx tsc --noEmit
```

Expected: errors in `app/page.tsx` (will be fixed in Task 5) — no errors in `lib/content.ts` itself.

- [ ] **Step 3: Commit**

```bash
git add lib/content.ts
git commit -m "feat: add locale param to content getters"
```

---

## Task 4: Create `middleware.ts`

**Files:**
- Create: `middleware.ts` (at project root, next to `package.json`)

- [ ] **Step 1: Create the file**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { LOCALES, DEFAULT_LOCALE_LOCAL, DEFAULT_LOCALE_DIASPORA } from '@/lib/i18n';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip internal Next.js paths and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Already has a valid locale prefix — let through
  const firstSegment = pathname.split('/')[1];
  if (LOCALES.includes(firstSegment as (typeof LOCALES)[number])) {
    return NextResponse.next();
  }

  // /diaspora → /en/diaspora
  if (pathname === '/diaspora') {
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LOCALE_DIASPORA}/diaspora`, req.url)
    );
  }

  // / → /hy
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LOCALE_LOCAL}`, req.url)
    );
  }

  // Any other unknown path — 404
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

- [ ] **Step 2: Start dev server and verify redirects**

```bash
npm run dev
```

Open `http://localhost:3000/` — should redirect to `http://localhost:3000/hy`.
Open `http://localhost:3000/diaspora` — should redirect to `http://localhost:3000/en/diaspora`.

The pages will 404 for now (Task 5 hasn't moved them yet) — that is expected.

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat: add i18n middleware for locale redirects"
```

---

## Task 5: Restructure `app/` directory

**Files:**
- Modify: `app/layout.tsx` — remove `<html>`/`<body>`, just return children
- Create: `app/[locale]/layout.tsx` — `<html lang={locale}>` + `<body>`
- Create: `app/[locale]/page.tsx` — local page (moved from `app/page.tsx`)
- Delete: `app/page.tsx`

- [ ] **Step 1: Simplify `app/layout.tsx`**

Replace the full contents of `app/layout.tsx` with:

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hyeland',
  description: 'Own a piece of the Highland.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

- [ ] **Step 2: Create `app/[locale]/layout.tsx`**

```tsx
import type { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';
import { LOCALES } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import '@/app/globals.css';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Create `app/[locale]/page.tsx`**

```tsx
import { getNavContent, getLocalContent } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import { LOCALES } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import HowItWorks from '@/components/sections/HowItWorks';
import DashboardShowcase from '@/components/sections/DashboardShowcase';
import Health from '@/components/sections/Health';
import Convenience from '@/components/sections/Convenience';
import Progress from '@/components/sections/Progress';
import Farmer from '@/components/sections/Farmer';
import Seasonal from '@/components/sections/Seasonal';
import Trust from '@/components/sections/Trust';
import FAQ from '@/components/sections/FAQ';
import About from '@/components/sections/About';
import CTAFooter from '@/components/sections/CTAFooter';

export const revalidate = 60;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  const [nav, local] = await Promise.all([
    getNavContent(locale),
    getLocalContent(locale),
  ]);

  return (
    <>
      <Navbar content={nav} page="local" locale={locale} />
      <main>
        <Hero content={local.hero} />
        <Problem content={local.problem} />
        <HowItWorks content={local.howItWorks} />
        <DashboardShowcase content={local.dashboardShowcase} />
        <Health content={local.health} />
        <Convenience content={local.convenience} />
        <Progress content={local.progress} />
        <Farmer content={local.farmer} />
        <Seasonal content={local.seasonal} />
        <Trust content={local.trust} />
        <FAQ content={local.faq} />
        <About content={local.about} />
        <CTAFooter content={local.ctaFooter} />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Delete `app/page.tsx`**

```bash
rm app/page.tsx
```

- [ ] **Step 5: Verify the app compiles**

```bash
npx tsc --noEmit
```

Expected: errors in `Navbar` (locale prop not yet added — will be fixed in Task 7). Fix by temporarily making locale optional in the call, or proceed to Task 7 next.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/[locale]/
git rm app/page.tsx
git commit -m "feat: restructure app/ to [locale] segment"
```

---

## Task 6: Create `LocaleSwitcher` component

**Files:**
- Create: `components/ui/LocaleSwitcher.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { switchLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

interface LocaleSwitcherProps {
  currentLocale: Locale;
}

export default function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleSwitch(newLocale: Locale) {
    if (newLocale === currentLocale) return;
    router.push(switchLocale(pathname, newLocale));
  }

  const activeStyle: React.CSSProperties = {
    fontWeight: 700,
    color: 'var(--ink)',
    borderBottom: '1.5px solid var(--green)',
  };

  const inactiveStyle: React.CSSProperties = {
    fontWeight: 400,
    color: 'var(--ink3)',
    borderBottom: '1.5px solid transparent',
    cursor: 'pointer',
  };

  const baseStyle: React.CSSProperties = {
    fontFamily: 'var(--font-lato)',
    fontSize: '0.78rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    background: 'none',
    border: 'none',
    padding: '2px 0',
    lineHeight: 1,
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {(['hy', 'en'] as Locale[]).map((locale, i) => (
        <React.Fragment key={locale}>
          {i > 0 && (
            <span style={{ color: 'var(--ink3)', fontSize: '0.7rem' }}>/</span>
          )}
          <button
            onClick={() => handleSwitch(locale)}
            style={{
              ...baseStyle,
              ...(locale === currentLocale ? activeStyle : inactiveStyle),
            }}
          >
            {locale.toUpperCase()}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no errors in `components/ui/LocaleSwitcher.tsx`

- [ ] **Step 3: Commit**

```bash
git add components/ui/LocaleSwitcher.tsx
git commit -m "feat: add LocaleSwitcher component"
```

---

## Task 7: Update `Navbar`

**Files:**
- Modify: `components/layout/Navbar.tsx`

The Navbar needs a `locale` prop and a `LocaleSwitcher`. The "local ↔ diaspora" switch link must also be locale-aware.

- [ ] **Step 1: Update `Navbar.tsx`**

Replace the full contents of `components/layout/Navbar.tsx` with:

```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { NavContent } from '@/types/content';
import type { Locale } from '@/lib/i18n';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';

interface NavbarProps {
  content: NavContent;
  page?: 'local' | 'diaspora';
  locale: Locale;
}

export default function Navbar({ content, page = 'local', locale }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = page === 'diaspora' ? content.diasporaLinks : content.localLinks;
  const ctaText = page === 'diaspora' ? content.diasporaCta : content.localCta;
  const switchHref = page === 'diaspora' ? `/${locale}` : `/${locale}/diaspora`;
  const switchText = page === 'diaspora' ? content.localLinkText : content.diasporaLinkText;

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      background: scrolled ? 'rgba(251,248,242,0.88)' : 'rgba(251,248,242,0.72)',
      borderBottom: '1px solid rgba(168,212,160,0.25)',
      boxShadow: scrolled ? '0 2px 20px rgba(45,90,39,0.08)' : 'none',
      transition: 'box-shadow 0.3s ease, background 0.3s ease',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
      }}>
        <Link href={`/${locale}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 400,
            fontSize: '1rem',
            color: 'var(--ink)',
            letterSpacing: '0.01em',
          }}>
            {content.logoMain}
            <span style={{ color: 'var(--green)', fontStyle: 'italic' }}>{content.logoHighlight}</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="nav-link"
              style={{
                fontFamily: 'var(--font-lato)',
                fontWeight: 400,
                fontSize: '0.875rem',
                color: 'var(--ink2)',
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
          <LocaleSwitcher currentLocale={locale} />

          <Link
            href={switchHref}
            style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 400,
              fontSize: '0.8rem',
              color: 'var(--ink3)',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            {switchText} →
          </Link>

          <a
            href="#join"
            className="btn-nav"
            style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'white',
              background: 'var(--green-deep)',
              padding: '9px 20px',
              borderRadius: '100px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              display: 'inline-block',
            }}
          >
            {ctaText}
          </a>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Verify the full app compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Smoke test in browser**

```bash
npm run dev
```

Open `http://localhost:3000/` — should redirect to `/hy` and render the local page.
Open `http://localhost:3000/en` — should render the local page in English (same content for now, Armenian will be filled via admin).
HY/EN buttons in Navbar should switch between `/hy` and `/en`.
"For the diaspora →" link should go to `/${locale}/diaspora`.

- [ ] **Step 4: Commit**

```bash
git add components/layout/Navbar.tsx
git commit -m "feat: add locale prop and LocaleSwitcher to Navbar"
```

---

## Task 8: Update admin content GET API

**Files:**
- Modify: `app/api/admin/content/route.ts`

- [ ] **Step 1: Update the route**

Replace the full contents of `app/api/admin/content/route.ts` with:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { requireSession } from '@/lib/session';
import { LOCALES } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

const ALLOWED_FILES = ['nav', 'local'];
const LOCALE_FREE_FILES = ['how-it-works', 'diaspora', 'farmer', 'plots', 'faq-local', 'faq-diaspora', 'settings', 'activity-log'];

export async function GET(req: NextRequest) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const file = req.nextUrl.searchParams.get('file');
  const locale = req.nextUrl.searchParams.get('locale') as Locale | null;

  if (!file) {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }

  let filePath: string;

  if (ALLOWED_FILES.includes(file)) {
    if (!locale || !LOCALES.includes(locale)) {
      return NextResponse.json({ error: 'Invalid or missing locale' }, { status: 400 });
    }
    filePath = join(process.cwd(), 'content', locale, `${file}.json`);
  } else if (LOCALE_FREE_FILES.includes(file)) {
    filePath = join(process.cwd(), 'content', `${file}.json`);
  } else {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }

  try {
    const raw = await readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/content/route.ts
git commit -m "feat: add locale param to admin content GET API"
```

---

## Task 9: Update admin save POST API

**Files:**
- Modify: `app/api/admin/save/route.ts`

- [ ] **Step 1: Update the route**

Replace the full contents of `app/api/admin/save/route.ts` with:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { revalidatePath } from 'next/cache';
import { requireSession } from '@/lib/session';
import { LOCALES } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import type { ActivityLogEntry } from '@/types/content';

const ALLOWED_FILES = ['nav', 'local'];
const LOCALE_FREE_FILES = ['how-it-works', 'diaspora', 'farmer', 'plots', 'faq-local', 'faq-diaspora', 'settings'];

/** Pages to revalidate per file+locale combo */
function getRevalidatePaths(file: string, locale?: Locale): string[] {
  if (file === 'local') return locale ? [`/${locale}`] : ['/hy', '/en'];
  if (file === 'nav') return ['/hy', '/en', '/hy/diaspora', '/en/diaspora'];
  if (file === 'diaspora') return ['/hy/diaspora', '/en/diaspora'];
  if (file === 'farmer') return ['/hy', '/en', '/hy/diaspora', '/en/diaspora'];
  if (file === 'how-it-works') return ['/hy', '/en'];
  return [];
}

export async function POST(req: NextRequest) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json() as { file: string; locale?: Locale; content: unknown; section?: string };
  const { file, locale, content, section } = body;

  if (!file) {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }
  if (!content || typeof content !== 'object') {
    return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
  }

  let filePath: string;

  if (ALLOWED_FILES.includes(file)) {
    if (!locale || !LOCALES.includes(locale)) {
      return NextResponse.json({ error: 'Invalid or missing locale' }, { status: 400 });
    }
    filePath = join(process.cwd(), 'content', locale, `${file}.json`);
  } else if (LOCALE_FREE_FILES.includes(file)) {
    filePath = join(process.cwd(), 'content', `${file}.json`);
  } else {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }

  await writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8');

  // Append to activity log
  try {
    const logPath = join(process.cwd(), 'content', 'activity-log.json');
    const raw = await readFile(logPath, 'utf-8');
    const log: ActivityLogEntry[] = JSON.parse(raw);
    log.unshift({
      timestamp: new Date().toISOString(),
      section: section ?? file,
      user: 'Admin',
    });
    await writeFile(logPath, JSON.stringify(log.slice(0, 50), null, 2), 'utf-8');
  } catch {
    // Non-fatal
  }

  const paths = getRevalidatePaths(file, locale);
  paths.forEach((p) => revalidatePath(p));

  return NextResponse.json({ success: true, revalidated: paths });
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/save/route.ts
git commit -m "feat: add locale param to admin save API, update revalidation paths"
```

---

## Task 10: Add locale selector to admin local editor

**Files:**
- Modify: `app/admin/(panel)/local/page.tsx`

The admin local editor currently calls `fetch('/api/admin/content?file=local')` and saves with `{ file: 'local', content }`. Add a locale selector at the top that controls which locale file is loaded/saved.

- [ ] **Step 1: Add locale state and selector**

In `app/admin/(panel)/local/page.tsx`:

1. Add this import at the top of the file (after existing imports):

```tsx
import type { Locale } from '@/lib/i18n';
```

2. Inside the component, add locale state after the existing `useState` calls:

```tsx
const [locale, setLocale] = useState<Locale>('en');
```

3. In the `loadContent` function (or wherever `fetch` is called), change:

```tsx
// Before:
const res = await fetch('/api/admin/content?file=local');

// After:
const res = await fetch(`/api/admin/content?file=local&locale=${locale}`);
```

4. In the save function (wherever `fetch('/api/admin/save', ...)` is called), change:

```tsx
// Before:
body: JSON.stringify({ file: 'local', content: data, section }),

// After:
body: JSON.stringify({ file: 'local', locale, content: data, section }),
```

5. Add a `useEffect` that reloads content when locale changes. Find the existing `useEffect` that loads content and add `locale` to its dependency array.

6. Add the locale selector UI — place it at the very top of the returned JSX, before the tab bar:

```tsx
{/* Locale selector */}
<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
  {(['en', 'hy'] as Locale[]).map((l) => (
    <button
      key={l}
      onClick={() => setLocale(l)}
      style={{
        padding: '6px 16px',
        borderRadius: '6px',
        border: '1px solid',
        borderColor: locale === l ? 'var(--green)' : '#D8D4C8',
        background: locale === l ? 'var(--green)' : 'white',
        color: locale === l ? 'white' : 'var(--ink)',
        fontFamily: 'Lato, sans-serif',
        fontWeight: 700,
        fontSize: '0.75rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        cursor: 'pointer',
      }}
    >
      {l.toUpperCase()}
    </button>
  ))}
</div>
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:3000/admin` and navigate to the Local editor.
Toggle between EN and HY — should load the respective content files.
Save should write to the correct locale file.

- [ ] **Step 3: Commit**

```bash
git add app/admin/\(panel\)/local/page.tsx
git commit -m "feat: add locale selector to admin local editor"
```

---

## Task 11: Add locale selector to admin navigation editor

**Files:**
- Modify: `app/admin/(panel)/navigation/page.tsx`

Same pattern as Task 10 — add locale state, update fetch/save calls, add locale selector UI.

- [ ] **Step 1: Add locale state and selector**

In `app/admin/(panel)/navigation/page.tsx`:

1. Add import:

```tsx
import type { Locale } from '@/lib/i18n';
```

2. Add locale state inside the component:

```tsx
const [locale, setLocale] = useState<Locale>('en');
```

3. Update the content fetch call:

```tsx
// Before:
const res = await fetch('/api/admin/content?file=nav');

// After:
const res = await fetch(`/api/admin/content?file=nav&locale=${locale}`);
```

4. Update the save call:

```tsx
// Before:
body: JSON.stringify({ file: 'nav', content: data, section }),

// After:
body: JSON.stringify({ file: 'nav', locale, content: data, section }),
```

5. Add `locale` to the `useEffect` dependency array that loads content.

6. Add the same locale selector UI (identical to Task 10 step 1 point 6) at the top of the returned JSX.

- [ ] **Step 2: Verify in browser**

Open `http://localhost:3000/admin` and navigate to the Navigation editor.
Toggle between EN and HY — content switches.
Save writes to the correct locale file.

- [ ] **Step 3: Commit**

```bash
git add app/admin/\(panel\)/navigation/page.tsx
git commit -m "feat: add locale selector to admin navigation editor"
```

---

## Done

After Task 11:
- `http://localhost:3000/` redirects to `/hy`
- `/hy` and `/en` render the local page in the respective locale
- Navbar has HY/EN toggle and locale-aware local↔diaspora switch link
- Admin editors for local and nav have locale selectors
- `content/hy/` files are ready to be filled in via admin
