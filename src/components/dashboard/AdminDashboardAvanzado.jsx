// src/components/dashboard/AdminDashboardAvanzado.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FaHotel, FaUsers, FaDollarSign, FaCalendarAlt, FaCog } from 'react-icons/fa';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboardAvanzado = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  // Cargar datos del dashboard
  useEffect(() => {
    loadDashboardData();
    loadActivities();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/reports/general?from=${dateRange.from}&to=${dateRange.to}`
      );
      setStats(response.data.data);
    } catch (err) {
      setError('Error al cargar estadísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      const response = await axiosInstance.get('/activities');
      setActivities(response.data.data);
    } catch (err) {
      console.error('Error cargando actividades:', err);
    }
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={loadDashboardData} className="btn btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-avanzado">
      <div className="dashboard-header">
        <h1>Dashboard Administrativo</h1>
        <FilterPanel 
          dateRange={dateRange} 
          onChange={handleDateChange}
          onRefresh={loadDashboardData}
        />
      </div>

      {stats && (
        <>
          <div className="dashboard-overview">
            <OverviewCards overview={stats.overview} />
          </div>

          <div className="dashboard-charts">
            <div className="chart-section">
              <h3>📊 Ocupación por Día</h3>
              <OccupancyChart data={stats.charts.occupancy} />
            </div>

            <div className="chart-section">
              <h3>💰 Ingresos Diarios</h3>
              <IncomeChart data={stats.charts.revenue} />
            </div>

            <div className="chart-section">
              <h3>🏨 Reservas por Tipo</h3>
              <ReservationByTypeChart data={stats.charts.reservationsByType} />
            </div>
          </div>

          <div className="dashboard-activity">
            <ActivityLogList activities={activities} />
          </div>
        </>
      )}
    </div>
  );
};

// Componente de tarjetas de resumen
const OverviewCards = ({ overview }) => {
  const cards = [
    {
      title: 'Habitaciones Totales',
      value: overview.totalRooms,
      icon: <FaHotel />,
      color: 'blue'
    },
    {
      title: 'Ocupación',
      value: `${overview.occupancyRate}%`,
      subtitle: `${overview.occupiedRooms}/${overview.totalRooms}`,
      icon: <FaUsers />,
      color: 'green'
    },
    {
      title: 'Ingresos',
      value: `$${overview.revenue}`,
      subtitle: `Estancia promedio: ${overview.averageStay} días`,
      icon: <FaDollarSign />,
      color: 'purple'
    },
    {
      title: 'Reservas Activas',
      value: overview.activeReservations,
      subtitle: `Total periodo: ${overview.totalReservations}`,
      icon: <FaCalendarAlt />,
      color: 'orange'
    }
  ];

  return (
    <div className="overview-cards">
      {cards.map((card, index) => (
        <div key={index} className={`overview-card ${card.color}`}>
          <div className="card-icon">{card.icon}</div>
          <div className="card-content">
            <h4>{card.title}</h4>
            <div className="card-value">{card.value}</div>
            {card.subtitle && <div className="card-subtitle">{card.subtitle}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente de filtros
const FilterPanel = ({ dateRange, onChange, onRefresh }) => {
  return (
    <div className="filter-panel">
      <div className="date-filters">
        <div className="filter-group">
          <label>Desde:</label>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => onChange('from', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Hasta:</label>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => onChange('to', e.target.value)}
          />
        </div>
        <button onClick={onRefresh} className="btn btn-primary">
          <FaCog /> Actualizar
        </button>
      </div>
    </div>
  );
};

// Gráfico de ocupación
const OccupancyChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Ocupación (%)',
        data: data.map(item => item.occupancy),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Porcentaje de Ocupación Diaria',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

// Gráfico de ingresos
const IncomeChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Ingresos ($)',
        data: data.map(item => item.revenue),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ingresos Diarios',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

// Gráfico de reservas por tipo
const ReservationByTypeChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item._id),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Distribución de Reservas por Tipo de Habitación',
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

// Lista de actividades
const ActivityLogList = ({ activities }) => {
  return (
    <div className="activity-log">
      <h3>📋 Registro de Actividades</h3>
      <div className="activity-list">
        {activities.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="activity-icon">
              {getActivityIcon(activity.type)}
            </div>
            <div className="activity-content">
              <div className="activity-description">{activity.description}</div>
              <div className="activity-meta">
                <span className="activity-user">{activity.user}</span>
                <span className="activity-time">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Función auxiliar para iconos de actividad
const getActivityIcon = (type) => {
  const icons = {
    reservation: '📅',
    room: '🏨',
    user: '👤',
    payment: '💳',
    default: '📝'
  };
  return icons[type] || icons.default;
};

export default AdminDashboardAvanzado;
