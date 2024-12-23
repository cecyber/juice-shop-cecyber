/*
 * Copyright (c) 2014-2020 Bjoern Kimminich.
 * SPDX-License-Identifier: MIT
 */

describe('/#/privacy-security/privacy-policy', () => {
  describe('challenge "privacyPolicy"', () => {
    it('should be possible to access privacy policy', () => {
      browser.get(protractor.basePath + '/#/privacy-security/privacy-policy')
      expect(browser.getCurrentUrl()).toMatch(/\/privacy-policy/)
    })

    protractor.expect.challengeSolved({ challenge: 'Privacy Policy' })
  })
})
