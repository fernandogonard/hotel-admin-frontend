// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// La configuración es correcta para desarrollo local.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:2117',
      '/auth': 'http://localhost:2117'
    }
  },
});
