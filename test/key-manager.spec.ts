import * as chai from 'chai'
import * as ED25519 from '~/crypto/ed25519'
import { KeyManager } from '~/key-manager'

const should = chai.should()

describe('class:KeyManager', () => {
  it('should create a new random Mnemonic and secret key with static generateRandomKey', () => {
    const key = KeyManager.generateRandomKey()
    key.should.contain.keys('mnemonic', 'secretKey', 'verifyKey')
  })

  it('should recover a secret key from mnemonic', () => {
    const originalKey = KeyManager.generateRandomKey()
    const mnemonic = originalKey.mnemonic

    const keyManager = KeyManager.fromMnemonic(mnemonic)

    should.equal(keyManager.getSecretKey(), originalKey.secretKey)
  })

  it('should generate valid signature', () => {
    const secretKey =
      '2ec10c93b1462287d79e210f59cc05e0c3d23ccbe8bcc8c9a60eea5c958260280796b1c803e382309f3d073eaebd8287a7b2ff72415effeb146ad9bf72ee2e0a'

    const keyManager = KeyManager.fromSecretKey(secretKey)
    keyManager.should.be.an.instanceOf(KeyManager)

    const message = '0a2f48364956b892e4'
    const signature = keyManager.generateSignature(message)

    const isValid = ED25519.verify(
      signature,
      message,
      keyManager.getVerifyKey()
    )

    should.equal(isValid, true)
  })
})
