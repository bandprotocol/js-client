import * as chai from 'chai'
import { KeyManager } from '~/key-manager'

const should = chai.should()

describe('class:KeyManager', () => {
  it('should create a new instance with factory generateRandom', async () => {
    const keyManager = await KeyManager.generateRandom()
    keyManager.should.be.an.instanceOf(KeyManager)
  })
})
