// src/components/calendar/CalendarReservas.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const CalendarReservas = () => {
  const [calendarData, setCalendarData] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    loadCalendarData();
  }, [currentMonth]);

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      const monthStr = currentMonth.toISOString().substring(0, 7); // YYYY-MM
      
      const response = await axiosInstance.get(`/calendar?month=${monthStr}`);
      
      setCalendarData(response.data.data);
    } catch (err) {
      console.error('Error cargando datos del calendario:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getRoomStatusForDate = (roomNumber, date) => {
    if (!calendarData?.events) return 'disponible';
    
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const reservation = calendarData.events.find(event => {
      const checkIn = new Date(event.start);
      const checkOut = new Date(event.end);
      return event.extendedProps.roomNumber === roomNumber &&
             checkIn <= dayEnd && checkOut > dayStart;
    });

    if (reservation) {
      return reservation.extendedProps.status;
    }

    // Verificar estado base de la habitación
    const room = calendarData.rooms.find(r => r.id === roomNumber);
    return room?.status || 'disponible';
  };

  const getReservationForDate = (roomNumber, date) => {
    if (!calendarData?.events) return null;
    
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return calendarData.events.find(event => {
      const checkIn = new Date(event.start);
      const checkOut = new Date(event.end);
      return event.extendedProps.roomNumber === roomNumber &&
             checkIn <= dayEnd && checkOut > dayStart;
    });
  };

  const handleCellClick = (roomNumber, date) => {
    const reservation = getReservationForDate(roomNumber, date);
    const status = getRoomStatusForDate(roomNumber, date);
    
    setSelectedCell({ roomNumber, date, status, reservation });
    setModalData({ roomNumber, date, status, reservation });
    setShowModal(true);
  };

  const handleCellDoubleClick = (roomNumber, date) => {
    const status = getRoomStatusForDate(roomNumber, date);
    if (status === 'disponible') {
      // Crear nueva reserva
      setModalData({ 
        roomNumber, 
        date, 
        status, 
        reservation: null, 
        action: 'create' 
      });
      setShowModal(true);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'disponible': '#10b981',    // Verde
      'reservado': '#3b82f6',     // Azul
      'ocupado': '#ef4444',       // Rojo
      'limpieza': '#f59e0b',      // Amarillo
      'mantenimiento': '#8b5cf6', // Morado
      'fuera de servicio': '#6b7280' // Gris
    };
    return colors[status] || colors['disponible'];
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  if (loading) {
    return (
      <div className="calendar-loading">
        <div className="loading-spinner"></div>
        <p>Cargando calendario...</p>
      </div>
    );
  }

  if (!calendarData) {
    return (
      <div className="calendar-error">
        <p>Error al cargar el calendario</p>
        <button onClick={loadCalendarData} className="btn btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
  const monthYear = currentMonth.toLocaleDateString('es-ES', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="calendar-reservas">
      <div className="calendar-header">
        <h2>📅 Calendario de Reservas - {monthYear}</h2>
        <div className="calendar-controls">
          <button 
            onClick={() => navigateMonth(-1)} 
            className="btn btn-secondary"
          >
            ← Anterior
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date())} 
            className="btn btn-primary"
          >
            Hoy
          </button>
          <button 
            onClick={() => navigateMonth(1)} 
            className="btn btn-secondary"
          >
            Siguiente →
          </button>
        </div>
      </div>

      <div className="calendar-legend">
        <h4>Leyenda:</h4>
        <div className="legend-items">
          {[
            { status: 'disponible', label: 'Disponible' },
            { status: 'reservado', label: 'Reservado' },
            { status: 'ocupado', label: 'Ocupado' },
            { status: 'limpieza', label: 'Limpieza' },
            { status: 'mantenimiento', label: 'Mantenimiento' }
          ].map(item => (
            <div key={item.status} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: getStatusColor(item.status) }}
              ></div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="calendar-grid">
        <CalendarGrid 
          rooms={calendarData.rooms}
          daysInMonth={daysInMonth}
          firstDayOfMonth={firstDayOfMonth}
          currentMonth={currentMonth}
          getRoomStatusForDate={getRoomStatusForDate}
          getStatusColor={getStatusColor}
          onCellClick={handleCellClick}
          onCellDoubleClick={handleCellDoubleClick}
          getReservationForDate={getReservationForDate}
        />
      </div>

      {showModal && (
        <ReservationModal 
          data={modalData}
          onClose={() => setShowModal(false)}
          onUpdate={loadCalendarData}
        />
      )}
    </div>
  );
};

// Componente de la grilla del calendario
const CalendarGrid = ({ 
  rooms, 
  daysInMonth, 
  firstDayOfMonth, 
  currentMonth,
  getRoomStatusForDate,
  getStatusColor,
  onCellClick,
  onCellDoubleClick,
  getReservationForDate
}) => {
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  return (
    <div className="calendar-table">
      {/* Header con días de la semana */}
      <div className="calendar-header-row">
        <div className="room-header">Habitación</div>
        {dayNames.map(day => (
          <div key={day} className="day-header">{day}</div>
        ))}
      </div>

      {/* Fila de números de día */}
      <div className="calendar-days-row">
        <div className="room-header"></div>
        {Array.from({ length: 7 }, (_, index) => {
          const dayNumber = index - firstDayOfMonth + 1;
          return (
            <div key={index} className="day-number">
              {dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : ''}
            </div>
          );
        })}
      </div>

      {/* Filas de habitaciones */}
      {rooms.map(room => (
        <div key={room.id} className="calendar-room-row">
          <div className="room-info">
            <div className="room-number">#{room.id}</div>
            <div className="room-type">{room.title}</div>
            <div className="room-price">${room.price}/noche</div>
          </div>
          
          {/* Celdas para cada día de la semana */}
          {Array.from({ length: 7 }, (_, dayIndex) => {
            const dayNumber = dayIndex - firstDayOfMonth + 1;
            
            if (dayNumber > 0 && dayNumber <= daysInMonth) {
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNumber);
              const status = getRoomStatusForDate(room.id, date);
              const reservation = getReservationForDate(room.id, date);
              
              return (
                <CalendarCell
                  key={dayIndex}
                  date={date}
                  roomNumber={room.id}
                  status={status}
                  reservation={reservation}
                  color={getStatusColor(status)}
                  onClick={() => onCellClick(room.id, date)}
                  onDoubleClick={() => onCellDoubleClick(room.id, date)}
                />
              );
            }
            
            return <div key={dayIndex} className="calendar-cell empty"></div>;
          })}
        </div>
      ))}
    </div>
  );
};

// Componente de celda individual
const CalendarCell = ({ 
  date, 
  roomNumber, 
  status, 
  reservation, 
  color, 
  onClick, 
  onDoubleClick 
}) => {
  const isToday = date.toDateString() === new Date().toDateString();
  
  return (
    <div 
      className={`calendar-cell ${status} ${isToday ? 'today' : ''}`}
      style={{ backgroundColor: color + '20', borderColor: color }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      title={reservation ? `${reservation.title} - ${status}` : status}
    >
      {reservation && (
        <div className="reservation-info">
          <div className="guest-name">{reservation.title}</div>
          <div className="reservation-time">
            {new Date(reservation.start).toLocaleDateString() === date.toLocaleDateString() && '📥'}
            {new Date(reservation.end).toLocaleDateString() === date.toLocaleDateString() && '📤'}
          </div>
        </div>
      )}
      {!reservation && status !== 'disponible' && (
        <div className="status-indicator">{getStatusEmoji(status)}</div>
      )}
    </div>
  );
};

// Modal para ver/editar reservas
const ReservationModal = ({ data, onClose, onUpdate }) => {
  if (!data) return null;

  const { roomNumber, date, status, reservation, action } = data;

  const handleAction = async (actionType) => {
    // Aquí implementarías las acciones (crear, editar, eliminar)
    console.log(`Acción: ${actionType}`, data);
    onClose();
    if (onUpdate) onUpdate();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            Habitación {roomNumber} - {date.toLocaleDateString()}
          </h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="modal-body">
          {reservation ? (
            <div className="reservation-details">
              <h4>📅 Reserva Existente</h4>
              <p><strong>Huésped:</strong> {reservation.title}</p>
              <p><strong>Check-in:</strong> {new Date(reservation.start).toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> {new Date(reservation.end).toLocaleDateString()}</p>
              <p><strong>Estado:</strong> <span className={`status ${reservation.extendedProps.status}`}>
                {reservation.extendedProps.status}
              </span></p>
              {reservation.extendedProps.email && (
                <p><strong>Email:</strong> {reservation.extendedProps.email}</p>
              )}
              {reservation.extendedProps.phone && (
                <p><strong>Teléfono:</strong> {reservation.extendedProps.phone}</p>
              )}
            </div>
          ) : (
            <div className="room-status">
              <h4>🏨 Estado de la Habitación</h4>
              <p><strong>Estado actual:</strong> <span className={`status ${status}`}>
                {status}
              </span></p>
              {status === 'disponible' && (
                <p>💡 <em>Doble clic para crear una nueva reserva</em></p>
              )}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          {reservation ? (
            <>
              <button 
                onClick={() => handleAction('view')} 
                className="btn btn-secondary"
              >
                <FaEye /> Ver Detalles
              </button>
              <button 
                onClick={() => handleAction('edit')} 
                className="btn btn-primary"
              >
                <FaEdit /> Editar
              </button>
              <button 
                onClick={() => handleAction('delete')} 
                className="btn btn-danger"
              >
                <FaTrash /> Cancelar
              </button>
            </>
          ) : status === 'disponible' ? (
            <button 
              onClick={() => handleAction('create')} 
              className="btn btn-primary"
            >
              <FaPlus /> Nueva Reserva
            </button>
          ) : (
            <button 
              onClick={() => handleAction('changeStatus')} 
              className="btn btn-secondary"
            >
              Cambiar Estado
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Función auxiliar para emojis de estado
const getStatusEmoji = (status) => {
  const emojis = {
    'limpieza': '🧹',
    'mantenimiento': '🔧',
    'fuera de servicio': '🚫'
  };
  return emojis[status] || '';
};

export default CalendarReservas;
