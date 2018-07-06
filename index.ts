// Shim
declare var global: { crypto }
require('buffer')
global.crypto = require('isomorphic-webcrypto')

// Business as usual
import BandProtocolClient from './src/index'

module.exports = {
  default: BandProtocolClient,
}
