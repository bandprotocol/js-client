import * as ED25519 from '~/crypto/ed25519'
import * as BIP39 from '~/crypto/bip39'
import * as SecretBox from '~/crypto/secretbox'
import { varintEncode } from '~/utils/varint'
import { verifyKeyToIBANAddress, verifyKeyToRawAddress } from '~/utils/address'

export interface GeneratedKey {
  mnemonic: string[]
  secretKey: string
  verifyKey: string
  address: string
}

export class KeyManager {
  /**
   * Expose utility functions
   */
  static verifyKeyToAddress = verifyKeyToIBANAddress
  static verifySignature = ED25519.verify

  /**
   * A utility to create random mnemonic and secret key
   */
  static generateRandomKey(): GeneratedKey {
    // Use BIP39 to generate 24-words mnemonic
    const mnemonic = BIP39.generateMnemonic(256)

    const { SEEDBYTES } = ED25519.Constants

    const seedHex = BIP39.mnemonicToEntropy(mnemonic)
    const seed = Buffer.from(seedHex, 'hex')
    const keypair = ED25519.generateKeypair(seed)

    return {
      mnemonic: mnemonic.split(' '),
      secretKey: keypair.secretKey,
      verifyKey: keypair.verifyKey,
      address: keypair.address,
    }
  }

  /**
   * A factory that instantiate KeyManager from mnemonic
   */
  static fromMnemonic(mnemonic: string[]) {
    if (mnemonic.length !== 24) {
      throw new Error('Mnemonic phrase must have 24 words')
    }

    const { SEEDBYTES } = ED25519.Constants

    const seedHex = BIP39.mnemonicToEntropy(mnemonic.join(' '))
    const seed = Buffer.from(seedHex, 'hex')
    const keypair = ED25519.generateKeypair(seed)

    return new KeyManager(keypair.secretKey)
  }

  /**
   * A factory that instantiate KeyManager from secret key
   */
  static fromSecretKey(secretKey: ED25519.SecretKey) {
    return new KeyManager(secretKey)
  }

  /**
   * A factory that instantiate KeyManager from SecretBox
   */
  static fromSecretBox(
    secretbox: SecretBox.EncryptedMessage,
    passcode: SecretBox.Passcode
  ) {
    try {
      const secretKey = SecretBox.decrypt(secretbox, passcode)
      return new KeyManager(secretKey)
    } catch (e) {
      return null
    }
  }

  private verifyKey: ED25519.VerifyKey

  private constructor(private secretKey: ED25519.SecretKey) {
    this.verifyKey = ED25519.secretKeyToVerifyKey(secretKey)
  }

  getSecretKey() {
    return this.secretKey
  }

  getVerifyKey() {
    return this.verifyKey
  }

  getAddress() {
    return verifyKeyToRawAddress(this.verifyKey)
  }

  getIBANAddress() {
    return verifyKeyToIBANAddress(this.verifyKey)
  }

  generateSignature(message: Buffer): ED25519.Signature {
    return ED25519.sign(message, this.secretKey)
  }

  sign(nonce: number, data: Buffer | string): string {
    if (typeof data === 'string') data = Buffer.from(data, 'hex')
    const tx = Buffer.concat([varintEncode(nonce), data])
    return (
      this.getAddress().toString('hex') +
      '01' +
      this.generateSignature(tx) +
      tx.toString('hex')
    )
  }

  encrypt(passcode: SecretBox.Passcode) {
    return SecretBox.encrypt(this.secretKey, passcode)
  }
}
