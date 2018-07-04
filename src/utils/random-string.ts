const characterPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export const generateRandomString = (length: number = 32) => {
  return Array(length)
    .fill(0)
    .map(_ => characterPool[Math.floor(Math.random() * characterPool.length)])
    .join('')
}
