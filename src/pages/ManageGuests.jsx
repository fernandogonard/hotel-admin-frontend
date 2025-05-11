import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ModalConfirm from '../components/ModalConfirm';
import styles from '../assets/ManageGuests.module.css';
import { toast } from 'react-toastify';

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
  const [modal, setModal] = useState({ open: false, title: '', message: '', onConfirm: null });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const res = await axiosInstance.get('/guests');
      setGuests(res.data);
    } catch {
      toast.error('Error al cargar huéspedes');
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
        toast.success('Huésped actualizado');
      } else {
        await axiosInstance.post('/guests', guest);
        toast.success('Huésped creado');
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
      toast.error('❌ Error al guardar el huésped. Intenta nuevamente.');
    }
  };

  const handleEdit = (g) => {
    setGuest(g);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    setModal({
      open: true,
      title: 'Eliminar huésped',
      message: '¿Estás seguro de eliminar este huésped? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        setModal(m => ({ ...m, open: false }));
        try {
          await axiosInstance.delete(`/guests/${id}`);
          setGuests(guests.filter(g => g._id !== id));
          toast.success('Huésped eliminado');
          fetchGuests();
        } catch {
          toast.error('❌ Error al eliminar el huésped.');
        }
      }
    });
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Gestión de Huéspedes</h1>
        </header>
        <div className={styles.content}>
          {/* Formulario */}
          <form onSubmit={handleSubmit} className={`card ${styles.form}`}>
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
          <div className={`card ${styles.table}`}>
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
                      <button className="btn btn-amarillo" onClick={() => handleEdit(g)} title="Editar huésped">Editar</button>
                      <button className="btn btn-rojo" onClick={() => handleDelete(g._id)} title="Eliminar huésped">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <ModalConfirm
          isOpen={modal.open}
          title={modal.title}
          message={modal.message}
          onConfirm={modal.onConfirm}
          onCancel={() => setModal(m => ({ ...m, open: false }))}
        />
        <footer className={styles.footer}>
          <span>© {new Date().getFullYear()} Hotel Admin. Todos los derechos reservados.</span>
        </footer>
      </main>
    </div>
  );
}

export default ManageGuests;
