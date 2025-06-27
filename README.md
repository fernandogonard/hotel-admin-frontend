💡 Proyecto: Sistema de Gestión Hotelero Full Stack

🎯 Objetivo: Redondear y cerrar el sistema de gestión hotelero moderno, asegurando que todo funcione de forma real y profesional. Conectar el frontend (`diva-web`) con el backend (`hotel-admin-backend`), usando datos reales en MongoDB.

✅ Lo que necesito que hagas como asistente IA:

1. Revisa y optimiza **todas las rutas y endpoints** del backend (Node.js + Express), validando que:
   - No haya rutas rotas o mal definidas.
   - Se manejen bien los errores (try/catch y `res.status().json()`).
   - Los modelos de Mongoose estén bien estructurados y completos.

2. Asegúrate de que el **frontend en React (Vite)**:
   - Consuma los endpoints reales desde el backend.
   - Valide correctamente los datos del formulario de reserva.
   - Muestre mensajes de éxito o error adecuados.
   - Refleje el estado real de las habitaciones y reservas.

3. Valida y corrige:
   - El sistema de autenticación con JWT.
   - El manejo de roles (admin, recepcionista, limpieza).
   - El acceso a rutas protegidas en el frontend.

4. Usa MongoDB como fuente de datos real (no mocks ni datos hardcodeados).
   - Confirma que la conexión con MongoDB funciona bien (local o Atlas).
   - Si hay `.env`, verifica que las variables estén bien usadas.

5. Elimina todo código duplicado, console.logs innecesarios y archivos sin usar.
   - Limpia la estructura para dejar el proyecto profesional y presentable.
   - Sugiere mejoras si ves cosas repetidas o mal estructuradas.

🎁 Bonus: Si es posible, crea un script para seed de datos de prueba en MongoDB y una función para reiniciar el estado del sistema para pruebas.

🛠️ Ayúdame a cerrar el proyecto como si lo fuera a entregar a un cliente real: limpio, funcional, conectado, sin errores y bien estructurado.

🔚 Dame los pasos a seguir si hay cosas que aún faltan, y ayudame a dejar todo funcionando con datos reales.

🎯 Actuá como un **ingeniero senior DevOps y Full Stack** con enfoque en seguridad, calidad y producción. A partir de esta auditoría técnica, corregí automáticamente todos los problemas críticos, errores de seguridad y puntos de arquitectura.

🧠 Tareas específicas que debés realizar:

---

### 🔧 1. Corrige los errores críticos:
- Importar correctamente `getAdminStats` y otras funciones faltantes
- Unificar los estados de habitación (`ocupado` vs `ocupada`)
- Reparar imports rotos en el frontend (ej: toast, estilos, axiosInstance)
- Inicializar correctamente los estados React
- Unificar rutas de API (`/api/rooms` vs `/rooms`)

---

### 🔐 2. Asegura la app:
- Reemplazar `localStorage` por cookies httpOnly seguras para el token JWT
- Sanitizar entradas del usuario (frontend y backend)
- No exponer stack trace o errores sensibles en respuestas JSON
- Agregar rate limiting en Express (por IP y ruta)
- Limitar CORS en producción

---

### 🧹 3. Limpieza general:
- Eliminar controladores obsoletos y archivos no usados (`*WithFallback`)
- Remover scripts .bat duplicados
- Eliminar `realData.js` si no está siendo usado
- Consolidar lógica duplicada (validaciones, manejo de errores, etc)

---

### 🧠 4. Refactor estructural mínimo:
- Separar lógica compleja de controladores hacia carpeta `/services`
- Crear hooks personalizados básicos: `useAuth()`, `useApi()`
- Extraer componentes en páginas muy acopladas como `ManageRooms`
- Aplicar lazy loading a los imports de librerías pesadas como Chart.js

---

### 🧪 5. Bonus si es posible:
- Implementar paginación simple en `getAllRooms`, `getAllReservations`
- Agregar `populate()` en reservas para incluir detalles de habitaciones
- Aplicar `try/catch` unificado con `handleAsync()` wrapper
- Aplicar `Helmet` y `express-mongo-sanitize` si aún no están

---

✅ **Requisitos adicionales**:
- No romper ninguna funcionalidad actual
- Mantener compatibilidad con los scripts de `npm run dev`, `npm start`, etc.
- No usar librerías nuevas sin avisar
- Mantener estilo de código actual (indentación, uso de semicolon, etc)

🧪 Si no podés resolver algo automáticamente, comentá el código con el problema explicado y sugerí cómo resolverlo manualmente.

