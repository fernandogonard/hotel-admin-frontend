import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Sidebar from '../components/Sidebar';
import styles from '../assets/Reports.module.css';

const UserHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  useEffect(() => {
    const fetchUserReservations = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/reservations/my?page=${page}&limit=10`);
        setReservations(res.data.reservations);
        setPagination(res.data.pagination);
      } catch (err) {
        setError('Error al cargar el historial');
      } finally {
        setLoading(false);
      }
    };
    fetchUserReservations();
  }, [page]);

  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => (pagination.hasNext ? p + 1 : p));

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Mi Historial de Reservas</h1>
        </header>
        <section className={styles.content}>
          {loading ? (
            <p>Cargando...</p>
          ) : error ? (
            <p style={{color:'red'}}>{error}</p>
          ) : reservations.length === 0 ? (
            <p>No tienes reservas registradas.</p>
          ) : (
            <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Habitación</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Estado</th>
                  <th>Notas</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r._id}>
                    <td>{r.roomNumber}</td>
                    <td>{r.checkIn ? new Date(r.checkIn).toLocaleDateString() : ''}</td>
                    <td>{r.checkOut ? new Date(r.checkOut).toLocaleDateString() : ''}</td>
                    <td>{r.status || '-'}</td>
                    <td>{r.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{marginTop:16, display:'flex', gap:8, alignItems:'center'}}>
              <button onClick={handlePrev} disabled={page === 1}>Anterior</button>
              <span>Página {pagination.page} de {pagination.pages}</span>
              <button onClick={handleNext} disabled={!pagination.hasNext}>Siguiente</button>
            </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default UserHistory;
