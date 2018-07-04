import { RPCEngine } from '~/rpc-engine'
import { RPCAbciQuery } from '~/rpc-method'

type Result = string

export const AbciTxgen = (rpcEngine: RPCEngine) => async (
  params: object
): Promise<string> => {
  const result = await RPCAbciQuery<Result>(rpcEngine)('txgen', params)

  return result
}
