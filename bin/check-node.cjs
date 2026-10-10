const { engines } = require('../package.json')

// Read the minimum from the package policy so the installation and command
// guards cannot drift independently. Newer Node majors are accepted.
const declared = /^>=\s*(\d+)$/.exec(engines.node)
const minimum = declared ? Number(declared[1]) : NaN
const detected = Number(process.versions.node.split('.')[0])
if (!declared || detected < minimum) {
  console.error(`This project requires Node ${declared ? `${minimum} or later` : `matching ${engines.node}`}; detected ${process.version}. Select the latest LTS with your version manager (see .nvmrc), then retry.`)
  process.exit(1)
}
