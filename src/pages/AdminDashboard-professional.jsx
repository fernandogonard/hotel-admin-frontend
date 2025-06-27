// pages/AdminDashboard-professional.jsx - Dashboard profesional con datos reales
import React, { Suspense, lazy } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import Sidebar from '../components/Sidebar';
import '../components/Sidebar.css';
import styles from '../assets/AdminDashboard-professional.module.css';

// Lazy loading de componentes pesados
const RoomGrid = lazy(() => import('../components/RoomGrid'));
const RoomTimeline = lazy(() => import('../components/RoomTimeline'));

// Componente de Loading
const LoadingSpinner = () => (
  <div className={styles.loading}>
    <div className={styles.spinner}></div>
    <p>Cargando datos del dashboard...</p>
  </div>
);

// Componente de Error
const ErrorMessage = ({ error, onRetry }) => (
  <div className={styles.errorContainer}>
    <div className={styles.errorIcon}>⚠️</div>
    <h3>Error cargando dashboard</h3>
    <p>{error}</p>
    <button onClick={onRetry} className={styles.retryButton}>
      🔄 Reintentar
    </button>
  </div>
);

// Componente de tarjeta de estadística
const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
  <div className={`${styles.statCard} ${styles[color]}`}>
    <div className={styles.statIcon}>{icon}</div>
    <div className={styles.statContent}>
      <h3 className={styles.statTitle}>{title}</h3>
      <div className={styles.statValue}>{value}</div>
      {subtitle && <p className={styles.statSubtitle}>{subtitle}</p>}
      {trend && <div className={styles.statTrend}>{trend}</div>}
    </div>
  </div>
);

// Componente de actividad reciente
const RecentActivity = ({ activities = [] }) => (
  <div className={styles.activityContainer}>
    <h3 className={styles.sectionTitle}>📊 Actividad Reciente</h3>
    {activities.length === 0 ? (
      <p className={styles.noActivity}>No hay actividad reciente</p>
    ) : (
      <div className={styles.activityList}>
        {activities.map((activity, index) => (
          <div key={index} className={styles.activityItem}>
            <span className={styles.activityIcon}>{activity.icon}</span>
            <div className={styles.activityContent}>
              <p className={styles.activityMessage}>{activity.message}</p>
              <span className={styles.activityTime}>
                {new Date(activity.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

function AdminDashboardProfessional() {
  const { user, isAdmin } = useAuth();
  const { 
    summary, 
    loading, 
    error, 
    refreshing, 
    refresh,
    isStaff 
  } = useDashboard();

  // Si no está autenticado o no tiene permisos
  if (!isStaff) {
    return (
      <div className={styles.accessDenied}>
        <h2>🚫 Acceso Denegado</h2>
        <p>No tienes permisos para ver este dashboard</p>
      </div>
    );
  }

  // Loading inicial
  if (loading) {
    return (
      <div className={styles.dashboardContainer}>
        <Sidebar />
        <main className={styles.mainContent}>
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  // Error state
  if (error && !summary) {
    return (
      <div className={styles.dashboardContainer}>
        <Sidebar />
        <main className={styles.mainContent}>
          <ErrorMessage error={error} onRetry={refresh} />
        </main>
      </div>
    );
  }

  const stats = summary || {};

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.dashboardHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.dashboardTitle}>
              🏨 Dashboard del Hotel
            </h1>
            <p className={styles.dashboardSubtitle}>
              Bienvenido, {user?.name || user?.email}
            </p>
          </div>
          <div className={styles.headerActions}>
            <button 
              onClick={refresh}
              disabled={refreshing}
              className={styles.refreshButton}
            >
              {refreshing ? '🔄' : '↻'} Actualizar
            </button>
          </div>
        </header>

        {/* Error banner si hay problemas parciales */}
        {error && summary && (
          <div className={styles.warningBanner}>
            ⚠️ Algunos datos pueden estar desactualizados: {error}
          </div>
        )}

        {/* KPIs principales */}
        <section className={styles.kpiSection}>
          <h2 className={styles.sectionTitle}>📈 Métricas Principales</h2>
          <div className={styles.kpiGrid}>
            <StatCard
              title="Ocupación"
              value={`${stats.occupancyRate || 0}%`}
              icon="🏠"
              color="primary"
              subtitle={`${stats.status?.occupied || 0} de ${stats.totalRooms || 0} habitaciones`}
            />
            
            <StatCard
              title="Disponibilidad"
              value={`${stats.availabilityRate || 0}%`}
              icon="✅"
              color="success"
              subtitle={`${stats.status?.available || 0} habitaciones libres`}
            />
            
            <StatCard
              title="Reservas Activas"
              value={stats.activeReservations || 0}
              icon="📅"
              color="info"
              subtitle="Reservas en curso"
            />
            
            <StatCard
              title="En Limpieza"
              value={stats.status?.cleaning || 0}
              icon="🧹"
              color="warning"
              subtitle="Habitaciones en proceso"
            />
            
            <StatCard
              title="Mantenimiento"
              value={stats.status?.maintenance || 0}
              icon="🔧"
              color="danger"
              subtitle="Habitaciones en reparación"
            />
          </div>
        </section>

        {/* Grilla principal con dos columnas */}
        <section className={styles.mainGrid}>
          {/* Columna izquierda - Grilla de habitaciones */}
          <div className={styles.leftColumn}>
            <h2 className={styles.sectionTitle}>🏠 Estado de Habitaciones</h2>
            <Suspense fallback={<LoadingSpinner />}>
              <RoomGrid refreshTrigger={refreshing} />
            </Suspense>
          </div>

          {/* Columna derecha - Actividad y timeline */}
          <div className={styles.rightColumn}>
            <RecentActivity activities={stats.recentActivity} />
            
            <div className={styles.timelineContainer}>
              <h3 className={styles.sectionTitle}>📅 Timeline de Reservas</h3>
              <Suspense fallback={<LoadingSpinner />}>
                <RoomTimeline refreshTrigger={refreshing} />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Estadísticas adicionales para admins */}
        {isAdmin && (
          <section className={styles.adminSection}>
            <h2 className={styles.sectionTitle}>🔐 Panel de Administrador</h2>
            <div className={styles.adminGrid}>
              <div className={styles.adminCard}>
                <h4>📊 Reportes Avanzados</h4>
                <p>Acceso a métricas detalladas de ingresos y ocupación</p>
                <button className={styles.adminButton}>Ver Reportes</button>
              </div>
              
              <div className={styles.adminCard}>
                <h4>👥 Gestión de Usuarios</h4>
                <p>Administrar cuentas de personal y permisos</p>
                <button className={styles.adminButton}>Gestionar</button>
              </div>
              
              <div className={styles.adminCard}>
                <h4>⚙️ Configuración</h4>
                <p>Configurar habitaciones, tarifas y políticas</p>
                <button className={styles.adminButton}>Configurar</button>
              </div>
            </div>
          </section>
        )}

        {/* Footer con información del sistema */}
        <footer className={styles.dashboardFooter}>
          <div className={styles.footerInfo}>
            <span>🔄 Última actualización: {new Date().toLocaleTimeString()}</span>
            <span>💾 Datos en tiempo real desde MongoDB</span>
            <span>🔒 Autenticación: {user?.role || 'N/A'}</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboardProfessional;
