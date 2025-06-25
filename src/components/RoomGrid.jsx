// Componente que muestra la grilla diaria de ocupación de habitaciones de hotel
// 40 habitaciones - 4 pisos - Estado por colores
// Responsivo - Datos reales desde API - Selector de fecha

import React, { useState, useEffect } from 'react';
import styles from '../assets/RoomGrid.module.css';
import axiosInstance from '../utils/axiosInstance';

const estadosLabel = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  ocupado: 'Ocupado',
  limpieza: 'Limpieza',
  mantenimiento: 'Mantenimiento',
  'fuera de servicio': 'Fuera de servicio',
};

function agruparPorPiso(rooms) {
  return rooms.reduce((acc, room) => {
    acc[room.floor] = acc[room.floor] || [];
    acc[room.floor].push(room);
    return acc;
  }, {});
}

function getEstadoHabitacion(room, reservas, fecha) {
  if (room.status === 'limpieza') return 'limpieza';
  if (room.status === 'mantenimiento') return 'mantenimiento';
  if (room.status === 'fuera de servicio') return 'fuera de servicio';
  const reserva = reservas.find(r =>
    String(r.roomNumber) === String(room.number) &&
    new Date(r.checkIn) <= new Date(fecha) &&
    new Date(r.checkOut) > new Date(fecha)
  );
  if (reserva) {
    if (reserva.status === 'ocupado') return 'ocupado';
    if (reserva.status === 'reservado') return 'reservado';
  }
  return room.status || 'disponible';
}

export default function RoomGrid() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  });
  const [rooms, setRooms] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ estado: '', piso: '', tipo: '', search: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [roomsRes, reservasRes] = await Promise.all([
          axiosInstance.get('/rooms'),
          axiosInstance.get('/reservations'),
        ]);
        setRooms(roomsRes.data);
        setReservas(reservasRes.data);
      } catch (error) {
        console.error('Error al cargar habitaciones o reservas:', error);
        alert('No se pudieron cargar los datos. Por favor, intente nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const pisos = Array.from(new Set(rooms.map(r => r.floor))).sort();
  const tipos = Array.from(new Set(rooms.map(r => r.type))).sort();
  const estados = ['disponible', 'reservado', 'ocupado', 'limpieza', 'mantenimiento', 'fuera de servicio'];

  const roomsFiltradas = rooms.filter(room => {
    const estado = getEstadoHabitacion(room, reservas, selectedDate);
    const coincideEstado = !filter.estado || estado === filter.estado;
    const coincidePiso = !filter.piso || String(room.floor) === String(filter.piso);
    const coincideTipo = !filter.tipo || room.type === filter.tipo;
    const coincideSearch = !filter.search || String(room.number).includes(filter.search) || (room.type && room.type.toLowerCase().includes(filter.search.toLowerCase()));
    return coincideEstado && coincidePiso && coincideTipo && coincideSearch;
  });

  const roomsPorPiso = agruparPorPiso(roomsFiltradas);

  return (
    <div className={styles.gridContainer}>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <label>
          Día:&nbsp;
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
        </label>
        <label>
          Estado:&nbsp;
          <select value={filter.estado} onChange={e => setFilter(f => ({ ...f, estado: e.target.value }))}>
            <option value="">Todos</option>
            {estados.map(e => <option key={e} value={e}>{estadosLabel[e]}</option>)}
          </select>
        </label>
        <label>
          Piso:&nbsp;
          <select value={filter.piso} onChange={e => setFilter(f => ({ ...f, piso: e.target.value }))}>
            <option value="">Todos</option>
            {pisos.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <label>
          Tipo:&nbsp;
          <select value={filter.tipo} onChange={e => setFilter(f => ({ ...f, tipo: e.target.value }))}>
            <option value="">Todos</option>
            {tipos.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <input
          type="text"
          placeholder="Buscar número o tipo..."
          value={filter.search}
          onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
          style={{ minWidth: 120 }}
        />
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', margin: '2rem' }}>Cargando habitaciones...</div>
      ) : (
        Object.keys(roomsPorPiso).sort().map(piso => (
          <div key={piso} className={styles.pisoGroup}>
            <div className={styles.pisoTitle}>Piso {piso}</div>
            <div className={styles.roomsRow}>
              {roomsPorPiso[piso]
                .slice()
                .sort((a, b) => Number(a.number) - Number(b.number))
                .map(room => {
                  const estado = getEstadoHabitacion(room, reservas, selectedDate);
                  return (
                    <div
                      key={room._id}
                      className={`${styles.roomCell} ${styles[estado]}`}
                      title={`Habitación ${room.number} - ${estadosLabel[estado]}`}
                    >
                      <div className={styles.roomNumber}>{room.number}</div>
                      <div className={styles.roomStatus}>{estadosLabel[estado]}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}