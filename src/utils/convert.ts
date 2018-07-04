type supportedFormat = 'utf8' | 'hex' | 'base64'

export function convert(
  data: string,
  from: supportedFormat,
  to: supportedFormat
) {
  return new Buffer(data, from).toString(to)
}
