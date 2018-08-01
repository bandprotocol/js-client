export class RealClock {
  get_time() {
    return Math.floor(Date.now() / 1000)
  }
}

export class MockClock {
  constructor(public current_time) {}

  set_time(current_time) {
    this.current_time = current_time
  }

  get_time() {
    return this.current_time
  }
}

export class Config {
  constructor(public endpoint, public clock?) {
    if (!clock) this.clock = new RealClock()
  }
}
