interface ClientConfig {
  httpEndpoint: string
  keyProvider: string | ((...args: any[]) => string)
}

export class BandProtocolClient {
  constructor(private config: ClientConfig) {
    // TODO
  }
}
