import React from 'react';
import { Link } from 'react-router-dom'; // Usado para navegación
import { HiOutlineSearch } from 'react-icons/hi'; // Icono de búsqueda
import { Bar } from 'react-chartjs-2'; // Para el gráfico de ocupación (requiere instalación de chart.js)
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

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
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex' }}>
      {/* Barra lateral */}
      <div style={{ width: '16rem', backgroundColor: '#2b6cb0', color: 'white', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>Dashboard Recepcionista</h2>
        <nav>
          <ul>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/reservas" style={{ fontSize: '1.125rem', color: '#cbd5e0', textDecoration: 'none' }}>Reservas</Link>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/habitaciones" style={{ fontSize: '1.125rem', color: '#cbd5e0', textDecoration: 'none' }}>Habitaciones</Link>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <Link to="/clientes" style={{ fontSize: '1.125rem', color: '#cbd5e0', textDecoration: 'none' }}>Clientes</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Panel principal */}
      <div style={{ flex: 1, padding: '2.5rem' }}>
        <div style={{ backgroundColor: 'white', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '1.5rem', padding: '2rem', maxWidth: '60rem', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#3182ce', marginBottom: '1rem' }}>Panel de Recepcionista</h1>
          <p style={{ color: '#4a5568', marginBottom: '1.5rem' }}>
            Aquí podrás gestionar las reservas y el estado de las habitaciones.
          </p>

          {/* Barra de búsqueda */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.5rem' }}>
            <HiOutlineSearch style={{ color: '#a0aec0', marginRight: '0.5rem' }} />
            <input
              type="text"
              placeholder="Buscar reserva o cliente"
              style={{ width: '100%', border: 'none', padding: '0.5rem', outline: 'none' }}
            />
          </div>

          {/* Gráfico de ocupación */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#4a5568', marginBottom: '1rem' }}>Ocupación de Habitaciones</h2>
            <Bar data={data} options={{ responsive: true }} />
          </div>

          {/* Lista de habitaciones */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#4a5568', marginBottom: '1rem' }}>Estado de las Habitaciones</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#c6f6d5', borderRadius: '1rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Habitación 101</h3>
                <p style={{ fontSize: '0.875rem', color: '#4a5568' }}>Disponible</p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#faf089', borderRadius: '1rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Habitación 102</h3>
                <p style={{ fontSize: '0.875rem', color: '#4a5568' }}>Ocupada</p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#fed7d7', borderRadius: '1rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Habitación 103</h3>
                <p style={{ fontSize: '0.875rem', color: '#4a5568' }}>Fuera de servicio</p>
              </div>
            </div>
          </div>

          {/* Acción rápida */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ width: '50%', backgroundColor: '#2b6cb0', color: 'white', fontWeight: '600', padding: '0.75rem', borderRadius: '1rem', transition: 'background-color 0.3s', cursor: 'pointer' }}>
              Crear Reserva
            </button>
            <button style={{ width: '50%', backgroundColor: '#48bb78', color: 'white', fontWeight: '600', padding: '0.75rem', borderRadius: '1rem', transition: 'background-color 0.3s', cursor: 'pointer' }}>
              Gestionar Habitaciones
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceptionistDashboard;
