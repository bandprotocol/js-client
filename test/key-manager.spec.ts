import * as chai from 'chai'
import * as ED25519 from '~/crypto/ed25519'
import { KeyManager } from '~/key-manager'

const should = chai.should()

describe('class:KeyManager', () => {
  it('should create a new random Mnemonic and private key with static generateRandomKey', async () => {
    const key = await KeyManager.generateRandomKey()
    key.should.contain.keys('mnemonic', 'privateKey', 'publicKey')
  })

  it('should recover a private key from mnemonic', async () => {
    const originalKey = await KeyManager.generateRandomKey()
    const mnemonic = originalKey.mnemonic.split(' ')

    const keyManager = await KeyManager.fromMnemonic(mnemonic)

    should.equal(keyManager.getPrivateKey(), originalKey.privateKey)
  })

  it('should generate valid signature', async () => {
    const privateKey =
      '2ec10c93b1462287d79e210f59cc05e0c3d23ccbe8bcc8c9a60eea5c958260280796b1c803e382309f3d073eaebd8287a7b2ff72415effeb146ad9bf72ee2e0a'

    const keyManager = new KeyManager(privateKey)
    keyManager.should.be.an.instanceOf(KeyManager)

    const message = '0a2f48364956b892e4'
    const signature = await keyManager.sign(message)

    const isValid = ED25519.verify(
      signature,
      message,
      keyManager.getPublicKey()
    )
  })
})
