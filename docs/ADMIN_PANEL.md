# Own a Piece of Armenia — Admin Panel

## Overview

The admin panel lives at `/admin` within the same Next.js project. It allows non-technical staff to edit all content on both landing pages without touching code. Authentication is session-based (JWT). All content is stored as JSON files in `/content/` and read by landing pages at request time via ISR.

---

## Tech Decisions

| Concern | Solution | Reason |
|---|---|---|
| Auth | NextAuth.js v4, Credentials provider | No database needed for v1 — username + password in env |
| Session | JWT, 8-hour expiry | Stateless, no Redis/DB required |
| Route protection | `proxy.ts` (Next.js 16 middleware) using `withAuth` | Redirects all `/admin/*` to `/admin/login` when unauthenticated |
| Content storage | JSON files in `/content/` | Zero infrastructure, version-controllable, instant reads |
| Content reads | `lib/content.ts` typed helpers + ISR (`revalidate = 60`) | Pages rebuild within 60s of a save; no full redeploy needed |
| Rich text | Plain textarea + markdown (future: react-markdown preview) | Avoids heavy editors; staff only needs basic formatting |
| Image uploads | `POST /api/admin/upload` → `/public/uploads/` | Simple file storage; swap for Vercel Blob in production |
| Drag-to-reorder | `@dnd-kit/core` + `@dnd-kit/sortable` | Lightweight, accessible, headless |
| Revalidation | `revalidatePath()` called in `/api/admin/save` | Triggers ISR for affected pages immediately after save |

---

## Environment Variables

```bash
# .env.local
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000   # change to prod URL in deployment
```

Generate a secret:
```bash
openssl rand -base64 32
```

---

## File Structure

```
/
├── content/                  ← All editable content (JSON)
│   ├── nav.json
│   ├── local.json
│   ├── diaspora.json
│   ├── farmer.json
│   ├── plots.json
│   ├── faq-local.json
│   ├── faq-diaspora.json
│   ├── settings.json
│   └── activity-log.json
│
├── types/
│   └── content.ts            ← TypeScript interfaces for all JSON shapes
│
├── lib/
│   ├── auth.ts               ← NextAuth config (authOptions)
│   ├── session.ts            ← getSession() / requireSession() helpers
│   └── content.ts            ← Typed read helpers for every JSON file
│
├── middleware.ts              ← (legacy, kept for reference)
├── proxy.ts                  ← Next.js 16 route protection (replaces middleware.ts)
│
├── app/
│   ├── page.tsx              ← Local residents landing page (reads nav.json)
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── admin/
│   │       ├── save/route.ts
│   │       └── content/route.ts
│   └── admin/
│       ├── (auth)/
│       │   └── login/page.tsx        ← No sidebar, full-screen login
│       └── (panel)/
│           ├── layout.tsx            ← Sidebar shell
│           ├── page.tsx              ← Dashboard
│           └── navigation/page.tsx  ← Navigation editor ✅
│
└── components/
    └── admin/
        ├── Sidebar.tsx
        ├── AdminCard.tsx
        ├── AdminInput.tsx
        ├── AdminSaveButton.tsx
        ├── AdminTextarea.tsx         ← planned
        ├── AdminSelect.tsx           ← planned
        ├── AdminToggle.tsx           ← planned
        ├── AdminImageUpload.tsx      ← planned
        ├── AdminAccordion.tsx        ← planned
        ├── AdminTable.tsx            ← planned
        ├── AdminBadge.tsx            ← planned
        └── ConfirmModal.tsx          ← planned
```

---

## Content JSON Schemas

### `content/nav.json`

```json
{
  "logoMain": "Own a Piece of",
  "logoHighlight": "Armenia",
  "localCta": "Join the pre-pilot",
  "diasporaCta": "Get your plot",
  "diasporaLinkText": "For the diaspora",
  "localLinkText": "For those living in Armenia",
  "localLinks": [
    { "id": "ll-1", "label": "How it works", "href": "#how-it-works" }
  ],
  "diasporaLinks": [
    { "id": "dl-1", "label": "How it works", "href": "#how-it-works" }
  ]
}
```

### `content/local.json`

