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

---

# Análisis del Proyecto: Sistema de Gestión Hotelero

## ¿Qué funcionalidades ya tiene este proyecto?

Actualmente, tu sistema cubre varias de las funciones clave de un PMS (Property Management System) moderno:

- **Gestión de Reservas:**  
  Puedes crear, editar y eliminar reservas, evitando solapamientos de fechas y mostrando información relevante de cada reserva.

- **Gestión de Habitaciones:**  
  Permite crear, editar, eliminar y listar habitaciones, con atributos como número, tipo, precio, piso, capacidad y servicios.

- **Gestión de Usuarios y Roles:**  
  Hay autenticación y control de acceso por roles (admin, recepcionista), con rutas protegidas y lógica de login.

- **Panel de Administración (Dashboard):**  
  Muestra estadísticas clave (habitaciones ocupadas, disponibles, reservas totales) y gráficos de ocupación.

- **Reportes:**  
  Incluye informes generales, de reservas y de habitaciones por tipo.

- **Interfaz Moderna:**  
  El diseño es responsivo, con navegación lateral y componentes visuales claros.

## ¿Qué te falta para cubrir todo lo que mencionaste?

### Faltantes principales:

1. **Gestión de Clientes (Huéspedes):**
   - No hay un módulo dedicado para registrar, editar o consultar huéspedes y su historial de reservas.
   - No se almacenan preferencias ni notas especiales de los clientes.

2. **Gestión de Tarifas y Facturación:**
   - No existe un módulo de facturación ni lógica para registrar pagos, emitir facturas o gestionar descuentos/promociones.

3. **Panel de Recepción / Front Desk:**
   - Aunque hay dashboards, faltan vistas específicas para check-in/check-out rápido y alertas de llegadas/salidas/pagos.

4. **Control de Mantenimiento y Limpieza:**
   - No hay gestión de tareas de limpieza ni solicitudes de mantenimiento para habitaciones.

5. **Reportes avanzados:**
   - Los reportes actuales son básicos; faltan reportes de ingresos, rendimiento, limpieza, mantenimiento, etc.

6. **Integraciones externas:**
   - No hay integración con portales de reservas, sistemas de pago o contabilidad.

7. **Seguridad avanzada:**
   - No se menciona encriptación de contraseñas en frontend ni copias de seguridad automáticas (esto es más backend).

8. **Configuración avanzada:**
   - No hay un módulo visual para gestionar tarifas, roles, integraciones o parámetros generales del sistema.

## ¿Cómo podrías avanzar hacia el sistema ideal?

### Siguiente pasos recomendados:

1. **Agregar módulo de Clientes:**
   - Crear modelos, rutas y vistas para gestionar huéspedes y su historial.
   - Permitir registrar preferencias y notas.

2. **Implementar Facturación y Pagos:**
   - Añadir modelos y vistas para facturas, registrar pagos y emitir comprobantes.
   - Permitir descuentos y promociones.

3. **Panel de Recepción:**
   - Crear una vista con entradas/salidas diarias, alertas y acciones rápidas (check-in/out).

4. **Módulo de Limpieza y Mantenimiento:**
   - Permitir asignar tareas de limpieza y registrar solicitudes de mantenimiento.
   - Cambiar el estado de habitaciones según limpieza/mantenimiento.

5. **Reportes avanzados:**
   - Añadir reportes de ingresos, rendimiento, limpieza y mantenimiento.

6. **Configuración y Seguridad:**
   - Crear un panel para gestionar usuarios, roles, tarifas y parámetros generales.
   - Mejorar la seguridad en backend (encriptación, backups).

7. **Integraciones (opcional):**
   - Conectar con portales de reservas y sistemas de pago si es necesario.

---

# 🗺️ Mapa visual de módulos del Sistema de Gestión Hotelero

```
                          [Dashboard Principal]
                                  |
    ---------------------------------------------------------------------
    |             |               |               |           |       |
[Reservas]   [Habitaciones]   [Clientes]    [Facturación] [Reportes] [Configuración]
    |             |               |               |           |       |
    |             |               |               |           |       |
[Check-in/out] [Estado]     [Registro]     [Pagos y Facturas] [Ocupación, ingresos]
[Crear/editar] [Limpieza]   [Historial]     [Descuentos]      [Rendimiento]
[Disponibilidad][Mantenimiento][Notas]        [Métodos de pago] [Análisis]
```

Este diagrama muestra cómo se relacionan los módulos principales del sistema.  
Cada bloque representa un área funcional clave para la gestión hotelera moderna.

---

## ¿Puedo ayudarte a construir alguno de estos módulos?

¡Sí!  
Dime por cuál te gustaría empezar (Clientes, Facturación, Limpieza, etc.) y te ayudo a diseñar la estructura, modelos, rutas y vistas necesarias para implementarlo en tu proyecto.
