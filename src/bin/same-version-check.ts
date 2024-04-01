#!/usr/bin/env node
import { program, Option } from 'commander'
import { sameVersionCheck } from '../sameVersionCheck'

interface CLIOptions {
  packages: string[]
  manager: 'yarn'
}

const managerOption = new Option(
  '--manager <manager>',
  'The package manager that should be used to check the versions',
).choices(['yarn'])
managerOption.required = true

program
  .option(
    '-pkgs, --packages <pkgs...>',
    'The package to ensure that there is only one version across the monorepo (you can specify multiple space separated package names)',
    [],
  )
  .requiredOption(
    '--manager <manager>',
    'The package manager that should be used to check the versions',
    (value) => {
      return value.split(' ')
    },
  )

program.parse()
const options = program.opts<CLIOptions>()

// Run the actual program
let exitCode = 0
options.packages.forEach((pkg) => {
  const errMsg = sameVersionCheck({
    pkg,
    pkgManager: options.manager,
  })

  if (!errMsg) {
    console.log(`${pkg}: Passed`)
  } else {
    exitCode = 1
    console.log(`$${pkg}: ${errMsg}`)
  }
})

process.exitCode = exitCode
