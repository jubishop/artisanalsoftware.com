---
status: current
---

# Railway deployment

The website runs on Railway behind Cloudflare. Pushing or merging release inputs to `main`
starts Railway's GitHub deployment. This records the existing repository
configuration; inspect Railway for live deployment and DNS values.

| Setting | Value |
| --- | --- |
| GitHub repository | `jubishop/artisanalsoftware.com` |
| Railway project | `artisanal` |
| Railway service | `artisanalsoftware` |
| Railway environment | `production` |
| Configuration | [`.railway/railway.ts`](../.railway/railway.ts); see [Railway configuration](#railway-configuration) |
| Runtime | Latest Node LTS, selected by `.nvmrc`; see [Node runtime selection](#node-runtime-selection) |
| Build command | `npm install` |
| Start command | `node app.js` |
| Health check | `/health` |
| Replicas | One, in `us-west2` |
| Custom domains | `artisanalsoftware.com`, `www.artisanalsoftware.com` |

The domain's registrar and DNS provider are Cloudflare. See
[domain management](../memory/domain-management.md) for transfer history.
Use Railway **Settings → Domains** as the authority for current DNS targets.

## Node runtime selection

Railway builds this service with
[Railpack](https://railpack.com/languages/node), its default builder;
`.railway/railway.ts` does not choose one. Railpack's source at commit `08ca893`
(checked 2026-10-09) selects Node this way:

- It starts from its `lts` default, applies `engines.node`, then a
  `NODE_VERSION` or `RAILPACK_NODE_VERSION` service variable. Version files
  that mise reads, including `.nvmrc`, then override all of these.
- mise reads `lts/*` in `.nvmrc` as its `lts` alias, the newest LTS major
  (24 on that date). Railpack installs that major's newest release that is at
  least 14 days old, so a newer Current line is not selected.
- Without `.nvmrc`, Railpack would reduce `engines.node` (`>=24`) to major 24
  and stay there after a newer LTS line arrives.

Keep `.nvmrc` at `lts/*` and leave the version variables unset. Production
moves to a newer LTS release only on its next deployment, after Railpack's
bundled mise recognizes it. The build log's package list shows the selected
version and its source.

## Railway configuration

[`.railway/railway.ts`](../.railway/railway.ts) is the service's
[Infrastructure as Code](https://docs.railway.com/infrastructure-as-code)
file. It declares the `artisanalsoftware` partial and manages the GitHub
source (`main`, waiting for the commit's check suites), build command, watch
paths, start command, health check, replica, and custom domains.
Variables are unmanaged, so set them in Railway.

Railway does not read `.railway/` during deploys. To change a setting, run
`npm ci` (it installs the `railway` SDK that evaluates the file), edit the file,
review `railway config plan`, then run `railway config apply`. Apply updates
the service and starts a deployment of the current `main` commit. Afterward,
`railway config plan --detailed-exit-code` exits 0 when Railway matches the
file. `.railway/package.json` marks the file as an ES module because the
application package is CommonJS.

This replaced `railway.json`. Railway deprecated that Config as Code file and
stops reading such files on 2026-12-01. On 2026-10-09, Railway CLI 5.64.2's
`railway config migrate --apply --variables=unmanaged --service
artisanalsoftware` imported the live settings, but left the watch paths as a
comment. They were added by hand without `/railway.json` and `/railway.toml`;
the first apply changed only `build.watchPatterns`.

## Nonfunctional changes

Documentation, agent instructions, task tracking, comments, and other
nonfunctional changes may be committed and pushed without deployment. Run
appropriate checks and assess all changes since the last successful release.
Do not skip a release that includes undeployed material changes.

[`.railway/railway.ts`](../.railway/railway.ts) configures Railway's
[watch paths](https://docs.railway.com/builds/build-configuration#configure-watch-paths)
as `build.watchPatterns`, and `test/deployment.test.js` evaluates that file.
Application code, content, views, assets, dependencies, startup checks, and
runtime configuration trigger deployment. Documentation, memory, td setup,
tests, knowledge tooling, and `.railway/` alone do not; `railway config apply`
deploys Railway configuration changes. Keep these patterns current when
adding or moving release inputs, and apply them before relying on them.

Watch paths cannot judge comment-only edits inside application files. For
those changes, inspect the full difference from the deployed revision, then
[disable autodeploy](https://docs.railway.com/deployments/github-autodeploys#disable-automatic-deployments)
in the service settings before pushing. Keep required CI running. Record the
reason and deployed revision in the commit message, then restore autodeploy
after the push has been processed. This is an authorized delivery choice and
does not require a separate deployment approval. If a deployment is needed
later, use **Deploy Latest Commit** for the connected `main` branch. Do not
use `[skip ci]` as a deployment control.

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
