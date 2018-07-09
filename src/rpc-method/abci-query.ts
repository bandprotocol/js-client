import { RPCEngine } from '~/rpc-engine'
import { convert } from '~/utils'

interface Params {
  data: string
}

interface Result {
  response: {
    value: string
    height: string
  }
}

export const RPCAbciQuery = <Response = any>(rpcEngine: RPCEngine) => async (
  method: string,
  params: object
): Promise<Response> => {
  const result = await rpcEngine.call<Params, Result>('abci_query', {
    data: convert(JSON.stringify({ method, params }), 'utf8', 'hex'),
  })

  return <Response>JSON.parse(convert(result.response.value, 'base64', 'utf8'))
}
