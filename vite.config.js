import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "unsafe-none", // firebase needs this usually or just disable COOP blocking
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
})
