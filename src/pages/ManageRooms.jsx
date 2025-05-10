import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Link } from 'react-router-dom';
import './rooms.css';

function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState({
    number: '',
    type: '',
    description: '',
    price: '',
    status: 'disponible',
    floor: '',
    capacity: '',
    amenities: [],
    images: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    axiosInstance.get('/rooms')
      .then(response => setRooms(response.data))
      .catch(error => console.error("Error al obtener habitaciones: ", error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoom({ ...room, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = isEditing ? `/rooms/${room._id}` : '/rooms';
    const method = isEditing ? axiosInstance.put : axiosInstance.post;

    method(url, room)
      .then(() => {
        setMessage(isEditing ? 'Habitación actualizada' : 'Habitación creada');
        setIsEditing(false);
        setRoom({
          number: '',
          type: '',
          description: '',
          price: '',
          status: 'disponible',
          floor: '',
          capacity: '',
          amenities: [],
          images: [],
        });
        fetchRooms();
      })
      .catch(console.error);
  };

  const handleDelete = (id) => {
    axiosInstance.delete(`/rooms/${id}`)
      .then(() => {
        setRooms(rooms.filter(room => room._id !== id));
        setMessage('Habitación eliminada');
      })
      .catch(console.error);
  };

  const handleEdit = (roomToEdit) => {
    setRoom({
      ...roomToEdit,
      amenities: roomToEdit.amenities || [],
    });
    setIsEditing(true);
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Admin Hotel</h2>
        <nav style={styles.nav}>
          <Link to="/admin-dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/manage-rooms" style={styles.link}>Habitaciones</Link>
          <Link to="/manage-reservations" style={styles.link}>Reservas</Link>
          <Link to="/manage-guests" style={styles.link}>Clientes</Link>
          <Link to="/reports" style={styles.link}>Informes</Link>
        </nav>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <h1>Gestión de Habitaciones</h1>

        {message && (
          <div className="bg-green-500 text-white p-4 rounded-md mb-4">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulario */}
          <div>
            <h2>{isEditing ? 'Editar Habitación' : 'Crear Habitación'}</h2>
            <form onSubmit={handleSubmit} className="room-form">
              <label>Número</label>
              <input name="number" value={room.number} onChange={handleInputChange} required />

              <label>Tipo</label>
              <input name="type" value={room.type} onChange={handleInputChange} required />

              <label>Precio</label>
              <input type="number" name="price" value={room.price} onChange={handleInputChange} required />

              <label>Piso</label>
              <input name="floor" value={room.floor} onChange={handleInputChange} />

              <label>Capacidad</label>
              <input type="number" name="capacity" value={room.capacity} onChange={handleInputChange} />

              <label>Servicios</label>
              <input
                name="amenities"
                value={room.amenities.join(', ')}
                onChange={(e) => setRoom({ ...room, amenities: e.target.value.split(',').map(a => a.trim()) })}
              />

              <button type="submit" className="btn-naranja">
                {isEditing ? 'Actualizar' : 'Crear'}
              </button>
            </form>
          </div>

         {/* Lista */}
<div>
  <h2>Lista de Habitaciones</h2>
  <div style={styles.tableContainer}>
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Número</th>
          <th style={styles.th}>Tipo</th>
          <th style={styles.th}>Precio</th>
          <th style={styles.th}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {rooms
          .slice()
          .sort((a, b) => Number(a.number) - Number(b.number))
          .map((room) => (
            <tr key={room._id} style={styles.tr}>
              <td style={styles.td}>{room.number}</td>
              <td style={styles.td}>{room.type}</td>
              <td style={styles.td}>${room.price}</td>
              <td style={styles.td}>
                <button style={styles.btnAmarillo} onClick={() => handleEdit(room)}>Editar</button>
                <button style={styles.btnRojo} onClick={() => handleDelete(room._id)}>Eliminar</button>
              </td>
            </tr>
        ))}
      </tbody>
    </table>
  </div>
  </div>
</div>

      </main>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#000',
    color: '#fff',
    padding: '32px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  sidebarTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '32px',
    color: '#FF6600',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '10px 14px',
    borderRadius: '8px',
    backgroundColor: '#1a1a1a',
    transition: 'all 0.3s ease',
  },
  main: {
    flex: 1,
    padding: '32px',
    marginLeft: '240px',
  },
  tableContainer: {
    overflowX: 'auto',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    marginTop: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '16px',
    color: '#1a1a1a',
  },
  th: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '14px',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '2px solid #FF6600',
  },
  tr: {
    borderBottom: '1px solid #ccc',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    backgroundColor: '#f9f9f9',
  },
  btnAmarillo: {
    backgroundColor: '#FFB100',
    color: '#000',
    padding: '6px 12px',
    marginRight: '8px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  btnRojo: {
    backgroundColor: '#cc0000',
    color: '#fff',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },

};

export default ManageRooms;
