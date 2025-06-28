// src/pages/DashboardAvanzado.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AdminDashboardAvanzado from '../components/dashboard/AdminDashboardAvanzado';
import '../styles/corona.css';
import axiosInstance from '../utils/axiosInstance';

function DashboardAvanzado() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Polling cada 30 segundos
  useEffect(() => {
    let interval;
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/reports/general');
        setStats(res.data.data || res.data);
      } catch {
        setStats(null);
      }
      setLoading(false);
    };
    fetchStats();
    interval = setInterval(fetchStats, 30000); // Actualiza cada 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="corona-layout">
      <aside className="corona-sidebar">
        <h2 className="sidebar-title">Dashboard Avanzado</h2>
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
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>Dashboard Avanzado</h1>
          <p style={{ color: 'var(--corona-muted)', marginBottom: 24 }}>
            Visualización avanzada de métricas y actividades del hotel.
          </p>
          <AdminDashboardAvanzado stats={stats} loading={loading} />
        </div>
        <div className="corona-footer">
          © {new Date().getFullYear()} Hotel Admin. Todos los derechos reservados.
        </div>
      </main>
    </div>
  );
};

export default DashboardAvanzado;
