import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import path from 'path'
// import { fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // resolve: {
  //   alias: {
  //     'form-builder': path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src'),
  //     '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
  //   },
  // },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  define: {
    // Enable better development experience
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  },
}) 