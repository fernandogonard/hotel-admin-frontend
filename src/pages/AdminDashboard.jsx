import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../styles/corona.css';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="corona-layout">
      <aside className="corona-sidebar">
        <h2 className="sidebar-title">Admin Hotel</h2>
        <nav>
          <a href="/admin-dashboard" className="sidebar-link">Dashboard</a>
          <a href="/dashboard-avanzado" className="sidebar-link">Dashboard Avanzado</a>
          <a href="/calendario-reservas" className="sidebar-link">Calendario</a>
          <a href="/manage-rooms" className="sidebar-link">Habitaciones</a>
          <a href="/manage-reservations" className="sidebar-link">Reservas</a>
          <a href="/reports" className="sidebar-link">Reportes</a>
          <a href="/mi-historial" className="sidebar-link">Mi Historial</a>
        </nav>
        <button
          onClick={async () => { await logout(); navigate('/login'); }}
          className="corona-btn"
          style={{ marginTop: 24 }}
        >
          Cerrar sesión
        </button>
      </aside>
      <main className="corona-main">
        <div className="corona-card">
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>Panel de Administración</h1>
          <p style={{ color: 'var(--corona-muted)', marginBottom: 24 }}>
            Bienvenido {user?.name || 'Administrador'} - Gestión centralizada del hotel
          </p>
          {/* Aquí puedes agregar cards, widgets y KPIs Corona-style */}
        </div>

        <div className="corona-footer">
          © {new Date().getFullYear()} Hotel Admin. Todos los derechos reservados.
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
