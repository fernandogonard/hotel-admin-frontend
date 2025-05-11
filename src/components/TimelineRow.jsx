import React, { useMemo } from 'react';
import TimelineCell from './TimelineCell';
import styles from '../assets/RoomTimeline.module.css';

const estadosLabel = {
  disponible: 'Disponible',
  reservada: 'Reservada',
  ocupada: 'Ocupada',
  limpieza: 'Limpieza',
  mantenimiento: 'Mantenimiento',
  'fuera de servicio': 'Fuera de servicio',
};

function getEstadoHabitacionDia(room, reservas, fecha) {
  if (room.status === 'limpieza') return 'limpieza';
  if (room.status === 'mantenimiento') return 'mantenimiento';
  if (room.status === 'fuera de servicio') return 'fuera de servicio';
  const reserva = reservas.find(r =>
    String(r.roomNumber) === String(room.number) &&
    new Date(r.checkIn) <= new Date(fecha) &&
    new Date(r.checkOut) > new Date(fecha)
  );
  if (reserva) {
    if (reserva.status === 'ocupado') return 'ocupada';
    if (reserva.status === 'reservado') return 'reservada';
  }
  return room.status || 'disponible';
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

export default function TimelineRow({ room, reservas, fechas }) {
  const celdas = useMemo(() =>
    fechas.map(fecha => {
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
      } else if (estado === 'limpieza' || estado === 'mantenimiento' || estado === 'fuera de servicio') {
        contenido = estadosLabel[estado];
      }
      return (
        <TimelineCell
          key={`${room._id}-${fecha}`}
          estado={estado}
          contenido={contenido}
          tooltip={tooltip}
        />
      );
    }),
    [room, reservas, fechas]
  );

  return (
    <div className={styles.timelineRoomRow}>
      <div className={styles.roomCell} role="rowheader">{room.number}</div>
      {celdas}
    </div>
  );
}
