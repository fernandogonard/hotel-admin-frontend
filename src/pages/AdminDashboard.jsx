import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Ocupación de Habitaciones',
      data: [30, 45, 40, 60, 75, 50],
      backgroundColor: 'rgba(255, 102, 0, 0.4)', // Naranja suave
      borderColor: '#FF6600',
      borderWidth: 2,
    },
  ],
};

const DashboardChart = () => <Bar data={data} />;

function AdminDashboard() {
  const [stats, setStats] = useState({
    occupiedRooms: 0,
    totalReservations: 0,
    availableRooms: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:2117/api/rooms/admin-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Admin Hotel</h2>
        <nav style={styles.nav}>
          <Link to="/admin-dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/manage-rooms" style={styles.link}>Habitaciones</Link>
          <Link to="/manage-reservations" style={styles.link}>Reservas</Link>
          <Link to="/reports" style={styles.link}>Informes</Link>
        </nav>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <header>
          <h1 style={styles.title}>Panel de Administración</h1>
          <p style={styles.subtitle}>Gestión centralizada de habitaciones y reservas.</p>
        </header>

        <section style={styles.contentGrid}>
          {/* Estadísticas */}
          <div style={styles.statsGrid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Habitaciones Ocupadas</h3>
              <p style={styles.cardValue}>{stats.occupiedRooms}</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Reservas Totales</h3>
              <p style={styles.cardValue}>{stats.totalReservations}</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Disponibles</h3>
              <p style={styles.cardValue}>{stats.availableRooms}</p>
            </div>
          </div>

          {/* Gráfico */}
          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>Ocupación Semestral</h3>
            <DashboardChart />
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#000',
    color: '#fff',
    padding: '32px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  sidebarTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '32px',
    color: '#FF6600',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '10px 14px',
    borderRadius: '8px',
    backgroundColor: '#1a1a1a',
    transition: 'all 0.3s ease',
  },
  main: {
    flex: 1,
    padding: '32px',
    marginLeft: '240px', // 👈 Esto empuja el contenido para no quedar detrás del sidebar
  },
  
  title: {
    fontSize: '32px',
    color: '#FF6600',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#666',
    fontSize: '16px',
    marginBottom: '32px',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
    alignItems: 'start',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  cardTitle: {
    color: '#555',
    fontSize: '18px',
    marginBottom: '8px',
  },
  cardValue: {
    fontSize: '32px',
    color: '#FF6600',
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  chartTitle: {
    fontSize: '18px',
    marginBottom: '16px',
    color: '#333',
  },
};

export default AdminDashboard;
