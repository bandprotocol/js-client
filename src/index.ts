import { Blockchain } from '~/blockchain'
import { KeyManager } from '~/key-manager'

interface ClientConfig {
  httpEndpoint?: string
  keyProvider?:
    | string
    | {
        secretbox?: string
        passcode?: string
        mnemonic?: string | string[]
      }
}

export default class BandProtocolClient {
  static generateRandomKey = KeyManager.generateRandomKey

  blockchain: Blockchain
  key: KeyManager

  constructor(public config: ClientConfig) {
    if (typeof config !== 'object') {
      throw new Error('BandProtocolClient has to be instantiated with config')
    }

    if (config.httpEndpoint) {
      this.blockchain = new Blockchain(config.httpEndpoint)
    }

    if (config.keyProvider) {
      if (typeof config.keyProvider === 'string') {
        this.key = KeyManager.fromSecretKey(config.keyProvider)
      } else if (
        typeof config.keyProvider === 'object' &&
        config.keyProvider.secretbox &&
        config.keyProvider.passcode
      ) {
        this.key = KeyManager.fromSecretBox(
          config.keyProvider.secretbox,
          config.keyProvider.passcode
        )
      } else if (
        typeof config.keyProvider === 'object' &&
        config.keyProvider.mnemonic
      ) {
        let mnemonicArr =
          typeof config.keyProvider.mnemonic === 'string'
            ? config.keyProvider.mnemonic.trim().split(' ')
            : config.keyProvider.mnemonic

        if (mnemonicArr.length !== 24) {
          throw new Error('Mnemonic must consist of 24 words')
        }

        this.key = KeyManager.fromMnemonic(mnemonicArr)
      }
    }
  }
}
