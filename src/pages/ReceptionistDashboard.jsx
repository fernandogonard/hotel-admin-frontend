import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineSearch } from 'react-icons/hi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../hooks/useAuth';
import ReceptionistChatbot from '../components/ReceptionistChatbot';
import '../styles/corona.css';

// Registrar las escalas y otros componentes necesarios
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ReceptionistDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Datos de ejemplo para el gráfico de ocupación
  const data = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ocupación de Habitaciones',
        data: [30, 45, 40, 60, 75, 50],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="corona-layout">
      <aside className="corona-sidebar">
        <h2 className="sidebar-title">Recepción</h2>
        <nav>
          <Link to="/receptionist-dashboard" className="sidebar-link">Dashboard</Link>
          <Link to="/reservas" className="sidebar-link">Reservas</Link>
          <Link to="/habitaciones" className="sidebar-link">Habitaciones</Link>
          <Link to="/clientes" className="sidebar-link">Clientes</Link>
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
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>Panel de Recepcionista</h1>
          <p style={{ color: 'var(--corona-muted)', marginBottom: 24 }}>Gestiona reservas, habitaciones y clientes desde un solo lugar.</p>
          {/* Barra de búsqueda */}
          <div className="search">
            <HiOutlineSearch style={{ color: 'var(--color-subtitle)', marginRight: '0.5rem' }} />
            <input
              type="text"
              placeholder="Buscar reserva o cliente"
              style={{ width: '100%', border: 'none', padding: '0.5rem', outline: 'none', background: 'transparent', color: 'var(--color-title)' }}
            />
          </div>
          {/* Gráfico de ocupación */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-subtitle)', marginBottom: '1rem' }}>Ocupación de Habitaciones</h2>
            <Bar data={data} options={{ responsive: true }} />
          </div>
          {/* Lista de habitaciones */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-subtitle)', marginBottom: '1rem' }}>Estado de las Habitaciones</h2>
            <div className="cards">
              <div className="card" style={{ textAlign: 'center', background: 'var(--success)', color: 'var(--card-bg)' }}>
                <h3>Habitación 101</h3>
                <p>Disponible</p>
              </div>
              <div className="card" style={{ textAlign: 'center', background: 'var(--danger)', color: 'var(--card-bg)' }}>
                <h3>Habitación 102</h3>
                <p>Ocupada</p>
              </div>
              <div className="card" style={{ textAlign: 'center', background: 'var(--text-light)', color: 'var(--card-bg)' }}>
                <h3>Habitación 103</h3>
                <p>Fuera de servicio</p>
              </div>
            </div>
          </div>
          {/* Acción rápida */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" style={{ width: '50%' }}>
              Crear Reserva
            </button>
            <button className="btn" style={{ width: '50%', background: 'var(--success)' }}>
              Gestionar Habitaciones
            </button>
          </div>
        </div>
        {/* Chatbot Recepcionista */}
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
          <ReceptionistChatbot />
        </div>
        <div className="corona-footer">
          © {new Date().getFullYear()} Hotel Admin. Todos los derechos reservados.
        </div>
      </main>
    </div>
  );
}

export default ReceptionistDashboard;

// FIXME: Reemplaza los colores hardcodeados por variables CSS de la nueva paleta en todos los estilos en línea y clases.
// Ejemplo: background: 'var(--primary)' en vez de background: '#458cf4'
