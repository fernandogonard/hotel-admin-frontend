import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
} from 'chart.js';
import axios from 'axios';
import { Link } from 'react-router-dom';

ChartJS.register(BarElement, CategoryScale, LinearScale, LineElement, PointElement);

const Sidebar = () => {
  const styles = {
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
  };

  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.sidebarTitle}>Admin Hotel</h2>
      <nav style={styles.nav}>
        <Link to="/admin-dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/manage-rooms" style={styles.link}>Habitaciones</Link>
        <Link to="/manage-reservations" style={styles.link}>Reservas</Link>
        <Link to="/reports" style={styles.link}>Informes</Link>
      </nav>
    </aside>
  );
};

const Reports = () => {
  const [generalStats, setGeneralStats] = useState(null);
  const [reservationStats, setReservationStats] = useState(null);
  const [roomStats, setRoomStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [genRes, resStats, roomRes] = await Promise.all([
        axios.get('http://localhost:5173/api/reports/general'),
        axios.get('http://localhost:5173/api/reports/reservations'),
        axios.get('http://localhost:5173/api/reports/rooms'),
      ]);
      setGeneralStats(genRes.data);
      setReservationStats(resStats.data);
      setRoomStats(roomRes.data);
    } catch (error) {
      console.error('Error al cargar informes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando informes...</div>;
  }

  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.main}>
        <header>
          <h1 style={styles.title}>Informes del Hotel</h1>
        </header>

        <section style={styles.contentGrid}>
          {/* Informe General */}
          <div style={styles.statsGrid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Total Ingresos</h3>
              <p style={styles.cardValue}>${generalStats?.totalRevenue}</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Total Reservas</h3>
              <p style={styles.cardValue}>{generalStats?.totalReservations}</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Ocupación Promedio</h3>
              <p style={styles.cardValue}>{generalStats?.occupancyRate}%</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Gráfica de Ocupación</h3>
              {/* Verificación de datos antes de pasar a la gráfica */}
              {generalStats?.occupancyChart ? (
                <Bar data={generalStats.occupancyChart} />
              ) : (
                <p>No hay datos disponibles para la gráfica de ocupación</p>
              )}
            </div>
          </div>

          {/* Informe de Reservas */}
          <div style={styles.statsGrid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Noches Reservadas</h3>
              <p style={styles.cardValue}>{reservationStats?.totalNights}</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Tasa Cancelación</h3>
              <p style={styles.cardValue}>{reservationStats?.cancellationRate}%</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Estancia Promedio</h3>
              <p style={styles.cardValue}>{reservationStats?.avgStay} días</p>
            </div>
          </div>

          {/* Informe de Habitaciones */}
          <div style={styles.statsGrid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Más Reservadas</h3>
              <ul>
                {roomStats?.mostBooked?.map((r, i) => (
                  <li key={i}>{r.roomNumber} - {r.count} reservas</li>
                ))}
              </ul>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Menos Utilizadas</h3>
              <ul>
                {roomStats?.leastUsed?.map((r, i) => (
                  <li key={i}>{r.roomNumber} - {r.count} reservas</li>
                ))}
              </ul>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Fuera de Servicio</h3>
              <ul>
                {roomStats?.outOfService?.map((r, i) => (
                  <li key={i}>{r.roomNumber} - {r.daysOut} días ({r.reason})</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

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
  main: {
    flex: 1,
    padding: '32px',
    marginLeft: '240px',
  },
  title: {
    fontSize: '32px',
    color: '#FF6600',
    marginBottom: '8px',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
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
};

export default Reports;
