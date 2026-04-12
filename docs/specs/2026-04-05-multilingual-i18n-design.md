# Multilingual (i18n) — Design Spec

**Date:** 2026-04-05  
**Status:** Approved

---

## Overview

Add bilingual support (Armenian `hy` / English `en`) to both the local page and the upcoming diaspora page. Language is encoded in the URL. A toggle button in the Navbar switches between locales. Defaults: local → `hy`, diaspora → `en`.

---

## 1. Routing

### URL structure

| URL | Page | Locale |
|-----|------|--------|
| `/hy` | Local | Armenian |
| `/en` | Local | English |
| `/hy/diaspora` | Diaspora | Armenian |
| `/en/diaspora` | Diaspora | English |

### Redirects (middleware)

- `/` → `/hy`
- `/diaspora` → `/en/diaspora`
- Any unknown locale segment → 404

### App directory restructure

```
app/
  [locale]/
    layout.tsx        ← sets <html lang={locale}>
    page.tsx          ← local page (moved from app/page.tsx)
    diaspora/
      page.tsx        ← diaspora page (new, built separately)
```

Supported locales: `['hy', 'en']` — defined in a single `lib/i18n.ts` constant.

---

## 2. Content files

Content moves from flat `content/` into locale subfolders:

```
content/
  en/
    local.json        ← current local.json (English, unchanged)
    nav.json          ← current nav.json (English, unchanged)
  hy/
    local.json        ← Armenian translation (filled via admin)
    nav.json          ← Armenian translation (filled via admin)
```

Armenian JSON files are initialized as copies of the English files (same keys, same placeholder values). The admin fills in the Armenian translations.

### `lib/content.ts` changes

All content functions accept a `locale` parameter:

```ts
getLocalContent(locale: 'hy' | 'en'): Promise<LocalContent>
getNavContent(locale: 'hy' | 'en'): Promise<NavContent>
```

Reads from `content/{locale}/{file}.json`.

---

## 3. Language toggle (Navbar)

A `LocaleSwitcher` component is added to the Navbar. It:

- Shows `HY / EN` with the active locale highlighted
- On click, calls `switchLocale(pathname, newLocale)` utility and navigates via `router.push`
- `switchLocale` replaces the first path segment: `/hy/diaspora` → `/en/diaspora`

No cookie or localStorage — locale lives entirely in the URL.

---

## 4. Admin panel

### Locale selector

A `HY / EN` toggle is added to the top of each admin editor page (local, nav, etc.). It controls which locale's file is loaded and saved.

### API changes

Both `/api/admin/content` (GET) and `/api/admin/save` (POST) gain a `locale` parameter:

- **GET:** `?file=local&locale=en` → reads `content/en/local.json`
- **POST body:** `{ file: 'local', locale: 'hy', content: {...} }` → writes `content/hy/local.json`

`ALLOWED_FILES` and `ALLOWED_LOCALES` are validated server-side. Invalid locale → 400.

### Revalidation

`REVALIDATE_MAP` updated to include locale-aware paths:

```ts
local: ['/hy', '/en'],
nav:   ['/hy', '/en', '/hy/diaspora', '/en/diaspora'],
```

---

## 5. What is NOT in scope

- Diaspora page content/sections (separate task, built after this)
- Language detection from browser `Accept-Language` header
- Any language other than `hy` and `en`
