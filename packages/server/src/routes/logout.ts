import { Route, RouteResponse } from './types.js'

const logout: Route<{
  session: { destroy: (err: string) => void; user?: string }
}> = ({
  session,
}: {
  session: { destroy: (err: string) => void; user?: string }
}): RouteResponse => {
  return new Promise((resolve) => {
    session.destroy((err) => {
      if (err) {
        resolve({
          status: 500,
          message: 'error',
          session: {
            user: undefined,
          },
        })
      }

      resolve({
        status: 200,
        message: 'success',
      })
    })
  })
}

logout.protected = true

export default logout
