// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import process from 'node:process';

// Configuración correcta para desarrollo local y producción
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno según el modo (development, production, etc.)
  loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': 'http://localhost:2117', // Cambia el puerto si tu backend usa otro
      },
    },
    // No agregues 'define' aquí, Vite ya expone import.meta.env.VITE_API_URL automáticamente
  };
});

