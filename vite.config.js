// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// La configuración es correcta para desarrollo local.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:2117',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
