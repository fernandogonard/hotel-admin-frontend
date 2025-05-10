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
    } catch (err) {
      console.error('Error al guardar:', err);
      alert(err.response?.data?.message || '❌ Error al guardar la reserva. Intenta nuevamente.');
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
        <h1>Gestión de Huéspedes</h1>
        {message && <div style={styles.message}>{message}</div>}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Formulario */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <h2>{isEditing ? 'Editar' : 'Nuevo'} Huésped</h2>
            <input name="firstName" placeholder="Nombre" value={guest.firstName} onChange={handleInputChange} required style={styles.input} />
            <input name="lastName" placeholder="Apellido" value={guest.lastName} onChange={handleInputChange} required style={styles.input} />
            <input name="email" placeholder="Email" value={guest.email} onChange={handleInputChange} required style={styles.input} />
            <input name="phone" placeholder="Teléfono" value={guest.phone} onChange={handleInputChange} style={styles.input} />
            <input name="preferences" placeholder="Preferencias" value={guest.preferences} onChange={handleInputChange} style={styles.input} />
            <textarea name="notes" placeholder="Notas" value={guest.notes} onChange={handleInputChange} style={styles.input} />
            <button type="submit" style={styles.btnNaranja}>{isEditing ? 'Actualizar' : 'Crear'}</button>
            {isEditing && (
              <button type="button" style={styles.btnCancelar} onClick={() => { setIsEditing(false); setGuest({ firstName: '', lastName: '', email: '', phone: '', notes: '', preferences: '' }); }}>Cancelar</button>
            )}
          </form>
          {/* Tabla */}
          <div style={{ flex: 1 }}>
            <h2>Lista de Huéspedes</h2>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Preferencias</th>
                    <th>Notas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map(g => (
                    <tr key={g._id}>
                      <td>{g.firstName} {g.lastName}</td>
                      <td>{g.email}</td>
                      <td>{g.phone}</td>
                      <td>{g.preferences}</td>
                      <td>{g.notes}</td>
                      <td>
                        <button style={styles.btnAmarillo} onClick={() => handleEdit(g)}>Editar</button>
                        <button style={styles.btnRojo} onClick={() => handleDelete(g._id)}>Eliminar</button>
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
  form: {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    minWidth: '300px',
    maxWidth: '350px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '0.5rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginBottom: '8px',
    fontSize: '15px',
  },
  btnNaranja: {
    backgroundColor: '#f97316',
    color: '#fff',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '1rem',
    fontWeight: 'bold',
  },
  btnCancelar: {
    backgroundColor: '#9ca3af',
    color: '#fff',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '0.5rem',
    fontWeight: 'bold',
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
    fontSize: '15px',
    color: '#1a1a1a',
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
  message: {
    background: '#facc15',
    color: '#000',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
};

export default ManageGuests;
