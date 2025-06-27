import React, { Suspense } from 'react';
import Sidebar from '../components/Sidebar';
import RoomGrid from '../components/RoomGrid';
import RoomTimeline from '../components/RoomTimeline';
import '../components/Sidebar.css';
import styles from '../assets/AdminDashboard.module.css';
import { useAuth } from '../hooks/useAuth';
import { useDashboardStats } from '../hooks/useDashboardStats';

// Lazy loading de componentes del dashboard
const KPIGrid = React.lazy(() => import('../components/dashboard/KPIGrid'));
const ErrorBanner = React.lazy(() => import('../components/dashboard/ErrorBanner'));
const ChartSection = React.lazy(() => import('../components/dashboard/ChartSection'));

function AdminDashboard() {
  const { user } = useAuth();
  const {
    loading,
    error,
    retryCount,
    kpis,
    chartData,
    chartOptions,
    handleRetry
  } = useDashboardStats();

  // Loading state para toda la página
  if (loading && retryCount === 0) {
    return (
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50vh',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div className="spinner"></div>
            <p>Cargando estadísticas del hotel...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Panel de Administración</h1>
            <p className={styles.subtitle}>
              Bienvenido {user?.name || 'Administrador'} - Gestión centralizada del hotel
            </p>
          </div>
        </header>
        
        <section className={styles.content}>
          {/* Banner de error si hay problemas de conexión */}
          <Suspense fallback={<div>Cargando...</div>}>
            <ErrorBanner 
              error={error}
              loading={loading}
              retryCount={retryCount}
              onRetry={handleRetry}
            />
          </Suspense>
          
          {/* Grid de KPIs */}
          <Suspense fallback={<div>Cargando métricas...</div>}>
            <KPIGrid kpis={kpis} loading={loading} />
          </Suspense>

          {/* Gráfico de barras */}
          <div className={styles.widgets}>
            <Suspense fallback={<div>Cargando gráficos...</div>}>
              <ChartSection 
                chartData={chartData}
                chartOptions={chartOptions}
                error={error}
                loading={loading}
              />
            </Suspense>
          </div>

          {/* Componentes de gestión */}
          <div style={{ display: 'grid', gap: '24px' }}>
            <div>
              <h2 className={styles.sectionTitle}>Grilla de Ocupación de Habitaciones</h2>
              <RoomGrid />
            </div>
            
            <div>
              <h2 className={styles.sectionTitle}>Timeline de Reservas</h2>
              <RoomTimeline />
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>© {new Date().getFullYear()} Hotel Admin. Todos los derechos reservados.</span>
            <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
              {error ? 'Modo Demostración' : 'Datos en Tiempo Real'}
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;
