import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import router from './router/router'

async function bootstrapApp() {
  const app = createApp(App)
  const initialMessages = await import(
    `./locales/${i18n.global.locale.value}.js`
  )

  i18n.global.setLocaleMessage(
    i18n.global.locale.value,
    initialMessages.default,
  )

  app.use(i18n)
  app.use(router)
  app.mount('#app')
}

bootstrapApp()
