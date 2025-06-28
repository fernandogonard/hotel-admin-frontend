import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/corona.css';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="corona-sidebar">
      <h2 className="sidebar-title">Admin Hotel</h2>
      <nav className="sidebar-nav">
        <Link to="/admin-dashboard" className="sidebar-link">Dashboard</Link>
        <Link to="/dashboard-avanzado" className="sidebar-link">Dashboard Avanzado</Link>
        <Link to="/calendario-reservas" className="sidebar-link">Calendario</Link>
        <Link to="/manage-rooms" className="sidebar-link">Habitaciones</Link>
        <Link to="/manage-reservations" className="sidebar-link">Reservas</Link>
        <Link to="/reports" className="sidebar-link">Reportes</Link>
        <Link to="/mi-historial" className="sidebar-link">Mi Historial</Link>
      </nav>
      <button
        onClick={async () => { await logout(); navigate('/login'); }}
        className="corona-btn"
        style={{ marginTop: 24 }}
      >
        Cerrar sesión
      </button>
    </aside>
  );
};

export default Sidebar;