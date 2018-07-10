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

  it('should generate passcode-encryped key and recover secret key from it', () => {
    const passcode = '123456789'
    const { secretKey } = BandProtocolClient.generateRandomKey()

    const client = new BandProtocolClient({
      keyProvider: secretKey,
    })
    const secretbox = client.key.encrypt(passcode)
    const recoveredClient = new BandProtocolClient({
      keyProvider: { secretbox, passcode },
    })

    should.equal(secretKey, recoveredClient.key.getSecretKey())
  })
})
