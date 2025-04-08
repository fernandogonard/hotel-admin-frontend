import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import QuickActions from '../../components/QuickActions';
import FilterPanel from '../../components/FilterPanel';
import OccupancyChart from '../../components/Charts/OccupancyChart';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';






const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    pendingCleanings: 0,
    activeBookings: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [availabilityGrid, setAvailabilityGrid] = useState([]);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/stats', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/admin/activities', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const statsData = await statsRes.json();
        const activitiesData = await activitiesRes.json();

        if (statsRes.ok && activitiesRes.ok) {
          setStats(statsData);
          setRecentActivities(Array.isArray(activitiesData) ? activitiesData : []);
        } else {
          setError('Error al cargar los datos del dashboard');
        }
      } catch (err) {
        console.error('Error al cargar los datos del dashboard:', err);
        setError('Error de conexión con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  useEffect(() => {
    const fetchAvailabilityGrid = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/rooms/availability-grid', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setAvailabilityGrid(data);
        } else {
          console.error('Error al obtener disponibilidad');
        }
      } catch (err) {
        console.error('Error de conexión al obtener disponibilidad:', err);
      }
    };

    fetchAvailabilityGrid();
  }, [token]);

  useEffect(() => {
    const generateDays = () => {
      const result = [];
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        result.push(date.toISOString().split('T')[0]);
      }
      setDays(result);
    };

    generateDays();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        📊 Panel de Administración
      </h1>

      <QuickActions />
      <FilterPanel />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Ocupación" value={`${Math.round((stats.occupiedRooms / stats.totalRooms) * 100 || 0)}%`} sub={`${stats.occupiedRooms}/${stats.totalRooms} habitaciones`} color="blue" />
        <StatCard title="Limpieza Pendiente" value={stats.pendingCleanings} sub="habitaciones" color="yellow" />
        <StatCard title="Servicios Activos" value={stats.activeBookings} sub="reservas" color="green" />
      </div>

      {/* Check-ins y Check-outs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Check-ins de Hoy" value={stats.todayCheckIns} color="indigo" />
        <StatCard title="Check-outs de Hoy" value={stats.todayCheckOuts} color="purple" />
      </div>

      {/* Grilla de disponibilidad */}
      <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Disponibilidad (30 días)</h3>
        <table className="min-w-full table-auto text-sm text-center border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1 border">Habitación</th>
              {days.map(date => (
                <th key={date} className="px-2 py-1 border">{date.slice(5)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {availabilityGrid.map(room => (
              <tr key={room.roomId}>
                <td className="px-2 py-1 border font-medium">{room.roomNumber}</td>
                {days.map(date => {
                  const status = room.dailyStatus[date];
                  const bg =
                    status === 'ocupado' ? 'bg-red-200 text-red-800 font-semibold' :
                    status === 'reservado' ? 'bg-yellow-200 text-yellow-900' :
                    'bg-green-100 text-green-800';
                  return (
                    <td key={date} className={`px-2 py-1 border ${bg}`} title={status}>
                      {status !== 'libre' ? status : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OccupancyChart />

      {/* Actividades recientes */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Actividades Recientes</h3>
        {recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={activity._id || activity.timestamp || index}
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-gray-500">
                    {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Fecha desconocida'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded text-sm ${
                  activity.type === 'check_in' ? 'bg-green-100 text-green-800' :
                  activity.type === 'check_out' ? 'bg-red-100 text-red-800' :
                  activity.type === 'cleaning' ? 'bg-blue-100 text-blue-800' :
                  activity.type === 'service' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {activity.type || 'Desconocido'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay actividades recientes.</p>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, sub = '', color = 'gray' }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="flex justify-between items-center">
      <span className={`text-3xl font-bold text-${color}-600`}>{value}</span>
      <span className="text-gray-500">{sub}</span>
    </div>
  </div>
);

export default AdminDashboard;
