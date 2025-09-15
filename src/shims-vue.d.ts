import { I18n } from 'vue-i18n'

declare module '*.json' {
  const value: any
  export default value
}
