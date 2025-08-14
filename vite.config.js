import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          auth: ['./src/auth/AuthContext.jsx', './src/auth/authDB.js'],
          teams: ['./src/teams/teamsDB.js'],
          database: ['./src/database/indexedDB.js']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: process.env.PORT || 4173,
    host: '0.0.0.0'
  }
})
