# CTA Href Editable — Design

**Date:** 2026-05-06
**Status:** Approved (brainstorm)

## Goal

Make both navbar CTA button destinations admin-editable. Currently the text is editable via `/admin/navigation` (`localCta`, `diasporaCta`), but the href is hardcoded to `#join` in `components/layout/Navbar.tsx`.

## Decisions

- **Scope:** Both local and diaspora CTAs.
- **Storage:** Two new string fields in `content/<locale>/nav.json` — `localCtaHref`, `diasporaCtaHref`.
- **Default:** `"#join"` (preserves existing behavior for both fs fallback and any old R2 saves missing the field, since `getNavContent` merges fs over R2).
- **Validation:** None. Free-form string. Allows `#anchor`, `/path`, `https://external.com`.

## Files touched

- `content/en/nav.json` *(add 2 fields)*
- `content/hy/nav.json` *(add 2 fields)*
- `types/content.ts` — add `localCtaHref: string; diasporaCtaHref: string` to `NavContent`
- `components/layout/Navbar.tsx` — derive `ctaHref` from `page` (mirrors the existing `ctaText` derivation); replace hardcoded `href="#join"` in desktop (line 100) and mobile (line 246) renders
- `app/admin/(panel)/navigation/page.tsx` — add two `AdminInput` fields next to the existing CTA text inputs

## Test plan

1. Default (no admin edit): `#join` still scrolls to CTAFooter on home + diaspora.
2. Edit `localCtaHref` in admin to `https://forms.example.com/reserve` → save → home page CTA opens that URL.
3. Edit `diasporaCtaHref` similarly → diaspora page CTA opens that URL.
4. Mobile menu CTA also follows the new href.
5. R2-saved nav with no `*Href` fields still works (fs default merges through).
