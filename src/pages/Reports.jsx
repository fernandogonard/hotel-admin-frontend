import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Link } from 'react-router-dom';

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
        <Link to="/manage-guests" style={styles.link}>Clientes</Link>
        <Link to="/reports" style={styles.link}>Informes</Link>
      </nav>
    </aside>
  );
};

const Reports = () => {
  const [generalReports, setGeneralReports] = useState(null);
  const [reservationReports, setReservationReports] = useState(null);
  const [roomReports, setRoomReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const generalRes = await axiosInstance.get('/api/reports/general');
        const reservationRes = await axiosInstance.get('/api/reports/reservations');
        const roomRes = await axiosInstance.get('/api/reports/rooms');
        setGeneralReports(generalRes.data);
        setReservationReports(reservationRes.data);
        setRoomReports(roomRes.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los reportes');
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.main}>
        <header>
          <h1 style={styles.title}>Informes</h1>
        </header>
        <section style={styles.contentGrid}>
          <div style={styles.statsGrid}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Generales</h2>
              {generalReports && (
                <ul>
                  <li>Total de Habitaciones: {generalReports.totalRooms}</li>
                  <li>Habitaciones Disponibles: {generalReports.availableRooms}</li>
                  <li>Habitaciones Ocupadas: {generalReports.occupiedRooms}</li>
                </ul>
              )}
            </div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Reservas</h2>
              {reservationReports && (
                <ul>
                  <li>Total de Reservas: {reservationReports.totalReservations}</li>
                  <li>Reservas Activas: {reservationReports.activeReservations}</li>
                  <li>Reservas Completadas: {reservationReports.completedReservations}</li>
                </ul>
              )}
            </div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Habitaciones</h2>
              {roomReports && (
                <ul>
                  {roomReports.map((room) => (
                    <li key={room._id}>
                      {room._id}: {room.count}
                    </li>
                  ))}
                </ul>
              )}
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
    gridTemplateColumns: '1fr',
    gap: '32px',
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
};

export default Reports;
