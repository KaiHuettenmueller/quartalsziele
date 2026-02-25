import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/quartalsziele/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
