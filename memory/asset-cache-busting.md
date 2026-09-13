---
name: asset-cache-busting
description: Prevent stale static assets from breaking freshly deployed HTML.
type: reference
---

# Static asset cache guidance

Use `assetUrl(...)` in EJS for stylesheets and images whose filenames are
reused across deployments. Fresh HTML can otherwise use old cached assets.

On 2026-06-01, the PodHaven redesign changed an existing stylesheet. Returning
visitors received the new HTML with the previous CSS, which broke the phone
frames and layout. A fresh or forced reload looked correct. At that time,
Cloudflare and browser responses used `cache-control: public, max-age=14400`
for static assets, while HTML was dynamic. These headers are historical
observations and should be checked again when diagnosing cache behavior.

Commit `97d9159` introduced the content-hash URL helper. It produces a new
query string when asset contents change. For example:

```ejs
<link rel="stylesheet" href="<%= assetUrl('/public/css/podhaven.css') %>">
```

Do not add a bare reused stylesheet URL. Verify a changed asset gets a new
URL and test a normal reload after deployment. The app caches hashes for the
process lifetime, so restart it after local asset changes. The
[historical redesign record](archive/podhaven-redesign.md) preserves the
original incident context.
