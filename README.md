# Hyeland — Project Overview

**Hye** (հայ, Armenian) + **land** — but also **Highland** = Armenian Highlands (Հայկական լեռնաշխարհ).
Tagline: *"Own a piece of the Highland"*

## What it is

Landing page for Hyeland — farming plots outside Yerevan for local residents, with weekly produce delivery. Pre-pilot, 20 plots, Armavir region.

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
| **Navigation** | Logo, nav links, CTA buttons |
| **Local Page** | Hero, Problem, FAQ, How it Works, Dashboard Showcase, and all other sections |
| **Diaspora Page** | Diaspora version Hero, Testimonials, How it works |
| **Farmer Profile** | Name, photo, quote, region |
| **Available Plots** | Plot availability |
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
