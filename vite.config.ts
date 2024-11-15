import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/types.ts',
        'node_modules/**',
        'dist/**',
        'vite.config.ts'
      ]
    },
  },
})
