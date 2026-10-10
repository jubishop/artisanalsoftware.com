---
status: current
---

# Development workflow

This page records this project's own commands and integrations. Shared rules
are in the [foundation pages](foundation/README.md).

## Setup

```sh
npm ci
bin/setup
bin/doctor
bin/check --full
```

Select Node 24 before `npm ci`. For fnm, run `fnm use 24`; install that major
with your version manager if needed.

Foundation setup needs Git and Python 3.9 or later, and checks also need
ShellCheck. QMD and direnv are optional; setup reports skipped features.
Install td and run `td init` as described in
[task tracking](foundation/task-tracking.md). Create `.envrc` only when the
project needs environment settings, and review it before running
`direnv allow`; search does not need it.

If an installed QMD fails with a native database module version error, its
Node runtime differs from the one used to build that installation. Keep the
application on Node 24. Point `knowledge.qmdPath` at a local launcher that
selects QMD's matching runtime, or repair that QMD installation deliberately.
Keep machine-specific executable paths in local Git settings and the launcher
outside tracked files. Test `bin/qmd-index` with the application runtime active;
`qmd --version` alone does not exercise the database module.

## Checks

Follow the [check schedule](foundation/engineering-policy.md#checks).
`bin/check-application`, which `bin/check --full` runs after the foundation
checks, runs the Python tests in `tests/` and then `npm test`. It stops at the
first failure and returns that command's exit status. Routine modes start no
Node or npm process. `tests/test_check_application.py` covers the order,
failure propagation, and missing-npm message with simulated tools.

Use `npm test -- --grep "episode"` (or another test title) for focused Mocha
checks. Application tests in `test/` use local RSS fixtures and exercise HTTP
responses through Supertest. They also cover runtime rejection and scoped
Mocha discovery. Keep both suites independent of production services; they
require no model downloads.

The [GitHub workflow](../.github/workflows/check.yml) runs `npm ci` under
Node 24 and then `bin/check --full` on Ubuntu for pull requests and pushes to
`main`. It uses read-only permissions and does not retain checkout credentials.
Local full validation is required until an enforced CI gate is confirmed.
Railway's automatic deployment is separate; do not assume it waits for CI.
After an authorized push, verify CI for the exact pushed commit. The workflow
file and a local pass alone do not prove that hosted CI passed.

## Runtime and toolchain versions

The application supports Node 24.x, declared in `package.json`. `.nvmrc`
selects that major for local version managers and GitHub Actions. Railway
uses the package engine declaration. Keep these settings in agreement.

`.npmrc` enables `engine-strict`, so installation fails on an unsupported
runtime. The `prestart` and `pretest` npm hooks run `bin/check-node.cjs` before
starting the server or Mocha. They report the detected version and the
required range. Use `npm start` and `npm test` as the application entry points;
direct `node app.js` and direct Mocha calls bypass npm's guard.

Document and foundation checks do not require Node or npm. Upgrade Node
deliberately, check dependency compatibility, and update development, CI, and
Railway together, following the
[version policy](foundation/engineering-policy.md#runtime-and-toolchain-versions).
Use maintained releases and avoid an unbounded major.

## Worktrees and checkout isolation

Shared worktree rules are in
[worktrees and models](foundation/knowledge-search.md#worktrees-and-models).
For application work in a new checkout, select Node 24 and run `npm ci`
there. Dependencies, configuration files, and any test output belong to that
checkout. No application environment file or dependency directory is copied
by the knowledge hooks. Choose a distinct `PORT` for each manual server, for
example `env PORT=3101 npm start`. HTTP tests use ephemeral ports.

Application test discovery is scoped to `test/**/*.test.js`; Python tests are
discovered as `tests/test_*.py`. Neither command scans nested `worktrees/`.
There is no application build cache. The tooling tests exercise nested
checkout exclusion and confirm that active test failures remain visible. Do
not broaden these paths to repository-wide recursion.

## Deployment

Pushes to `main` that change Railway's watched release inputs deploy
automatically. Documentation, tests, and knowledge tooling alone do not.
Follow the [nonfunctional change policy](deployment.md#nonfunctional-changes)
for watch paths and the manual option for other nonfunctional edits, and the
[deployment runbook](deployment.md) for release checks.

## Project Starter

`.project-starter.json` records the installed Project Starter release and the
hashes of its managed files. Update them with Project Starter's `bin/sync`,
and record any intentional local change as an override with its reason.
