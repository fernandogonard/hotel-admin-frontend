import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const Sidebar = () => {
  const navigate = useNavigate();
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
        // Silenciar error para sidebar
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="sidebar sidebar-modern">
      <h2 className="sidebar-title">Admin Hotel</h2>
      <nav className="sidebar-nav">
        <Link to="/admin-dashboard" className="sidebar-link">Dashboard</Link>
        <Link to="/manage-rooms" className="sidebar-link">Habitaciones</Link>
        <Link to="/manage-reservations" className="sidebar-link">Reservas</Link>
        <Link to="/reports" className="sidebar-link">Reportes</Link>
      </nav>
      <div className="sidebar-stats">
        <div className="sidebar-stat sidebar-stat-ocupadas">
          <span className="sidebar-stat-label">Habitaciones Ocupadas</span>
          <span className="sidebar-stat-value">{stats.occupiedRooms}</span>
        </div>
        <div className="sidebar-stat sidebar-stat-reservas">
          <span className="sidebar-stat-label">Reservas Totales</span>
          <span className="sidebar-stat-value">{stats.totalReservations}</span>
        </div>
        <div className="sidebar-stat sidebar-stat-disponibles">
          <span className="sidebar-stat-label">Disponibles</span>
          <span className="sidebar-stat-value">{stats.availableRooms}</span>
        </div>
      </div>
      <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>
    </aside>
  );
};

export default Sidebar;