```json
{
  "hero": {
    "tag": "For those living in Armenia",
    "h1Line1": "You know exactly",
    "h1Line2": "what you're eating.",
    "h1Line3": "You watched it grow.",
    "subtitle": "Own a small, real farming plot...",
    "cta1": "Join the pre-pilot",
    "cta2": "See how it works",
    "stat1Value": "100%", "stat1Label": "Traceable",
    "stat2Value": "Weekly", "stat2Label": "Deliveries",
    "stat3Value": "Real", "stat3Label": "Your plot"
  },
  "problem": {
    "tag": "The problem",
    "h2": "Most Armenians buy their vegetables without knowing anything about them.",
    "intro": "The supermarket shelf tells you nothing...",
    "cards": [
      { "veg": "tomato", "title": "You don't know where it came from.", "body": "..." },
      { "veg": "cucumber", "title": "Pesticides you can't taste or see.", "body": "..." },
      { "veg": "greens", "title": "Picked before it was ready.", "body": "..." }
    ]
  },
  "howItWorks": {
    "tag": "How it works",
    "h2": "Simple from day one.",
    "steps": [
      { "number": "01", "title": "Choose your plot", "description": "..." },
      { "number": "02", "title": "A farmer takes care of it", "description": "..." },
      { "number": "03", "title": "Track everything", "description": "..." },
      { "number": "04", "title": "Receive weekly deliveries", "description": "..." }
    ]
  },
  "health": {
    "tag": "Your health",
    "h2": "You'll eat like your grandparents did.",
    "cards": [
      { "icon": "🌿", "title": "No pesticides", "body": "..." },
      { "icon": "🌱", "title": "Harvested fresh", "body": "..." },
      { "icon": "🍅", "title": "Varieties lost to supermarkets", "body": "..." },
      { "icon": "🍂", "title": "Seasonal eating", "body": "..." }
    ]
  },
  "convenience": {
    "tag": "Convenience",
    "h2": "Fits your life in Yerevan.",
    "intro": "...",
    "items": [
      { "icon": "📦", "title": "No market trips", "body": "..." },
      { "icon": "📅", "title": "Predictable weekly delivery", "body": "..." },
      { "icon": "⏱", "title": "Adjust delivery timing", "body": "..." },
      { "icon": "⏸", "title": "Pause anytime", "body": "..." }
    ]
  },
  "progress": {
    "tag": "Your progress",
    "h2": "Your plot grows with you.",
    "subtitle": "Start small, expand as you get comfortable.",
    "years": [
      { "label": "Year 1", "size": "2 m²", "tier": "Starter", "features": ["Tomatoes", "Cucumbers", "Herbs", "Weekly delivery"] },
      { "label": "Year 2", "size": "6 m²", "tier": "Grower", "features": ["+ Carrots", "+ Peppers", "+ Eggplant", "Bi-weekly options"] },
      { "label": "Year 3", "size": "15 m²", "tier": "Farmer", "features": ["Seasonal variety", "Winter storage crops", "Custom schedule", "Priority farmer access"] }
    ]
  },
  "about": {
    "tag": "About",
    "founderName": "Alex",
    "founderRole": "Founder",
    "paragraph1": "...",
    "paragraph2": "...",
    "paragraph3": "...",
    "trustLabel": "Why trust me",
    "trustText": "..."
  },
  "ctaFooter": {
    "h2Line1": "Your plot is waiting.",
    "h2Line2": "",
    "subtitle": "Join the pre-pilot. Limited plots available.",
    "buttonText": "Join the pre-pilot",
    "buttonHref": "mailto:hello@armenia.farm"
  }
}
```

### `content/diaspora.json`

