# Artisanal Software

The Artisanal Software studio website and PodHaven companion site. Express
renders marketing pages, app guides, and podcast or episode pages from RSS
feeds. EJS and CSS provide the interface without client-side JavaScript.

## Start locally

Use the latest Node LTS (24 or later; see `package.json` and `.nvmrc`), npm,
Git, Python 3, QMD, and ShellCheck, plus direnv when the project has an
`.envrc`.

```sh
npm ci
bin/setup
bin/doctor
npm start
```

Open `http://localhost:3000`. Use `/podhaven` for the app website,
`/podhaven/podcast?feedURL=<RSS_FEED_URL>` for a podcast, or
`/podhaven/episode?feedURL=<RSS_FEED_URL>&guid=<EPISODE_GUID>` for an episode.

`npm ci` enforces the declared minimum Node version. `npm start` and
`npm test` also check it before running. Select the latest LTS with your
version manager first.
The app reads process environment variables, not `.env` automatically. See
[configuration and deployment](docs/deployment.md).

## Checks

| Command | Scope |
| --- | --- |
| `bin/check --documents-only` | Markdown metadata, indexes, and local links. |
| `bin/check` | Foundation syntax, shell lint, docs, and whitespace. |
| `npm test` | Mocha application tests with local fixtures. |
| `bin/check --full` | Foundation checks, then `bin/check-application`: Python tests and the application suite. |

Full checks run in [GitHub Actions](.github/workflows/check.yml). Require a
successful full check before merge or release. See the
[development workflow](docs/development-workflow.md) for setup, focused tests,
and isolated worktrees, and the [foundation pages](docs/foundation/README.md)
for check selection, search, and hooks.

## Deployment

Push release changes to `main` for Railway deployment. Documentation changes
can skip deployment while CI still runs. See the
[deployment policy](docs/deployment.md#nonfunctional-changes) for watch paths
and the manual option for other nonfunctional edits.

## Project knowledge

- [Documentation](docs/README.md): architecture, content, operations, and decisions.
- [Memory](memory/README.md): durable lessons and historical context.
- [GitHub Issues](https://github.com/jubishop/artisanalsoftware.com/issues): shared work and acceptance criteria.
- [Agent instructions](AGENTS.md): project constraints and working conventions.

Use `git knowledge search "term"` after setup, or read the Markdown directly.
Run `bin/qmd-index` after editing knowledge files when fresh search results
are needed. Archives stay available as source files and are excluded from
search. The former `spec/` material is now in `docs/` and `docs/archive/`.

## Hosting and license

Railway hosts the app; Cloudflare manages the domain and DNS. Pushes to `main`
auto-deploy. Follow [the deployment runbook](docs/deployment.md).

The application retains its ISC license declaration. Copied foundation files
retain the MIT notice in [LICENSE.project-starter](LICENSE.project-starter).
