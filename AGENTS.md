# Artisanal Software instructions

<!-- project-starter:begin -->
Project Starter manages this block; add project rules after it. Project rules
take precedence over this block and the foundation pages wherever they differ.

- Keep durable guidance and non-derivable context in [memory](memory/README.md),
  and designs, decisions, and research in [docs](docs/README.md). Before
  non-trivial work or writing memory, search with `bin/knowledge search "term"`
  or `bin/knowledge query "question" --no-rerank`, then read results with
  `bin/knowledge get <path> -l 80`. Markdown sources are authoritative.
- If configured QMD fails, follow `~/AGENTS.md` for a failed knowledge search,
  repairing it as
  [search failures](docs/foundation/knowledge-search.md#search-failures)
  describes.
- Follow the [engineering policy](docs/foundation/engineering-policy.md):
  fewer dependencies, red-green tests for behavior changes, cohesive files and
  pages, checkout-isolated validation, and the latest stable toolchains.
- Run [checks](docs/foundation/engineering-policy.md#checks) by change:
  `bin/check --documents-only` for text, the relevant checks while editing
  code, and `bin/check --full` before merging or releasing production code
  unless an enforced CI gate runs it. Reuse passing results.
- Keep accepted decisions separate from proposals, and keep generated caches
  out of Git. Keep secrets out of public repositories only; a private one may
  commit them.
- Run `bin/setup` after cloning, `bin/doctor` to diagnose setup, and
  `bin/qmd-index` after uncommitted knowledge edits. Managed files listed in
  `.project-starter.json` change only through Project Starter or a recorded
  override with its reason.
<!-- project-starter:end -->

## Project

This is an Express/EJS site on the latest Node LTS (minimum 24), hosted on
Railway behind Cloudflare. Keep server-side rendering only: no client-side
JavaScript. Preserve public PodHaven URLs, the trusted RSS HTML model, and
versioned static asset URLs. Read [architecture](docs/architecture.md),
[deployment](docs/deployment.md), and the
[content guide](docs/podhaven-content.md) for affected work.

While editing code, run focused application checks, such as
`npm test -- --grep "episode"`, or all of them with `bin/check-application`.
Railway deploys a commit only after its CI checks pass, so CI's
`bin/check --full` is the enforced release gate; see
[checks](docs/development-workflow.md#checks). Nonfunctional changes may be
pushed without deployment; follow the
[deployment policy](docs/deployment.md#nonfunctional-changes).
