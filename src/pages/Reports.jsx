import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Link } from 'react-router-dom';
import '../styles/corona.css';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';

const Reports = () => {
  const [generalReports, setGeneralReports] = useState({});
  const [reservationReports, setReservationReports] = useState({});
  const [roomReports, setRoomReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const generalRes = await axiosInstance.get('/reports/general');
        const reservationRes = await axiosInstance.get('/reports/reservations');
        const roomRes = await axiosInstance.get('/reports/rooms');
        setGeneralReports(generalRes.data);
        setReservationReports(reservationRes.data);
        setRoomReports(roomRes.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast.error('Error al cargar los reportes');
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="corona-layout">
      <Sidebar />
      <main className="corona-main">
        <div className="corona-card">
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>Reportes</h1>
          <div style={{ marginBottom: 24 }}>
            <button
              className="btn btn-primary"
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
              className="btn btn-primary"
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
              className="btn btn-primary"
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
          <div className="corona-grid">
            <div className="corona-card">
              <h2>Generales</h2>
              {generalReports && (
                <ul>
                  <li>Total de Habitaciones: {generalReports.totalRooms}</li>
                  <li>Habitaciones Disponibles: {generalReports.availableRooms}</li>
                  <li>Habitaciones Ocupadas: {generalReports.occupiedRooms}</li>
                </ul>
              )}
            </div>
            <div className="corona-card">
              <h2>Reservas</h2>
              {reservationReports && (
                <ul>
                  <li>Total de Reservas: {reservationReports.totalReservations}</li>
                  <li>Reservas Activas: {reservationReports.activeReservations}</li>
                  <li>Reservas Completadas: {reservationReports.completedReservations}</li>
                </ul>
              )}
            </div>
            <div className="corona-card">
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
        </div>
        <div className="corona-footer">
          © {new Date().getFullYear()} Hotel Admin. Todos los derechos reservados.
        </div>
      </main>
    </div>
  );
};

export default Reports;
