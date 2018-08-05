import BandProtocolClient from '~/index'
import { Config, MockClock } from '~/config'

declare var global: { fetch }
global.fetch = require('isomorphic-fetch')
;(async () => {
  const clock = new MockClock(0)

  const client = new BandProtocolClient(
    new Config('http://0.0.0.0:26657/', clock),
    'e480f19604b0e44a0b65b67315c97ffac223a4e85c764a6890ac05e3047fb93878e3d3647baadde0b9e92c3bb2eca1b8b8944cf263c5ef38a7d489f8a64baedd'
  )

  const creator = await client.blockchain
    .contract('Creator')
    .call([...Array(40).fill('0')].join(''))
  const token = await client.blockchain
    .contract('Token')
    .call('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')

  const addr = await creator
    .method('create')
    .call(
      client.blockchain
        .contract('Account')
        .__constructor__(client.key.getVerifyKey())
    )
  const account = await client.blockchain.contract('Account').call(addr)

  const ct_id = await creator.method('create').call(
    client.blockchain.contract('Token').__constructor__(
      'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      Buffer.from('06080702', 'hex') // Y = X^2
    )
  )
  const ct_token = await client.blockchain.contract('Token').call(ct_id)

  const voting_id = await creator
    .method('create')
    .call(client.blockchain.contract('Voting').__constructor__(ct_id))
  const vote = await client.blockchain.contract('Voting').call(voting_id)

  const tcr_id = await creator.method('create').call(
    client.blockchain.contract('Registry').__constructor__(
      ct_id,
      voting_id,
      50, // vote_quorum = 50%
      50, // dispensation_percentage = 50%
      '1000000000000000000000', // min_deposit = 1000 tokens
      300, // apply_duration = 5 minutes
      300, // commit_duration = 5 minutes
      300 // reveal_duration = 5 minutes
    )
  )
  const tcr = await client.blockchain.contract('Registry').call(tcr_id)

  console.log('=========== BLOCKCHAIN INIT ===========')
  console.log('{')
  console.log('=  token_address:"' + ct_id + '",')
  console.log('=  registry_address:"' + tcr_id + '",')
  console.log('=  voting_address:"' + voting_id + '"')
  console.log('}')
  console.log('=======================================')

  /*
    await token.method('mint').call(client.key, 0, 1000)
    await ct_token.method('buy').call(client.key, 1, 500)
    await vote.method('request_voting_power').call(client.key, 2, 100)

    await tcr
      .method('apply')
      .call(client.key, 3, 'Swit will come back to Thai!!!!', 120)
  */
})()
