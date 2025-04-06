import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const ServicesDashboard = () => {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('servicios');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, bookingsRes] = await Promise.all([
          fetch('http://localhost:5000/api/services', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/services/booking/room/all', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const servicesData = await servicesRes.json();
        const bookingsData = await bookingsRes.json();

        if (servicesRes.ok && bookingsRes.ok) {
          setServices(servicesData);
          setBookings(bookingsData);
        } else {
          setError('Error al cargar los datos');
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/services/booking/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setBookings(bookings.map(booking => 
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        ));
      }
    } catch (err) {
      setError('Error al actualizar la reserva');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Servicios</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('servicios')}
            className={`px-4 py-2 rounded ${
              activeTab === 'servicios' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Servicios
          </button>
          <button
            onClick={() => setActiveTab('reservas')}
            className={`px-4 py-2 rounded ${
              activeTab === 'reservas' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Reservas
          </button>
        </div>
      </div>

      {activeTab === 'servicios' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div key={service._id} className="bg-white rounded-lg shadow p-6">
              {service.image && (
                <img 
                  src={service.image} 
                  alt={service.name}
                  className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${service.price}</span>
                <span className={`px-3 py-1 rounded ${
                  service.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {service.available ? 'Disponible' : 'No disponible'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left">Servicio</th>
                <th className="px-6 py-3 text-left">Habitación</th>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id} className="border-b">
                  <td className="px-6 py-4">{booking.service.name}</td>
                  <td className="px-6 py-4">
                    {booking.room ? `Habitación ${booking.room.number}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(booking.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      booking.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'confirmada' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'completada' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {booking.status === 'pendiente' && (
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'confirmada')}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Confirmar
                      </button>
                    )}
                    {booking.status === 'confirmada' && (
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'completada')}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Completar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ServicesDashboard;
