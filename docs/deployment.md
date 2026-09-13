---
status: current
---

# Railway deployment

The website runs on Railway behind Cloudflare. Pushing or merging to `main`
starts Railway's GitHub deployment. This records the existing repository
configuration; inspect Railway for live deployment and DNS values.

| Setting | Value |
| --- | --- |
| GitHub repository | `jubishop/artisanalsoftware.com` |
| Railway project | `artisanal` |
| Railway service | `artisanalsoftware` |
| Railway environment | `production` |
| Runtime | Node 24.x, declared in `package.json` |
| Start command | `npm start` |
| Custom domains | `artisanalsoftware.com`, `www.artisanalsoftware.com` |

The domain's registrar and DNS provider are Cloudflare. See
[domain management](../memory/domain-management.md) for transfer history.
Use Railway **Settings → Domains** as the authority for current DNS targets.

## Environment

| Variable | Setting or default |
| --- | --- |
| `NODE_ENV` | Set `production` on Railway. |
| `PORT` | Railway supplies it. Local default is `3000`. |
| `BASE_URL` | Defaults to `https://artisanalsoftware.com`. |
| `RSS_TIMEOUT` | RSS fetch timeout in milliseconds; defaults to `10000`. |
| `PODHAVEN_UNIVERSAL_LINKS_ENABLED` | Only `true` enables the new buttons. Follow the [rollout runbook](universal-links.md). |

Leave Railway's injected `RAILWAY_*` variables in place. The app reads process
variables; it does not automatically load `.env`. Locally, use shell variables
or Node's `--env-file` option. Do not commit secrets.

## CLI and release checks

Install the Railway CLI, run `railway login`, then run `railway link` from the
repo. Select the project, service, and environment above. Normal deployment
uses a push to `main`; `railway up` is the manual route. `railway logs` reads
service logs. Environment changes require a redeploy.

Before a release, require a successful `bin/check --full`. The
[GitHub workflow](../.github/workflows/check.yml) runs it, but the existence of
that file does not establish branch protection or that Railway waits for CI.
Until an enforced gate is verified, run the full check locally before pushing.

After an authorized deploy, confirm Railway reports a successful deployment
for the intended commit. Read back `/health` and the changed pages on the
public domain. For changes to styles or reused images, verify asset hashes
and a normal reload as well as responsive rendering. For Universal Links,
complete the association and physical-device checks in the rollout runbook.

## Troubleshooting

For 502 errors, inspect Railway logs and service health first. The
[resolved Render incident](../memory/archive/render-502-investigation.md)
records why this service moved to Railway in March 2026. It is historical
evidence, not a guarantee of current provider behavior.
