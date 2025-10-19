import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // ✅ allows "@/..." imports
    },
  },
  server: {
    host: true,   // allows LAN access (e.g. test on phone)
    port: 3000,   // you can change this if needed
  },
})
