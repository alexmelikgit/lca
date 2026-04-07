# Diaspora Admin Page — Design Spec

**Date:** 2026-04-07  
**Status:** Approved  
**Approach:** Copy local/page.tsx pattern, adapt for diaspora, backport improvements to local.

---

## 1. New File

`app/admin/(panel)/diaspora/page.tsx`

Single client component, mirrors the structure of `app/admin/(panel)/local/page.tsx`.

---

## 2. Tabs (15 total)

| Tab ID | Label | Content Key | Visibility Key |
|---|---|---|---|
| `hero` | Hero | `hero` | `hero` |
| `problem` | Problem | `problem` | `problem` |
| `howItWorks` | How It Works | `howItWorks` | `howItWorks` |
| `harvestOptions` | Harvest Options | `harvestOptions` | `harvestOptions` |
| `dashboard` | Dashboard | `dashboardShowcase` | `dashboardShowcase` |
| `ownership` | Ownership | `ownership` | `ownership` |
| `gift` | Gift | `giftMechanic` | `giftMechanic` |
| `phaseTwo` | Phase Two | `phaseTwo` | `phaseTwo` |
| `progress` | Progress | `progress` | `progress` |
| `farmer` | Farmer | `farmer` | `farmer` |
| `seasonal` | Seasonal | `seasonal` | `seasonal` |
| `trust` | Trust | `trust` | `trust` |
| `faq` | FAQ | `faq` | `faq` |
| `about` | About | `about` | `about` |
| `cta` | CTA | `ctaFooter` | `ctaFooter` |

---

## 3. Tab Navigation

**Problem with current local/page.tsx:** 13+ tabs overflow on smaller screens with no visual affordance.

**Solution:** Scrollable tab strip.
- `overflow-x: auto`, `white-space: nowrap`, `-webkit-overflow-scrolling: touch`
- Hide scrollbar visually (`::-webkit-scrollbar { display: none }`)
- Active tab: gold (`#C49A3C`) bottom border `2px solid`, bold font
- Fade indicators on left/right edges when overflow exists (optional enhancement)

Apply same fix to `local/page.tsx`.

---

## 4. Unsaved Changes Warning

**New state:** `const [isDirty, setIsDirty] = useState(false)`

- Set `isDirty = true` on any content mutation (`update()` / `toggleVisibility()`)
- Set `isDirty = false` after successful save and after locale switch (content reloads)
- Yellow sticky banner below tab bar when `isDirty`:
  ```
  ⚠ You have unsaved changes   [Save now →]
  ```
  Style: `background: rgba(196,154,60,0.1)`, `border: 1px solid rgba(196,154,60,0.3)`, `color: #8B6914`
- `beforeunload` event listener that fires when `isDirty` is true, showing browser's native "Leave page?" dialog

Apply same to `local/page.tsx`.

---

## 5. Array Fields — Add / Remove

### `giftMechanic.features: string[]`
- Render each item as a row: `[text input ─────────────────] [× remove]`
- `[+ Add feature]` button below the list
- Max items: none enforced

### `harvestOptions.options: HarvestOption[]`
Each option has: `id`, `icon`, `title`, `description`
- Render each as an `AdminCard` with fields: icon picker, title input, description textarea
- `[+ Add option]` button — appends `{ id: uuid, icon: '🌾', title: '', description: '' }`
- `[× Remove]` button on each card
- `id` generated client-side with `crypto.randomUUID()`

### `ownership.items: OwnershipItem[]`
Each item has: `id`, `title`, `description`
- Same pattern as above (AdminCard per item, add/remove)
- `[+ Add item]` button — appends `{ id: uuid, title: '', description: '' }`

---

## 6. Emoji Picker for `harvestOptions.options[].icon`

**No external library.** Inline `EmojiPicker` component defined in the same file.

Preset grid of ~30 relevant emojis:
```
🌾 🌿 🍅 🥕 🫙 📦 ✈️ 🎁 🏔️ 🌱 🍇 🌻 🥦 🍋 🫐 🍓
🧅 🌽 🥒 🧄 🍎 🥝 🍊 🫒 🌰 🫚 🧺 🚜 🌍 💌
```

**UI:** Small inline popover (absolute positioned) — click on the current icon to open, click an emoji to select and close. Also a manual text input for custom characters. Closes on outside click (`useEffect` + `document.addEventListener`).

---

## 7. Preview Button

In `app/admin/(panel)/layout.tsx`, add a "View diaspora ↗" link next to the existing "View site ↗":

```tsx
<a href="/en/diaspora" target="_blank" rel="noopener noreferrer">
  View diaspora ↗
</a>
```

Both links always visible in the topbar. Simple, no routing logic needed.

---

## 8. Data Flow

```
Mount / locale change
  → GET /api/admin/content?file=diaspora&locale={locale}
  → setContent(data), setIsDirty(false)

User edits
  → update(section, value) or toggleVisibility(key)
  → setIsDirty(true)

Save
  → POST /api/admin/save { file: 'diaspora', locale, content, section: 'Diaspora Page' }
  → on success: setIsDirty(false)
```

Same API routes as local — no backend changes needed.

---

## 9. Shared Helpers (inline, same file)

Reuse the same inline helper pattern as local/page.tsx:
- `textareaStyle`, `labelStyle` — copy as-is
- `VisibilityBanner` — copy as-is
- `TextareaField` — copy as-is
- `EmojiPicker` — new, diaspora-only (does not need to be in local)

No extraction to separate files — keeps each admin page self-contained.

---

## 10. Backport to `local/page.tsx`

Two changes only:
1. Scrollable tab strip (section 3)
2. Unsaved changes warning — `isDirty` state + yellow banner + `beforeunload` (section 4)

No structural changes to local/page.tsx beyond these.

---

## 11. Files Changed

| File | Action |
|---|---|
| `app/admin/(panel)/diaspora/page.tsx` | **Create** |
| `app/admin/(panel)/local/page.tsx` | **Update** — scrollable tabs + unsaved warning |
| `app/admin/(panel)/layout.tsx` | **Update** — add "View diaspora ↗" link |

No new components, no new API routes, no type changes needed.
