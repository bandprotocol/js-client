import * as chai from 'chai'
import { verifyKeyToAddress } from '~/utils/address'

const should = chai.should()

describe('fn:verifyKeyToAddress', () => {
  it('should give a correct address', () => {
    const verifyKey =
      'f1e23926c568996d50ac68866959d256384ec835090d79ffad4f71c84929c1eb'
    should.equal(
      verifyKeyToAddress(verifyKey),
      'AX57 8QTS 4H3G PWFW 7BFA AAL7 NMYV 5R4L K96X'
    )
  })
})
