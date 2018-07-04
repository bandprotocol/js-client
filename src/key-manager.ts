import * as ED25519 from '~/crypto/ed25519'

export class KeyManager {
  /**
   * A factory to create a new instance from random key pair
   */
  static async generateRandom(): Promise<KeyManager> {
    const keypair = await ED25519.generateKeypair()
    return new KeyManager(keypair.privateKey)
  }

  private publicKey: ED25519.PublicKey

  constructor(private privateKey: ED25519.PrivateKey) {
    this.publicKey = ED25519.privateKeyToPublicKeySync(privateKey)
  }

  getPrivateKey() {
    return this.privateKey
  }

  getPublicKey() {
    return this.publicKey
  }

  async generateSignature(messageHex: string): Promise<ED25519.Signature> {
    return await ED25519.sign(messageHex, this.privateKey)
  }

  async sign(messageHex: string): Promise<string> {
    return messageHex + (await this.generateSignature(messageHex))
  }
}
