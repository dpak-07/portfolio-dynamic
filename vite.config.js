import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // allows LAN access (e.g. phone on same Wi-Fi)
    port: 3000    // use desired port here
  }
})
