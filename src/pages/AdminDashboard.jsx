import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from '../components/Sidebar';
import RoomGrid from '../components/RoomGrid';
import RoomTimeline from '../components/RoomTimeline';
import '../components/Sidebar.css';
import styles from '../assets/AdminDashboard.module.css';
import axiosInstance from '../utils/axiosInstance';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const [stats, setStats] = useState({ totalRooms: 0, availableRooms: 0, occupiedRooms: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Usar el endpoint que realmente existe con timeout reducido
      const res = await axiosInstance.get('/reports/general', { timeout: 5000 });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching general reports:', err);
      
      // 🔧 FALLBACK: Si el backend no responde, usar datos mock
      console.warn('⚠️ Backend no responde, usando datos de demostración');
      setStats({
        totalRooms: 40,
        availableRooms: 15,
        occupiedRooms: 20
      });
      setError('Backend no disponible');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Preparar datos para el gráfico con los datos reales del backend
  const data = {
    labels: ['Habitaciones'],
    datasets: [
      {
        label: 'Ocupadas',
        data: [stats.occupiedRooms || 0],
        backgroundColor: 'var(--danger)', // antes: '#f87171'
      },
      {
        label: 'Disponibles',
        data: [stats.availableRooms || 0],
        backgroundColor: 'var(--success)', // antes: '#34d399'
      },
      {
        label: 'En Limpieza',
        data: [Math.max(0, (stats.totalRooms || 0) - (stats.occupiedRooms || 0) - (stats.availableRooms || 0))],
        backgroundColor: 'var(--warning)', // antes: '#fbbf24'
      },
    ],
  };

  // KPIs con los datos reales
  const kpis = {
    'Total': stats.totalRooms || 0,
    'Disponibles': stats.availableRooms || 0,
    'Ocupadas': stats.occupiedRooms || 0,
    'Ocupación': stats.totalRooms ? `${Math.round((stats.occupiedRooms / stats.totalRooms) * 100)}%` : '0%'
  };

  // 2. Accesibilidad: roles y aria-labels
  // 3. Responsive: asegurado por CSS module
  // 4. Feedback visual ya implementado (loading/error)

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Panel de Administración</h1>
          <p className={styles.subtitle}>Gestión centralizada de habitaciones y reservas.</p>
        </header>
        <section className={styles.content}>
          {/* ⚠️ Indicador de estado del backend */}
          {error && (
            <div style={{ 
              background: 'var(--warning-light)', 
              border: '1px solid var(--warning)', 
              borderRadius: 8, 
              padding: 16, 
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div>
                <strong>Modo Demostración Activo</strong>
                <p style={{ margin: '4px 0 8px 0', fontSize: 14, color: 'var(--text-light)' }}>
                  {error} Los datos mostrados son de ejemplo para demostración.
                </p>
                <button 
                  onClick={fetchStats}
                  disabled={loading}
                  style={{
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 16px',
                    fontSize: 12,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Conectando...' : 'Intentar conectar al backend'}
                </button>
              </div>
            </div>
          )}
          
          {/* KPIs adicionales */}
          {Object.keys(kpis).length > 0 && (
            <div className={styles.kpiGrid} style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
              {Object.entries(kpis).map(([label, value]) => (
                <div key={label} className={styles.kpiCard} style={{ background: 'var(--card-bg)', borderRadius: 10, padding: 16, minWidth: 120, textAlign: 'center', boxShadow: '0 2px 8px var(--border)' }}>
                  <div style={{ fontSize: 18, color: 'var(--text-light)', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
                </div>
              ))}
            </div>
          )}
          <div className={styles.widgets}>
            <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px var(--border)', marginBottom: 24 }}>
              <h3 style={{ marginBottom: 8 }}>
                Estado actual de habitaciones
                {error && <span style={{ fontSize: 14, color: 'var(--warning)', marginLeft: 8 }}>(Datos de demostración)</span>}
              </h3>
              {loading ? (
                <div style={{ padding: 24, textAlign: 'center' }}>Cargando reporte...</div>
              ) : (
                <Bar data={data} options={{ 
                  responsive: true, 
                  plugins: { 
                    legend: { position: 'top' },
                    title: {
                      display: !!error,
                      text: error ? 'Datos de demostración - Backend no disponible' : undefined,
                      color: 'var(--warning)',
                      font: { size: 12 }
                    }
                  }
                }} />
              )}
            </div>
          </div>
          <div>
            <h2 className={styles.sectionTitle}>Grilla de Ocupación de Habitaciones</h2>
            <RoomGrid />
          </div>
          <div>
            <RoomTimeline />
          </div>
        </section>
        <footer className={styles.footer}>
          <span>© {new Date().getFullYear()} Hotel Admin. Todos los derechos reservados.</span>
        </footer>
      </main>
    </div>
  );
}
// Qué falta implementar en este componente para que esté completo
// 1. Mejorar el selector de semana para que sea más intuitivo (ej: calendario)
// FIXME: Reemplaza los colores hardcodeados por variables CSS de la nueva paleta en todos los estilos en línea y clases.
// Ejemplo: background: 'var(--primary)' en vez de background: '#458cf4'
export default AdminDashboard;
