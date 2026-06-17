## Project Memory

Project-specific memory lives in `memory/`.
Use `memory/README.md` as the canonical index, with one linked Markdown file per memory in `memory/`.
When asked to save, recall, or update a memory, read and write those files directly. Check memory before guessing about prior project-specific decisions or environment details.

## 🎯 Project Overview

**What**: Node.js Express server that renders podcast information from RSS feeds with PodHaven iOS app integration.
**Purpose**: Display podcast/episode pages server-side with deep links to the PodHaven mobile app.
**Key Constraint**: Server-side rendering only - NO client-side JavaScript.

## 🏗️ Infrastructure

- **Hosting**: Railway (Node.js web service)
- **Domain**: `artisanalsoftware.com` — registered and DNS managed in **Cloudflare**
- **GitHub**: `jubishop/artisanalsoftware.com` — pushes to `main` auto-deploy to Railway

### Railway

| | |
|---|---|
| Project | `artisanal` |
| Service | `artisanalsoftware` |
| Environment | `production` |
| Start command | `npm start` → `node app.js` |
| Node version | 24.x (`package.json` `engines`) |

**Custom domains** (configured in Railway): `artisanalsoftware.com`, `www.artisanalsoftware.com`

**Traffic path**: Client → Cloudflare (DNS/proxy) → Railway. The app sets `trust proxy` so rate limiting sees real client IPs.

**Deploys**
- Normal workflow: merge/push to `main` — Railway deploys automatically via GitHub integration
- Manual deploy from repo root: `railway up`
- View logs: `railway logs`

**CLI setup** (one-time per machine)
```bash
brew install railway   # or: npm i -g @railway/cli
railway login
cd /path/to/artisanalsoftware.com
railway link           # select project artisanal → service artisanalsoftware
```

**Environment variables** (Railway dashboard or `railway variables`)
- `NODE_ENV=production` — set explicitly
- `PORT` — injected by Railway; do not hardcode
- `BASE_URL` — optional; defaults to `https://artisanalsoftware.com`
- `RSS_TIMEOUT` — optional; defaults to `10000` (ms)

Railway also injects its own `RAILWAY_*` vars; leave those alone.

**DNS (Cloudflare)**
- Domain registration and DNS live in Cloudflare (see `memory/reference_domain_management.md`)
- Custom domains are attached in the Railway service settings; Railway provides the DNS targets (CNAME or A records) to add in Cloudflare
- Use the Railway dashboard **Settings → Domains** as the source of truth for current DNS values

**Troubleshooting**
- 502s or cold-start issues: check `railway logs` (migrated from Render for this reason — see `memory/project_render_502_investigation.md`)
- After env var changes: redeploy from dashboard or `railway up`
- Dashboard: https://railway.com (project **artisanal**)

## 🔑 Key Architectural Decisions

### 1. **Trusted RSS Content Model**
- RSS feed content from `<content:encoded>` is rendered as HTML (unescaped `<%-` in EJS)
- Plain text descriptions from `<description>` are escaped normally
