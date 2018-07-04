import { RPCEngine } from '~/rpc-engine'
import { RPCAbciQuery } from '~/rpc-method'

interface Result {
  balance: string
}

export const AbciBalance = (rpcEngine: RPCEngine) => async (
  address: string,
  token: string
): Promise<string> => {
  const result = await RPCAbciQuery<Result>(rpcEngine)('balance', {
    address,
    token,
  })

  return result.balance
}
