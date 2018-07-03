import * as chai from 'chai'
import * as ED25519 from '~/crypto/ed25519'
import { KeyManager } from '~/key-manager'

const should = chai.should()

describe('class:KeyManager', () => {
  it('should create a new instance with factory generateRandom', async () => {
    const keyManager = await KeyManager.generateRandom()
    keyManager.should.be.an.instanceOf(KeyManager)
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
