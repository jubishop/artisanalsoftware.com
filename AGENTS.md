# Artisanal Software instructions

<!-- project-starter:begin -->
Project Starter manages this block; add project rules after it. Project rules
take precedence over this block and the foundation pages wherever they differ.

- Keep durable guidance and non-derivable context in [memory](memory/README.md),
  and designs, decisions, and research in [docs](docs/README.md). Before
  non-trivial work or writing memory, search with `bin/knowledge search "term"`
  or `bin/knowledge query "question" --no-rerank`, then read results with
  `bin/knowledge get <path> -l 80`. Markdown sources are authoritative.
- If configured QMD fails, tell the user immediately and attempt repair. If
  repair fails, pause knowledge-dependent work until the user approves a
  fallback; never silently substitute `rg` or direct reads. See
  [search failures](docs/foundation/knowledge-search.md#search-failures).
- Use td for work with multiple stages, interruptions, blockers, or handoffs;
  run `td usage --new-session -q` once per new context and keep handoffs
  current. See [task tracking](docs/foundation/task-tracking.md).
- Follow the [engineering policy](docs/foundation/engineering-policy.md):
  fewer dependencies, red-green tests for behavior changes, flaky tests fixed
  or tracked in an issue, cohesive files and pages, checkout-isolated
  validation, and the latest stable toolchains.
- Deliver by [kind of change](docs/foundation/engineering-policy.md#kinds-of-change):
  commit text, such as Markdown and AI skill prose, directly on the default
  branch without checks; commit development code, such as tests, CI, and
  tooling, directly after its checks pass; and deliver production code through
  a pull request after its checks.
- Run [checks](docs/foundation/engineering-policy.md#checks) by change: the
  relevant checks while editing, and `bin/check --full` before merging or
  releasing production code unless an enforced CI gate runs it. Reuse passing
  results.
- Keep accepted decisions separate from proposals, preserve unrelated changes,
  and keep generated caches out of Git. Keep secrets out of public
  repositories only; a private one may commit them.
- Run `bin/setup` after cloning, `bin/doctor` to diagnose setup, and
  `bin/qmd-index` after uncommitted knowledge edits. Managed files listed in
  `.project-starter.json` change only through Project Starter or a recorded
  override with its reason.
<!-- project-starter:end -->

## Project

This is an Express/EJS site on the latest Node LTS (minimum 24), hosted on
Railway behind Cloudflare. Keep server-side rendering only: no client-side
JavaScript. Preserve public PodHaven URLs, the trusted RSS HTML model, and
versioned static asset URLs.
Read [architecture](docs/architecture.md), [deployment](docs/deployment.md),
and the [content guide](docs/podhaven-content.md) for affected work.

Use [GitHub Issues](https://github.com/jubishop/artisanalsoftware.com/issues)
for shared work and acceptance criteria.

For code edits, run relevant application checks explicitly, such as
`npm test -- --grep "episode"`. `bin/check --full` adds `bin/check-application`:
the Python tests, then `npm test`. Railway deploys a commit only after its CI
checks pass, so CI's full check is the release gate; see the
[development workflow](docs/development-workflow.md#checks). Nonfunctional
changes may be pushed without deployment; follow the
[deployment policy](docs/deployment.md#nonfunctional-changes).
