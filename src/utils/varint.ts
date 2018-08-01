import { BigNumber } from 'bignumber.js'

var Buffer = require('buffer/').Buffer

export function varintDecode(bytes: Buffer) {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) {
    bin = ('00000000' + (bytes[i] & 0x7f).toString(2)).slice(-7) + bin
    if (!(bytes[i] & 0x80)) break
  }
  return new BigNumber(bin, 2)
}

export function varintEncode(num: BigNumber | number): Buffer {
  let bin = num.toString(2)
  const varint = []
  while (bin) {
    const val = parseInt(bin.slice(-7), 2)
    bin = bin.slice(0, -7)
    varint.push(val | (bin && 0x80))
  }
  return Buffer.from(varint)
}
