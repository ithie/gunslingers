/// <reference types="histoire" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { configDefaults } from 'vitest/config'
import { HstVue } from '@histoire/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/*'],
    root: fileURLToPath(new URL('./', import.meta.url)),
  },
  histoire: {
    storyMatch: ['src/**/*.story.vue'],
    setupFile: './src/histoire.setup.ts',

    storyIgnored: ['**/node_modules/**', '**/dist/**'],
    plugins: [
      HstVue(), // Plugin für Vue-Support
    ],
  },
})
