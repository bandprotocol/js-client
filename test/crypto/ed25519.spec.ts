/**
 * Tests for ED25519, copied from https://github.com/1p6/supercop.js
 */

import * as chai from 'chai'
import * as ED25519 from '~/crypto/ed25519'

const should = chai.should()

describe('lib:ED25519', () => {
  it('should exists', () => {
    ED25519.should.be.an('object')
  })

  it('should create seed Buffer', () => {
    ED25519.createSeed().should.be.an.instanceOf(Buffer)
  })

  it('should create key pair from seed', () => {
    const seed = ED25519.createSeed()
    const keys = ED25519.createKeyPair(seed)
    should.exist(keys.publicKey)
    should.exist(keys.secretKey)
  })

  it('should be able to sign message with secretKey and verify with public key', () => {
    const seed = ED25519.createSeed()
    const keys = ED25519.createKeyPair(seed)
    const message = Buffer.from(
      'THIS IS A HIGHLY CLASSIFIED MESSAGE!@#$%^&*(',
      'utf8'
    )
    const signature = ED25519.sign(message, keys.publicKey, keys.secretKey)

    should.exist(signature)

    const valid = ED25519.verify(signature, message, keys.publicKey)
    should.equal(valid, true)
  })
})
