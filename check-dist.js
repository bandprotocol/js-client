const BandProtocolClient = require('./dist.js').default

const keys = BandProtocolClient.generateRandomKey()

console.log('Random Keys', keys)
