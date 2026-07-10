/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Use 127.0.0.1 (not "localhost"): on Windows, "localhost" can resolve to IPv6
// (::1) first, while Nest listens on IPv4 — causing ECONNREFUSED in the proxy.
const API_TARGET = 'http://127.0.0.1:3001'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Expose on the local network so other devices can open the app.
    host: true,
    // Proxy API calls to the backend, so the browser only ever talks to Vite
    // (same origin as the page) — no CORS and no hardcoded machine IP.
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    // Tests hit MSW with absolute URLs; keep the base URL stable regardless of env.
    env: { VITE_API_URL: 'http://localhost:3000' },
  },
})
