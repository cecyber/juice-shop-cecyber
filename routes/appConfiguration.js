/*
 * Copyright (c) 2014-2020 Bjoern Kimminich.
 * SPDX-License-Identifier: MIT
 */

const config = require('config')

module.exports = function retrieveAppConfiguration () {
  return (req, res) => {
    res.json({ config })
  }
}
