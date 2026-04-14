import session from 'express-session'

// @todo durch JWT ersetzen

export default (secret: string) => {
  return {
    getMiddleware: () => {
      return session({
        secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 3600000,
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
        },
      })
    },
  }
}
