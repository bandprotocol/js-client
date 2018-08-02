import { KeyManager } from '~/key-manager'
import { generateRandomString } from '~/utils'
import { varintEncode } from '~/utils/varint'
import {
  Void,
  Bytes,
  UnboundBuffer,
  String,
  UnsignedInteger,
  Boolean,
} from '~/utils/data-structure'

const IDENT_LOOKUP = {
  void: new Void(),
  bool: new Boolean(),
  uint8_t: new UnsignedInteger(8),
  uint16_t: new UnsignedInteger(16),
  uint32_t: new UnsignedInteger(32),
  uint64_t: new UnsignedInteger(64),
  uint256_t: new UnsignedInteger(256),
  Address: new Bytes('Address', 20),
  Hash: new Bytes('Hash', 32),
  Signature: new Bytes('Signature', 64),
  Buffer: new UnboundBuffer(),
  String: new String(),
}

export class Function {
  public tx_prefix
  constructor(
    public config,
    public name,
    public addr,
    public opcode,
    public params,
    public result,
    public type
  ) {
    this.tx_prefix = Buffer.concat([
      addr,
      IDENT_LOOKUP['uint16_t'].dump(opcode),
    ])
  }

  raw_tx(...args) {
    if (this.params.length !== args.length) {
      console.log(this.params, args.length)
      throw new Error(`Invalid number of arguments to ${this.name}`)
    }

    const tx_data = args.map((arg, idx) =>
      IDENT_LOOKUP[this.params[idx]].dump(arg)
    )

    return Buffer.concat([this.tx_prefix, ...tx_data])
  }

  async broadcast_msg(...args) {
    let tx_data
    if (
      args.length >= 2 &&
      args[0] instanceof KeyManager &&
      typeof args[1] === 'number'
    ) {
      tx_data = Buffer.from(
        args[0].sign(args[1], this.raw_tx(...args.slice(2))),
        'hex'
      )
    } else {
      tx_data = this.raw_tx(...args)
    }

    // TODO:
    const timestamp = varintEncode(this.config.clock.get_time())

    // console.log('\n\n>> ---------- TXN ---------------')
    // console.log('>>', this.name, this.addr, this.params)
    // console.log('>>', args)
    // console.log('>>', tx_data)
    // console.log('>> ----------------------------')

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: generateRandomString(),
        method: 'broadcast_tx_commit',
        params: {
          tx: Buffer.concat([timestamp, tx_data]).toString('base64'),
        },
      }),
    }).then(response => response.json())

    console.log('RESPONSE:', response)
    const error_info = response.result.deliver_tx.info || ''
    const data = response.result.deliver_tx.data || ''

    if (error_info) return error_info

    return IDENT_LOOKUP[this.result].parse(Buffer.from(data, 'base64'))
  }

  async query_msg(...args) {
    const tx_data = this.raw_tx(...args)
    const timestamp = varintEncode(this.config.clock.get_time())

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: generateRandomString(),
        method: 'abci_query',
        params: {
          data: Buffer.concat([timestamp, tx_data]).toString('hex'),
        },
      }),
    }).then(response => response.json())

    const value = response.result.response.value || ''

    return IDENT_LOOKUP[this.result].parse(Buffer.from(value, 'base64'))
  }

  call(...args) {
    if (this.type == 'action') return this.broadcast_msg(...args)
    else return this.query_msg(...args)
  }
}

export class Contract {
  constructor(public config, public name, public addr, public abi_contract) {
    this.addr = IDENT_LOOKUP['Address'].dump(addr)
  }

  method(method: string) {
    if (!this.abi_contract[method])
      throw new Error(`Invalid method ${this.name}.${method}`)

    return new Function(
      this.config,
      `${this.name}.${method}`,
      this.addr,
      this.abi_contract[method].opcode,
      this.abi_contract[method].params,
      this.abi_contract[method].result,
      this.abi_contract[method].type
    )
  }
}

export class ContractCreator {
  constructor(public config, public name, public abi_contract) {}

  call(addr) {
    return new Contract(this.config, this.name, addr, this.abi_contract)
  }

  __constructor__(...args) {
    const tx_data = args.map((arg, idx) =>
      IDENT_LOOKUP[this.abi_contract['constructor_params'][idx]].dump(arg)
    )

    return Buffer.concat([varintEncode(this.abi_contract.id), ...tx_data])
  }
}

export class Blockchain {
  constructor(public config, public abi) {}

  contract(contract: string) {
    if (!this.abi[contract]) throw new Error(`Invalid contract ${contract}`)

    return new ContractCreator(this.config, contract, this.abi[contract])
  }
}
