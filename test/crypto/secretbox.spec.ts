/**
 * Tests for SecretBox (Symmetric-key Encryption)
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

    it('should return empty string if decrypt w/ incorrect passcode', () => {
      const passcode = 'SOME_SECRET_KEY_#$%^&'
      const message = 'THIS_IS_AN_AWESOME_MESSAGE_REALLY'

      const encrypted = SecretBox.encrypt(message, passcode)

      should.throw(() => SecretBox.decrypt(encrypted, 'SOME_RANDOM_PASSCODE'))
    })
  })
})
