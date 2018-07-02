import * as chai from 'chai'
import BandProtocolClient from '~/index'

const should = chai.should()

describe('class:BandProtocolClient', () => {
  it('should initialize', () => {
    const client = new BandProtocolClient()
    should.exist(client)
  })
})
