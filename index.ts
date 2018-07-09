// Shim
declare var global: { crypto; window; XMLHttpRequest }
require('buffer')

// Shim window scope in Node.js
if (typeof window === 'undefined') {
  global.window = global
}

// Shim XMLHttpRequest
if (!global.XMLHttpRequest) {
  global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
}

// Shim crypto module with isomorphic-webcrypto
global.crypto = global.crypto || require('isomorphic-webcrypto')

// Business as usual
import BandProtocolClient from './src/index'

module.exports = BandProtocolClient
module.exports.default = BandProtocolClient