```json
{
  "hero": {
    "tag": "For Armenians abroad",
    "h1Line1": "Your roots.",
    "h1Line2": "Your land.",
    "h1Line3": "Your harvest.",
    "tagline": "Stay connected to Armenia — through the soil.",
    "subtitle": "Own a real plot of Armenian farmland...",
    "cta1": "Get your plot",
    "cta2": "See how it works"
  },
  "emotional": {
    "tag": "Why this matters",
    "h2": "You left. But Armenia didn't leave you.",
    "body1": "...",
    "body2": "...",
    "pullQuote": "..."
  },
  "testimonials": [
    { "quote": "...", "attribution": "Ani, Los Angeles" },
    { "quote": "...", "attribution": "Vartan, Paris" },
    { "quote": "...", "attribution": "Narine, Moscow" }
  ],
  "howItWorks": {
    "tag": "How it works",
    "h2": "Simple, wherever you are.",
    "steps": [
      { "number": "01", "title": "Choose your plot", "description": "..." },
      { "number": "02", "title": "We assign your farmer", "description": "..." },
      { "number": "03", "title": "Watch it grow remotely", "description": "..." },
      { "number": "04", "title": "Family in Armenia gets deliveries", "description": "..." }
    ]
  },
  "familyLegacy": {
    "tag": "Family legacy",
    "h2": "Give your parents something that lasts.",
    "body1": "...",
    "body2": "..."
  },
  "harvestOptions": [
    { "icon": "🇦🇲", "title": "Family delivery", "body": "...", "label": "Most popular" },
    { "icon": "✈️", "title": "Visit & harvest", "body": "...", "label": "" },
    { "icon": "🎁", "title": "Gift a plot", "body": "...", "label": "New" }
  ],
  "future": {
    "tag": "Coming soon",
    "h2": "This is just the beginning.",
    "body": "...",
    "features": [
      { "title": "Live plot camera", "body": "..." },
      { "title": "Seasonal video updates", "body": "..." },
      { "title": "Ancestral region plots", "body": "..." }
    ]
  },
  "gift": {
    "tag": "Gift a plot",
    "h2": "The most Armenian gift you can give.",
    "body": "...",
    "tagExample": "A plot of Armenian earth — for Grandma Anahit"
  },
  "ctaFooter": {
    "h2Line1": "Your land is waiting.",
    "h2Line2": "It always has been.",
    "subtitle": "Join the diaspora pre-pilot.",
    "buttonText": "Get your plot",
    "buttonHref": "mailto:hello@armenia.farm"
  }
}
```

### `content/farmer.json`

```json
{
  "name": "Aram Mkrtchyan",
  "region": "Armavir",
  "years": 18,
  "quote": "Every plot I tend, I treat like my own family's land.",
  "bio": "Aram has been farming the Ararat valley for nearly two decades...",
  "photoUrl": "/uploads/farmer.jpg"
}
```

### `content/plots.json`

```json
[
  {
    "id": "plot-7",
    "name": "Plot 7 — Armavir Valley",
    "region": "Armavir",
    "sizeM2": 2,
    "status": "available",
    "crops": ["Tomatoes", "Cucumbers"],
    "season": "Summer",
    "estYield": "3–5 kg"
  }
]
```

### `content/faq-local.json` and `content/faq-diaspora.json`

```json
[
  {
    "id": "faq-1",
    "question": "How big is 2m²?",
    "answer": "About the size of a large dining table..."
  }
]
```

### `content/settings.json`

```json
{
  "siteName": "Own a Piece of Armenia",
  "contactEmail": "hello@armenia.farm",
  "tagline": "You watched it grow.",
  "pilotStatus": "open",
  "social": {
    "telegram": "",
    "instagram": "",
    "newsletter": ""
  },
  "dashboardDemo": {
    "plotName": "Plot 7 — Armavir",
    "crop1": "Tomatoes",
    "crop2": "Cucumbers",
    "plotSize": "2 m²",
    "seasonWeek": "Week 14",
    "estimatedYield": "~4 kg",
    "progressLabel": "Flowering",
    "progressPercent": 62,
    "nextDeliveryDay": "Thursday",
    "nextDeliveryAmount": "~1.5 kg tomatoes"
  }
}
```

### `content/activity-log.json`

```json
[
  {
    "timestamp": "2026-03-28T12:00:00.000Z",
    "section": "Navigation",
    "user": "Admin"
  }
]
```

---

## API Routes

### `GET /api/admin/content?file={name}`

Returns the parsed JSON of any allowed content file.

**Allowed files:** `nav`, `local`, `diaspora`, `farmer`, `plots`, `faq-local`, `faq-diaspora`, `settings`, `activity-log`

**Auth:** Session required. Returns 401 if not authenticated.

---

### `POST /api/admin/save`

Saves content to a JSON file and triggers ISR revalidation.

**Body:**
```json
{
  "file": "nav",
  "content": { ... },
  "section": "Navigation"
}
```

**Response:**
```json
{ "success": true, "revalidated": ["/", "/diaspora"] }
```

**Side effects:**
- Writes to `/content/{file}.json`
- Appends to `activity-log.json` (capped at 50 entries)
- Calls `revalidatePath()` for all affected pages

---

### `POST /api/admin/upload`

Accepts a multipart image upload, saves to `/public/uploads/`.

