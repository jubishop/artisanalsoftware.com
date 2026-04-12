---
name: Render 502 investigation and Railway migration (2026-03-23 to 2026-03-26)
description: Render Starter plan was spinning down causing 502s — migrated to Railway to fix, completed 2026-03-26
type: project
---

## Resolved: migrated from Render to Railway (2026-03-26)

Render Starter plan ($7/month) was spinning down every ~9 minutes despite being a paid tier, causing 502s on cold requests. Render's marketing says all paid plans get "zero downtime" but Starter clearly spins down. Memory was not the issue (peaked at 63MB of 512MB).

Migrated to Railway. Render account downgraded to free.

**Why:** 502s were breaking PodHaven deep links for users.

**How to apply:** If hosting issues recur, check Railway logs via `railway logs`. The service should not spin down on Railway.
