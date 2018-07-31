import * as chai from 'chai'
import { BigNumber } from 'bignumber.js'
import { fromVarint, toVarint } from '~/utils/varint'

const should = chai.should()

describe('util:varint', () => {
  describe('fn:toVarint', () => {
    it('should convert BigNumber to varint', () => {
      const num = new BigNumber('1234567890')
      const varint = toVarint(num)
      should.equal(varint.toString('base64'), '0oXYzAQ=')
    })
  })
  describe('fn:fromVarint', () => {
    it('should convert varint Buffer to BigNumber', () => {
      const varint = Buffer.from('0oXYzAQ=', 'base64')
      const num = fromVarint(varint)
      should.equal(num.toString(), '1234567890')
    })
  })
})
