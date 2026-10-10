const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const root = path.resolve(__dirname, '..')

describe('Repository application commands', function () {
  this.timeout(15000)
  let directory
  let manifest

  beforeEach(function () {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'artisanal tooling '))
    manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
    delete manifest.dependencies
    delete manifest.devDependencies
    fs.mkdirSync(path.join(directory, 'bin'))
    for (const name of ['.npmrc', 'bin/check-node.cjs']) {
      if (fs.existsSync(path.join(root, name))) {
        fs.copyFileSync(path.join(root, name), path.join(directory, name))
      }
    }
    fs.writeFileSync(path.join(directory, 'probe.cjs'),
      "require('node:fs').writeFileSync('command-ran', 'yes')\n")
    manifest.scripts.start = 'node probe.cjs'
    manifest.scripts.test = 'node probe.cjs'
    saveManifest()
  })

  afterEach(function () {
    fs.rmSync(directory, { recursive: true, force: true })
  })

  function saveManifest() {
    fs.writeFileSync(path.join(directory, 'package.json'), JSON.stringify(manifest))
  }

  function npm(args, version) {
    const env = { ...process.env }
    delete env.NODE_OPTIONS
    delete env.npm_config_engine_strict
    if (version) {
      const preload = path.join(directory, 'runtime-fixture.cjs')
      fs.writeFileSync(preload,
        `Object.defineProperty(process, 'version', { value: 'v${version}' });\n` +
        `Object.defineProperty(process.versions, 'node', { value: '${version}' });\n`)
      env.NODE_OPTIONS = `--require ${JSON.stringify(preload)}`
    }
    const result = spawnSync(process.execPath, [process.env.npm_execpath, ...args], {
      cwd: directory, env, encoding: 'utf8', timeout: 10000
    })
    assert.ifError(result.error)
    return result
  }

  for (const command of ['start', 'test']) {
    it(`rejects Node below the minimum before npm ${command} starts work`, function () {
      for (const version of ['22.0.0', '23.11.0']) {
        const result = npm([command], version)
        assert.notEqual(result.status, 0, result.stdout)
        assert.match(result.stderr, /requires Node 24 or later/)
        assert.match(result.stderr, new RegExp(version.replaceAll('.', '\\.')))
        assert.equal(fs.existsSync(path.join(directory, 'command-ran')), false)
      }
    })

    it(`runs npm ${command} on the minimum and newer Node majors`, function () {
      for (const version of [undefined, '24.0.0', '26.0.0', '28.0.0']) {
        fs.rmSync(path.join(directory, 'command-ran'), { force: true })
        const result = npm([command], version)
        assert.equal(result.status, 0, `${version}: ${result.stderr}`)
        assert.equal(fs.readFileSync(path.join(directory, 'command-ran'), 'utf8'), 'yes')
      }
    })
  }

  it('enforces the Node engine during dependency installation', function () {
    fs.writeFileSync(path.join(directory, 'package-lock.json'), JSON.stringify({
      name: manifest.name, version: manifest.version, lockfileVersion: 3,
      packages: { '': { name: manifest.name, version: manifest.version, engines: manifest.engines } }
    }))
    const install = ['ci', '--offline', '--ignore-scripts', '--no-audit', '--no-fund']
    const rejected = npm(install, '23.11.0')
    assert.notEqual(rejected.status, 0, rejected.stdout)
    assert.match(rejected.stderr, /EBADENGINE/)
    for (const version of [undefined, '26.0.0', '28.0.0']) {
      const supported = npm(install, version)
      assert.equal(supported.status, 0, `${version}: ${supported.stderr}`)
    }
  })

  it('keeps Mocha discovery inside the active checkout and reports active failures', function () {
    manifest.scripts.test = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).scripts.test
    saveManifest()
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(directory, 'node_modules'), 'dir')
    fs.mkdirSync(path.join(directory, 'test'))
    const active = path.join(directory, 'test/probe.test.js')
    fs.writeFileSync(active, "it('discovery probe', function () {})\n")
    const nested = path.join(directory, 'worktrees/unrelated/test')
    for (const state of ['absent', 'added', 'changed', 'removed']) {
      if (state === 'added') fs.mkdirSync(nested, { recursive: true })
      if (state === 'added' || state === 'changed') {
        fs.writeFileSync(path.join(nested, 'bad.test.js'), `invalid JavaScript ${state} !!!`)
      }
      if (state === 'removed') fs.rmSync(path.join(directory, 'worktrees'), { recursive: true })
      const result = npm(['test', '--', '--grep', 'discovery probe'])
      assert.equal(result.status, 0, `${state}: ${result.stderr}`)
      assert.match(result.stdout, /1 passing/)
    }
    fs.writeFileSync(active, "it('discovery probe', function () { throw new Error('active failure') })\n")
    const failed = npm(['test', '--', '--grep', 'discovery probe'])
    assert.notEqual(failed.status, 0)
    assert.match(failed.stdout + failed.stderr, /active failure/)
  })
})
