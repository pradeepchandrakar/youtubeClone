import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // or any port different from backend (e.g., 3000, 5174)
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // your backend
        changeOrigin: true,
        secure: false,
      }
    }
  }
});


