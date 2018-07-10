/**
 * Tests for ED25519
 */

import * as chai from 'chai'
import * as ED25519 from '~/crypto/ed25519'

const should = chai.should()

const ConstantSpec = {
  SEEDBYTES: 32,
  VERIFYKEY_HEX_LENGTH: 64,
  SECRETKEY_HEX_LENGTH: 128,
}

describe('lib:ED25519', () => {
  describe('fn:generateKeypair', () => {
    it('should generate a random key pair', () => {
      const keypair = ED25519.generateKeypair()
      keypair.should.contain.all.keys('verifyKey', 'secretKey')
      keypair.verifyKey.should.have.lengthOf(ConstantSpec.VERIFYKEY_HEX_LENGTH)
      keypair.secretKey.should.have.lengthOf(ConstantSpec.SECRETKEY_HEX_LENGTH)
    })

    it('should generate a same key pair given 32-byte seed', () => {
      const seed = new Buffer(Array(32).fill(1))
      const keypair1 = ED25519.generateKeypair(seed)
      const keypair2 = ED25519.generateKeypair(seed)

      should.equal(keypair1.secretKey, keypair2.secretKey)
    })
  })

  describe('fn:secretKeyToVerifyKey', () => {
    it('should gives a correct public key', () => {
      const keypair = ED25519.generateKeypair()
      const generatedVerifyKey = ED25519.secretKeyToVerifyKey(keypair.secretKey)
      should.equal(keypair.verifyKey, generatedVerifyKey)
    })
  })

  describe('fn:sign & fn:verify', () => {
    it('should be able to sign message with secret key and verify with public key', () => {
      const keypair = ED25519.generateKeypair()
      const message = new Buffer(
        Array(128)
          .fill(0)
          .map(_ => Math.floor(Math.random() * 256))
      )

      const signature = ED25519.sign(message, keypair.secretKey)

      should.exist(signature)

      const isValid = ED25519.verify(signature, message, keypair.verifyKey)
      should.equal(isValid, true)
    })
  })
})
