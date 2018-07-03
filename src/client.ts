import { RPCEngine } from '~/rpc-engine'

import RPCBroadcastTxCommit from './rpc-method/broadcast-tx-commit'

interface ClientConfig {
  httpEndpoint?: string
  keyProvider?: string | ((...args: any[]) => string)
}

export class BandProtocolClient {
  private rpcEngine: RPCEngine

  constructor(private config: ClientConfig) {
    // TODO
    if (config.httpEndpoint) {
      this.rpcEngine = new RPCEngine(config.httpEndpoint)
    }
  }

  //@rpc
  get broadcastTxnSync(): typeof RPCBroadcastTxCommit {
    return RPCBroadcastTxCommit.bind(this)
  }
}
