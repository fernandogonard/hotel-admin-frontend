import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Link } from 'react-router-dom';
import styles from '../assets/Reports.module.css';
import Sidebar from '../components/Sidebar';

const Reports = () => {
  const [generalReports, setGeneralReports] = useState(null);
  const [reservationReports, setReservationReports] = useState(null);
  const [roomReports, setRoomReports] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const generalRes = await axiosInstance.get('/api/reports/general');
        const reservationRes = await axiosInstance.get('/api/reports/reservations');
        const roomRes = await axiosInstance.get('/api/reports/rooms');
        setGeneralReports(generalRes.data);
        setReservationReports(reservationRes.data);
        setRoomReports(roomRes.data);
      } catch {
        // Error silenciado, se puede mostrar un mensaje si se desea
      }
    };
    fetchReports();
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Informes</h1>
        </header>
        <section className={styles.content}>
          <div style={{ marginBottom: 24 }}>
            <button
              className={styles.btnExport}
              onClick={async () => {
                try {
                  const res = await axiosInstance.get('/reports/reservations/export', {
                    responseType: 'blob',
                  });
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', 'reporte_reservas.xlsx');
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                } catch {
                  alert('Error al exportar el reporte.');
                }
              }}
              title="Descargar reporte de reservas en Excel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
              Descargar reservas (Excel)
            </button>
          </div>
          <div style={{ marginBottom: 24 }}>
            <button
              className={styles.btnExport}
              onClick={async () => {
                try {
                  const res = await axiosInstance.get('/reports/rooms/export', {
                    responseType: 'blob',
                  });
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', 'reporte_habitaciones.xlsx');
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                } catch {
                  alert('Error al exportar el reporte de habitaciones.');
                }
              }}
              title="Descargar reporte de habitaciones en Excel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
              Descargar habitaciones (Excel)
            </button>
          </div>
          <div style={{ marginBottom: 24 }}>
            <button
              className={styles.btnExport}
              onClick={async () => {
                try {
                  const res = await axiosInstance.get('/reports/guests/export', {
                    responseType: 'blob',
                  });
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', 'reporte_huespedes.xlsx');
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                } catch {
                  alert('Error al exportar el reporte de huéspedes.');
                }
              }}
              title="Descargar reporte de huéspedes en Excel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
              Descargar huéspedes (Excel)
            </button>
          </div>
          <div className={styles.statsGrid}>
            <div className={styles.card}>
              <h2>Generales</h2>
              {generalReports && (
                <ul>
                  <li>Total de Habitaciones: {generalReports.totalRooms}</li>
                  <li>Habitaciones Disponibles: {generalReports.availableRooms}</li>
                  <li>Habitaciones Ocupadas: {generalReports.occupiedRooms}</li>
                </ul>
              )}
            </div>
            <div className={styles.card}>
              <h2>Reservas</h2>
              {reservationReports && (
                <ul>
                  <li>Total de Reservas: {reservationReports.totalReservations}</li>
                  <li>Reservas Activas: {reservationReports.activeReservations}</li>
                  <li>Reservas Completadas: {reservationReports.completedReservations}</li>
                </ul>
              )}
            </div>
            <div className={styles.card}>
              <h2>Habitaciones</h2>
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
        <footer className={styles.footer}>
          <span>© {new Date().getFullYear()} Hotel Admin. Todos los derechos reservados.</span>
        </footer>
      </main>
    </div>
  );
};

export default Reports;
