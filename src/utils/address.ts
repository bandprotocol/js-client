import * as ED25519 from '~/crypto/ed25519'
import shajs = require('sha.js')

export const ADDRESS_LETTER_SPACE = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function verifyKeyToRawAddress(verifyKey: ED25519.VerifyKey) {
  return shajs('sha256')
    .update(Buffer.from(verifyKey, 'hex'))
    .digest()
    .slice(0, ED25519.Constants.ADDRESS_INTERMEDIATEBYTES_LENGTH)
}

export function verifyKeyToIBANAddress(verifyKey: ED25519.VerifyKey) {
  // Calculate RAW address bytes
  const rawAddress = verifyKeyToRawAddress(verifyKey)

  // Convert Array<bytes> into Array<bits>
  const intermediateBits: Array<boolean> = []
  Array.from(rawAddress).forEach((byte: number) =>
    [...Array(8)].forEach((_, i) => {
      intermediateBits.push((byte & (1 << (7 - i))) > 0)
    })
  )

  // Construct 32-bytes representation from the Array<bit>
  const address = [...Array(32)].map(() => {
    let value =
      (intermediateBits.shift() && 16) |
      (intermediateBits.shift() && 8) |
      (intermediateBits.shift() && 4) |
      (intermediateBits.shift() && 2) |
      (intermediateBits.shift() && 1)
    return ADDRESS_LETTER_SPACE[value]
  })

  // Calculate checksum
  const checksumCalc = address
    .concat('A', 'X', '0', '0')
    .map(val => (val.charCodeAt(0) >= 65 ? val.charCodeAt(0) - 65 + 10 : val))
    .join('')
    .split('')

  // Mod checksum by 97
  let remainder = 0
  checksumCalc.forEach(val => {
    remainder = (remainder * 10 + parseInt(val, 10)) % 97
  })

  // Checksum
  const checksumVal = 98 - remainder
  const checksum = (checksumVal > 9 ? '' : '0') + checksumVal

  // Combine
  const fullAddress = 'AX' + checksum + address.join('')

  return [...Array(9)]
    .map((_, i) => fullAddress.slice(4 * i, 4 * (i + 1)))
    .join(' ')
}
