import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@/hooks': path.resolve(__dirname, './src/presentation/hooks'),
      '@/components': path.resolve(__dirname, './src/presentation/components'),
      '@/features': path.resolve(__dirname, './src/presentation/features'),
      '@/infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@/presentation': path.resolve(__dirname, './src/presentation'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/auth': 'http://localhost:3000',
      '/businesses': 'http://localhost:3000',
      '/parking-rates': 'http://localhost:3000',
      '/vehicles': 'http://localhost:3000',
      '/parking-tickets': 'http://localhost:3000',
    },
  },
})
