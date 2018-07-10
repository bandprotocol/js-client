import sodium = require('./sodium')
import shajs = require('sha.js')

/**
 * Define Interfaces
 */

export type SecretKey = string
export type VerifyKey = string
export type Address = string
export type Message = string | Buffer
export type Signature = string

export interface KeyPair {
  secretKey: SecretKey
  verifyKey: VerifyKey
  address: Address
}

export interface Constants {
  SEEDBYTES: number
  VERIFYKEYBYTES: number
  SECRETKEYBYTES: number
  ADDRESSBYTES: number
  SIGNATUREBYTES: number
  VERIFYKEY_HEX_LENGTH: number
  SECRETKEY_HEX_LENGTH: number
  ADDRESSBYTES_HEX_LENGTH: number
}

/**
 * Constants
 */
export const Constants = <Constants>{
  SEEDBYTES: sodium.crypto_sign_SEEDBYTES,
  VERIFYKEYBYTES: sodium.crypto_sign_VERIFYKEYBYTES,
  SECRETKEYBYTES: sodium.crypto_sign_SECRETKEYBYTES,
  ADDRESSBYTES: 20,
  SIGNATUREBYTES: sodium.crypto_sign_BYTES,
  VERIFYKEY_HEX_LENGTH: sodium.crypto_sign_VERIFYKEYBYTES * 2,
  SECRETKEY_HEX_LENGTH: sodium.crypto_sign_SECRETKEYBYTES * 2,
  ADDRESSBYTES_HEX_LENGTH: 40,
}

/**
 * Utility function to turn hex message format into UInt8Array
 */
export function normalizeMessage(message: Message) {
  if (message instanceof Buffer) return message
  if (typeof message === 'string') return Buffer.from(message, 'hex')

  throw new Error('Unsupported message')
}

/**
 * Generate a random Ed25519 keypair
 *
 * @param seed 32-byte Buffer seed
 */
export function generateKeypair(seed?: Buffer): KeyPair {
  const secretKeyBuff = new Buffer(Constants.SECRETKEYBYTES)
  const verifyKeyBuff = new Buffer(Constants.VERIFYKEYBYTES)

  if (seed && seed.length === Constants.SEEDBYTES)
    sodium.crypto_sign_seed_keypair(verifyKeyBuff, secretKeyBuff, seed)
  else sodium.crypto_sign_keypair(verifyKeyBuff, secretKeyBuff)

  return {
    secretKey: secretKeyBuff.toString('hex'),
    verifyKey: verifyKeyBuff.toString('hex'),
    address: verifyKeyToAddress(secretKeyBuff.toString('hex')),
  }
}

/**
 * Get public key from secret key
 *
 * @param secretKey 64-byte secret key string
 */
export function secretKeyToVerifyKey(secretKey: SecretKey): VerifyKey {
  return secretKey.slice(
    Constants.SECRETKEY_HEX_LENGTH - Constants.VERIFYKEY_HEX_LENGTH,
    Constants.SECRETKEY_HEX_LENGTH
  )
}

/**
 * Verify key to address
 *
 * @param verifyKey 32-byte public key string
 */
export function verifyKeyToAddress(verifyKey: VerifyKey): Address {
  const Address = shajs('sha256')
    .update(Buffer.from(verifyKey, 'hex'))
    .digest('hex')
  return Address.slice(0, Constants.ADDRESSBYTES_HEX_LENGTH)
}
/**
 * Get message signature
 *
 * @param message arbitrary message
 * @param secretKey 64-byte secret key string
 */
export function sign(message: Message, secretKey: SecretKey): Signature {
  const messageBuff = normalizeMessage(message)
  const secretKeyBuff = Buffer.from(secretKey, 'hex')
  const signatureBuff = new Buffer(Constants.SIGNATUREBYTES)

  sodium.crypto_sign_detached(signatureBuff, messageBuff, secretKeyBuff)

  return signatureBuff.toString('hex')
}

/**
 * Verify signature
 *
 * @param signature 64-byte signature
 * @param message arbitrary message
 * @param verifyKey 32-byte secret key string
 */
export function verify(
  signature: Signature,
  message: Message,
  verifyKey: VerifyKey
): boolean {
  const signatureBuff = Buffer.from(signature, 'hex')
  const messageBuff = normalizeMessage(message)
  const verifyKeyBuff = Buffer.from(verifyKey, 'hex')

  return sodium.crypto_sign_verify_detached(
    signatureBuff,
    messageBuff,
    verifyKeyBuff
  )
}
