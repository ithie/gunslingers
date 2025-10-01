/// <reference types="histoire" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { configDefaults } from 'vitest/config'
import { HstVue } from '@histoire/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      open: true,
      filename: 'dist/stats.html',
      title: 'Vite Rollup Visualizer',
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    }),
  ],
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
    coverage: {
      include: ['src/**'],
      provider: 'istanbul',
      failOnCoverageNotReached: true,
      thresholds: {
        global: {
          lines: 80,
          functions: 80,
          statements: 80,
          branches: 80,
        },
      },
    },
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
