<template>
  <div>
    <h1>{{ $t('message.welcome') }}</h1>
    <p>{{ $t('message.hello') }}</p>
    <button @click="setLocale('de')">Deutsch</button>
    <button @click="setLocale('en')">English</button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import i18n from './i18n'

const { locale } = useI18n()

async function loadLocaleMessages(lang: string) {
  const messages = await import(`./locales/${lang}.json`)
  return messages.default
}

async function setLocale(lang: string) {
  if (locale.value === lang) return

  const messages = await loadLocaleMessages(lang)

  i18n.global.setLocaleMessage(lang, messages)
  locale.value = lang
}
</script>

<style scoped>
h1 {
  color: #34495e;
  text-align: center;
}

p {
  color: #42b983;
  text-align: center;
}

button {
  margin: 0 5px;
}
</style>
