const { engines } = require('../package.json')

// This project deliberately supports one Node major. Read the package policy
// so the installation and command guards cannot drift independently.
const supported = /^(\d+)\.x$/.exec(engines.node)
if (!supported || process.versions.node.split('.')[0] !== supported[1]) {
  console.error(`This project requires Node ${engines.node}; detected ${process.version}. Select a compatible version with your version manager (see .nvmrc), then retry.`)
  process.exit(1)
}
