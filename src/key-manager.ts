import * as ED25519 from '~/crypto/ed25519'
import * as BIP39 from 'bip39'

export interface GeneratedKey {
  mnemonic: string[]
  privateKey: string
  publicKey: string
  address: string
}

export class KeyManager {
  /**
   * A utility to create random mnemonic and private key
   */
  static generateRandomKey(): GeneratedKey {
    // Use BIP39 to generate mnemonic
    const mnemonic = BIP39.generateMnemonic()

    const { SEEDBYTES } = ED25519.Constants

    // The mnemonic yeilds 64 bytes of seed
    // the ED25519 only use 32 bytes, which is plenty enough
    const seed: Buffer = BIP39.mnemonicToSeed(mnemonic).slice(0, SEEDBYTES)
    const keypair = ED25519.generateKeypair(seed)

    return {
      mnemonic: mnemonic.split(' '),
      privateKey: keypair.privateKey,
      publicKey: keypair.publicKey,
      address: keypair.address,
    }
  }

  /**
   * A factory that instantiate KeyManager from mnemonic
   */
  static fromMnemonic(mnemonic: string[]) {
    if (mnemonic.length !== 12) {
      throw new Error('Mnemonic phrase must have 12 words')
    }

    const { SEEDBYTES } = ED25519.Constants

    const seed: Buffer = BIP39.mnemonicToSeed(mnemonic.join(' ')).slice(
      0,
      SEEDBYTES
    )
    const keypair = ED25519.generateKeypair(seed)

    return new KeyManager(keypair.privateKey)
  }

  /**
   * A factory that instantiate KeyManager from private key
   */
  static fromPrivateKey(privateKey: ED25519.PrivateKey) {
    return new KeyManager(privateKey)
  }

  private publicKey: ED25519.PublicKey
  private address: ED25519.Address

  private constructor(private privateKey: ED25519.PrivateKey) {
    this.publicKey = ED25519.privateKeyToPublicKey(privateKey)
    this.address = ED25519.publicKeyToAddress(this.publicKey)
  }

  getPrivateKey() {
    return this.privateKey
  }

  getPublicKey() {
    return this.publicKey
  }

  getAddress() {
    return this.address
  }

  generateSignature(messageHex: string): ED25519.Signature {
    return ED25519.sign(messageHex, this.privateKey)
  }

  sign(messageHex: string): string {
    return messageHex + this.generateSignature(messageHex)
  }
}
