import { RouteResponse, Route } from './types.js'
import { createUser, findUser } from '../userDb.js'

const add: Route<{
  username: string
  password: string
}> = async ({
  username: userName,
  password,
}: {
  username: string
  password: string
}): RouteResponse => {
  if (!userName || !password) {
    return {
      status: 500,
      message: 'invalid data',
    }
  }

  const user = await findUser(userName)

  if (user) {
    return {
      status: 500,
      message: 'invalid data',
    }
  }

  createUser({ userName, password })

  return {
    status: 200,
    message: 'success',
  }
}

export default add
