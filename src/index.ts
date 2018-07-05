require('buffer')
import { Blockchain } from '~/blockchain'
import { KeyManager } from '~/key-manager'
import { ready } from '~/crypto/ed25519'

interface ClientConfig {
  httpEndpoint?: string
  keyProvider?: string
}

export default class BandProtocolClient {
  static ready = ready
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
      this.key = KeyManager.fromPrivateKey(config.keyProvider)
    }
  }
}
