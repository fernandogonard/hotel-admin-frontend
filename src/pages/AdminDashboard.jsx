import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Link } from 'react-router-dom';
import RoomGrid from '../components/RoomGrid';
import RoomTimeline from '../components/RoomTimeline';

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

          <div>
            <h1 style={{ textAlign: 'center', margin: '1rem 0' }}>Grilla de Ocupación de Habitaciones</h1>
            <RoomGrid />
          </div>
          <div>
            <RoomTimeline />
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
    background: 'var(--color-bg)', // Usar fondo dark global
  },
  sidebar: {
    width: '240px',
    background: 'var(--color-sidebar)',
    color: '#fff',
    padding: '32px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    minHeight: '100vh',
    boxShadow: '2px 0 16px 0 #e3eafc',
  },
  sidebarTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '32px',
    color: 'var(--color-accent)',
    letterSpacing: '2px',
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
    padding: '12px 18px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.04)',
    marginBottom: '6px',
    fontWeight: 500,
    letterSpacing: '1px',
    transition: 'background 0.2s, color 0.2s',
  },
  main: {
    flex: 1,
    padding: '32px',
    marginLeft: '240px',
    background: 'var(--color-bg)', // Fondo dark global
    minHeight: '100vh',
  },
  title: {
    fontSize: '2.2rem',
    color: 'var(--color-title)',
    marginBottom: '8px',
    fontWeight: 700,
    letterSpacing: '-1px',
  },
  subtitle: {
    color: 'var(--color-subtitle)',
    fontSize: '1.1rem',
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
    background: 'var(--color-card)',
    borderRadius: '18px',
    padding: '2rem 1.5rem',
    boxShadow: '0 4px 24px 0 #e3eafc',
    border: '1px solid var(--color-border)',
    marginBottom: '2rem',
  },
  cardTitle: {
    color: 'var(--color-title)',
    fontSize: '18px',
    marginBottom: '8px',
    fontWeight: 600,
  },
  cardValue: {
    fontSize: '32px',
    color: 'var(--color-accent)',
    fontWeight: 'bold',
  },
};

export default AdminDashboard;
