import React from 'react';
import styles from '../assets/RoomTimeline.module.css';

function getMonthGroups(fechas) {
  const groups = [];
  let current = null;
  fechas.forEach((fecha, idx) => {
    const d = new Date(fecha);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!current || current.key !== key) {
      if (current) groups.push(current);
      current = {
        key,
        year: d.getFullYear(),
        month: d.toLocaleString('es-ES', { month: 'long' }).toUpperCase(),
        start: idx,
        count: 1
      };
    } else {
      current.count++;
    }
  });
  if (current) groups.push(current);
  return groups;
}

export default function TimelineHeader({ fechas }) {
  const monthGroups = getMonthGroups(fechas);
  return (
    <>
      {/* Barra de meses agrupando días */}
      <div className={styles.monthBar} style={{ display: 'grid', gridTemplateColumns: `70px repeat(${fechas.length}, 1fr)` }}>
        <div className={styles.roomHeader} />
        {monthGroups.map(g => (
          <div
            key={g.key}
            className={styles.monthLabel}
            style={{ gridColumn: `${g.start + 2} / span ${g.count}` }}
          >
            {g.month} {g.year}
          </div>
        ))}
      </div>
      {/* Header de días */}
      <div className={styles.timelineHeaderRow}>
        <div className={styles.roomHeader} role="columnheader">HABIT</div>
        {fechas.map(fecha => {
          const dateObj = new Date(fecha);
          const dia = dateObj.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
          let letraDia = dia.charAt(0).toUpperCase();
          if (dia.startsWith('mié')) letraDia = 'X';
          if (dia.startsWith('jue')) letraDia = 'J';
          if (dia.startsWith('sáb')) letraDia = 'S';
          if (dia.startsWith('dom')) letraDia = 'D';
          if (dia.startsWith('lun')) letraDia = 'L';
          if (dia.startsWith('mar')) letraDia = 'M';
          if (dia.startsWith('vie')) letraDia = 'V';
          return (
            <div key={fecha} className={styles.dayHeader} role="columnheader">
              <div>{letraDia}</div>
              <div>{dateObj.getDate()}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
