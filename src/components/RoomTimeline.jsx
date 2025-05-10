// Componente RoomTimeline: habitaciones vs días, vista tipo timeline
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import styles from '../assets/RoomTimeline.module.css';
import axiosInstance from '../utils/axiosInstance';
import TimelineHeader from './TimelineHeader';
import TimelineRow from './TimelineRow';
import { useRooms } from './rooms/useRooms';

const VISTAS = { '7': 7, '15': 15, '30': 30 };

export default function RoomTimeline() {
  const { rooms, loading } = useRooms();
  const [reservas, setReservas] = useState([]);
  const [vistaDias, setVistaDias] = useState(7);
  const [fechaInicio, setFechaInicio] = useState(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return hoy;
  });
  const gridRef = useRef(null);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await axiosInstance.get('/reservations');
        setReservas(res.data);
      } catch (err) {
        // opcional: log
      }
    };
    fetchReservas();
  }, []);

  const fechas = useMemo(() => {
    const listaFechas = [];
    let actual = new Date(fechaInicio);
    for (let i = 0; i < vistaDias; i++) {
      listaFechas.push(actual.toISOString().split('T')[0]);
      actual.setDate(actual.getDate() + 1);
    }
    return listaFechas;
  }, [fechaInicio, vistaDias]);

  useEffect(() => {
    document.documentElement.style.setProperty('--colCantidad', fechas.length);
  }, [fechas]);

  // Sincronización de scroll para sticky robusto
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const handleScroll = () => {
      const header = grid.querySelector(`.${styles.timelineHeaderRow}`);
      if (header) header.scrollLeft = grid.scrollLeft;
    };
    grid.addEventListener('scroll', handleScroll);
    return () => grid.removeEventListener('scroll', handleScroll);
  }, [gridRef]);

  const moverFecha = useCallback((dias) => {
    setFechaInicio(prev => {
      const nuevaFecha = new Date(prev);
      nuevaFecha.setDate(nuevaFecha.getDate() + dias);
      return nuevaFecha;
    });
  }, []);

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.controls}>
        <button onClick={() => moverFecha(-vistaDias)} aria-label="Ver días anteriores">⬅️</button>
        <select
          value={vistaDias}
          onChange={e => setVistaDias(Number(e.target.value))}
          aria-label="Cantidad de días a mostrar"
        >
          {[7, 15, 30].map(v => (
            <option key={v} value={v}>{v} noches</option>
          ))}
        </select>
        <button onClick={() => moverFecha(vistaDias)} aria-label="Ver días siguientes">➡️</button>
      </div>
      {loading ? (
        <div className={styles.loading} role="status" aria-live="polite">Cargando timeline...</div>
      ) : (
        <div
          className={styles.timelineGrid}
          role="table"
          aria-label="Timeline de habitaciones"
          ref={gridRef}
          tabIndex={0}
        >
          <TimelineHeader fechas={fechas} />
          <List
            height={Math.min(rooms.length * 44, 440)}
            itemCount={rooms.length}
            itemSize={44}
            width={fechas.length * 90 + 80}
            style={{ overflowX: 'hidden' }}
          >
            {({ index, style }) => (
              <div style={style}>
                <TimelineRow
                  key={rooms[index]._id}
                  room={rooms[index]}
                  reservas={reservas}
                  fechas={fechas}
                />
              </div>
            )}
          </List>
        </div>
      )}
    </div>
  );
}
