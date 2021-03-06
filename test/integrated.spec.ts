import BandProtocolClient from '~/index'
import { Config, MockClock } from '~/config'
import { varintEncode } from '~/utils/varint'
import shajs = require('sha.js')
;(async () => {
  const clock = new MockClock(0)

  const client = new BandProtocolClient(
    new Config('http://192.168.134.129:26657/', clock),
    'e480f19604b0e44a0b65b67315c97ffac223a4e85c764a6890ac05e3047fb93878e3d3647baadde0b9e92c3bb2eca1b8b8944cf263c5ef38a7d489f8a64baedd'
  )
  const client2 = new BandProtocolClient(
    new Config('http://192.168.134.129:26657/', clock),
    '5e44d24cb81f599fbaac9d0817290aa810beac244af95f163837fedd68749633fb6fc5062d71cb56d1dff269ffb050b962c1e346b44f8eccecb673e7f88553e4'
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

  const ct_id = await creator
    .method('create')
    .call(
      client.blockchain
        .contract('Token')
        .__constructor__(
          'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
          Buffer.from('01080706', 'hex')
        )
    )
  const ct_token = await client.blockchain.contract('Token').call(ct_id)

  const voting_id = await creator
    .method('create')
    .call(client.blockchain.contract('Voting').__constructor__(ct_id))
  const vote = await client.blockchain.contract('Voting').call(voting_id)

  const tcr_id = await creator
    .method('create')
    .call(
      client.blockchain.contract('Registry').__constructor__(ct_id, voting_id)
    )
  const tcr = await client.blockchain.contract('Registry').call(tcr_id)

  await token.method('mint').call(client.key, 0, 1000)
  await ct_token.method('buy').call(client.key, 1, 500)
  await vote.method('request_voting_power').call(client.key, 2, 100)

  await tcr
    .method('apply')
    .call(client.key, 3, 'Swit will come back to Thai!!!!', 120)

  // client 2 challenge
  clock.set_time(10)

  const addr2 = await creator
    .method('create')
    .call(
      client2.blockchain
        .contract('Account')
        .__constructor__(client2.key.getVerifyKey())
    )
  const account2 = await client.blockchain.contract('Account').call(addr2)

  await token.method('mint').call(client2.key, 0, 700)
  await ct_token.method('buy').call(client2.key, 1, 500)
  await tcr.method('challenge').call(client2.key, 2, 1, "He won't come back.")

  // no one vote
  clock.set_time(220)
  await tcr.method('update_status').call(client2.key, 3, 1)

  // New apply
  clock.set_time(300)
  await tcr.method('apply').call(client.key, 4, 'Swit loves kfc too much.', 200)

  clock.set_time(401)
  await tcr.method('update_status').call(client.key, 5, 2)

  clock.set_time(420)
  await tcr
    .method('challenge')
    .call(client2.key, 4, 2, 'He loves Mcdonald more.')

  // Create 3 voter
  clock.set_time(450)
  const voter1 = new BandProtocolClient(
    new Config('http://192.168.134.129:26657/', clock),
    '7a54dc810f0a5889da9f32620c675375d63bdfebb20ac6a6669c7ed48da2c516e19d33b8365584aef2bf9a54f2d7cfbd025cc94b536dc1da04f5f05a0ceca652'
  )
  const voter2 = new BandProtocolClient(
    new Config('http://192.168.134.129:26657/', clock),
    '065fb538352b432443c0f509a7c462e903a324120d41bf972799eeec9ec37058a00e155d681fc36325b2148bf54b43841104353470fefd921f18b1b27c89cd42'
  )
  const voter3 = new BandProtocolClient(
    new Config('http://192.168.134.129:26657/', clock),
    'a5a51a0974bb2fbea0abfc68d14b9ef226f8ed2eaa98c293d173e40e221e8eabe3b7d02e3ef94c0e3d47fef2a90ba51150abd47dd34876758b5267ce265fc1b0'
  )
  const voter4 = new BandProtocolClient(
    new Config('http://192.168.134.129:26657/', clock),
    '124d043b9e8f757764bec574a2e24532663c83fadf4c9c681f9dec64521712d34a31eeee9abbbbee78f0b7cd21136b66f6e17d00c0c20e76db7d352ca188d3fc'
  )

  const addrv1 = await creator
    .method('create')
    .call(
      voter1.blockchain
        .contract('Account')
        .__constructor__(voter1.key.getVerifyKey())
    )
  const av1 = await voter1.blockchain.contract('Account').call(addrv1)
  const addrv2 = await creator
    .method('create')
    .call(
      voter2.blockchain
        .contract('Account')
        .__constructor__(voter2.key.getVerifyKey())
    )
  const av2 = await voter2.blockchain.contract('Account').call(addrv2)
  const addrv3 = await creator
    .method('create')
    .call(
      voter3.blockchain
        .contract('Account')
        .__constructor__(voter3.key.getVerifyKey())
    )
  const av3 = await voter3.blockchain.contract('Account').call(addrv3)
  const addrv4 = await creator
    .method('create')
    .call(
      voter4.blockchain
        .contract('Account')
        .__constructor__(voter4.key.getVerifyKey())
    )
  const av4 = await voter4.blockchain.contract('Account').call(addrv4)

  await ct_token.method('mint').call(voter1.key, 0, 1000)
  await ct_token.method('mint').call(voter2.key, 0, 1000)
  await ct_token.method('mint').call(voter3.key, 0, 1000)
  await ct_token.method('mint').call(voter4.key, 0, 1000)

  await vote.method('request_voting_power').call(voter1.key, 1, 700)
  await vote.method('request_voting_power').call(voter2.key, 1, 400)
  await vote.method('request_voting_power').call(voter3.key, 1, 400)
  await vote.method('request_voting_power').call(voter4.key, 1, 200)

  await vote.method('commit_vote').call(
    voter1.key,
    2,
    2,
    shajs('sha256')
      .update(Buffer.concat([Buffer.from([0]), varintEncode(79)]))
      .digest(),
    700
  )
  await vote.method('commit_vote').call(
    voter2.key,
    2,
    2,
    shajs('sha256')
      .update(Buffer.concat([Buffer.from([1]), varintEncode(434)]))
      .digest(),
    400
  )
  await vote.method('commit_vote').call(
    voter3.key,
    2,
    2,
    shajs('sha256')
      .update(Buffer.concat([Buffer.from([1]), varintEncode(178)]))
      .digest(),
    400
  )

  clock.set_time(550)
  await vote.method('commit_vote').call(
    voter4.key,
    2,
    2,
    shajs('sha256')
      .update(Buffer.concat([Buffer.from([0]), varintEncode(999)]))
      .digest(),
    200
  )
  await vote.method('reveal_vote').call(voter1.key, 3, 2, false, 79)

  clock.set_time(600)
  await vote.method('reveal_vote').call(voter2.key, 3, 2, true, 434)
  await vote.method('reveal_vote').call(voter3.key, 3, 2, true, 178)

  clock.set_time(630)
  await tcr.method('update_status').call(client.key, 6, 2)

  await ct_token.method('balance').call(addrv2)
  await tcr.method('claim_reward').call(voter2.key, 4, 2, 434)
  await ct_token.method('balance').call(addrv2)

  await ct_token.method('balance').call(addrv3)
  await tcr.method('claim_reward').call(voter3.key, 4, 2, 178)
  await ct_token.method('balance').call(addrv3)

  await vote.method('withdraw_voting_power').call(voter1.key, 4, 678)

  // Deposit and withdraw stake on list
  await ct_token.method('balance').call(addr)
  await tcr.method('withdraw').call(client.key, 7, 2, 150)
  await ct_token.method('balance').call(addr)

  await ct_token.method('balance').call(addr)
  await tcr.method('deposit').call(client.key, 8, 2, 200)
  await ct_token.method('balance').call(addr)

  // New list and challenge
  clock.set_time(700)
  await tcr
    .method('apply')
    .call(client2.key, 5, "I don't want to know story about Swit.", 300)

  clock.set_time(750)
  await tcr.method('withdraw').call(client.key, 9, 2, 50)
  await tcr
    .method('challenge')
    .call(
      client.key,
      10,
      3,
      'Swit is a famous person, everyone want to know everything about him!!'
    )

  await vote.method('request_voting_power').call(voter1.key, 5, 378)

  clock.set_time(800)
  await vote.method('commit_vote').call(
    voter1.key,
    6,
    3,
    shajs('sha256')
      .update(Buffer.concat([Buffer.from([1]), varintEncode(1476)]))
      .digest(),
    400
  )
  await vote.method('commit_vote').call(
    voter2.key,
    5,
    3,
    shajs('sha256')
      .update(Buffer.concat([Buffer.from([1]), varintEncode(5810)]))
      .digest(),
    400
  )
  await vote.method('commit_vote').call(
    voter3.key,
    5,
    3,
    shajs('sha256')
      .update(Buffer.concat([Buffer.from([0]), varintEncode(7223)]))
      .digest(),
    400
  )
  await vote.method('commit_vote').call(
    voter4.key,
    2,
    3,
    shajs('sha256')
      .update(Buffer.concat([Buffer.from([0]), varintEncode(9875)]))
      .digest(),
    200
  )

  // voter 2 forget to reveal so bad :(
  clock.set_time(900)
  await vote.method('reveal_vote').call(voter1.key, 7, 3, true, 1476)
  await vote.method('reveal_vote').call(voter3.key, 6, 3, false, 7223)
  await vote.method('reveal_vote').call(voter4.key, 3, 3, false, 9875)

  // voter 1 want token can withdraw because reveal vote already
  clock.set_time(914)
  await vote.method('withdraw_voting_power').call(voter1.key, 8, 300)

  // too late!
  clock.set_time(951)
  await vote.method('reveal_vote').call(voter2.key, 6, 3, true, 5810)

  // addr1 update status want to beat challenge (remove list)
  await tcr.method('update_status').call(client.key, 11, 3)

  await ct_token.method('balance').call(addr)
  // 150

  // Voter 2 want to withdraw vote
  await vote.method('withdraw_voting_power').call(voter2.key, 6, 300)

  await vote.method('rescue_token').call(voter2.key, 6, 3)

  // Voter 2 can withdraw now
  await vote.method('withdraw_voting_power').call(voter2.key, 7, 400)

  // voter 3 and 4 claim reward
  await ct_token.method('balance').call(addrv3)
  // 625
  await tcr.method('claim_reward').call(voter3.key, 7, 3, 7223)
  await ct_token.method('balance').call(addrv3)
  // 658

  await ct_token.method('balance').call(addrv4)
  // 800
  await tcr.method('claim_reward').call(voter4.key, 4, 3, 9875)
  await ct_token.method('balance').call(addrv4)
  // 817

  await ct_token.method('balance').call(addr)
  // 150
  await tcr.method('exit').call(client.key, 12, 2)
  await ct_token.method('balance').call(addr)

  console.log('nonce >>', (await account.method('get_nonce').call()).toString())
  // 400
})()
