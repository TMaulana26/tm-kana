import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { cloudflare } from "@cloudflare/vite-plugin";

const isProd = process.env.NODE_ENV === 'production'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), cloudflare()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  esbuild: {
    drop: isProd ? ['console', 'debugger'] : []
  } as any
})