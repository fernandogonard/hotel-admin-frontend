import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>Admin Hotel</h2>
      <nav>
        <Link to="/admin-dashboard">Dashboard</Link>
        <Link to="/manage-rooms">Habitaciones</Link>
        <Link to="/manage-reservations">Reservas</Link>
        <Link to="/manage-guests">Clientes</Link>
        <Link to="/reports">Informes</Link>
      </nav>
    </aside>
  );
};

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
    <div className="reports-page" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', marginLeft: '240px' }}>
        <h1>Informes</h1>
        <section style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div className="stats-grid" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div className="card">
              <h2>Generales</h2>
              {generalReports && (
                <ul>
                  <li>Total de Habitaciones: {generalReports.totalRooms}</li>
                  <li>Habitaciones Disponibles: {generalReports.availableRooms}</li>
                  <li>Habitaciones Ocupadas: {generalReports.occupiedRooms}</li>
                </ul>
              )}
            </div>
            <div className="card">
              <h2>Reservas</h2>
              {reservationReports && (
                <ul>
                  <li>Total de Reservas: {reservationReports.totalReservations}</li>
                  <li>Reservas Activas: {reservationReports.activeReservations}</li>
                  <li>Reservas Completadas: {reservationReports.completedReservations}</li>
                </ul>
              )}
            </div>
            <div className="card">
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
      </main>
    </div>
  );
};

export default Reports;
