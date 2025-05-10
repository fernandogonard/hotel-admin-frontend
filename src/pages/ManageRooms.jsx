import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Link } from 'react-router-dom';

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
    <div className="rooms-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Admin Hotel</h2>
        <nav>
          <Link to="/admin-dashboard">Dashboard</Link>
          <Link to="/manage-rooms">Habitaciones</Link>
          <Link to="/manage-reservations">Reservas</Link>
          <Link to="/manage-guests">Clientes</Link>
          <Link to="/reports">Informes</Link>
        </nav>
      </aside>
      {/* Main */}
      <main style={{ flex: 1, padding: '32px', marginLeft: '240px' }}>
        <h1>Gestión de Habitaciones</h1>
        {message && <div className="status-tag status-reservado">{message}</div>}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="card" style={{ minWidth: 300, maxWidth: 350 }}>
            <h2>{isEditing ? 'Editar' : 'Nueva'} Habitación</h2>
            <label htmlFor="number">Número</label>
            <input name="number" placeholder="Número" value={room.number} onChange={handleInputChange} required />
            <label htmlFor="type">Tipo</label>
            <input name="type" placeholder="Tipo" value={room.type} onChange={handleInputChange} required />
            <label htmlFor="description">Descripción</label>
            <textarea name="description" placeholder="Descripción" value={room.description} onChange={handleInputChange} />
            <label htmlFor="price">Precio</label>
            <input name="price" placeholder="Precio" value={room.price} onChange={handleInputChange} required />
            <label htmlFor="status">Estado</label>
            <select name="status" value={room.status} onChange={handleInputChange}>
              <option value="disponible">Disponible</option>
              <option value="ocupada">Ocupada</option>
              <option value="limpieza">Limpieza</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
            <label htmlFor="floor">Piso</label>
            <input name="floor" placeholder="Piso" value={room.floor} onChange={handleInputChange} />
            <label htmlFor="capacity">Capacidad</label>
            <input name="capacity" placeholder="Capacidad" value={room.capacity} onChange={handleInputChange} />
            <label htmlFor="amenities">Comodidades (separadas por coma)</label>
            <input name="amenities" placeholder="Comodidades" value={room.amenities} onChange={handleInputChange} />
            <button type="submit" className="btn" style={{ marginTop: 12 }}>{isEditing ? 'Actualizar' : 'Crear'}</button>
            {isEditing && <button type="button" className="btn btn-rojo" style={{ marginTop: 8 }} onClick={() => { setIsEditing(false); setRoom({ number: '', type: '', description: '', price: '', status: 'disponible', floor: '', capacity: '', amenities: [], images: [] }); }}>Cancelar</button>}
          </form>
          {/* Tabla de habitaciones */}
          <div className="card" style={{ flex: 1, minWidth: 320 }}>
            <h2>Lista de Habitaciones</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Piso</th>
                  <th>Capacidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r._id}>
                    <td>{r.number}</td>
                    <td>{r.type}</td>
                    <td>{r.description}</td>
                    <td>{r.price}</td>
                    <td><span className={`status-tag status-${r.status}`}>{r.status}</span></td>
                    <td>{r.floor}</td>
                    <td>{r.capacity ? r.capacity : '-'}</td>
                    <td>
                      <button className="btn btn-amarillo" onClick={() => handleEdit(r)}>Editar</button>
                      <button className="btn btn-rojo" onClick={() => handleDelete(r._id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ManageRooms;
