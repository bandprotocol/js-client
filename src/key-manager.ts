import * as ED25519 from '~/crypto/ed25519'
import * as BIP39 from 'bip39'

export class KeyManager {
  /**
   * A utility to create random mnemonic and private key
   */
  static async generateRandomKey() {
    // Use BIP39 to generate mnemonic
    const mnemonic = BIP39.generateMnemonic()

    // The mnemonic yeilds 64 bytes of seed
    // the ED25519 only use 32 bytes, which is plenty enough
    const seed: Buffer = BIP39.mnemonicToSeed(mnemonic).slice(
      0,
      ED25519.Constants.SEEDBYTES
    )
    const keypair = await ED25519.generateKeypair(seed)

    return {
      mnemonic,
      privateKey: keypair.privateKey,
      publicKey: keypair.publicKey,
    }
  }

  /**
   * A factory that instantiate KeyManager from mnemonic
   */
  static async fromMnemonic(mnemonic: string[]) {
    if (mnemonic.length !== 12) {
      throw new Error('Mnemonic phrase must have 12 words')
    }

    const seed: Buffer = BIP39.mnemonicToSeed(mnemonic.join(' ')).slice(
      0,
      ED25519.Constants.SEEDBYTES
    )
    const keypair = await ED25519.generateKeypair(seed)

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
