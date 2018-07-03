import Axios, { AxiosInstance } from 'axios'

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
    id: number = undefined
  ): Promise<Result> {
    console.log('Call', method, params, id)
    // try {
    //   const axiosResponse = await this.axios.post('/', {
    //     jsonrpc: '2.0',
    //     method,
    //     params,
    //     id,
    //   })

    //   const data = <RPCResponse<Result>>axiosResponse.data

    //   if (data.error) {
    //     throw new RPCError('BAND_REJECT', data.error)
    //   }

    //   return data.result
    // } catch (e) {
    //   throw new RPCError('ENDPOINT_UNAVAILABLE', e)
    // }
  }
}
