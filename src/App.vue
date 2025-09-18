<template>
  <div class="app">
    <button @click="setLocale('de')">Deutsch</button>
    <button @click="setLocale('en')">English</button>
    <GameTable />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import i18n from './i18n'
import GameTable from './components/GameTable/GameTable.vue'

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
  padding: 0;
  margin: 0;
}

button {
  margin: 0 5px;
}

.app {
  padding: 0;
  margin: 0;
}
</style>
