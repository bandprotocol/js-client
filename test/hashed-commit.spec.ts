import * as chai from 'chai'
import BandProtocolClient from '~/index'

const should = chai.should()

describe('class:BandProtocolClient', () => {
  it('should hashedCommit successfully', () => {
    const hashedCommit = BandProtocolClient.hashedCommit(1, 9999)
    console.log(hashedCommit)
  })
})
