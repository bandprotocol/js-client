# Band Protocol JS Library

[![NPM](https://nodei.co/npm/bandprotocol.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/bandprotocol/)

[![Code Style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![Dependency Status](https://david-dm.org/bandprotocol/js-client.svg)](https://david-dm.org/bandprotocol/js-client)
[![devDependency Status](https://david-dm.org/bandprotocol/js-client/dev-status.svg)](https://david-dm.org/bandprotocol/js-client#info=devDependencies)
[![NPM Downloads](https://img.shields.io/npm/dt/express.svg)](https://nodei.co/npm/bandprotocol/)

## Dependencies

- [TypeScript](https://www.typescriptlang.org/)
- [bip39](https://github.com/bitcoinjs/bip39)
- [libsodium.js](https://github.com/jedisct1/libsodium.js)

## Installation

```
npm i --save bandprotocol
```

## Basic Usage

```js
import BandProtocolClient from 'bandprotocol'
import { secretKey } from './config'

const client = new BandProtocolClient({
  httpEndpoint: 'http://localhost:26657',
  keyProvider: secretKey,
})
```

### Key Generation

This library supports secure key generations using ED25519 algorithm.

```js
const {
  mnemonic, // Array<string x 12> of Mnemonic phrase
  secretKey, // 64-byte hex string secret key
  verifyKey, // 32-byte hex string public key
  address, // IBAN-style address
} = BandProtocolClient.generateRandomKey()
```

### Transaction Generation

Every transaction is created on the remote node via JSON-RPC protocol and signed on the client. This design allows higher portability comparing to client-generated transactions, while the client keeps its secret keys secured.

See [BandProtocol's Gitbook](https://bandprotocol.gitbook.io/blockchain) for documentation on transaction formats.

```js
import BandProtocolClient from 'bandprotocol'

// Initialize client
const client = new BandProtocolClient({
  httpEndpoint: 'http://localhost:26657',
  keyProvider: '<secretKey>',
})

// Generate unsigned transaction from node
const unsignedTx = await client.blockchain.txgen({
  msgid: 1,
  vk: '6ddb22994b551f4da5818e7a257d467e9af753348194f31dddc5f9aa489d3da1',
  dest: 'AX62 ECTZ WZZ5 XVTG N8NL 6EVB 9TPH TELJ ZBRL,
  token: 'BX63 AAAA AAAA AAAA AAAA AAAA AAAA AAAA AAAA',
  value: '200',
})

// Sign the transaction
const signedTx = client.key.sign(unsignedTx)

// Broadcast the signed transaction
const result = await client.blockchain.broadcastTxn(signedTx)
```

### Encrypted Secret Key (SecretBox)

The client supports secret key encryption via [Libsodium's Secret-key encryption](https://download.libsodium.org/doc/secret-key_cryptography/authenticated_encryption.html). Application server can store the secretbox without exposing the risk of leaking user's secret keys, given that the passcodes are strong enough.

To create secretbox from secret key, you'll need to initialize the client with secret key:

```js
const passcode = '<some_user_defined_passcode>'
const client = new BandProtocolClient({ keyProvider: '<secretKey>' })

const secretbox = client.encrypt(passcode)
```

To restore client instance and secret key:

```js
const client = new BandProtocolClient({
  keyProvider: {
    secretbox: '<encrypted_secretbox>',
    passcode: '<user_passcode>',
  },
})

const secretKey = client.getSecretKey()
```

## Development

Make sure you have [Node.js v8+](https://nodejs.org/en/) installed. Then run:

```
yarn install
```

## Test

Only **Unit Tests** are implemented for now. Integration tests with testnet can be possible, and we highly encourage you to contribute to make this happen.

```
yarn test
```

## Build

To make it compatible with React Native, the TypeScript code is compiled and shimmed to avoid direct call of Node.js libraries. `compile.js` takes care of compilation process using [Browserify](http://browserify.org/).

```
yarn build
```

## License

[MIT](LICENSE.md)
