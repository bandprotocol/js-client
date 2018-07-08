import * as chai from 'chai'
import BandProtocolClient from '~/index'

const should = chai.should()

describe('class:BandProtocolClient', () => {
  it('should initialize', () => {
    const client = new BandProtocolClient({
      httpEndpoint: 'http://localhost:26657',
      keyProvider: null,
    })

    should.exist(client)
  })

  it('should generate passcode-encryped key and recover private key from it', () => {
    const passcode = '123456789'
    const { privateKey } = BandProtocolClient.generateRandomKey()

    const client = new BandProtocolClient({
      keyProvider: privateKey,
    })
    const box = client.key.encrypt(passcode)
    const recoveredClient = new BandProtocolClient({
      keyProvider: { box, passcode },
    })

    should.equal(privateKey, recoveredClient.key.getPrivateKey())
  })
})
