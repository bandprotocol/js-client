import sodium = require('libsodium-wrappers-sumo')

/**
 * Define Interfaces
 */

export type PrivateKey = string
export type PublicKey = string
export type Address = string
export type Message = string | Uint8Array
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
  PUBLICKEY_HEX_LENGTH: number
  PRIVATEKEY_HEX_LENGTH: number
}

/**
 * Expose thatresolves when the lib is ready
 */
export const ready = sodium.ready

/**
 * Constants
 */
export function getConstants(): Constants {
  return {
    SEEDBYTES: sodium.crypto_sign_SEEDBYTES,
    PUBLICKEYBYTES: sodium.crypto_sign_PUBLICKEYBYTES,
    PRIVATEKEYBYTES: sodium.crypto_sign_SECRETKEYBYTES,
    PUBLICKEY_HEX_LENGTH: sodium.crypto_sign_PUBLICKEYBYTES * 2,
    PRIVATEKEY_HEX_LENGTH: sodium.crypto_sign_SECRETKEYBYTES * 2,
  }
}

/**
 * Utility function to turn hex message format into UInt8Array
 */
export function normalizeMessage(message: Message) {
  if (message instanceof Uint8Array) return message
  if (typeof message === 'string') return sodium.from_hex(message)

  throw new Error('Unsupported message')
}

/**
 * Generate a random Ed25519 keypair
 *
 * @param seed 32-byte Uint8Array seed
 */
export function generateKeypair(seed?: Uint8Array): KeyPair {
  const { privateKey: privateKeyBuff, publicKey: publicKeyBuff } = seed
    ? sodium.crypto_sign_seed_keypair(seed)
    : sodium.crypto_sign_keypair()

  return {
    privateKey: sodium.to_hex(privateKeyBuff),
    publicKey: sodium.to_hex(publicKeyBuff),
    address: publicKeyToAddress(sodium.to_hex(publicKeyBuff)),
  }
}

/**
 * Get public key from private key
 *
 * @param privateKey 64-byte private key string
 */
export function privateKeyToPublicKey(privateKey: PrivateKey): PublicKey {
  const privateKeyBuff: Uint8Array = sodium.from_hex(privateKey)
  return sodium.to_hex(sodium.crypto_sign_ed25519_sk_to_pk(privateKeyBuff))
}

/**
 * Public key to address
 *
 * @param publicKey 32-byte public key string
 */
export function publicKeyToAddress(publicKey: PublicKey): Address {
  const AddressBuff = sodium.to_hex(
    sodium.crypto_hash_sha256(sodium.from_hex(publicKey))
  )
  return AddressBuff.slice(0, 40)
}

/**
 * Get message signature
 *
 * @param message arbitrary message
 * @param privateKey 64-byte private key string
 */
export function sign(message: Message, privateKey: PrivateKey): Signature {
  let messageBuff = normalizeMessage(message)
  const privateKeyBuff: Uint8Array = sodium.from_hex(privateKey)
  return sodium.to_hex(sodium.crypto_sign_detached(messageBuff, privateKeyBuff))
}

/**
 * Verify signature
 *
 * @param signature
 * @param message arbitrary message
 * @param publicKey 32-byte private key string
 */
export function verify(
  signature: Signature,
  message: Message,
  publicKey: PublicKey
): boolean {
  const signatureBuff: Uint8Array = sodium.from_hex(signature)
  let messageBuff = normalizeMessage(message)
  const publicKeyBuff: Uint8Array = sodium.from_hex(publicKey)

  return sodium.crypto_sign_verify_detached(
    signatureBuff,
    messageBuff,
    publicKeyBuff
  )
}
