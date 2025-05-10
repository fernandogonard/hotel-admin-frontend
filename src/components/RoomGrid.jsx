// Componente que muestra la grilla diaria de ocupación de habitaciones de hotel
// 40 habitaciones - 4 pisos - Estado por colores
// Responsivo - Datos reales desde API - Selector de fecha

import React, { useState, useEffect } from 'react';
import styles from '../assets/RoomGrid.module.css';
import axiosInstance from '../utils/axiosInstance';

const estadosLabel = {
  disponible: 'Disponible',
  ocupada: 'Ocupada',
  limpieza: 'Limpieza',
  mantenimiento: 'Mantenimiento',
};

function agruparPorPiso(rooms) {
  return rooms.reduce((acc, room) => {
    acc[room.floor] = acc[room.floor] || [];
    acc[room.floor].push(room);
    return acc;
  }, {});
}

function getEstadoHabitacion(room, reservas, fecha) {
  // Si la habitación está en mantenimiento o limpieza, priorizar ese estado
  if (room.status === 'limpieza') return 'limpieza';
  if (room.status === 'mantenimiento') return 'mantenimiento';
  // Buscar si hay una reserva activa en la fecha seleccionada
  const ocupada = reservas.some(r =>
    String(r.roomNumber) === String(room.number) &&
    new Date(r.checkIn) <= new Date(fecha) &&
    new Date(r.checkOut) > new Date(fecha)
  );
  if (ocupada) return 'ocupada';
  return 'disponible';
}

export default function RoomGrid() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  });
  const [rooms, setRooms] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert('Error al cargar habitaciones o reservas');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const roomsPorPiso = agruparPorPiso(rooms);

  return (
    <div className={styles.gridContainer}>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Día:&nbsp;
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
        </label>
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