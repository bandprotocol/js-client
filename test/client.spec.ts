import * as chai from 'chai'
import BandProtocolClient from '~/index'

import * as BIP39 from '~/crypto/bip39'

const should = chai.should()

describe('class:BandProtocolClient', () => {
  it('should initialize', () => {
    const client = new BandProtocolClient({
      httpEndpoint: 'http://localhost:26657',
      keyProvider: null,
    })

    should.exist(client)
  })

  it('should generate 24-word mnemonic from generateRandomKey and recover secret key', () => {
    const { mnemonic, secretKey } = BandProtocolClient.generateRandomKey()
    should.equal(mnemonic.length, 24)

    // Recover from mnemonic
    const recoveredClient = new BandProtocolClient({
      keyProvider: { mnemonic },
    })

    should.equal(secretKey, recoveredClient.key.getSecretKey())
  })

  it('should generate passcode-encryped key and recover secret key from it', () => {
    const passcode = '123456789'
    const { secretKey } = BandProtocolClient.generateRandomKey()

    // Generate secretbox from secretKey
    const client = new BandProtocolClient({
      keyProvider: secretKey,
    })
    const secretbox = client.key.encrypt(passcode)

    // Recover from secretbox
    const recoveredClient = new BandProtocolClient({
      keyProvider: { secretbox, passcode },
    })

    should.equal(secretKey, recoveredClient.key.getSecretKey())
  })
})
