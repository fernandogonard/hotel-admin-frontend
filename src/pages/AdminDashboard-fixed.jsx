import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import Sidebar from '../components/Sidebar';
import RoomGrid from '../components/RoomGrid';
import RoomTimeline from '../components/RoomTimeline';
import '../components/Sidebar.css';
import styles from '../assets/AdminDashboard.module.css';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../hooks/useAuth';

// Lazy loading del componente de gráfico con error boundary
const LazyBarChart = lazy(() => 
  import('react-chartjs-2').then(module => {
    // Registrar Chart.js solo cuando se necesite
    return import('chart.js').then(({ Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend }) => {
      Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
      return { default: module.Bar };
    });
  }).catch(error => {
    console.error('Error cargando Chart.js:', error);
    // Fallback component
    return { default: () => <div>Error cargando gráfico</div> };
  })
);

function AdminDashboard() {
  const { user, isAdmin, token } = useAuth();
  const [stats, setStats] = useState({ 
    totalRooms: 0, 
    availableRooms: 0, 
    occupiedRooms: 0,
    cleaningRooms: 0,
    maintenanceRooms: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Usar nuevo endpoint de dashboard para obtener métricas completas
      const res = await axiosInstance.get('/dashboard/summary', { 
        timeout: 10000,
        retry: retryCount < 2 
      });
      
      if (res.data.success) {
        const data = res.data.data;
        setStats({
          totalRooms: data.totalRooms || 0,
          availableRooms: data.status?.available || 0,
          occupiedRooms: data.status?.occupied || 0,
          cleaningRooms: data.status?.cleaning || 0,
          maintenanceRooms: data.status?.maintenance || 0,
          occupancyRate: data.occupancyRate || 0,
          availabilityRate: data.availabilityRate || 0,
          activeReservations: data.activeReservations || 0,
          recentActivity: data.recentActivity || []
        });
        setRetryCount(0); // Reset retry count on success
        console.log('✅ Métricas del dashboard cargadas desde backend real');
      } else {
        throw new Error(res.data.message || 'Datos inválidos del servidor');
      }
      
    } catch (err) {
      console.error('Error obteniendo métricas del dashboard:', err);
      
      // Manejar diferentes tipos de error
      if (err.code === 'ECONNABORTED') {
        setError('Timeout - El servidor tardó demasiado en responder');
      } else if (err.response?.status === 503) {
        setError('Servicio temporalmente no disponible');
      } else if (err.response?.status >= 500) {
        setError('Error interno del servidor');
      } else if (err.response?.status === 404) {
        setError('Endpoint de dashboard no encontrado');
      } else {
        setError(`Error de conexión: ${err.message}`);
      }
      
      // Fallback con datos demo solo después de varios intentos
      if (retryCount >= 2) {
        console.warn('⚠️ Usando datos de demostración después de varios intentos fallidos');
        setStats({
          totalRooms: 24,
          availableRooms: 8,
          occupiedRooms: 12,
          cleaningRooms: 3,
          maintenanceRooms: 1,
          occupancyRate: 50,
          availabilityRate: 33,
          activeReservations: 15,
          recentActivity: []
        });
      }
      
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchStats();
  };

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token, fetchStats]);

  // Preparar datos para el gráfico con colores consistentes
  const chartData = {
    labels: ['Estado de Habitaciones'],
    datasets: [
      {
        label: 'Ocupadas',
        data: [stats.occupiedRooms || 0],
        backgroundColor: 'rgba(239, 68, 68, 0.8)', // Red
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1
      },
      {
        label: 'Disponibles',
        data: [stats.availableRooms || 0],
        backgroundColor: 'rgba(34, 197, 94, 0.8)', // Green
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1
      },
      {
        label: 'En Limpieza',
        data: [stats.cleaningRooms || 0],
        backgroundColor: 'rgba(251, 191, 36, 0.8)', // Yellow
        borderColor: 'rgba(251, 191, 36, 1)',
        borderWidth: 1
      },
      {
        label: 'Mantenimiento',
        data: [stats.maintenanceRooms || 0],
        backgroundColor: 'rgba(168, 85, 247, 0.8)', // Purple
        borderColor: 'rgba(168, 85, 247, 1)',
        borderWidth: 1
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          font: { size: 12 },
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: error ? 'Datos de Demostración - Backend No Disponible' : 'Estado Actual de Habitaciones',
        color: error ? 'rgba(251, 191, 36, 1)' : 'rgba(55, 65, 81, 1)',
        font: { size: 14, weight: 'bold' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // KPIs calculados
  const occupancyRate = stats.totalRooms > 0 
    ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) 
    : 0;

  const availabilityRate = stats.totalRooms > 0 
    ? Math.round((stats.availableRooms / stats.totalRooms) * 100) 
    : 0;

  const kpis = [
    { 
      label: 'Total Habitaciones', 
      value: stats.totalRooms, 
      icon: '🏨', 
      color: 'blue' 
    },
    { 
      label: 'Disponibles', 
      value: stats.availableRooms, 
      icon: '✅', 
      color: 'green',
      percentage: `${availabilityRate}%`
    },
    { 
      label: 'Ocupadas', 
      value: stats.occupiedRooms, 
      icon: '🛏️', 
      color: 'red',
      percentage: `${occupancyRate}%`
    },
    { 
      label: 'En Limpieza', 
      value: stats.cleaningRooms, 
      icon: '🧹', 
      color: 'yellow' 
    }
  ];

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
          {isAdmin() && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => fetchStats(true)}
                style={{
                  padding: '8px 16px',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🔄 Actualizar
              </button>
            </div>
          )}
        </header>

        <section className={styles.content}>
          {/* Indicador de estado del backend */}
          {error && (
            <div style={{ 
              background: 'rgba(251, 191, 36, 0.1)', 
              border: '1px solid rgba(251, 191, 36, 0.3)', 
              borderRadius: '8px', 
              padding: '16px', 
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>⚠️</span>
                <div>
                  <strong>Modo Demostración Activo</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
                    {error}. Los datos mostrados son de ejemplo.
                  </p>
                </div>
              </div>
              <button 
                onClick={handleRetry}
                disabled={loading}
                style={{
                  background: 'rgba(251, 191, 36, 1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Reintentando...' : `Reintentar (${retryCount}/3)`}
              </button>
            </div>
          )}
          
          {/* Grid de KPIs */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px', 
            marginBottom: '32px' 
          }}>
            {kpis.map((kpi, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                textAlign: 'center',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0px)'}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{kpi.icon}</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
                  {kpi.value}
                  {kpi.percentage && (
                    <span style={{ fontSize: '16px', marginLeft: '8px', opacity: 0.7 }}>
                      ({kpi.percentage})
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Gráfico de estado */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '24px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
            marginBottom: '32px',
            minHeight: '400px'
          }}>
            <Suspense fallback={
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '300px',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div className="spinner"></div>
                <p>Cargando gráfico...</p>
              </div>
            }>
              <div style={{ height: '350px' }}>
                <LazyBarChart data={chartData} options={chartOptions} />
              </div>
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
            <span style={{ fontSize: '12px', opacity: 0.7 }}>
              {error ? '🟡 Modo Demo' : '🟢 Conectado'} | v2.0.0
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;
