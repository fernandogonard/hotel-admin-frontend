// components/reservations/ReservationFilters.jsx
import React from 'react';
import styles from '../../assets/ManageReservations.module.css';

const ReservationFilters = ({ 
  filter, 
  setFilter, 
  activeRoom, 
  setActiveRoom, 
  fetchActiveByRoom, 
  fetchReservations, 
  estados 
}) => {
  return (
    <form onSubmit={e => { e.preventDefault(); fetchReservations(); }} style={{ 
      marginBottom: '1rem', 
      display: 'flex', 
      gap: 16, 
      flexWrap: 'wrap', 
      alignItems: 'center' 
    }}>
      <label>
        Estado:&nbsp;
        <select 
          value={filter.estado} 
          onChange={e => setFilter(f => ({ ...f, estado: e.target.value }))}
        >
          <option value="">Todos</option>
          {estados.map(e => (
            <option key={e} value={e}>
              {e.charAt(0).toUpperCase() + e.slice(1)}
            </option>
          ))}
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
          style={{ 
            marginLeft: 4, 
            padding: '0.4em 1em', 
            background: 'var(--text-light)' 
          }}
          onClick={() => { 
            setActiveRoom(''); 
            fetchReservations(); 
          }}
          disabled={!activeRoom}
          title="Limpiar filtro"
        >
          Limpiar
        </button>
      </label>

      <input 
        type="date" 
        name="dateFrom" 
        value={filter.dateFrom || ''} 
        onChange={e => setFilter(f => ({ ...f, dateFrom: e.target.value }))} 
        placeholder="Fecha desde"
      />
      <input 
        type="date" 
        name="dateTo" 
        value={filter.dateTo || ''} 
        onChange={e => setFilter(f => ({ ...f, dateTo: e.target.value }))} 
        placeholder="Fecha hasta"
      />
      <button type="submit" className={styles.btn}>
        Filtrar
      </button>
    </form>
  );
};

export default ReservationFilters;
