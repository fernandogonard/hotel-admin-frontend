# Hotel Admin Frontend

Este proyecto es una aplicación web desarrollada con React y Vite para la gestión integral de un hotel. Permite a los administradores y recepcionistas gestionar habitaciones, reservas y visualizar informes de ocupación y disponibilidad.

## Características principales

- **Gestión de habitaciones:** Crear, editar, eliminar y listar habitaciones con detalles como número, tipo, precio, piso, capacidad y servicios.
- **Gestión de reservas:** Registrar nuevas reservas, editar o cancelar reservas existentes, y evitar solapamientos de fechas para una misma habitación.
- **Panel de administración:** Visualización de estadísticas clave como habitaciones ocupadas, disponibles y total de reservas.
- **Informes:** Acceso a reportes generales, de reservas y de habitaciones por tipo.
- **Autenticación y roles:** Acceso seguro mediante inicio de sesión, con roles diferenciados para administrador y recepcionista.
- **Interfaz moderna:** Diseño responsivo y amigable, con navegación lateral y componentes visuales claros.

## Estructura del proyecto

- `src/pages`: Contiene las páginas principales como Dashboard, Gestión de Habitaciones, Reservas e Informes.
- `src/components`: Componentes reutilizables como Sidebar y rutas privadas.
- `src/utils`: Utilidades como la configuración de Axios para las peticiones HTTP.
- `src/index.css`: Estilos globales del proyecto.

## Instalación y ejecución

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Accede a la aplicación en [http://localhost:5173](http://localhost:5173).

## Requisitos

- Node.js
- Backend corriendo en [hotel-admin-backend](../hotel-admin-backend)

## Licencia

MIT
