import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'

// Erstellen Sie eine asynchrone Hauptfunktion
async function bootstrapApp() {
  const app = createApp(App)
  const initialMessages = await import(
    `./locales/${i18n.global.locale.value}.json`
  )

  i18n.global.setLocaleMessage(
    i18n.global.locale.value,
    initialMessages.default,
  )

  app.use(i18n)
  app.mount('#app')
}

bootstrapApp()
