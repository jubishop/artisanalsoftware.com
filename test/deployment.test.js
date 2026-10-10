const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { mkdtempSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

// Evaluate the Infrastructure as Code file the way `railway config plan` does.
async function railwayService(name) {
  const { createRailwayContext, project } = await import('railway/iac');
  const { default: program } = await import(pathToFileURL(path.join(__dirname, '../.railway/railway.ts')).href);
  const definition = await program(createRailwayContext({ environment: 'production' }), project);
  const service = definition.resources.find((resource) => resource.type === 'service' && resource.name === name);
  assert.ok(service, `service ${name} is not defined in .railway/railway.ts`);
  return service;
}

describe('Railway deployment watch paths', function () {
  let directory;

  before(async function () {
    const { build } = await railwayService('artisanalsoftware');
    assert.ok(Array.isArray(build?.watchPatterns), 'artisanalsoftware has no build.watchPatterns');
    directory = mkdtempSync(path.join(tmpdir(), 'railway-watch-'));
    assert.equal(spawnSync('git', ['init', '-q', directory]).status, 0);
    // Railway documents gitignore-style matching. Matching here means watched.
    writeFileSync(path.join(directory, '.gitignore'), build.watchPatterns.join('\n') + '\n');
  });

  after(function () {
    if (directory) rmSync(directory, { recursive: true, force: true });
  });

  function watches(files) {
    const result = spawnSync('git', ['check-ignore', '--no-index', '--stdin'], {
      cwd: directory, input: files.join('\n') + '\n', encoding: 'utf8',
    });
    assert.ok([0, 1].includes(result.status), result.stderr);
    return result.status === 0;
  }

  it('skips changes confined to docs, local tracking, tests, and knowledge tooling', function () {
    assert.equal(watches(['README.md', 'AGENTS.md', 'docs/foundation/task-tracking.md',
      'memory/README.md', '.project-starter.json', '.gitignore', '.todos/issues.db',
      'bin/_knowledge.py', 'bin/check-application', 'test/routes.test.js',
      'tests/test_check_application.py']), false);
  });

  it('skips Railway configuration, which `railway config apply` deploys itself', function () {
    assert.equal(watches(['.railway/railway.ts', '.railway/package.json']), false);
  });

  it('deploys application, asset, dependency, and runtime configuration changes', function () {
    for (const file of ['app.js', 'config/index.js', 'controllers/siteController.js',
      'middleware/validateFeedUrl.js', 'services/rssParser.js', 'content/podhaven-features.js',
      'views/podhaven.ejs', 'public/stylesheets/style.css', 'package-lock.json',
      'package.json', '.nvmrc', '.npmrc', 'bin/check-node.cjs', 'Dockerfile', 'Procfile']) {
      assert.equal(watches([file]), true, file);
    }
  });

  it('deploys mixed documentation and application changes', function () {
    assert.equal(watches(['docs/foundation/task-tracking.md', 'app.js']), true);
  });
});
