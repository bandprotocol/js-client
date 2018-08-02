import BigNumber from 'bignumber.js'
import { varintDecode, varintEncode } from './varint'

interface DataType<T> {
  dump(value: T): Buffer
  parse(data: Buffer): T
}

export class Void {
  dump(value): Buffer {
    return Buffer.from([])
  }
  parse(data: Buffer) {
    return null
  }
}

export class UnboundBuffer {
  dump(value: Buffer): Buffer {
    return value
  }
  parse(data: Buffer) {
    return data
  }
}

export class String {
  dump(value: string): Buffer {
    return Buffer.from(varintEncode(value.length) + value)
  }
  parse(data) {
    let startIndex = 0
    while (startIndex < data.length) {
      startIndex++
      if (!(data[startIndex - 1] & 0x80)) break
    }
    return data.slice(startIndex).toString('utf8')
  }
}

export class Boolean {
  dump(value: boolean): Buffer {
    return varintEncode(value ? 1 : 0)
  }
  parse(data: Buffer): boolean {
    return !!varintDecode(data).toNumber()
  }
}

export class UnsignedInteger {
  private max_value
  constructor(precision_bit: number) {
    this.max_value = new BigNumber(
      '1' + [...Array(precision_bit)].fill('0').join(''),
      2
    )
  }
  dump(value: BigNumber | number | string): Buffer {
    if (typeof value === 'string') {
      value = new BigNumber(value)
    }
    return varintEncode(value)
  }
  parse(data: Buffer) {
    return varintDecode(data)
  }
}

export class Bytes {
  constructor(private name: string, private length: number) {}
  dump(value: string): Buffer {
    return Buffer.from(value, 'hex')
  }
  parse(data: Buffer) {
    return data.toString('hex')
  }
}
