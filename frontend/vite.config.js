import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Necessario no docker
    port: 5173,
    watch: {
      usePolling: true, // Necessario no Windows WSL / Docker
    }
  }
})
