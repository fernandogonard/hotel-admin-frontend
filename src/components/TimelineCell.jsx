import React, { useState } from 'react';
import styles from '../assets/RoomTimeline.module.css';

export default function TimelineCell({ estado, contenido, tooltip }) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div
      className={`${styles.dayCell} ${styles[estado]}`}
      tabIndex={0}
      role="gridcell"
      aria-label={tooltip}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      aria-describedby={showTooltip ? `tooltip-${tooltip.replace(/\s/g, '')}` : undefined}
      style={{ position: 'relative' }}
    >
      {contenido}
      {showTooltip && tooltip && (
        <div
          role="tooltip"
          id={`tooltip-${tooltip.replace(/\s/g, '')}`}
          className={styles.customTooltip}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
