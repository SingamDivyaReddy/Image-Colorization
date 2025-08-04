import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// frontend/vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Or your preferred frontend port
    proxy: {
      '/api': { // Match the prefix used in your API calls
        target: 'http://127.0.0.1:5000', // Your Flask backend address
        changeOrigin: true,
        // No rewrite needed if Flask routes already include /api
      }
    }
  }
})