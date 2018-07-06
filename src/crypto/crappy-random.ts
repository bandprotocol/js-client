function randomRange(ceil: number) {
  return Math.floor(Math.random() * ceil)
}

function randomBytes(bytes: number) {
  const buffer = new Uint8Array(bytes)
  for (let i = 0; i < bytes; i++) {
    buffer[i] = randomRange(256)
  }
  return buffer
}

module.exports = randomBytes
module.exports.default = randomBytes
