const BandProtocolClient = require('./dist')

const keys = BandProtocolClient.generateRandomKey()

console.log('Random Keys', keys)

const BLOCKCHAIN_ENDPOINT = 'http://testnet.bandprotocol.com:26657'

const client = new BandProtocolClient({
  keyProvider: keys.secretKey,
  httpEndpoint: BLOCKCHAIN_ENDPOINT,
})

client.blockchain
  .balance(
    '26daad0c2f2dae34db0f5f6f79e56486055732bc',
    '0000000000000000000000000000000000000000'
  )
  .then(x => console.log('Balance =', x))
  .catch(e => console.log('Error', e))
