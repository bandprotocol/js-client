import { RPCEngine } from '~/rpc-engine'
import { rpc } from '~/utils'

import { RPCBroadcastTxCommit, RPCAbciQuery } from '~/rpc-method'

import { AbciTxgen, AbciBalance } from '~/abci-query-method'

type Call<M extends (...args: any[]) => any> = ReturnType<M>

export class Blockchain {
  rpcEngine: RPCEngine

  constructor(private httpEndpoint: string) {
    this.rpcEngine = new RPCEngine(httpEndpoint)
  }

  @rpc(RPCBroadcastTxCommit) //
  public broadcastTxn: Call<typeof RPCBroadcastTxCommit>

  @rpc(RPCAbciQuery) //
  public abciQuery: Call<typeof RPCAbciQuery>

  @rpc(AbciTxgen) //
  public txgen: Call<typeof AbciTxgen>

  @rpc(AbciBalance) //
  public balance: Call<typeof AbciBalance>
}
