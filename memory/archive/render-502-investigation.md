---
name: render-502-investigation
description: Historical context for the completed Railway migration.
type: project
status: resolved
---

# Render 502 investigation and Railway migration

This is a historical record. Deployment, test counts, tooling paths, and
follow-up notes below describe that work, not the current state.

## Resolved: migrated from Render to Railway (2026-03-26)

Render Starter plan ($7/month) was spinning down every ~9 minutes despite being a paid tier, causing 502s on cold requests. Render's marketing says all paid plans get "zero downtime" but Starter clearly spins down. Memory was not the issue (peaked at 63MB of 512MB).

Migrated to Railway. Render account downgraded to free.

**Why:** 502s were breaking PodHaven deep links for users.

**How to apply:** If hosting issues recur, check Railway logs via `railway logs`. The service should not spin down on Railway.
