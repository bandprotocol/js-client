import sodium = require('sodium-javascript')
import shajs = require('sha.js')

/**
 * Define Interfaces
 */

export type PrivateKey = string
export type PublicKey = string
export type Address = string
export type Message = string | Buffer
export type Signature = string

export interface KeyPair {
  privateKey: PrivateKey
  publicKey: PublicKey
  address: Address
}

export interface Constants {
  SEEDBYTES: number
  PUBLICKEYBYTES: number
  PRIVATEKEYBYTES: number
  ADDRESSBYTES: number
  SIGNATUREBYTES: number
  PUBLICKEY_HEX_LENGTH: number
  PRIVATEKEY_HEX_LENGTH: number
  ADDRESSBYTES_HEX_LENGTH: number
}

/**
 * Constants
 */
export const Constants = <Constants>{
  SEEDBYTES: sodium.crypto_sign_SEEDBYTES,
  PUBLICKEYBYTES: sodium.crypto_sign_PUBLICKEYBYTES,
  PRIVATEKEYBYTES: sodium.crypto_sign_SECRETKEYBYTES,
  ADDRESSBYTES: 20,
  SIGNATUREBYTES: sodium.crypto_sign_BYTES,
  PUBLICKEY_HEX_LENGTH: sodium.crypto_sign_PUBLICKEYBYTES * 2,
  PRIVATEKEY_HEX_LENGTH: sodium.crypto_sign_SECRETKEYBYTES * 2,
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
  const privateKeyBuff = new Buffer(Constants.PRIVATEKEYBYTES)
  const publicKeyBuff = new Buffer(Constants.PUBLICKEYBYTES)

  if (seed && seed.length === Constants.SEEDBYTES)
    sodium.crypto_sign_seed_keypair(publicKeyBuff, privateKeyBuff, seed)
  else sodium.crypto_sign_keypair(publicKeyBuff, privateKeyBuff)

  return {
    privateKey: privateKeyBuff.toString('hex'),
    publicKey: publicKeyBuff.toString('hex'),
    address: publicKeyToAddress(privateKeyBuff.toString('hex')),
  }
}

/**
 * Get public key from private key
 *
 * @param privateKey 64-byte private key string
 */
export function privateKeyToPublicKey(privateKey: PrivateKey): PublicKey {
  return privateKey.slice(
    Constants.PRIVATEKEY_HEX_LENGTH - Constants.PUBLICKEY_HEX_LENGTH,
    Constants.PRIVATEKEY_HEX_LENGTH
  )
}

/**
 * Public key to address
 *
 * @param publicKey 32-byte public key string
 */
export function publicKeyToAddress(publicKey: PublicKey): Address {
  const Address = shajs('sha256')
    .update(publicKey)
    .digest('hex')
  return Address.slice(0, Constants.ADDRESSBYTES_HEX_LENGTH)
}
/**
 * Get message signature
 *
 * @param message arbitrary message
 * @param privateKey 64-byte private key string
 */
export function sign(message: Message, privateKey: PrivateKey): Signature {
  const messageBuff = normalizeMessage(message)
  const privateKeyBuff = Buffer.from(privateKey, 'hex')
  const signatureBuff = new Buffer(Constants.SIGNATUREBYTES)

  sodium.crypto_sign_detached(signatureBuff, messageBuff, privateKeyBuff)

  return signatureBuff.toString('hex')
}

/**
 * Verify signature
 *
 * @param signature 64-byte signature
 * @param message arbitrary message
 * @param publicKey 32-byte private key string
 */
export function verify(
  signature: Signature,
  message: Message,
  publicKey: PublicKey
): boolean {
  const signatureBuff = Buffer.from(signature, 'hex')
  const messageBuff = normalizeMessage(message)
  const publicKeyBuff = Buffer.from(publicKey, 'hex')

  return sodium.crypto_sign_verify_detached(
    signatureBuff,
    messageBuff,
    publicKeyBuff
  )
}
