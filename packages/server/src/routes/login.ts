import { DATA_KEY_ID, DATA_KEY_USERNAME } from '../config.js'
import { Route, RouteResponse } from './types.js'
import { authenticate, findUser } from '../userDb.js'

const login: Route<{
  username: string
  password: string
}> = async ({
  username: userName,
  password,
}: {
  username: string
  password: string
}): RouteResponse => {
  if (typeof userName !== 'string' || typeof password !== 'string') {
    return {
      status: 400,
      message: 'invalid',
    }
  }
  const authenticated = await authenticate({ userName, password })
  const user = await findUser(userName)

  if (authenticated && user) {
    return {
      status: 200,
      message: 'success',
      session: {
        user: {
          id: user[DATA_KEY_ID],
          name: user[DATA_KEY_USERNAME],
        },
      },
    }
  }

  return {
    status: 400,
    message: 'invalid',
  }
}

export default login
