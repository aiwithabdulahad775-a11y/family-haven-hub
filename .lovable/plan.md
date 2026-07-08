# Family Stability App — Front-End Plan

Front-end only. No backend, no auth logic, no DB, no APIs. All screens use dummy content and are fully clickable.

## Design system

- Palette: soft blue (primary), white/off-white surfaces, gold accent. Calm, minimal, Islamic-inspired without heavy ornament.
- Tokens defined in `src/styles.css` (oklch) with light + dark themes.
- Typography: Inter/Plus Jakarta for English; Noto Nastaliq Urdu for Urdu (loaded via `<link>` in `__root.tsx`).
- Rounded cards, subtle shadows, generous spacing, smooth micro-interactions using existing `tw-animate-css` + Tailwind keyframes.
- Reusable primitives via shadcn (Card, Button, Input, Dialog, Sheet, Tabs, Carousel, Badge, Skeleton, Avatar, Switch).

## Routes (TanStack file-based)

Public (shared bottom nav layout `_app.tsx`):
- `/` Home
- `/knowledge` Knowledge Base (tabs: Al-Zaujain, Al-Aulad, Parenting, Marriage, Family Relationships)
- `/knowledge/$section` section detail with article/video/PDF cards + filters
- `/case-studies` list + featured
- `/case-studies/$id` detail (also opens as modal from list)
- `/counseling` info + counselor cards + request form + confirmation
- `/profile` (portal hub)

Auth (visual only):
- `/auth/login`, `/auth/signup`, `/auth/forgot`, `/auth/otp`

User portal (under `/profile`):
- `/profile` dashboard (welcome, continue reading, recent, saved, quick actions)
- `/profile/edit`
- `/profile/saved` with tabs (articles, videos, PDFs, case studies)
- `/profile/notifications`
- `/profile/settings` (language, dark mode, privacy, help, about)

Each route sets its own `head()` metadata.

## Layout & components

- `BottomNav` (Home, Knowledge, Case Studies, Counseling, Profile) with active state + press animation. Fixed, safe-area aware (`pb-[env(safe-area-inset-bottom)]`).
- `TopAppBar` with search, language switcher, theme toggle.
- Reusable: `ArticleCard`, `VideoCard`, `PdfCard`, `CaseStudyCard`, `CounselorCard`, `SectionHeader`, `CategoryChip`, `SearchBar`, `EmptyState`, `LoadingSkeleton`, `Carousel`, `BookmarkButton` (with tap animation).

## Bilingual (EN / UR)

- Lightweight i18n via a `LanguageProvider` (React context) + `useT()` hook reading from `src/i18n/{en,ur}.ts` dictionaries. No external i18n lib needed for a prototype.
- `<html lang dir>` updated via effect when language changes; Tailwind `rtl:` variants (built into v4) mirror layout/icons.
- Urdu font applied via `[lang="ur"] body { font-family: 'Noto Nastaliq Urdu', ... }`.
- Language switcher persists in `localStorage` (read inside `useEffect` to avoid hydration mismatch).
- All dummy content authored in both languages.

## Dark mode

- Class-based via `.dark` on `<html>`. Toggle in TopAppBar + Settings. Persist in `localStorage` (effect-guarded).

## Accessibility & responsive

- Semantic landmarks, single `<main>` in layout, focus-visible rings, `aria-label` on icon buttons, 44px tap targets, `h-dvh` for full-height, skip link.
- Mobile-first; grid breakpoints for tablet/desktop; foldable/split handled by fluid grid + `min-w-0` on flex text containers.
- Empty states, skeleton loaders, long-title truncation, missing-image fallback component.

## Animations

- Fade-in/scale-in on route mount, hover-scale on cards, bookmark pop, modal scale-in, carousel slide, button press (`active:scale-95`).

## Out of scope (explicit)

- No Lovable Cloud, no server functions, no auth backend, no database, no real search — all forms/search are visual with toast feedback.

## Deliverable

A polished, fully navigable prototype where every screen listed above renders with realistic dummy content in both English and Urdu, in both light and dark themes.
