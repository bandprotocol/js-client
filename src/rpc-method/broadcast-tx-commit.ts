import { RPCEngine } from '~/rpc-engine'
import { convert } from '~/utils'

interface Params {
  tx: string
}

interface Result {
  check_tx: any
  deliver_tx: any
  hash: string
  height: number
}

export const RPCBroadcastTxCommit = (rpcEngine: RPCEngine) => async (
  signedTxnHex: string
): Promise<Result> => {
  const result = await rpcEngine.call<Params, Result>('broadcast_tx_commit', {
    tx: convert(signedTxnHex, 'hex', 'base64'),
  })

  return result
}
