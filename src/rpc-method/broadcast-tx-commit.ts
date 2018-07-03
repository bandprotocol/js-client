import { RPCEngine } from '~/rpc-engine'
import { hex2base64 } from '~/utils'

interface Params {
  tx: string
}

interface Result {
  check_tx: any
  deliver_tx: any
  hash: string
  height: number
}

export default async (signedTxnHex: string): Promise<Result> => {
  const { rpcEngine }: { rpcEngine: RPCEngine } = this

  return await rpcEngine.call<Params, Result>('broadcast_tx_commit', {
    tx: hex2base64(signedTxnHex),
  })
}
