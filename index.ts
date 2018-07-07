// Shim
declare var global: { crypto; window }
require('buffer')

// Shim window scope in Node.js
if (typeof window === 'undefined') {
  global.window = global
}

// Shim crypto module with isomorphic-webcrypto
global.crypto = global.crypto || require('isomorphic-webcrypto')

// Business as usual
import BandProtocolClient from './src/index'

module.exports = BandProtocolClient
module.exports.default = BandProtocolClient
