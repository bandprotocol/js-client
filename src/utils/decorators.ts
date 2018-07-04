/**
 * Method decorator to bind property to rpcEngine call
 */
export const rpc = fn => (target, key: string): any => {
  return {
    get() {
      if (!this.rpcEngine)
        throw new Error(
          'Please supply httpEndpoint in client config to use RPC feature'
        )
      return fn.bind(this)
    },

    set(value) {
      throw new Error(`Cannot set ${key}`)
    },
  }
}
