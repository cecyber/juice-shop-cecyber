/*
 * Copyright (c) 2014-2020 Bjoern Kimminich.
 * SPDX-License-Identifier: MIT
 */

let dependencyChecker = {}
try {
  dependencyChecker = require('check-dependencies')
} catch (err) {
  console.error('Please run "npm install" before starting the application!')
  process.exit(1)
}
const logger = require('../logger')
const colors = require('colors/safe')

const validateDependencies = async ({ packageDir = '.', exitOnFailure = true } = {}) => {
  let success = true
  let dependencies = {}
  try {
    dependencies = await dependencyChecker({ packageDir, scopeList: ['dependencies'] })
  } catch (err) {
    logger.warn(`Dependencies in ${colors.bold(packageDir + '/package.json')} could not be checked due to "${err.message}" error (${colors.red('NOT OK')})`)
  }

  if (dependencies.depsWereOk === true) {
    logger.info(`All dependencies in ${colors.bold(packageDir + '/package.json')} are satisfied (${colors.green('OK')})`)
  } else {
    logger.warn(`Dependencies in ${colors.bold(packageDir + '/package.json')} are not rightly satisfied (${colors.red('NOT OK')})`)
    success = false
    for (const err of dependencies.error) {
      logger.warn(err)
    }
  }

  if (!success && exitOnFailure) {
    logger.error(colors.red('Exiting due to unsatisfied dependencies!'))
    process.exit(1)
  }
}

module.exports = validateDependencies
