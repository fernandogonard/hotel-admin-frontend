import React, { Suspense, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ModalConfirm from '../components/ModalConfirm';
import styles from '../assets/ManageReservations.module.css';

// Lazy loading de componentes
const ReservationForm = React.lazy(() => import('../components/reservations/ReservationForm'));
const ReservationTable = React.lazy(() => import('../components/reservations/ReservationTable'));
const ReservationFilters = React.lazy(() => import('../components/reservations/ReservationFilters'));

// Hook personalizado
import { useReservations } from '../hooks/useReservations';

function ManageReservations() {
  const {
    reservation,
    isEditing,
    filter,
    modal,
    activeRoom,
    formRef,
    filteredReservations,
    estados,
    setFilter,
    setModal,
    setActiveRoom,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancel,
    handleCheckIn,
    handleCheckOut,
    handleSetAvailable,
    fetchReservations,
    fetchActiveByRoom,
  } = useReservations();

  const [page, setPage] = useState(1);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Gestión de Reservas</h1>
        </header>
        
        <Suspense fallback={<div>Cargando filtros...</div>}>
          <ReservationFilters
            filter={filter}
            setFilter={setFilter}
            activeRoom={activeRoom}
            setActiveRoom={setActiveRoom}
            fetchActiveByRoom={fetchActiveByRoom}
            fetchReservations={fetchReservations}
            estados={estados}
          />
        </Suspense>
        
        <div className={styles.content}>
          {/* Formulario de reserva */}
          <Suspense fallback={<div>Cargando formulario...</div>}>
            <ReservationForm
              reservation={reservation}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isEditing={isEditing}
              formRef={formRef}
            />
          </Suspense>
          
          {/* Tabla de reservas */}
          <Suspense fallback={<div>Cargando tabla...</div>}>
            <ReservationTable
              filteredReservations={filteredReservations}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleCancel={handleCancel}
              handleCheckIn={handleCheckIn}
              handleCheckOut={handleCheckOut}
              handleSetAvailable={handleSetAvailable}
            />
          </Suspense>
        </div>
        
        <div>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Anterior</button>
          <span>Página {page}</span>
          <button onClick={() => setPage(p => p + 1)}>Siguiente</button>
        </div>
        
        <ModalConfirm
          isOpen={modal.open}
          title={modal.title}
          message={modal.message}
          onConfirm={modal.onConfirm}
          onCancel={() => setModal(m => ({ ...m, open: false }))}
        />
        
        <footer className={styles.footer}>
          <span>© {new Date().getFullYear()} Hotel Admin. Todos los derechos reservados.</span>
        </footer>
      </main>
    </div>
  );
}

// FIXME: Reemplaza los colores hardcodeados por variables CSS de la nueva paleta en todos los estilos en línea y clases.
// Ejemplo: background: 'var(--primary)' en vez de background: '#458cf4'

export default ManageReservations;