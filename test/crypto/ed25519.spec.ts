/**
 * Tests for ED25519, copied from https://github.com/1p6/supercop.js
 */

import * as chai from 'chai'
import * as ED25519 from '~/crypto/ed25519'

const should = chai.should()

const ConstantSpec = {
  SEEDBYTES: 32,
  PUBLICKEY_HEX_LENGTH: 64,
  PRIVATEKEY_HEX_LENGTH: 128,
}

describe('lib:ED25519', () => {
  describe('fn:generateKeypair', () => {
    it('should generate a random key pair', () => {
      const keypair = ED25519.generateKeypair()
      keypair.should.contain.all.keys('publicKey', 'privateKey')
      keypair.publicKey.should.have.lengthOf(ConstantSpec.PUBLICKEY_HEX_LENGTH)
      keypair.privateKey.should.have.lengthOf(
        ConstantSpec.PRIVATEKEY_HEX_LENGTH
      )
    })

    it('should generate a same key pair given 32-byte seed', () => {
      const seed = new Buffer(Array(32).fill(1))
      const keypair1 = ED25519.generateKeypair(seed)
      const keypair2 = ED25519.generateKeypair(seed)

      should.equal(keypair1.privateKey, keypair2.privateKey)
    })
  })

  describe('fn:privateKeyToPublicKey', () => {
    it('should gives a correct public key', () => {
      const keypair = ED25519.generateKeypair()
      const generatedPublicKey = ED25519.privateKeyToPublicKey(
        keypair.privateKey
      )
      should.equal(keypair.publicKey, generatedPublicKey)
    })
  })

  describe('fn:sign & fn:verify', () => {
    it('should be able to sign message with private key and verify with public key', () => {
      const keypair = ED25519.generateKeypair()
      const message = new Buffer(
        Array(128)
          .fill(0)
          .map(_ => Math.floor(Math.random() * 256))
      )

      const signature = ED25519.sign(message, keypair.privateKey)

      should.exist(signature)

      const isValid = ED25519.verify(signature, message, keypair.publicKey)
      should.equal(isValid, true)
    })
  })
})
