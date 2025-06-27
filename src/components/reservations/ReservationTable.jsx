// components/reservations/ReservationTable.jsx
import React from 'react';
import styles from '../../assets/ManageReservations.module.css';

const ReservationTable = ({ 
  filteredReservations, 
  handleEdit, 
  handleDelete, 
  handleCancel, 
  handleCheckIn, 
  handleCheckOut, 
  handleSetAvailable 
}) => {
  return (
    <div className={`card ${styles.table}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Habitación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map((res) => (
            <tr key={res._id}>
              <td>{res.firstName} {res.lastName}</td>
              <td>{res.phone}</td>
              <td>{res.email}</td>
              <td>{res.checkIn}</td>
              <td>{res.checkOut}</td>
              <td>{res.roomNumber}</td>
              <td>
                <span className={`status-tag status-${res.status}`}>
                  {res.status}
                </span>
              </td>
              <td>
                <button
                  className={`${styles.btn} ${styles.btnAmarillo}`}
                  onClick={() => handleEdit(res)}
                  title="Editar reserva"
                >
                  Editar
                </button>
                <button
                  className={`${styles.btn} ${styles.btnRojo}`}
                  onClick={() => handleDelete(res._id)}
                  title="Eliminar reserva"
                >
                  Eliminar
                </button>
                
                {/* Botón cancelar solo si no está cancelada */}
                {res.status !== 'cancelado' && (
                  <button
                    className={`${styles.btn} ${styles.btnGris}`}
                    onClick={() => handleCancel(res._id)}
                    title="Cancelar reserva"
                  >
                    Cancelar
                  </button>
                )}
                
                {/* Check-in para reservas confirmadas */}
                {res.status === 'reservado' && (
                  <button
                    className={`${styles.btn} ${styles.btnAzul}`}
                    onClick={() => handleCheckIn(res._id)}
                    title="Realizar check-in"
                  >
                    Check-in
                  </button>
                )}
                
                {/* Check-out para habitaciones ocupadas */}
                {res.status === 'ocupado' && (
                  <button
                    className={`${styles.btn} ${styles.btnAzul}`}
                    onClick={() => handleCheckOut(res._id)}
                    title="Realizar check-out"
                  >
                    Check-out
                  </button>
                )}
                
                {/* Marcar disponible después de completado */}
                {res.status === 'completado' && (
                  <button
                    className={`${styles.btn} ${styles.btnVerde}`}
                    onClick={() => handleSetAvailable(res.roomId)}
                    title="Marcar habitación como disponible"
                  >
                    Marcar como disponible
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationTable;
