import hash from './hash.js'
import {
  DATA_KEY_ID,
  DATA_KEY_PASSWORD,
  DATA_KEY_ROLE,
  DATA_KEY_SALT,
  DATA_KEY_USERNAME,
  SECRET_KEY,
} from './config.js'
import { createWriteStream, createReadStream } from 'fs'
import path from 'path'
import readline from 'readline'

type USER = [string, string, string, string, string]

const USER_WRITE_STREAM = createWriteStream(path.join('.', 'data.txt'), {
  flags: 'a',
  encoding: 'utf-8',
})

export const createUser = ({
  userName,
  password,
}: {
  userName: string
  password: string
}): boolean => {
  try {
    const salt = hash({ phrase: `${Date.now()}`, salt: '0' })

    const userData = []
    userData[DATA_KEY_ID] = `${Date.now()}`
    userData[DATA_KEY_USERNAME] = Buffer.from(userName).toString('base64')
    userData[DATA_KEY_ROLE] = 'player'
    userData[DATA_KEY_PASSWORD] = `${hash({
      phrase: `${password}${SECRET_KEY}`,
      salt,
    })}`
    userData[DATA_KEY_SALT] = `${salt}`
    USER_WRITE_STREAM.write(
      `\n${userData.join('|')} // ${userName}/${password}`,
    )
  } catch (e) {
    console.log('Error while trying tocreate user')
    return false
  }
  return true
}

export const findUser = async (userName: string): Promise<USER | null> => {
  const rl = readline.createInterface({
    input: createReadStream(path.join('.', 'data.txt'), {
      encoding: 'utf-8',
    }),
  })

  let dataSet: USER = ['', '', '', '', '']

  for await (const line of rl) {
    dataSet = line.split('|') as USER
    if (dataSet.length && dataSet[DATA_KEY_USERNAME] === btoa(userName)) {
      break
    }
    dataSet = ['', '', '', '', '']
  }

  if (dataSet.join('').length) {
    return dataSet
  }
  return null
}

export const authenticate = async ({
  userName,
  password,
}: {
  userName: string
  password: string
}): Promise<boolean> => {
  const user = await findUser(userName)

  if (
    user &&
    user[DATA_KEY_PASSWORD] ===
      hash({
        phrase: `${password}${SECRET_KEY}`,
        salt: user[DATA_KEY_SALT],
      })
  ) {
    return true
  }

  return false
}
