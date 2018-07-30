/**
 * This file exposes BandProtocolClient and shim some of the
 * components to make it work on Web, Node.js, and React Native
 *
 * This can get a bit too ugly and hard to test. Treat it with care.
 */

// Shim
declare var global: { Buffer; crypto; fetch; window; self }

// Shim window scope in Node.js
if (typeof window === 'undefined') {
  global.window = global
}

// Shim self scope in Node.js
if (typeof self === 'undefined') {
  global.self = global
}

// Shim crypto module with isomorphic-webcrypto
if (!global.crypto) {
  global.crypto = require('isomorphic-webcrypto')
}

// Shim fetch
if (!global.fetch) {
  global.fetch = require('isomorphic-fetch')
}

// Shim Buffer
if (!global.Buffer) {
  global.Buffer = require('safe-buffer').Buffer
}

// Business as usual
import BandProtocolClient from './src/index'

module.exports = BandProtocolClient
module.exports.default = BandProtocolClient

// Tools exposed for debugging purpose
import * as ED25518 from '~/crypto/ed25519'
import * as SecretBox from '~/crypto/secretbox'

module.exports.__tools__ = {
  ED25518,
  SecretBox,
}
