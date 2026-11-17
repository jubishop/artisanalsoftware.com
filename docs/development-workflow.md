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

Select the latest Node LTS before `npm ci`. `.nvmrc` requests `lts/*`; with
fnm, run `fnm use --install-if-missing`.

Foundation setup needs Git, Python 3, and QMD, plus direnv when the project
has an `.envrc`, and checks also need ShellCheck; see
[required tools](foundation/knowledge-search.md#required-tools). Create
`.envrc` only when the project needs environment settings, and review it
before running `direnv allow`; search does not need it.

If an installed QMD fails with a native database module version error, its
Node runtime differs from the one used to build that installation. Keep the
application on the latest Node LTS. Point `knowledge.qmdPath` at a local
launcher that selects QMD's matching runtime, or repair that QMD installation
deliberately. Keep machine-specific executable paths in local Git settings and
the launcher outside tracked files. Test `bin/qmd-index` with the application
runtime active; `qmd --version` alone does not exercise the database module.

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
the latest Node LTS and then `bin/check --full` for pull requests and pushes
to `main`. It uses read-only permissions and does not retain checkout credentials.
Its job reads the `CI_TIER` repository variable, which home-infra's CI router
sets, as it queues: `github` runs it on GitHub's `ubuntu-latest`, `local` on
the primary Mac's Colima VM (`[self-hosted, local-vm]`, arm64), and anything
else, or unset, on the NVR's x64 runner, `nvr-artisanalsoftware.com-1`; see
home-infra's `memory/nvr-ci-runners.md#hosted-fallback`. Its 40-minute
timeout includes up to 30 minutes waiting for one of the NVR's four CI slots.
The NVR's and the VM's runners have no `sudo`, so the job installs nothing: a
tool it starts needing that a runner lacks gets an install step that runs only
when the tool is missing, and an entry in home-infra's `nvr/apt-packages.txt`.
Railway waits for the commit's GitHub check suites before it builds, and
skips the deployment if they fail, so this workflow gates releases; a local
full check before pushing is optional. On 2026-10-10 Railway held 5027492 in
`WAITING` until its CI run passed. `test/deployment.test.js` keeps the
setting in [`.railway/railway.ts`](../.railway/railway.ts). After an
authorized push, verify CI and the deployment for the exact pushed commit.

## Runtime and toolchain versions

The application runs on the latest Node LTS, following the
[version policy](foundation/engineering-policy.md#runtime-and-toolchain-versions).
`package.json` declares the minimum, `"node": ">=24"`, with no upper bound.
`.nvmrc` requests `lts/*` for local version managers, GitHub Actions, and
Railway; see [Railway's Node selection](deployment.md#node-runtime-selection).

`.npmrc` enables `engine-strict`, so installation fails below the minimum.
The `prestart` and `pretest` npm hooks run `bin/check-node.cjs` before
starting the server or Mocha. It rejects only majors below the minimum and
reports the detected version, the minimum, and how to select the latest LTS.
Use `npm start` and `npm test` as the application entry points; direct
`node app.js` and direct Mocha calls bypass npm's guard. Railway starts
production with `node app.js`; its build runs `npm install` on the same Node,
so `engine-strict` enforces the minimum there.

Document and foundation checks do not require Node or npm. Raise the minimum
when the application starts relying on a newer Node release.

## Worktrees and checkout isolation

Shared worktree rules are in
[worktrees and models](foundation/knowledge-search.md#worktrees-and-models).
For application work in a new checkout, select the latest Node LTS and run
`npm ci` there. Dependencies, configuration files, and any test output belong to that
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
