import React from 'react';
import { Link } from 'react-router-dom'; // Usado para navegación
import { HiOutlineSearch } from 'react-icons/hi'; // Icono de búsqueda
import { Bar } from 'react-chartjs-2'; // Para el gráfico de ocupación (requiere instalación de chart.js)
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styles from '../assets/ReceptionistDashboard.module.css';

// Registrar las escalas y otros componentes necesarios
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ReceptionistDashboard() {
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
    <div className={styles.layout}>
      <aside className="sidebar">
        <h2>Dashboard Recepcionista</h2>
        <nav>
          <ul>
            <li><Link to="/reservas">Reservas</Link></li>
            <li><Link to="/habitaciones">Habitaciones</Link></li>
            <li><Link to="/clientes">Clientes</Link></li>
          </ul>
        </nav>
      </aside>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Panel de Recepcionista</h1>
          <p className={styles.subtitle}>Aquí podrás gestionar las reservas y el estado de las habitaciones.</p>
        </div>
        {/* Barra de búsqueda */}
        <div className={styles.search}>
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
          <div className={styles.cards}>
            <div className="card" style={{ textAlign: 'center', background: '#22c55e', color: '#fff' }}>
              <h3>Habitación 101</h3>
              <p>Disponible</p>
            </div>
            <div className="card" style={{ textAlign: 'center', background: '#ff7f50', color: '#fff' }}>
              <h3>Habitación 102</h3>
              <p>Ocupada</p>
            </div>
            <div className="card" style={{ textAlign: 'center', background: '#6b7280', color: '#fff' }}>
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
          <button className="btn" style={{ width: '50%', background: '#48bb78' }}>
            Gestionar Habitaciones
          </button>
        </div>
        <footer className={styles.footer}>
          <span>© {new Date().getFullYear()} Hotel Admin. Todos los derechos reservados.</span>
        </footer>
      </main>
    </div>
  );
}

export default ReceptionistDashboard;
