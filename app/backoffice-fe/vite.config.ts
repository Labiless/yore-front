import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('.././shared', import.meta.url))
    },
  },
  server: {
    port: 5175,     // la porta che vuoi
    host: true      // opzionale: permette accesso da rete locale
  },
  build: {
    minify: false,      // 🔴 niente minificazione
    sourcemap: true,    // ✅ utile per capire gli errori
  },
})
