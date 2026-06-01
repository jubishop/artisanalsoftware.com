---
name: PodHaven marketing site redesign — shipped to production — 2026-06-01
description: Visual redesign of /podhaven landing + feature/guide pages (CSS iPhone device frames, hero stage, bento, scroll reveal), 5 new screenshots, and the real app icon in the nav. Reviewed light+dark, terminology fixed, tests pass. SHIPPED to production on main.
type: project
---

## Status: SHIPPED to production on `main`

Deployed via Railway. Key commits: `02533a0` redesign (21 files, +605/−103), `9ccc3d1` real app icon in nav, `97d9159` CSS cache-busting fix (see [[project_asset_cache_busting]] — the redesign briefly looked "stretched/broken" for returning visitors due to stale cached CSS; fixed with content-hash asset URLs). Verified live at a 1920px viewport — hero phone constrained to ~366px, not full-width.

- Visually reviewed every page in **light + dark** (Playwright + Chrome, reduced-motion forced to defeat the scroll-reveal screenshot artifact). All device frames render cleanly — no distortion/overflow. The "black" phone screens are just genuinely dark-mode app screenshots, not broken images.
- All 95 mocha tests pass.

## What's in the commit
- **Design system** (`public/css/podhavenLanding.css`, +357): new tokens (deep bg, 2nd accent, `--ph-grad`, `--ph-shadow-lg`, `--ph-glow`, `--ph-ease`); components `.ph-phone` (CSS iPhone frame: Dynamic Island, titanium bezel, `.ph-phone-screen` clips the shot), `.ph-hero-stage`, `.ph-chip-float`, `.ph-stat`/`.ph-stats-band`, `.ph-bento`, `.ph-reveal` (+`@keyframes ph-reveal-in`/`ph-float`). Scroll reveal is gated behind `@media (prefers-reduced-motion: no-preference)` + `@supports (animation-timeline: view())`, so browsers without scroll-driven animations still show all content (no permanently-hidden sections).
- **Landing** (`landing.ejs`): device-framed hero in `.ph-hero-stage` w/ floating chips, `.ph-stats-band`, feature sections in `.ph-phone` frames, bento grid.
- **Device frames** rolled out across `recommendations/player/library/queue/offline/customization/guides/per-podcast-settings` (codemod wrapped portrait `figure.ph-feature-shot > img`).
- **5 new screenshots** wired in + old `podcast-detail.png` → `podcast-episodes.png` rename. New images copied from `~/Desktop` IMG_0255–0259 (originals still on Desktop; verified byte-identical by checksum):
  - IMG_0255 → `recommended-episode-detail.png`
  - IMG_0256 → `settings-recommendations.png`
  - IMG_0257 → `widget-queue.png`
  - IMG_0258 → `lock-screen-widgets.png`
  - IMG_0259 → `podcast-detail.png`
- **Terminology unified to "Recommendation score"** (matches the in-app label — the app shows "Recommendation 58%"). Fixed 4 stragglers that still said "match score" during this session: `landing.ejs`, `guides/index.ejs`, and two `pageDescription`s in `podhavenLandingController.js`.

## To deploy
`git push origin main` → Railway auto-deploys. After deploy: `railway logs` to confirm; spot-check https://artisanalsoftware.com/podhaven.

## Run / review locally
- `PORT=3000 node app.js` → http://localhost:3000/podhaven (controllers are required once at startup — restart after editing `podhavenLandingController.js`; EJS views hot-render).
- Screenshot review: Playwright is installed globally at `/opt/homebrew/lib/node_modules` (import by absolute path in an `.mjs`, it's CommonJS so use a default import). Use `reducedMotion: 'reduce'` + `fullPage: true` to capture full content; otherwise scroll-driven `.ph-reveal` leaves below-the-fold sections blank in the shot.

## Optional follow-ups (not blocking)
- Rate-limit IPv6 `keyGenerator` ValidationError warning at startup (~`app.js:58`) — non-blocking, address if wanted.
- `~/Desktop/IMG_0255–0259.PNG` originals can be deleted once happy (copies are committed).
