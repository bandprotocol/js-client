import { Blockchain } from '~/blockchain'
import { KeyManager } from '~/key-manager'
import { Config } from '~/config'
import DefaultABI from '~/default-abi'

import { varintEncode } from '~/utils/varint'
import shajs = require('sha.js')

type KeyProvider =
  | string
  | {
      secretbox?: string
      passcode?: string
      mnemonic?: string | string[]
    }

export default class BandProtocolClient {
  static generateRandomKey = KeyManager.generateRandomKey
  static verifyKeyToAddress = KeyManager.verifyKeyToAddress
  static verifySignature = KeyManager.verifySignature

  static hashedCommit(choice, nonce) {
    return shajs('sha256')
      .update(Buffer.concat([Buffer.from([choice]), varintEncode(nonce)]))
      .digest()
  }

  blockchain: Blockchain
  key: KeyManager

  constructor(
    public config: Config | string,
    keyProvider: KeyProvider,
    abi = DefaultABI
  ) {
    if (typeof config === 'string') {
      config = new Config(config)
    }

    this.blockchain = new Blockchain(config, abi)

    if (keyProvider) {
      if (typeof keyProvider === 'string') {
        this.key = KeyManager.fromSecretKey(keyProvider)
      } else if (
        typeof keyProvider === 'object' &&
        keyProvider.secretbox &&
        keyProvider.passcode
      ) {
        this.key = KeyManager.fromSecretBox(
          keyProvider.secretbox,
          keyProvider.passcode
        )
      } else if (typeof keyProvider === 'object' && keyProvider.mnemonic) {
        let mnemonicArr =
          typeof keyProvider.mnemonic === 'string'
            ? keyProvider.mnemonic.trim().split(' ')
            : keyProvider.mnemonic

        if (mnemonicArr.length !== 24) {
          throw new Error('Mnemonic must consist of 24 words')
        }

        this.key = KeyManager.fromMnemonic(mnemonicArr)
      }
    }
  }
}
