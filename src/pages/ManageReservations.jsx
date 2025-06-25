import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Sidebar from '../components/Sidebar';
import ModalConfirm from '../components/ModalConfirm';
import { Link } from 'react-router-dom';
import styles from '../assets/ManageReservations.module.css';
import { toast } from 'react-toastify';

function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [reservation, setReservation] = useState(initialReservationState());
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);
  const [filter, setFilter] = useState({ estado: '', search: '' });
  const [modal, setModal] = useState({ open: false, title: '', message: '', onConfirm: null });
  const [activeRoom, setActiveRoom] = useState('');

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

  // Nueva función para buscar reservas activas por habitación
  const fetchActiveByRoom = async (roomNumber) => {
    if (!roomNumber) return;
    try {
      const res = await axiosInstance.get(`/reservations/active-by-room/${roomNumber}`);
      setReservations(res.data);
      setFilter({ estado: '', search: '' });
    } catch (error) {
      console.error("Error al buscar reservas activas:", error);
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

  const estados = ['reservado', 'ocupado', 'completado', 'cancelado'];

  const filteredReservations = reservations.filter(r => {
    const coincideEstado = !filter.estado || r.status === filter.estado;
    const coincideSearch = !filter.search ||
      r.firstName.toLowerCase().includes(filter.search.toLowerCase()) ||
      r.lastName.toLowerCase().includes(filter.search.toLowerCase()) ||
      String(r.roomNumber).includes(filter.search);
    return coincideEstado && coincideSearch;
  });

  const isOverlapping = (newStart, newEnd, existingStart, existingEnd) => {
    return new Date(newStart) <= new Date(existingEnd) &&
           new Date(newEnd) >= new Date(existingStart);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de fechas
    if (new Date(reservation.checkIn) >= new Date(reservation.checkOut)) {
      toast.error("⚠️ La fecha de entrada debe ser anterior a la de salida.");
      return;
    }

    // Verificar conflictos de reserva (frontend, pero el backend también valida)
    const conflict = reservations.some((r) =>
      r.roomNumber === reservation.roomNumber &&
      (!isEditing || r._id !== reservation._id) &&
      isOverlapping(reservation.checkIn, reservation.checkOut, r.checkIn, r.checkOut)
    );

    if (conflict) {
      toast.error("⚠️ Ya existe una reserva para esta habitación en las fechas seleccionadas.");
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
      toast.success(isEditing ? 'Reserva actualizada' : 'Reserva creada');
    } catch (err) {
      // Mostrar mensaje de error del backend si es conflicto de fechas
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Error al guardar la reserva. Intenta nuevamente.');
      }
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
    setModal({
      open: true,
      title: 'Eliminar reserva',
      message: '¿Estás seguro de eliminar esta reserva? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        setModal(m => ({ ...m, open: false }));
        try {
          await axiosInstance.delete(`/reservations/${id}`);
          setReservations(reservations.filter(r => r._id !== id));
          toast.success('Reserva eliminada');
        } catch (err) {
          console.error('Error al eliminar:', err);
          toast.error('Error al eliminar la reserva.');
        }
      }
    });
  };

  const handleCheckIn = async (id) => {
    setModal({
      open: true,
      title: 'Confirmar check-in',
      message: '¿Deseas realizar el check-in de esta reserva? Esta acción cambiará el estado de la habitación.',
      onConfirm: async () => {
        setModal(m => ({ ...m, open: false }));
        try {
          await axiosInstance.post(`/reservations/${id}/checkin`);
          fetchReservations();
          toast.success('Check-in realizado correctamente.');
        } catch (err) {
          toast.error('Error al realizar check-in: ' + (err.response?.data?.message || err.message));
        }
      }
    });
  };

  const handleCheckOut = async (id) => {
    setModal({
      open: true,
      title: 'Confirmar check-out',
      message: '¿Deseas realizar el check-out de esta reserva? La habitación pasará a estado limpieza.',
      onConfirm: async () => {
        setModal(m => ({ ...m, open: false }));
        try {
          await axiosInstance.post(`/reservations/${id}/checkout`);
          fetchReservations();
          toast.success('Check-out realizado correctamente.');
        } catch (err) {
          toast.error('Error al realizar check-out: ' + (err.response?.data?.message || err.message));
        }
      }
    });
  };

  const handleSetAvailable = async (roomId) => {
    setModal({
      open: true,
      title: 'Marcar habitación disponible',
      message: '¿Marcar la habitación como disponible después de limpieza?',
      onConfirm: async () => {
        setModal(m => ({ ...m, open: false }));
        try {
          await axiosInstance.post(`/rooms/${roomId}/set-available`);
          fetchReservations();
          toast.success('Habitación marcada como disponible.');
        } catch (err) {
          toast.error('Error al marcar como disponible: ' + (err.response?.data?.message || err.message));
        }
      }
    });
  };

  // Nueva función para cancelar reserva usando endpoint dedicado
  const handleCancel = async (id) => {
    setModal({
      open: true,
      title: 'Cancelar reserva',
      message: '¿Estás seguro de cancelar esta reserva? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        setModal(m => ({ ...m, open: false }));
        try {
          await axiosInstance.put(`/reservations/${id}/cancel`);
          fetchReservations();
          toast.success('Reserva cancelada');
        } catch {
          toast.error('Error al cancelar la reserva.');
        }
      }
    });
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Gestión de Reservas</h1>
        </header>
        <div style={{ marginBottom: '1rem', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <label>
            Estado:&nbsp;
            <select value={filter.estado} onChange={e => setFilter(f => ({ ...f, estado: e.target.value }))}>
              <option value="">Todos</option>
              {estados.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
            </select>
          </label>
          <input
            type="text"
            placeholder="Buscar nombre o habitación..."
            value={filter.search}
            onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
            style={{ minWidth: 120 }}
          />
          <label>
            Ver activas por habitación:&nbsp;
            <input
              type="text"
              placeholder="Ej: 101"
              value={activeRoom}
              onChange={e => setActiveRoom(e.target.value)}
              style={{ width: 70 }}
            />
            <button
              className={styles.btn}
              type="button"
              style={{ marginLeft: 4, padding: '0.4em 1em' }}
              onClick={() => fetchActiveByRoom(activeRoom)}
              disabled={!activeRoom}
              title="Buscar reservas activas por habitación"
            >
              Buscar
            </button>
            <button
              className={styles.btn}
              type="button"
              style={{ marginLeft: 4, padding: '0.4em 1em', background: 'var(--text-light)' }}
              onClick={() => { setActiveRoom(''); fetchReservations(); }}
              disabled={!activeRoom}
              title="Limpiar filtro"
            >
              Limpiar
            </button>
          </label>
        </div>
        <div className={styles.content}>
          {/* Formulario */}
          <form onSubmit={handleSubmit} className={`card ${styles.form}`} ref={formRef}>
            <input className={styles.input} type="text" name="firstName" placeholder="Nombre" value={reservation.firstName} onChange={handleInputChange} required />
            <input className={styles.input} type="text" name="lastName" placeholder="Apellido" value={reservation.lastName} onChange={handleInputChange} required />
            <input className={styles.input} type="tel" name="phone" placeholder="Teléfono" value={reservation.phone} onChange={handleInputChange} required />
            <input className={styles.input} type="email" name="email" placeholder="Correo electrónico" value={reservation.email} onChange={handleInputChange} required />
            <input className={styles.input} type="date" name="checkIn" value={reservation.checkIn} onChange={handleInputChange} required />
            <input className={styles.input} type="date" name="checkOut" value={reservation.checkOut} onChange={handleInputChange} required />
            <input className={styles.input} type="text" name="roomNumber" placeholder="Habitación" value={reservation.roomNumber} onChange={handleInputChange} required />
            <input className={styles.input} type="number" name="guests" placeholder="Nº Huéspedes" value={reservation.guests} onChange={handleInputChange} required min={1} />
            <textarea className={styles.input} name="notes" placeholder="Notas" value={reservation.notes} onChange={handleInputChange}></textarea>
            <button className={styles.btn} type="submit">{isEditing ? 'Actualizar' : 'Crear'} Reserva</button>
          </form>
          {/* Tabla de reservas */}
          <div className={`card ${styles.table}`}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Habitación</th>
                  <th>Estado</th>
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
                    <td><span className={`status-tag status-${res.status}`}>{res.status}</span></td>
                    <td>
                      <button
                        className={`${styles.btn} ${styles.btnAmarillo}`}
                        onClick={() => handleEdit(res)}
                        title="Editar reserva"
                      >
                        Editar
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnRojo}`}
                        onClick={() => handleDelete(res._id)}
                        title="Eliminar reserva"
                      >
                        Eliminar
                      </button>
                      {/* Botón cancelar solo si no está cancelada */}
                      {res.status !== 'cancelado' && (
                        <button
                          className={`${styles.btn} ${styles.btnGris}`}
                          onClick={() => handleCancel(res._id)}
                          title="Cancelar reserva"
                        >
                          Cancelar
                        </button>
                      )}
                      {res.status === 'reservado' && (
                        <button
                          className={`${styles.btn} ${styles.btnAzul}`}
                          onClick={() => handleCheckIn(res._id)}
                          title="Realizar check-in"
                        >
                          Check-in
                        </button>
                      )}
                      {res.status === 'ocupado' && (
                        <button
                          className={`${styles.btn} ${styles.btnAzul}`}
                          onClick={() => handleCheckOut(res._id)}
                          title="Realizar check-out"
                        >
                          Check-out
                        </button>
                      )}
                      {res.status === 'completado' && (
                        <button
                          className={`${styles.btn} ${styles.btnVerde}`}
                          onClick={() => handleSetAvailable(res.roomId)}
                          title="Marcar habitación como disponible"
                        >
                          Marcar como disponible
                        </button>
                      )}
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

// FIXME: Reemplaza los colores hardcodeados por variables CSS de la nueva paleta en todos los estilos en línea y clases.
// Ejemplo: background: 'var(--primary)' en vez de background: '#458cf4'

export default ManageReservations;