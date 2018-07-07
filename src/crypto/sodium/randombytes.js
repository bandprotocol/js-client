var assert = require('nanoassert')
var randomBytes = require('../crappy-random')

Object.defineProperty(module.exports, 'randombytes', {
  value: function(out, n) {
    const buffer = randomBytes(n)
    out.set(buffer)
  },
})

module.exports.randombytes_buf = function(out) {
  assert(out, 'out must be given')
  randombytes(out, out.length)
}
