// Componente RoomTimeline: habitaciones vs días, vista tipo timeline
import React, { useState, useEffect, useMemo } from 'react';
import styles from '../assets/RoomTimeline.module.css';
import axiosInstance from '../utils/axiosInstance';

const estadosLabel = {
  disponible: 'Disponible',
  ocupada: 'Ocupada',
  limpieza: 'Limpieza',
  mantenimiento: 'Mantenimiento',
};

const VISTAS = {
  '7': 7,
  '15': 15,
  '30': 30,
};

function agruparPorHabitacion(rooms) {
  // Ordena por número ascendente, 400s (piso 4) al final
  return rooms.slice().sort((a, b) => {
    // Si ambos son del piso 4, ordena normalmente
    if (a.number >= 400 && b.number >= 400) return a.number - b.number;
    // Si solo a es del piso 4, va después
    if (a.number >= 400) return 1;
    // Si solo b es del piso 4, va después
    if (b.number >= 400) return -1;
    // Ambos no son del piso 4, ordena normalmente
    return a.number - b.number;
  });
}

function getEstadoHabitacionDia(room, reservas, fecha) {
  if (room.status === 'limpieza') return 'limpieza';
  if (room.status === 'mantenimiento') return 'mantenimiento';
  const ocupada = reservas.some(r =>
    String(r.roomNumber) === String(room.number) &&
    new Date(r.checkIn) <= new Date(fecha) &&
    new Date(r.checkOut) > new Date(fecha)
  );
  if (ocupada) return 'ocupada';
  return 'disponible';
}

function getTooltip(room, reservas, fecha) {
  const estado = getEstadoHabitacionDia(room, reservas, fecha);
  if (estado === 'ocupada') {
    const reserva = reservas.find(r =>
      String(r.roomNumber) === String(room.number) &&
      new Date(r.checkIn) <= new Date(fecha) &&
      new Date(r.checkOut) > new Date(fecha)
    );
    if (reserva) {
      return `Habitación ${room.number}\nOcupada\n${reserva.firstName || ''} ${reserva.lastName || ''}\n${reserva.checkIn?.slice(0,10)} a ${reserva.checkOut?.slice(0,10)}`;
    }
  }
  return `Habitación ${room.number}\n${estadosLabel[estado]}\n${fecha}`;
}

export default function RoomTimeline() {
  const [rooms, setRooms] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vistaDias, setVistaDias] = useState(7);
  const [fechaInicio, setFechaInicio] = useState(() => new Date());

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
        alert('Error cargando datos de habitaciones o reservas');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fechas = useMemo(() => {
    const listaFechas = [];
    const start = new Date(fechaInicio);
    for (let i = 0; i < vistaDias; i++) {
      const f = new Date(start);
      f.setDate(f.getDate() + i);
      listaFechas.push(f.toISOString().split('T')[0]);
    }
    return listaFechas;
  }, [fechaInicio, vistaDias]);

  // Actualiza la variable CSS --colCantidad según la cantidad de fechas
  useEffect(() => {
    document.documentElement.style.setProperty('--colCantidad', fechas.length);
  }, [fechas]);

  const roomsOrdenadas = useMemo(() => agruparPorHabitacion(rooms), [rooms]);

  const moverFecha = (dias) => {
    const nuevaFecha = new Date(fechaInicio);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    setFechaInicio(nuevaFecha);
  };

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.controls}>
        <button onClick={() => moverFecha(-vistaDias)}>⬅️</button>
        <select
          value={vistaDias}
          onChange={e => setVistaDias(Number(e.target.value))}
        >
          {Object.keys(VISTAS).map(v => (
            <option key={v} value={VISTAS[v]}>
              {v} noches
            </option>
          ))}
        </select>
        <button onClick={() => moverFecha(vistaDias)}>➡️</button>
      </div>

      {loading ? (
        <div className={styles.loading}>Cargando timeline...</div>
      ) : (
        <div className={styles.timelineGrid}>
          {/* Header de fechas */}
          <div className={styles.header}>
            <div className={styles.roomHeader}>Habitación</div>
            {fechas.map(fecha => {
              const dateObj = new Date(fecha);
              // Día de la semana abreviado (L, M, X, J, V, S, D) y día numérico
              const dia = dateObj.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
              // Normaliza: L, M, X, J, V, S, D
              const diaCorto = dia.charAt(0).toUpperCase();
              const diaNum = dateObj.getDate();
              // Si el locale da "mié" o "jue", usa la primera letra
              let letraDia = diaCorto;
              if (dia.startsWith('mié')) letraDia = 'X';
              if (dia.startsWith('jue')) letraDia = 'J';
              if (dia.startsWith('sáb')) letraDia = 'S';
              if (dia.startsWith('dom')) letraDia = 'D';
              if (dia.startsWith('lun')) letraDia = 'L';
              if (dia.startsWith('mar')) letraDia = 'M';
              if (dia.startsWith('vie')) letraDia = 'V';
              return (
                <div key={fecha} className={styles.dayHeader}>
                  <div>{letraDia}</div>
                  <div>{diaNum}</div>
                </div>
              );
            })}
          </div>

          {/* Filas de habitaciones */}
          {roomsOrdenadas.map(room => (
            <div key={room._id} className={styles.roomRow}>
              <div className={styles.roomCell}>{room.number}</div>
              {fechas.map(fecha => {
                const estado = getEstadoHabitacionDia(room, reservas, fecha);
                let contenido = '';
                let tooltip = getTooltip(room, reservas, fecha);

                if (estado === 'ocupada') {
                  const reserva = reservas.find(r =>
                    String(r.roomNumber) === String(room.number) &&
                    new Date(r.checkIn) <= new Date(fecha) &&
                    new Date(r.checkOut) > new Date(fecha)
                  );
                  if (reserva) {
                    contenido = `${reserva.firstName} ${reserva.lastName}`;
                  }
                } else if (estado === 'limpieza' || estado === 'mantenimiento') {
                  contenido = estadosLabel[estado];
                }

                return (
                  <div
                    key={`${room._id}-${fecha}`}
                    className={`${styles.dayCell} ${styles[estado]}`}
                    title={tooltip}
                  >
                    {contenido}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
