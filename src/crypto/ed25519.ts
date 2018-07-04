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
}

export const Constants = {
  SEEDBYTES: null,
  PUBLICKEYBYTES: null,
  PRIVATEKEYBYTES: null,
  PUBLICKEY_HEX_LENGTH: null,
  PRIVATEKEY_HEX_LENGTH: null,
}

/**
 * Initialize constants
 */
let isSodiumReady = false

/**
 * Watch for when libsodium is ready, then populate constants
 */
sodium.ready.then(() => {
  isSodiumReady = true
  Constants.SEEDBYTES = sodium.crypto_sign_SEEDBYTES
  Constants.PUBLICKEYBYTES = sodium.crypto_sign_PUBLICKEYBYTES
  Constants.PRIVATEKEYBYTES = sodium.crypto_sign_SECRETKEYBYTES
  Constants.PUBLICKEY_HEX_LENGTH = sodium.crypto_sign_PUBLICKEYBYTES * 2
  Constants.PRIVATEKEY_HEX_LENGTH = sodium.crypto_sign_SECRETKEYBYTES * 2
})

/**
 * Utility function that indicates if libsodium is ready
 */
export function isReady() {
  return isSodiumReady
}

/**
 * Utility function to turn hex message format into UInt8Array
 */
export async function normalizeMessage(message: Message) {
  await sodium.ready

  if (message instanceof Uint8Array) return message
  if (typeof message === 'string') return sodium.from_hex(message)

  throw new Error('Unsupported message')
}

/**
 * Generate a random Ed25519 keypair
 *
 * @param seed 32-byte Uint8Array seed
 */
export async function generateKeypair(seed?: Uint8Array): Promise<KeyPair> {
  await sodium.ready
  const { privateKey: privateKeyBuff, publicKey: publicKeyBuff } = seed
    ? sodium.crypto_sign_seed_keypair(seed)
    : sodium.crypto_sign_keypair()

  return {
    privateKey: sodium.to_hex(privateKeyBuff),
    publicKey: sodium.to_hex(publicKeyBuff),
  }
}

/**
 * Get public key from private key
 *
 * @param privateKey 64-byte private key string
 */
export async function privateKeyToPublicKey(
  privateKey: PrivateKey
): Promise<PublicKey> {
  await sodium.ready
  const privateKeyBuff: Uint8Array = sodium.from_hex(privateKey)
  return sodium.to_hex(sodium.crypto_sign_ed25519_sk_to_pk(privateKeyBuff))
}

/**
 * Get public key from private key synchronously
 *
 * @param privateKey 64-byte private key string
 */
export function privateKeyToPublicKeySync(privateKey: PrivateKey): PublicKey {
  return privateKey.slice(
    Constants.PRIVATEKEY_HEX_LENGTH - Constants.PUBLICKEY_HEX_LENGTH
  )
}

/**
 * Public key to address
 *
 * @param publicKey 32-byte public key string
 */
export async function publicKeyToAddress(
  publicKey: PublicKey
): Promise<Address> {
  await sodium.ready
  const AddressBuff = sodium.to_hex(
    sodium.crypto_hash_sha256(sodium.from_hex(publicKey))
  )
  return AddressBuff.slice(0, 20)
}

/**
 * Get message signature
 *
 * @param message arbitrary message
 * @param privateKey 64-byte private key string
 */
export async function sign(
  message: Message,
  privateKey: PrivateKey
): Promise<Signature> {
  await sodium.ready
  let messageBuff = await normalizeMessage(message)
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
export async function verify(
  signature: Signature,
  message: Message,
  publicKey: PublicKey
): Promise<boolean> {
  await sodium.ready
  const signatureBuff: Uint8Array = sodium.from_hex(signature)
  let messageBuff = await normalizeMessage(message)
  const publicKeyBuff: Uint8Array = sodium.from_hex(publicKey)

  return sodium.crypto_sign_verify_detached(
    signatureBuff,
    messageBuff,
    publicKeyBuff
  )
}
