// Shim
declare var global: { crypto; fetch; window; self }
require('buffer')

// Shim window scope in Node.js
if (typeof window === 'undefined') {
  global.window = global
}

// Shim self scope in Node.js
if (typeof self === 'undefined') {
  global.self = global
}

// Shim crypto module with isomorphic-webcrypto
global.crypto = global.crypto || require('isomorphic-webcrypto')

// Shim fetch
global.fetch = global.fetch || require('isomorphic-fetch')

// Business as usual
import BandProtocolClient from './src/index'

module.exports = BandProtocolClient
module.exports.default = BandProtocolClient
