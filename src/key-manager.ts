import * as ED25519 from '~/crypto/ed25519'
import * as BIP39 from '~/crypto/bip39'
import * as SecretBox from '~/crypto/secretbox'

export interface GeneratedKey {
  mnemonic: string[]
  secretKey: string
  verifyKey: string
  address: string
}

export class KeyManager {
  /**
   * A utility to create random mnemonic and secret key
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
      secretKey: keypair.secretKey,
      verifyKey: keypair.verifyKey,
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
    box: SecretBox.EncryptedMessage,
    passcode: SecretBox.Passcode
  ) {
    try {
      const secretKey = SecretBox.decrypt(box, passcode)
      return new KeyManager(secretKey)
    } catch (e) {
      return null
    }
  }

  private verifyKey: ED25519.VerifyKey
  private address: ED25519.Address

  private constructor(private secretKey: ED25519.SecretKey) {
    this.verifyKey = ED25519.secretKeyToVerifyKey(secretKey)
    this.address = ED25519.verifyKeyToAddress(this.verifyKey)
  }

  getSecretKey() {
    return this.secretKey
  }

  getVerifyKey() {
    return this.verifyKey
  }

  getAddress() {
    return this.address
  }

  generateSignature(messageHex: string): ED25519.Signature {
    return ED25519.sign(messageHex, this.secretKey)
  }

  sign(messageHex: string): string {
    return messageHex + this.generateSignature(messageHex)
  }

  encrypt(passcode: SecretBox.Passcode) {
    return SecretBox.encrypt(this.secretKey, passcode)
  }
}
