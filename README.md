# Band Protocol JS Library

[![NPM](https://nodei.co/npm/bandprotocol.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/bandprotocol/)

[![Dependency Status](https://david-dm.org/bandprotocol/bandprotocol.svg)](https://david-dm.org/bandprotocol/bandprotocol)
[![devDependency Status](https://david-dm.org/bandprotocol/bandprotocol/dev-status.svg)](https://david-dm.org/smiled0g/bandprotocol#info=devDependencies)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

## Dependencies

- [TypeScript](https://www.typescriptlang.org/)
- [libsodium.js](https://github.com/jedisct1/libsodium.js)
- [bip39](https://github.com/bitcoinjs/bip39)

## Installation

```
npm i --save bandprotocol
```

## Basic Usage

```js
import BandProtocolClient from 'bandprotocol'
import { privateKey } from './config'

const client = new BandProtocolClient({
  httpEndpoint: 'http://localhost:26657',
  keyProvider: privateKey,
})
```

### Key Generation

This library supports secure key generations using ED25519 algorithm.

```js
const {
  mnemonic, // Array<string x 12> of Mnemonic phrase
  privateKey, // 64-byte hex string private key
  publicKey, // 32-byte hex string public key
  address, // 20-byte hex string address
} = BandProtocolClient.generateRandomKey()
```

### Transaction Generation

Every transaction is created on the remote node via JSON-RPC protocol and signed on the client. This design allows higher portability comparing to client-generated transactions, while the client keeps its private keys secured.

See [BandProtocol's Gitbook](https://bandprotocol.gitbook.io/blockchain) for documentation on transaction formats.

```js
import BandProtocolClient from 'bandprotocol'

// Initialize client
const client = new BandProtocolClient({
  httpEndpoint: 'http://localhost:26657',
  keyProvider: '<privateKey>'
})

// Generate unsigned transaction from node
const unsignedTx = await client.blockchain.txgen({
  "msgid": 1,
  "vk": "6ddb22994b551f4da5818e7a257d467e9af753348194f31dddc5f9aa489d3da1",
  "dest": "eed0ea6675438f06baa20a75c3ea3e027728e5d1",
  "token": "0000000000000000000000000000000000000000",
  "value": "200"
})

// Sign the transaction
const signedTx = await client.key.sign(unsignedTx)

// Broadcast the signed transaction
const result = await client.blockchain.broadcastTxn(signedTx)
```

## Development

```
yarn install
```

## Test

```
yarn test
```

## Build

Compile TypeScript down to ES2017 under `/dist` directory. Useful for distribution/NPM publish.

```
yarn build
```

## License

[MIT](LICENSE.md)
