var assert = require('nanoassert')
var randomBytes = require('../crappy-random')

const randombytes = function(out, n) {
  const buffer = randomBytes(n)
  out.set(buffer)
}

Object.defineProperty(module.exports, 'randombytes', {
  value: randombytes,
})

module.exports.randombytes_buf = function(out) {
  assert(out, 'out must be given')
  randombytes(out, out.length)
}
