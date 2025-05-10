import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Link } from 'react-router-dom';

function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [reservation, setReservation] = useState(initialReservationState());
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({ name: '', date: '' });
  const formRef = useRef(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await axiosInstance.get('/reservations');
      setReservations(res.data);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
    }
  };

  function initialReservationState() {
    return {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      checkIn: '',
      checkOut: '',
      roomNumber: '',
      guests: 1,
      notes: '',
    };
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservation({
      ...reservation,
      [name]: name === "guests" ? Number(value) : value
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredReservations = reservations.filter((r) => {
    const fullName = `${r.firstName} ${r.lastName}`.toLowerCase();
    const dateMatch =
      filters.date === '' ||
      r.checkIn.includes(filters.date) || r.checkOut.includes(filters.date);
    return fullName.includes(filters.name.toLowerCase()) && dateMatch;
  });

  const isOverlapping = (newStart, newEnd, existingStart, existingEnd) => {
    return new Date(newStart) <= new Date(existingEnd) &&
           new Date(newEnd) >= new Date(existingStart);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de fechas
    if (new Date(reservation.checkIn) >= new Date(reservation.checkOut)) {
      alert("⚠️ La fecha de entrada debe ser anterior a la de salida.");
      return;
    }

    // Verificar conflictos de reserva
    const conflict = reservations.some((r) =>
      r.roomNumber === reservation.roomNumber &&
      (!isEditing || r._id !== reservation._id) &&
      isOverlapping(reservation.checkIn, reservation.checkOut, r.checkIn, r.checkOut)
    );

    if (conflict) {
      alert("⚠️ Ya existe una reserva para esta habitación en las fechas seleccionadas.");
      return;
    }

    // Asegurar que guests sea número y todos los campos requeridos estén presentes
    const data = {
      ...reservation,
      guests: Number(reservation.guests) || 1,
      firstName: reservation.firstName || '',
      lastName: reservation.lastName || '',
      phone: reservation.phone || '',
      email: reservation.email || '',
      checkIn: reservation.checkIn || '',
      checkOut: reservation.checkOut || '',
      roomNumber: reservation.roomNumber || '',
    };

    try {
      const url = isEditing ? `/reservations/${reservation._id}` : '/reservations';
      const method = isEditing ? axiosInstance.put : axiosInstance.post;

      await method(url, data);
      fetchReservations();
      setReservation(initialReservationState());
      setIsEditing(false);
      alert('✅ Reserva guardada exitosamente.');
    } catch (err) {
      console.error('Error al guardar:', err);
      alert('❌ Error al guardar la reserva. Intenta nuevamente.');
    }
  };

  const handleEdit = (res) => {
    setReservation({
      firstName: res.firstName || '',
      lastName: res.lastName || '',
      phone: res.phone || '',
      email: res.email || '',
      checkIn: res.checkIn ? res.checkIn.slice(0, 10) : '',
      checkOut: res.checkOut ? res.checkOut.slice(0, 10) : '',
      roomNumber: res.roomNumber || '',
      guests: typeof res.guests === 'number' ? res.guests : Number(res.guests) || 1,
      notes: res.notes || '',
      _id: res._id
    });
    setIsEditing(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta reserva?")) return;

    try {
      await axiosInstance.delete(`/reservations/${id}`);
      fetchReservations();
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('❌ Error al eliminar la reserva.');
    }
  };

  const handleCheckIn = async (id) => {
    if (!window.confirm('¿Confirmar check-in de esta reserva?')) return;
    try {
      await axiosInstance.post(`/reservations/${id}/checkin`);
      fetchReservations();
      alert('✅ Check-in realizado correctamente.');
    } catch (err) {
      alert('❌ Error al realizar check-in: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCheckOut = async (id) => {
    if (!window.confirm('¿Confirmar check-out de esta reserva?')) return;
    try {
      await axiosInstance.post(`/reservations/${id}/checkout`);
      fetchReservations();
      alert('✅ Check-out realizado correctamente.');
    } catch (err) {
      alert('❌ Error al realizar check-out: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="rooms-page">
      <aside className="sidebar">
        <h2>Admin Hotel</h2>
        <nav>
          <Link to="/admin-dashboard" className="sidebar-link">Dashboard</Link>
          <Link to="/manage-rooms" className="sidebar-link">Habitaciones</Link>
          <Link to="/manage-reservations" className="sidebar-link">Reservas</Link>
          <Link to="/manage-guests" className="sidebar-link">Clientes</Link>
          <Link to="/reports" className="sidebar-link">Informes</Link>
        </nav>
      </aside>
      <main>
        <h1>Gestión de Reservas</h1>
        <form onSubmit={handleSubmit} className="card" ref={formRef} style={{ maxWidth: 600, margin: '0 auto' }}>
          <input className="input" type="text" name="firstName" placeholder="Nombre" value={reservation.firstName} onChange={handleInputChange} required />
          <input className="input" type="text" name="lastName" placeholder="Apellido" value={reservation.lastName} onChange={handleInputChange} required />
          <input className="input" type="tel" name="phone" placeholder="Teléfono" value={reservation.phone} onChange={handleInputChange} required />
          <input className="input" type="email" name="email" placeholder="Correo electrónico" value={reservation.email} onChange={handleInputChange} required />
          <input className="input" type="date" name="checkIn" value={reservation.checkIn} onChange={handleInputChange} required />
          <input className="input" type="date" name="checkOut" value={reservation.checkOut} onChange={handleInputChange} required />
          <input className="input" type="text" name="roomNumber" placeholder="Habitación" value={reservation.roomNumber} onChange={handleInputChange} required />
          <input className="input" type="number" name="guests" placeholder="Nº Huéspedes" value={reservation.guests} onChange={handleInputChange} required min={1} />
          <textarea className="input" name="notes" placeholder="Notas" value={reservation.notes} onChange={handleInputChange}></textarea>
          <button className="btn" type="submit" style={{ marginTop: 8 }}>{isEditing ? 'Actualizar' : 'Crear'} Reserva</button>
        </form>
        <div style={{ margin: '2rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input className="input" style={{ minWidth: 220 }} type="text" name="name" placeholder="Buscar por nombre o apellido" value={filters.name} onChange={handleFilterChange} />
          <input className="input" style={{ minWidth: 180 }} type="date" name="date" value={filters.date} onChange={handleFilterChange} />
        </div>
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Habitación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((res) => (
                <tr key={res._id}>
                  <td>{res.firstName} {res.lastName}</td>
                  <td>{res.phone}</td>
                  <td>{res.email}</td>
                  <td>{res.checkIn}</td>
                  <td>{res.checkOut}</td>
                  <td>{res.roomNumber}</td>
                  <td>
                    <button className="btn btn-amarillo" onClick={() => handleEdit(res)} style={{ marginRight: 6 }}>Editar</button>
                    <button className="btn btn-rojo" onClick={() => handleDelete(res._id)} style={{ marginRight: 6 }}>Eliminar</button>
                    {res.status === 'reservado' &&
                      new Date(res.checkIn).toISOString().slice(0, 10) <= new Date().toISOString().slice(0, 10) && (
                        <button className="btn btn-azul" onClick={() => handleCheckIn(res._id)} style={{ marginRight: 6 }}>Check-in</button>
                      )}
                    {res.status === 'ocupado' &&
                      new Date(res.checkOut).toISOString().slice(0, 10) <= new Date().toISOString().slice(0, 10) && (
                        <button className="btn btn-azul" onClick={() => handleCheckOut(res._id)}>Check-out</button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default ManageReservations;
