import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from '../components/Sidebar';
import RoomGrid from '../components/RoomGrid';
import RoomTimeline from '../components/RoomTimeline';
import '../components/Sidebar.css';
import styles from '../assets/AdminDashboard.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const [stats, setStats] = useState({ labels: [], ocupadas: [], disponibles: [], limpieza: [] });

  useEffect(() => {
    // Simulación: deberías reemplazar esto por un fetch real a un endpoint de reportes por fecha
    const fetchStats = async () => {
      // Ejemplo de datos: días de la semana y cantidad de habitaciones por estado
      setStats({
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        ocupadas: [10, 12, 14, 13, 15, 16, 12],
        disponibles: [20, 18, 16, 17, 15, 14, 18],
        limpieza: [2, 2, 2, 2, 2, 2, 2],
      });
    };
    fetchStats();
  }, []);

  const data = {
    labels: stats.labels,
    datasets: [
      {
        label: 'Ocupadas',
        data: stats.ocupadas,
        backgroundColor: '#f87171',
      },
      {
        label: 'Disponibles',
        data: stats.disponibles,
        backgroundColor: '#34d399',
      },
      {
        label: 'Limpieza',
        data: stats.limpieza,
        backgroundColor: '#fbbf24',
      },
    ],
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Panel de Administración</h1>
          <p className={styles.subtitle}>Gestión centralizada de habitaciones y reservas.</p>
        </header>
        <section className={styles.content}>
          <div className={styles.widgets}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px #e3eafc', marginBottom: 24 }}>
              <h3 style={{ marginBottom: 8 }}>Reporte semanal de ocupación y limpieza</h3>
              <Bar data={data} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
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

export default AdminDashboard;
