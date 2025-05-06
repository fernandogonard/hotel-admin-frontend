import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <h2>Admin Hotel</h2>
      <nav>
        <Link to="/admin-dashboard">Dashboard</Link>
        <Link to="/manage-rooms">Habitaciones</Link>
        <Link to="/manage-reservations">Reservas</Link>
        <Link to="/reports">Reportes</Link>
      </nav>
      <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>
    </aside>
  );
};

export default Sidebar;