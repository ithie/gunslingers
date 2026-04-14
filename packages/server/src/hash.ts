import { SECRET_HASH } from './config'

const call = (key = '', salt = 0) => {
  let hash = SECRET_HASH

  ;[...key].forEach((char: string, index: number) => {
    const n =
      ((index + 1) * 7) / (index + 1) +
      (char?.codePointAt(0) || 0) * (index + 1) +
      salt

    hash ^= n
    hash = Math.imul(hash, 16777619)

    return hash
  })
  return (hash >>> 0).toString(16).padStart(8, '0')
}

export default ({ phrase = '', salt }: { phrase: string; salt: string }) => {
  const extractedSalt = parseInt(
    salt
      .split('')
      .map((char) => char.codePointAt(0))
      .join(''),
    10,
  )

  const n1 = call(`${SECRET_HASH}${phrase}`, extractedSalt + 0x1111)
  const n2 = call(`${n1}${phrase}`, extractedSalt + 0x2222)
  const n3 = call(`${n2}${phrase}`, extractedSalt + 0x3333)
  const n4 = call(`${n3}${phrase}`, extractedSalt + 0x4444)

  return `${n2}${n1}${n3}${n4}`
}
