import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './reservations.css';

function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [reservation, setReservation] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    checkIn: '',
    checkOut: '',
    roomNumber: '',
    guests: '',
    notes: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    date: '',
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5173/api/reservations', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setReservations(res.data))
      .catch(err => console.error('Error al cargar reservas:', err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservation({ ...reservation, [name]: value });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const url = isEditing
      ? `http://localhost:5173/api/reservations/${reservation._id}`
      : 'http://localhost:5173/api/reservations';
    const method = isEditing ? axios.put : axios.post;

    method(url, reservation, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        fetchReservations();
        setReservation({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          checkIn: '',
          checkOut: '',
          roomNumber: '',
          guests: '',
          notes: '',
        });
        setIsEditing(false);
      })
      .catch(err => console.error('Error al guardar:', err));
  };

  const handleEdit = (res) => {
    setReservation(res);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:5173/api/reservations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => fetchReservations())
      .catch(err => console.error('Error al eliminar:', err));
  };

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
    title: {
      fontSize: '32px',
      color: '#FF6600',
      marginBottom: '8px',
    },
    subtitle: {
      color: '#666',
      fontSize: '16px',
      marginBottom: '32px',
    },
    reservationForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    input: {
      padding: '10px',
      fontSize: '16px',
      border: '1px solid #ddd',
      borderRadius: '8px',
    },
    filters: {
      marginTop: '20px',
      display: 'flex',
      gap: '16px',
    },
    table: {
      width: '100%',
      marginTop: '32px',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      backgroundColor: '#000',
      color: '#fff',
      padding: '10px',
    },
    tableRow: {
      borderBottom: '1px solid #ddd',
    },
    tableCell: {
      padding: '10px',
    },
    actionsButton: {
      backgroundColor: '#FF6600',
      color: '#fff',
      padding: '6px 12px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      marginRight: '8px',
    },
    btnDelete: {
      backgroundColor: '#ff4c4c',
    },
  };

  return (
    <div style={styles.container}>
      {/* ASIDE */}
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Admin Hotel</h2>
        <nav style={styles.nav}>
          <Link to="/admin-dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/manage-rooms" style={styles.link}>Habitaciones</Link>
          <Link to="/manage-reservations" style={styles.link}>Reservas</Link>
          <Link to="/reports" style={styles.link}>Informes</Link>
        </nav>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>
        <h1 style={styles.title}>Gestión de Reservas</h1>
        <form onSubmit={handleSubmit} style={styles.reservationForm}>
          <input style={styles.input} type="text" name="firstName" placeholder="Nombre" value={reservation.firstName} onChange={handleInputChange} required />
          <input style={styles.input} type="text" name="lastName" placeholder="Apellido" value={reservation.lastName} onChange={handleInputChange} required />
          <input style={styles.input} type="tel" name="phone" placeholder="Teléfono" value={reservation.phone} onChange={handleInputChange} />
          <input style={styles.input} type="email" name="email" placeholder="Correo electrónico" value={reservation.email} onChange={handleInputChange} />
          <input style={styles.input} type="date" name="checkIn" value={reservation.checkIn} onChange={handleInputChange} required />
          <input style={styles.input} type="date" name="checkOut" value={reservation.checkOut} onChange={handleInputChange} required />
          <input style={styles.input} type="text" name="roomNumber" placeholder="Habitación" value={reservation.roomNumber} onChange={handleInputChange} />
          <input style={styles.input} type="number" name="guests" placeholder="Nº Huéspedes" value={reservation.guests} onChange={handleInputChange} />
          <textarea style={styles.input} name="notes" placeholder="Notas" value={reservation.notes} onChange={handleInputChange}></textarea>
          <button style={styles.actionsButton} type="submit">{isEditing ? 'Actualizar' : 'Crear'} Reserva</button>
        </form>

        <div style={styles.filters}>
          <input style={styles.input} type="text" name="name" placeholder="Buscar por nombre o apellido" value={filters.name} onChange={handleFilterChange} />
          <input style={styles.input} type="date" name="date" value={filters.date} onChange={handleFilterChange} />
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Nombre</th>
              <th style={styles.tableHeader}>Teléfono</th>
              <th style={styles.tableHeader}>Email</th>
              <th style={styles.tableHeader}>Check-In</th>
              <th style={styles.tableHeader}>Check-Out</th>
              <th style={styles.tableHeader}>Habitación</th>
              <th style={styles.tableHeader}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((res) => (
              <tr key={res._id} style={styles.tableRow}>
                <td style={styles.tableCell}>{res.firstName} {res.lastName}</td>
                <td style={styles.tableCell}>{res.phone}</td>
                <td style={styles.tableCell}>{res.email}</td>
                <td style={styles.tableCell}>{res.checkIn}</td>
                <td style={styles.tableCell}>{res.checkOut}</td>
                <td style={styles.tableCell}>{res.roomNumber}</td>
                <td style={styles.tableCell}>
                  <button style={styles.actionsButton} onClick={() => handleEdit(res)}>Editar</button>
                  <button style={{ ...styles.actionsButton, ...styles.btnDelete }} onClick={() => handleDelete(res._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default ManageReservations;
