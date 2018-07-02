# Band Protocol JS Library

## Dependencies

- [TypeScript](https://www.typescriptlang.org/)
- [supercop.js (local copy)](https://github.com/1p6/supercop.js)

## Key Generation

This library supports secure key generations using ED25519 algorithm.

## Transaction Generation

Every transaction is created on the remote node via JSON-RPC protocol and signed on the client. This design allows higher portability comparing to client-generated transactions, while the client keeps its private keys secured.

## Development

```
yarn install
```

## Test

```
yarn test
```
