import { generateRandomString } from '~/utils'

interface RPCResponse<Result> {
  jsonrpc: string
  id: number
  result?: Result
  error?: {
    code: number
    message: string
    data: string
  }
}

export class RPCError extends Error {
  constructor(message: string, public info: object) {
    super(message)
  }
}

export class RPCEngine {
  constructor(private endpoint: string) {}

  async call<Params = object, Result = object>(
    method: string,
    params: Params,
    id: string = generateRandomString()
  ): Promise<Result> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method,
          params,
          id,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new RPCError('BAND_REJECT', data.error)
      }

      return data.result
    } catch (e) {
      console.error('RPC Call Error:', e.message)
      throw new RPCError('ENDPOINT_UNAVAILABLE', e)
    }
  }
}
