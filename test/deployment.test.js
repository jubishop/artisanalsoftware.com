const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { mkdtempSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');

describe('Railway deployment watch paths', function () {
  let directory;

  before(function () {
    directory = mkdtempSync(path.join(tmpdir(), 'railway-watch-'));
    assert.equal(spawnSync('git', ['init', '-q', directory]).status, 0);
    const config = JSON.parse(readFileSync(path.join(__dirname, '../railway.json')));
    // Railway documents gitignore-style matching. Matching here means watched.
    writeFileSync(path.join(directory, '.gitignore'), config.build.watchPatterns.join('\n') + '\n');
  });

  after(function () {
    rmSync(directory, { recursive: true, force: true });
  });

  function watches(files) {
    const result = spawnSync('git', ['check-ignore', '--no-index', '--stdin'], {
      cwd: directory, input: files.join('\n') + '\n', encoding: 'utf8',
    });
    assert.ok([0, 1].includes(result.status), result.stderr);
    return result.status === 0;
  }

  it('skips changes confined to docs, local tracking, tests, and knowledge tooling', function () {
    assert.equal(watches(['README.md', 'AGENTS.md', 'docs/task-tracking.md',
      'memory/README.md', '.project-starter.json', '.gitignore', '.todos/issues.db',
      'bin/_knowledge.py', 'test/routes.test.js', 'tests/test_knowledge.py']), false);
  });

  it('deploys application, asset, dependency, and runtime configuration changes', function () {
    for (const file of ['app.js', 'config/index.js', 'controllers/siteController.js',
      'middleware/validateFeedUrl.js', 'services/rssParser.js', 'content/podhaven-features.js',
      'views/podhaven.ejs', 'public/stylesheets/style.css', 'package-lock.json',
      'package.json', '.nvmrc', '.npmrc', 'bin/check-node.cjs', 'railway.json', 'Dockerfile']) {
      assert.equal(watches([file]), true, file);
    }
  });

  it('deploys mixed documentation and application changes', function () {
    assert.equal(watches(['docs/task-tracking.md', 'app.js']), true);
  });
});
