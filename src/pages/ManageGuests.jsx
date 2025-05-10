import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Link } from 'react-router-dom';

function ManageGuests() {
  const [guests, setGuests] = useState([]);
  const [guest, setGuest] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
    preferences: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const res = await axiosInstance.get('/guests');
      setGuests(res.data);
    } catch (err) {
      setMessage('Error al cargar huéspedes');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuest({ ...guest, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axiosInstance.put(`/guests/${guest._id}`, guest);
        setMessage('Huésped actualizado');
      } else {
        await axiosInstance.post('/guests', guest);
        setMessage('Huésped creado');
      }
      setGuest({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        notes: '',
        preferences: '',
      });
      setIsEditing(false);
      fetchGuests();
    } catch {
      alert('❌ Error al guardar la reserva. Intenta nuevamente.');
    }
  };

  const handleEdit = (g) => {
    setGuest(g);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar huésped?')) return;
    try {
      await axiosInstance.delete(`/guests/${id}`);
      setMessage('Huésped eliminado');
      fetchGuests();
    } catch {
      setMessage('Error al eliminar huésped');
    }
  };

  return (
    <div className="guests-page">
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
        <h1>Gestión de Huéspedes</h1>
        {message && <div className="status-tag status-reservado">{message}</div>}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="card" style={{ minWidth: 300, maxWidth: 350 }}>
            <h2>{isEditing ? 'Editar' : 'Nuevo'} Huésped</h2>
            <label htmlFor="firstName">Nombre</label>
            <input name="firstName" placeholder="Nombre" value={guest.firstName} onChange={handleInputChange} required />
            <label htmlFor="lastName">Apellido</label>
            <input name="lastName" placeholder="Apellido" value={guest.lastName} onChange={handleInputChange} required />
            <label htmlFor="email">Email</label>
            <input name="email" placeholder="Email" value={guest.email} onChange={handleInputChange} required />
            <label htmlFor="phone">Teléfono</label>
            <input name="phone" placeholder="Teléfono" value={guest.phone} onChange={handleInputChange} />
            <label htmlFor="notes">Notas</label>
            <textarea name="notes" placeholder="Notas" value={guest.notes} onChange={handleInputChange} />
            <label htmlFor="preferences">Preferencias</label>
            <input name="preferences" placeholder="Preferencias" value={guest.preferences} onChange={handleInputChange} />
            <button type="submit" className="btn" style={{ marginTop: 12 }}>{isEditing ? 'Actualizar' : 'Crear'}</button>
            {isEditing && <button type="button" className="btn btn-rojo" style={{ marginTop: 8 }} onClick={() => { setIsEditing(false); setGuest({ firstName: '', lastName: '', email: '', phone: '', notes: '', preferences: '' }); }}>Cancelar</button>}
          </form>
          {/* Tabla de huéspedes */}
          <div className="card" style={{ flex: 1, minWidth: 320 }}>
            <h2>Lista de Huéspedes</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((g) => (
                  <tr key={g._id}>
                    <td>{g.firstName}</td>
                    <td>{g.lastName}</td>
                    <td>{g.email}</td>
                    <td>{g.phone}</td>
                    <td>
                      <button className="btn btn-amarillo" onClick={() => handleEdit(g)}>Editar</button>
                      <button className="btn btn-rojo" onClick={() => handleDelete(g._id)}>Eliminar</button>
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

export default ManageGuests;
