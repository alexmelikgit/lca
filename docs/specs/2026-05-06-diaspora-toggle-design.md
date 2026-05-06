# Diaspora Toggle — Design

**Date:** 2026-05-06
**Status:** Approved (brainstorm)

## Goal

Single admin button that disables the diaspora page (routing) and the navbar switch link in one click, applied to both locales (en, hy).

## Decisions

- **Where:** Toggle card on top of `/admin` Dashboard.
- **Off behavior:** `/[locale]/diaspora` returns Next.js `notFound()` (404).
- **Scope:** One global flag for both locales (no per-locale toggle).
- **Default:** `diasporaEnabled: true`.
- **Storage:** Locale-free `content/settings.json`, R2-overridable, filesystem fallback. Reuses existing save infrastructure (`'settings'` already in `LOCALE_FREE_FILES` in `app/api/admin/save/route.ts`).

## Architecture

### 1. Data model & storage

New file `content/settings.json`:
```json
{ "diasporaEnabled": true }
```

New type in `types/content.ts`:
```ts
export interface SiteSettings {
  diasporaEnabled: boolean;
}
```

R2 key: `content/settings.json`. Filesystem provides defaults; R2 overrides (matches existing pattern for `how-it-works.json`).

### 2. Backend reading

New getter in `lib/content.ts`:
```ts
export async function getSiteSettings(): Promise<SiteSettings> {
  const fsPath = join(CONTENT_DIR, 'settings.json');
  const fsData = JSON.parse(await readFile(fsPath, 'utf-8')) as SiteSettings;
  try {
    const text = await r2GetText('content/settings.json');
    if (text) return { ...fsData, ...JSON.parse(text) };
  } catch { /* fallthrough */ }
  return fsData;
}
```

Enforcement in `app/[locale]/diaspora/page.tsx`:
```ts
const settings = await getSiteSettings();
if (!settings.diasporaEnabled) notFound();
```

### 3. Navbar

`components/layout/Navbar.tsx` receives a new prop `diasporaEnabled: boolean`.

The switch link (using `localLinkText` / `diasporaLinkText`) is rendered only when `diasporaEnabled === true`. Applies to both desktop and mobile views.

Callers:
- `app/[locale]/page.tsx` — fetch settings, pass to Navbar.
- `app/[locale]/diaspora/page.tsx` — already fetches settings (Step 2), passes to Navbar. (Diaspora page is 404 when disabled, so Navbar there is unreachable when off — but pass anyway for consistency.)

### 4. Admin Dashboard toggle UI

`app/admin/(panel)/page.tsx` becomes async (already a server component), fetches settings via `getSiteSettings()`, passes to a new client component:

`components/admin/DiasporaToggle.tsx` — toggle card placed above the Quick Links grid:

```
┌─────────────────────────────────────────────────────┐
│  Diaspora page                                      │
│  Routing + navbar link toggle for both locales      │
│                                            [ON / OFF]│
└─────────────────────────────────────────────────────┘
```

Style consistent with `AdminCard`. On click:
1. Optimistic UI update.
2. POST `/api/admin/save` with body:
   ```json
   {
     "file": "settings",
     "content": { "diasporaEnabled": false },
     "section": "site-settings"
   }
   ```
3. Show loading / success / error feedback.
4. `router.refresh()` after success.

### 5. Save & revalidation

`app/api/admin/save/route.ts` — extend `getRevalidatePaths()`:
```ts
if (file === 'settings') return ['/hy', '/en', '/hy/diaspora', '/en/diaspora'];
```

This rebuilds:
- Home pages (so navbar switch link disappears / reappears).
- Diaspora pages (so 404 takes effect / lifts).

## Edge cases

| Case | Handling |
|------|----------|
| R2 unavailable | Filesystem `settings.json` provides default `true` → no breakage. |
| Page already indexed by Google when toggled off | 404 is acceptable; Google de-indexes over time. |
| Locale switcher used while on diaspora page | N/A — page is 404 when disabled. |
| Home page hash-links pointing at diaspora-only sections | Browser default no-op (silent); not a regression. |

## Files touched

- `content/settings.json` *(new)*
- `types/content.ts` — add `SiteSettings`
- `lib/content.ts` — add `getSiteSettings()`
- `app/[locale]/page.tsx` — fetch settings, pass to Navbar
- `app/[locale]/diaspora/page.tsx` — fetch settings, `notFound()` when off, pass to Navbar
- `components/layout/Navbar.tsx` — new `diasporaEnabled` prop, conditional switch link
- `components/admin/DiasporaToggle.tsx` *(new client component)*
- `app/admin/(panel)/page.tsx` — fetch settings, render toggle
- `app/api/admin/save/route.ts` — add settings revalidation paths

## Test plan

1. Default (ON): `/en/diaspora`, `/hy/diaspora` render; navbar link visible on both home pages.
2. Toggle OFF in admin: both diaspora URLs return 404; navbar link disappears on both home pages (desktop + mobile).
3. Toggle back ON: everything returns to normal.
4. Save persists across reloads (R2 round-trip).
5. With R2 disabled / unreachable: site falls back to filesystem default (ON).
