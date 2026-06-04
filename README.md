# Hyeland — Project Overview

**Hye** (հայ, Armenian) + **land** — but also **Highland** = Armenian Highlands (Հայկական լեռնաշխարհ).
Tagline: *"Own a piece of the Highland"*

## What it is

Landing page for Hyeland — share-based access to a real organic farm in Armenia. Pre-launch validation phase; pilot opens **Spring 2027** in the **Kotayk region**. See `LANDING_PIVOT_PLAN.md` and `docs/PRICING_MODEL_PIVOT.md` for the current model and roadmap.

**Dev server:** `http://localhost:3000`

---

## Pages

| URL | Description |
|-----|-------------|
| `/` | Main landing page (local Armenian audience) |
| `/admin` | Admin panel dashboard |
| `/admin/login` | Admin login |

---

## Admin Panel

### How to open

Go to **`http://localhost:3000/admin`** — it will redirect to login automatically.

### Credentials

Stored in `.env.local` (`ADMIN_USERNAME` / `ADMIN_PASSWORD`). See `docs/ADMIN_PANEL.md` → "Environment Variables" for setup. Local credentials are not committed.

### Admin sections

| Section | What you can edit |
|---------|-------------------|
| **Waitlist** | Spring 2027 pilot signups — view, approve/decline, delete, CSV export |
| **Navigation** | Logo, nav links, CTA buttons |
| **Local Page** | Hero, Problem, FAQ, How it Works, Dashboard Showcase, and all other sections |
| **Diaspora Page** | Diaspora version Hero, Testimonials, How it works |
| **Settings** | Pilot status, social links |

---

## Content files

| File | Description |
|------|-------------|
| `content/local.json` | All text content for the local landing page |
| `content/activity-log.json` | Log of admin edits |

---

## Running the project

```bash
npm run dev     # dev server → localhost:3000
npm run build   # production build
npm run start   # production server
```
