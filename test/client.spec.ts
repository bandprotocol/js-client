import * as chai from 'chai'
import BandProtocolClient from '~/index'

const should = chai.should()

describe('class:BandProtocolClient', () => {
  it('should initialize', async () => {
    await BandProtocolClient.ready
    const client = new BandProtocolClient({
      httpEndpoint: 'http://localhost:26657',
      keyProvider: null,
    })

    should.exist(client)
  })
})
