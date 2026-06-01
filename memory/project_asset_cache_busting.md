---
name: Static asset cache-busting via assetUrl() helper — 2026-06-01
description: CSS/static assets are served behind Cloudflare with a multi-hour cache-control; link them through the assetUrl() helper (content-hash ?v=) or returning visitors get stale CSS paired with new HTML.
metadata:
  type: project
---

Static assets (`/public/...`) are served by `express.static` and proxied through **Cloudflare**, which applies `cache-control: public, max-age=14400` (~4h) at the edge and in the browser. The HTML itself is `cf-cache-status: DYNAMIC` (never cached), so a deploy ships new HTML instantly but **returning visitors keep the old cached CSS for up to 4 hours**.

**This caused a real production breakage** (2026-06-01): the PodHaven redesign added 357 lines to the *same* unversioned `public/css/podhavenLanding.css`. Returning visitors got the new `.ph-phone`/hero-stage HTML markup with the *old* cached CSS that lacked those rules → device-frame screenshots rendered unstyled and ballooned to full width / the two-column hero collapsed. A fresh load (or Cmd+Shift+R) was always fine; only cached clients broke.

**The fix / convention (commit `97d9159`):** `app.js` defines `assetUrl(publicPath)` on `app.locals` — it appends `?v=<md5-prefix>` computed from the asset's file contents (memoized per process). All stylesheet links go through it:
```ejs
<link rel="stylesheet" href="<%= assetUrl('/public/css/podhavenLanding.css') %>">
```
A content change → new hash → new URL → cache is bypassed for everyone (Cloudflare's cache key includes the query string). `express.static` ignores the `?v=` and still serves the file.

**How to apply:** route ANY new CSS/static-asset `<link>`/`<img>` whose filename is reused across deploys through `assetUrl(...)`. Don't add a bare `/public/...` stylesheet link. New image files get fresh filenames so they're lower-risk, but reused-name assets MUST be versioned. Related: [[project_podhaven_redesign]].
