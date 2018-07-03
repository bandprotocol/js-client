export function hex2base64(hex: string) {
  return new Buffer(hex, 'hex').toString('base64')
}
