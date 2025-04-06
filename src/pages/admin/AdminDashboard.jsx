import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // En un caso real, estas serían llamadas a tu API
        const [statsRes, activitiesRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/admin/activities', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const statsData = await statsRes.json();
        const activitiesData = await activitiesRes.json();

        if (statsRes.ok && activitiesRes.ok) {
          setStats(statsData);
          setRecentActivities(activitiesData);
        } else {
          setError('Error al cargar los datos del dashboard');
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Ocupación</h3>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold text-blue-600">
              {Math.round((stats.occupiedRooms / stats.totalRooms) * 100)}%
            </span>
            <span className="text-gray-500">
              {stats.occupiedRooms}/{stats.totalRooms} habitaciones
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Limpieza Pendiente</h3>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold text-yellow-600">
              {stats.pendingCleanings}
            </span>
            <span className="text-gray-500">habitaciones</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Servicios Activos</h3>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold text-green-600">
              {stats.activeBookings}
            </span>
            <span className="text-gray-500">reservas</span>
          </div>
        </div>
      </div>

      {/* Check-ins/Check-outs de hoy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Check-ins de Hoy</h3>
          <div className="text-3xl font-bold text-indigo-600">
            {stats.todayCheckIns}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Check-outs de Hoy</h3>
          <div className="text-3xl font-bold text-purple-600">
            {stats.todayCheckOuts}
          </div>
        </div>
      </div>

      {/* Actividades Recientes */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Actividades Recientes</h3>
        <div className="space-y-4">
          {recentActivities.map(activity => (
            <div 
              key={activity._id} 
              className="flex items-center justify-between border-b pb-4"
            >
              <div>
                <p className="font-medium">{activity.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded text-sm ${
                activity.type === 'check_in' ? 'bg-green-100 text-green-800' :
                activity.type === 'check_out' ? 'bg-red-100 text-red-800' :
                activity.type === 'cleaning' ? 'bg-blue-100 text-blue-800' :
                activity.type === 'service' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {activity.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
