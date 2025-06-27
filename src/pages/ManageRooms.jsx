import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import styles from '../assets/ManageRooms.module.css';
import { toast } from 'react-toastify';
import ModalConfirm from '../components/ModalConfirm';

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
  const [modal, setModal] = useState({ open: false, title: '', message: '', onConfirm: null });
  const [editRowId, setEditRowId] = useState(null);
  const [editField, setEditField] = useState({});

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
    // Convierte amenities a array si es string
    const roomData = {
      ...room,
      amenities: typeof room.amenities === 'string'
        ? room.amenities.split(',').map(a => a.trim()).filter(Boolean)
        : room.amenities
    };
    const url = isEditing ? `/rooms/${room._id}` : '/rooms';
    const method = isEditing ? axiosInstance.put : axiosInstance.post;

    method(url, roomData)
      .then(() => {
        toast.success(isEditing ? 'Habitación actualizada' : 'Habitación creada');
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
      .catch((err) => {
        toast.error('Error al guardar la habitación');
        console.error(err);
      });
  };

  const handleDelete = (id) => {
    setModal({
      open: true,
      title: 'Eliminar habitación',
      message: '¿Estás seguro de eliminar esta habitación? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        setModal(m => ({ ...m, open: false }));
        try {
          await axiosInstance.delete(`/rooms/${id}`);
          setRooms(rooms.filter(room => room._id !== id));
          toast.success('Habitación eliminada');
        } catch (err) {
          toast.error('Error al eliminar la habitación');
          console.error(err);
        }
      }
    });
  };

  const handleEdit = (roomToEdit) => {
    setRoom({
      ...roomToEdit,
      amenities: roomToEdit.amenities || [],
    });
    setIsEditing(true);
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Gestión de Habitaciones</h1>
        </header>
        <div className={styles.content}>
          {/* Formulario */}
          <form onSubmit={handleSubmit} className={`card ${styles.form}`}>
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
          <div className={`card ${styles.table}`}>
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
                    <td>
                      {editRowId === r._id ? (
                        <input
                          value={editField.price || r.price}
                          onChange={e => setEditField(f => ({ ...f, price: e.target.value }))}
                          onBlur={async () => {
                            await axiosInstance.put(`/rooms/${r._id}`, { ...r, price: editField.price });
                            setEditRowId(null);
                            fetchRooms();
                          }}
                          autoFocus
                        />
                      ) : (
                        <span onClick={() => { setEditRowId(r._id); setEditField({ price: r.price }); }}>{r.price}</span>
                      )}
                    </td>
                    <td><span className={`status-tag status-${r.status}`}>{r.status}</span></td>
                    <td>{r.floor}</td>
                    <td>{r.capacity ? r.capacity : '-'}</td>
                    <td>
                      <button className="btn btn-amarillo" onClick={() => handleEdit(r)} title="Editar habitación">Editar</button>
                      <button className="btn btn-rojo" onClick={() => handleDelete(r._id)} title="Eliminar habitación">Eliminar</button>
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

export default ManageRooms;
