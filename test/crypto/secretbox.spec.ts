/**
 * Tests for ED25519, copied from https://github.com/1p6/supercop.js
 */

import * as chai from 'chai'
import * as SecretBox from '~/crypto/secretbox'

const should = chai.should()

describe('lib:SecretBox', () => {
  describe('fn:encrypt & fn:decrypt', () => {
    it('should create encrypted box and decrypt it', () => {
      const passcode = 'SOME_SECRET_KEY_#$%^&'
      const message = 'THIS_IS_AN_AWESOME_MESSAGE_REALLY'

      const encrypted = SecretBox.encrypt(message, passcode)
      const decrypted = SecretBox.decrypt(encrypted, passcode)

      should.equal(message, decrypted)
    })
  })
})
