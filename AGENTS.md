# Vettonia — Agent Guide

## Stack
- **React 19 + Vite 8 + Tailwind 4 + TypeScript 6**
- Routing: `react-router-dom` v7 (BrowserRouter)
- Animation: `framer-motion` + custom CSS keyframes
- Backend: Supabase (primary) with localStorage fallback
- Auth: album code (`VITE_ALBUM_CODE`) or pass number (`VET-XXXXXX`)
- PWA: `vite-plugin-pwa` (Workbox `generateSW`)
- Map: `leaflet` + `react-leaflet` with OpenStreetMap tiles

## Commands
```sh
npm run dev        # Vite dev server
npm run build      # Production build (renames .webmanifest → .json post-build)
npm run lint       # ESLint (JS/JSX only — TS not linted in flat config)
npx tsc --noEmit   # Manual typecheck (not in npm scripts)
```

**Verification order**: `npx tsc --noEmit` → `npm run lint` → `npm run build`

## Env vars
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — Supabase credentials (gitignored)
- `VITE_ALBUM_CODE` — public album access code (default: `VETTONIA`)
- `VITE_FORMSPREE_ID` — contact form Formspree form ID
- `VITE_FORMSPREE_NEWSLETTER` — newsletter Formspree form ID
- `VITE_FORMSPREE_NOTIFY` — photo upload notification Formspree form ID
- `VITE_SITE_URL` — canonical site URL for SEO/meta tags

## Architecture

```
src/
├── pages/          # Route-level components, one per route
│   ├── Access/     # Split into index.tsx + hooks.ts + components/
│   ├── admin/      # Dashboard, GalleryManage, LineupManage, Alerts
│   └── Gallery.tsx, Upload.tsx, ...
├── services/       # Data layer — all async, Supabase first, localStorage fallback
│   ├── album.ts    # Photos, likes, auth, photo status (pending/approved/rejected)
│   ├── lineup.ts   # CRUD de lineup, publish/draft, seed from static data
│   ├── pass.ts     # Pass info, photo, theme
│   ├── messages.ts # Wall messages
│   ├── stats.ts    # Aggregate stats
│   ├── alerts.ts   # User notifications
│   └── index.ts    # Barrel exports
├── lib/
│   ├── storage.ts  # Re-exports from services/ (backward compat)
│   ├── persistence.ts  # localStorage wrapper with 'vettonia_' prefix
│   └── image.ts    # compressImage() (canvas resize to 1920px JPEG 0.82)
├── components/     # Shared UI components (HamburgerNav, Solids, Reveal, Countdown, NewsletterForm, GalleryModal, etc.)
├── sections/       # Page sections (Footer, etc.)
├── types/          # Shared TypeScript interfaces
└── data/           # Static data only (lineup.ts is seed data, no logic)
```

## Admin Panel

### LineupManage (CRUD real de lineup)
- Uses `services/lineup.ts` for all operations (Supabase first, localStorage fallback)
- `getAllArtists()` — returns all artists with `published` status flag
- `upsertArtist()` — create or update (localStorage overrides when offline)
- `deleteArtist()` — remove from Supabase / localStorage
- `publishArtist(slug, bool)` / `publishAllArtists()` — toggle published flag
- `seedFromStatic()` — copies static `data/lineup.ts` to Supabase (idempotent)
- Preview toggle: shows only published artists (what public sees)
- Per-artist publish/unpublish + "Publicar X borradores" bulk action
- Offline fallback: `vettonia_artist_overrides` in localStorage (same key as before)

### GalleryManage (aprobación/rechazo de fotos)
- `UploadedPhoto.status` field: `'pending' | 'approved' | 'rejected'` (default: `'pending'`)
- Filter tabs: Pendientes / Aprobadas / Rechazadas / Todas
- Approve/reject buttons per photo
- Public `Gallery.tsx` calls `getPhotos('approved')` — only approved photos appear
- `updatePhotoStatus(id, status)` sets the status in Supabase + localStorage
- Status column migration needed on Supabase (`alter table photos add column if not exists status text`)

### Dashboard (métricas reales desde Supabase)
- `getPublishedArtists()` → artist count (from `lineup_artists` table)
- `getPhotos()` → photo count, pending count, unique authors, recent uploads
- `getAlerts('admin')` → unread alerts count
- Error state with retry button if Supabase unavailable

## Key patterns
- **All data functions are async** (`getPhotos()`, `getMessages()`, `getPassInfo()`, etc.)
- **Supabase is primary, localStorage is fallback** — every service function follows: try supabase → catch/fallback to localStorage cache (`vettonia_*` keys)
- **Import from `lib/storage`** for backward compat (re-exports from `services/`)
- **Components use hooks** with `useEffect` + `loading` state for data fetching
- **Photo uploads** are compressed via canvas (`lib/image.ts`) before being sent to Supabase Storage

## Style conventions
- **No comments** in component/service code
- **No emojis** unless explicitly requested
- Tailwind v4 uses `@import "tailwindcss"` in CSS (no `@tailwind` directives)
- Theme colors via CSS `@theme`: `--color-arena`, `--color-violeta`, `--color-coral`, etc.
- `clipPath` polygons are used extensively for jagged card edges
- Three font families: `--font-heading` (Spline Sans), `--font-ui` (Inter), `--font-mono` (JetBrains Mono)

## Supabase
- Credentials in `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), gitignored
- Client created lazily: `null` if env vars missing
- Storage bucket: `photos` (public)
- Tables: `photos`, `messages`, `passes`, `likes`, `alerts`, `lineup_artists`
- RLS policies allow anonymous read/insert/delete on all tables + storage
- `SUPABASE_GUIDE.md` has full SQL migration

## ESLint quirk
Flat config in `eslint.config.js` only covers `**/*.{js,jsx}` files. TS/TSX files are **not linted** — use `npx tsc --noEmit` for TS errors.
Ignores `dist` and `dev-dist` (auto-generated PWA files).

## Tests
No test framework or test files exist in the project.
