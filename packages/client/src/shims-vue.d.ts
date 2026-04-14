import { I18n } from 'vue-i18n'

declare module '*.json' {
  const value: any
  export default value
}

declare module 'express-session' {
  interface SessionData {
    user: { username: string } | undefined
  }
}