**Body:** `multipart/form-data` with `file` field (jpg / png / webp, max 5 MB)

**Response:**
```json
{ "url": "/uploads/farmer.jpg" }
```

*(Not yet implemented — planned for Farmer Profile page)*

---

## Admin Pages

| Route | Status | Description |
|---|---|---|
| `/admin` | ✅ Done | Dashboard with quick links |
| `/admin/login` | ✅ Done | Login page |
| `/admin/navigation` | ✅ Done | Logo, CTA buttons, drag-to-reorder nav links |
| `/admin/local` | 🔜 Planned | All local residents page content |
| `/admin/diaspora` | 🔜 Planned | All diaspora page content |
| `/admin/farmer` | 🔜 Planned | Farmer profile + photo upload |
| `/admin/plots` | 🔜 Planned | Plots table + inline editing |
| `/admin/faq` | 🔜 Planned | FAQ accordion editor (tabbed) |
| `/admin/settings` | 🔜 Planned | Pilot status, social links, demo data |

---

## How Content Flows

```
Admin edits form
       ↓
POST /api/admin/save
       ↓
Writes /content/{file}.json
       ↓
revalidatePath('/') called
       ↓
Next.js marks the page stale
       ↓
Next request to '/' triggers rebuild
       ↓
lib/content.ts reads updated JSON
       ↓
Component receives new props → renders updated content
```

In **dev mode**: changes appear on the next page refresh immediately.
In **production** (Vercel): ISR kicks in within 60 seconds (`revalidate = 60`).

---

## How to Add a New Content Field (End-to-End)

Example: adding a "hero badge text" field to the local page.

**Step 1 — Add to JSON**

In `content/local.json`, add the field:
```json
{
  "hero": {
    "badgeText": "Now accepting pre-pilot signups"
  }
}
```

**Step 2 — Add TypeScript type**

In `types/content.ts`, update the `LocalHeroContent` interface:
```typescript
export interface LocalHeroContent {
  // ... existing fields
  badgeText: string;
}
```

**Step 3 — Read it in the component**

The component already receives content as props. Just use the new field:
```tsx
<span>{content.hero.badgeText}</span>
```

**Step 4 — Add the form field in admin**

In `app/admin/(panel)/local/page.tsx`, inside the Hero accordion section:
```tsx
<AdminInput
  label="Badge text"
  value={content.hero.badgeText}
  onChange={(e) => setHero({ ...hero, badgeText: e.target.value })}
/>
```

That's it. No config, no migrations, no redeploy needed.

---

## Shared Admin UI Components

| Component | File | Purpose |
|---|---|---|
| `AdminCard` | `components/admin/AdminCard.tsx` | White card with optional title + subtitle |
| `AdminInput` | `components/admin/AdminInput.tsx` | Labeled input with focus ring + error state |
| `AdminSaveButton` | `components/admin/AdminSaveButton.tsx` | Save with loading spinner + "Saved ✓" flash |
| `AdminTextarea` | planned | Labeled textarea with char counter |
| `AdminSelect` | planned | Labeled select dropdown |
| `AdminToggle` | planned | Labeled toggle switch |
| `AdminImageUpload` | planned | Drag & drop image zone with preview |
| `AdminAccordion` | planned | Collapsible section for grouping fields |
| `AdminTable` | planned | Generic table with edit/delete per row |
| `AdminBadge` | planned | Status badge: green/red/amber |
| `ConfirmModal` | planned | Delete confirmation modal |

---

## Security Notes

- All `/api/admin/*` routes call `requireSession()` — returns 401 if no valid JWT
- All `/admin/*` pages are protected by `proxy.ts` before reaching the component
- Allowed file list is hardcoded in both the save and content API routes — no arbitrary file writes/reads
- Image uploads (when implemented) should validate MIME type and file size server-side
- `NEXTAUTH_SECRET` must be a cryptographically random string in production
- Admin credentials (`ADMIN_USERNAME`, `ADMIN_PASSWORD`) must be set in environment — never committed to git

---

## Production Deployment (Vercel)

1. Set all env vars in Vercel dashboard:
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
2. The `/content/` directory is read-only on Vercel's filesystem — **switch to Vercel Blob or a database before deploying**
3. `/public/uploads/` is also ephemeral on Vercel — use Vercel Blob for image uploads
4. ISR works natively on Vercel — `revalidate = 60` requires no extra config
