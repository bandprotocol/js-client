import sodium = require('./sodium')
import shajs = require('sha.js')

/**
 * Define Interfaces
 */

export type Passcode = string
export type Key = Buffer
export type Message = string | Buffer
export type EncryptedMessage = string // Base64

export interface Constants {
  KEYBYTES: number
  NONCEBYTES: number
  MACBYTES: number
}

/**
 * Constants
 */
export const Constants = <Constants>{
  KEYBYTES: sodium.crypto_secretbox_KEYBYTES,
  NONCEBYTES: sodium.crypto_secretbox_NONCEBYTES,
  MACBYTES: sodium.crypto_secretbox_MACBYTES,
}

/**
 * Utility function to turn utf8 message format into UInt8Array
 */
export function normalizeMessage(message: Message): Buffer {
  if (message instanceof Buffer) return message
  if (typeof message === 'string') return Buffer.from(message, 'utf8')

  throw new Error('Unsupported message')
}

/**
 * Create key for encrypting message w/ sha256 hashing
 *
 * @param passcode arbitrary passcode string
 */
export function passcodeToKey(passcode: Passcode): Key {
  const keyBuffer = shajs('sha256')
    .update(passcode)
    .digest('hex')
  return Buffer.from(keyBuffer, 'hex').slice(0, Constants.KEYBYTES)
}

/**
 * Create encryped message
 *
 * @param message arbitrary utf8 string
 * @param passcode arbitrary utf8 string
 * @returns base64 box
 */
export function encrypt(
  message: Message,
  passcode: Passcode
): EncryptedMessage {
  const key: Key = passcodeToKey(passcode)
  const messageBuffer = normalizeMessage(message)
  const nonceBuffer = new Buffer(Constants.NONCEBYTES)
  const encryptedBuffer = new Buffer(Constants.MACBYTES + messageBuffer.length)

  // Create random nonce
  sodium.randombytes_buf(nonceBuffer)

  // Encrypt message
  sodium.crypto_secretbox_easy(encryptedBuffer, messageBuffer, nonceBuffer, key)

  return Buffer.concat(
    [nonceBuffer, encryptedBuffer],
    nonceBuffer.length + encryptedBuffer.length
  ).toString('base64')
}

/**
 * Decrypt box using passcode
 *
 * @param box base64 encrypted message
 * @param passcode utf8 string
 */
export function decrypt(box: EncryptedMessage, passcode: Passcode): Message {
  const encryptedBufferNonce = Buffer.from(box, 'base64')

  const nonceBuffer = encryptedBufferNonce.slice(0, Constants.NONCEBYTES)
  const encryptedBuffer = encryptedBufferNonce.slice(Constants.NONCEBYTES)

  const key: Key = passcodeToKey(passcode)
  const messageBuffer = new Buffer(encryptedBuffer.length - Constants.MACBYTES)

  // Encrypt message
  sodium.crypto_secretbox_open_easy(
    messageBuffer,
    encryptedBuffer,
    nonceBuffer,
    key
  )

  return messageBuffer.toString('utf8')
}
