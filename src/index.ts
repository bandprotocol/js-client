import { Blockchain } from '~/blockchain'
import { KeyManager } from '~/key-manager'
import { Config } from '~/config'
import DefaultABI from '~/default-abi'

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

  blockchain: Blockchain
  key: KeyManager

  constructor(
    public config: Config,
    keyProvider: KeyProvider,
    abi = DefaultABI
  ) {
    if (typeof config !== 'object') {
      throw new Error('BandProtocolClient has to be instantiated with config')
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
