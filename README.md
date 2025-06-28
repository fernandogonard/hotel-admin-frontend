Eres un ingeniero Full Stack Senior con especialidad en auditorías de software. Realiza una auditoría técnica completa y exhaustiva sobre este proyecto PMS hotelero full stack, compuesto por tres repositorios: frontend (React + Vite), backend (Node.js + Express + MongoDB) y un portal adicional llamado diva-web (React).

🔍 Realiza una revisión detallada y precisa de los siguientes aspectos:

1️⃣ **Backend (hotel-admin-backend):**
- Verifica la correcta definición de rutas, middlewares y controladores.
- Revisa la validación robusta de modelos Mongoose (required, enums, defaults, indexes).
- Asegúrate de que las respuestas HTTP sean coherentes (200, 201, 400, 401, 403, 404, 500).
- Verifica el manejo de errores centralizado (middleware error handler).
- Asegúrate de que las conexiones a MongoDB estén correctamente gestionadas y protegidas mediante variables de entorno (.env).
- Implementa seguridad API: sanitización de datos, rate limiting, headers seguros (helmet), CORS seguro.
- Evalúa uso seguro y correcto de JWT (expiración, validación, refresh si aplica).
- Refactoriza código duplicado hacia servicios y helpers.
- Limpia archivos innecesarios, rutas no usadas, middleware redundantes.

2️⃣ **Frontend (hotel-admin-frontend y diva-web):**
- Valida el consumo correcto de APIs (sin datos hardcodeados, sin mocks en producción).
- Verifica el manejo de estado (hooks, context, redux o zustand si aplica).
- Implementa rutas protegidas según roles (admin, recepcionista, limpieza).
- Sustituye almacenamiento inseguro (`localStorage`) por cookies seguras `httpOnly` si es viable.
- Añade validaciones front robustas (formularios, inputs).
- Mejora la UX con loading states, skeletons y feedback de éxito/error.
- Refactoriza componentes demasiado grandes en componentes pequeños y reutilizables.
- Elimina console.log, imports no utilizados, hooks mal implementados o innecesarios.
- Implementa optimizaciones: lazy loading de componentes y librerías pesadas.

3️⃣ **DevOps y Preparación para Producción:**
- Asegúrate de que existan archivos `.env.example` bien documentados.
- Verifica que los scripts npm funcionen correctamente (`dev`, `start`, `build`, `test`).
- Implementa configuración CORS segura para producción.
- Asegúrate de que no haya exposición de datos sensibles (keys, tokens, stack traces).
- Implementa logging profesional con niveles (`info`, `error`, `warn`) usando Winston o equivalente.
- Sugiere y configura pipelines para CI/CD que incluyan linting, testing y build.

4️⃣ **Refactorización Recomendada:**
- Aplica patrones sólidos como Service Pattern, Repository Pattern.
- Modula controladores, servicios, rutas, middlewares y modelos.
- Implementa hooks personalizados en el frontend (`useAuth`, `useApi`, `useRoles`).
- Crea un wrapper global para manejo de async/await y errores (handleAsync).
- Agrega scripts para seeding (`seed.js`) y reset de DB (`reset-db.js`).

5️⃣ **Mejoras Opcionales:**
- Implementa paginación y filtros en endpoints (`getAllRooms`, `getAllReservations`, etc.).
- Mejora las relaciones en MongoDB utilizando `populate()` cuando sea necesario.
- Añade testing básico: unitarios (Jest o Vitest) e integraciones para endpoints.

🎯 **Criterios:**
- No romper funcionalidades existentes.
- Mantener la misma convención de código.
- No agregar nuevas dependencias sin comentar la razón.
- Si detectas algo que no puedes corregir directamente, comenta en el código con una sugerencia técnica clara.

🛑 El objetivo es que este proyecto esté limpio, seguro, escalable y listo para deploy en un entorno productivo, aplicando los estándares de un ingeniero senior en desarrollo y DevOps.
