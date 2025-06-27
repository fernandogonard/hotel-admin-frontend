/* 
🔧 PROMPT SUPREMO PARA COPILOT – CONFIGURACIÓN DE PROYECTO MULTI-REPOS

✅ CONTEXTO DEL PROYECTO:
- Este proyecto es un frontend Vite que se conecta a un backend Express en otro repositorio.
- El backend corre en http://localhost:2117 y expone rutas como /api/rooms, /api/reports/general, etc.

🎯 OBJETIVO:
1. Verificar si el archivo vite.config.js tiene correctamente configurado el proxy para redirigir `/api` al backend en puerto 2117.
2. Sugerir corrección si apunta a otro puerto (ej: 3000 o 4000).
3. Confirmar que todas las llamadas Axios o fetch usen rutas que empiecen con `/api` (y no `/rooms` o `/users` directo).
4. Mostrar advertencia si se detecta uso de rutas sin `/api`.
5. Validar que el backend responda correctamente a `/api/rooms` con un JSON de ejemplo.
6. Sugerir test de conexión manual desde el navegador o Postman si falla la conexión.

🧠 TAREAS EXTRAS (opcional si detectás errores):
- Mostrar mensaje si el backend devuelve 404 constantemente desde `/`.
- Mostrar solución si hay errores tipo `NS_ERROR_CONNECTION_REFUSED`.
- Detectar si Vite necesita ser reiniciado después de cambios en proxy.

🚀 BONUS:
- Si falta configuración de CORS en el backend, sugerir ejemplo de `cors({ origin: 'http://localhost:5174' })`
- Si Copilot encuentra vite.config.js mal configurado, sugerir el siguiente bloque:

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:2117',
        changeOrigin: true,
        secure: false,
      },
    },
  }

Fin del prompt.
*/
// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';

// Configuración correcta para desarrollo local y producción
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:2117', // asegúrate de que sea el puerto correcto del backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
