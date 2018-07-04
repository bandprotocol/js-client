import Axios, { AxiosInstance } from 'axios'
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
  private axios: AxiosInstance

  constructor(private endpoint: string, timeout: number = 1000) {
    this.axios = Axios.create({
      baseURL: endpoint,
      timeout,
    })
  }

  async call<Params = object, Result = object>(
    method: string,
    params: Params,
    id: string = generateRandomString()
  ): Promise<Result> {
    try {
      const axiosResponse = await this.axios.post('/', {
        jsonrpc: '2.0',
        method,
        params,
        id,
      })

      const data = <RPCResponse<Result>>axiosResponse.data

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
