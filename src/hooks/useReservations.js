// hooks/useReservations.js
import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

export const useReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [reservation, setReservation] = useState(initialReservationState());
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState({ estado: '', search: '' });
  const [modal, setModal] = useState({ 
    open: false, 
    title: '', 
    message: '', 
    onConfirm: null 
  });
  const [activeRoom, setActiveRoom] = useState('');
  const formRef = useRef(null);

  function initialReservationState() {
    return {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      checkIn: '',
      checkOut: '',
      roomNumber: '',
      guests: 1,
      notes: '',
    };
  }

  const fetchReservations = async () => {
    try {
      const res = await axiosInstance.get('/reservations');
      setReservations(res.data);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      toast.error('Error al cargar las reservas');
    }
  };

  const fetchActiveByRoom = async (roomNumber) => {
    if (!roomNumber) return;
    try {
      const res = await axiosInstance.get(`/reservations/active-by-room/${roomNumber}`);
      setReservations(res.data);
      setFilter({ estado: '', search: '' });
    } catch (error) {
      console.error("Error al buscar reservas activas:", error);
      toast.error('Error al buscar reservas activas');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservation({
      ...reservation,
      [name]: name === "guests" ? Number(value) : value
    });
  };

  const validateForm = () => {
    // Validación de fechas
    if (new Date(reservation.checkIn) >= new Date(reservation.checkOut)) {
      toast.error("⚠️ La fecha de entrada debe ser anterior a la de salida.");
      return false;
    }

    // Verificar conflictos de reserva
    const isOverlapping = (newStart, newEnd, existingStart, existingEnd) => {
      return new Date(newStart) <= new Date(existingEnd) &&
             new Date(newEnd) >= new Date(existingStart);
    };

    const conflict = reservations.some((r) =>
      r.roomNumber === reservation.roomNumber &&
      (!isEditing || r._id !== reservation._id) &&
      isOverlapping(reservation.checkIn, reservation.checkOut, r.checkIn, r.checkOut)
    );

    if (conflict) {
      toast.error("⚠️ Ya existe una reserva para esta habitación en las fechas seleccionadas.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = {
      ...reservation,
      guests: Number(reservation.guests) || 1,
      firstName: reservation.firstName || '',
      lastName: reservation.lastName || '',
      phone: reservation.phone || '',
      email: reservation.email || '',
      checkIn: reservation.checkIn || '',
      checkOut: reservation.checkOut || '',
      roomNumber: reservation.roomNumber || '',
    };

    try {
      const url = isEditing ? `/api/reservations/${reservation._id}` : '/api/reservations';
      const method = isEditing ? axiosInstance.put : axiosInstance.post;

      await method(url, data);
      fetchReservations();
      setReservation(initialReservationState());
      setIsEditing(false);
      toast.success(isEditing ? 'Reserva actualizada' : 'Reserva creada');
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Error al guardar la reserva. Intenta nuevamente.');
      }
    }
  };

  const handleEdit = (res) => {
    setReservation({
      firstName: res.firstName || '',
      lastName: res.lastName || '',
      phone: res.phone || '',
      email: res.email || '',
      checkIn: res.checkIn ? res.checkIn.slice(0, 10) : '',
      checkOut: res.checkOut ? res.checkOut.slice(0, 10) : '',
      roomNumber: res.roomNumber || '',
      guests: typeof res.guests === 'number' ? res.guests : Number(res.guests) || 1,
      notes: res.notes || '',
      _id: res._id
    });
    setIsEditing(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Filtrar reservas
  const estados = ['reservado', 'ocupado', 'completado', 'cancelado'];
  
  const filteredReservations = reservations.filter(r => {
    const coincideEstado = !filter.estado || r.status === filter.estado;
    const coincideSearch = !filter.search ||
      r.firstName.toLowerCase().includes(filter.search.toLowerCase()) ||
      r.lastName.toLowerCase().includes(filter.search.toLowerCase()) ||
      String(r.roomNumber).includes(filter.search);
    return coincideEstado && coincideSearch;
  });

  // Handlers para acciones de reserva
  const createModalHandler = (title, message, action) => {
    return (...args) => {
      setModal({
        open: true,
        title,
        message,
        onConfirm: async () => {
          setModal(m => ({ ...m, open: false }));
          try {
            await action(...args);
            fetchReservations();
          } catch (err) {
            console.error('Error en acción:', err);
            toast.error(`Error: ${err.response?.data?.message || err.message}`);
          }
        }
      });
    };
  };

  const handleDelete = createModalHandler(
    'Eliminar reserva',
    '¿Estás seguro de eliminar esta reserva? Esta acción no se puede deshacer.',
    async (id) => {
      await axiosInstance.delete(`/api/reservations/${id}`);
      toast.success('Reserva eliminada');
    }
  );

  const handleCancel = createModalHandler(
    'Cancelar reserva',
    '¿Estás seguro de cancelar esta reserva? Esta acción no se puede deshacer.',
    async (id) => {
      await axiosInstance.put(`/api/reservations/${id}/cancel`);
      toast.success('Reserva cancelada');
    }
  );

  const handleCheckIn = createModalHandler(
    'Confirmar check-in',
    '¿Deseas realizar el check-in de esta reserva? Esta acción cambiará el estado de la habitación.',
    async (id) => {
      await axiosInstance.post(`/api/reservations/${id}/checkin`);
      toast.success('Check-in realizado correctamente.');
    }
  );

  const handleCheckOut = createModalHandler(
    'Confirmar check-out',
    '¿Deseas realizar el check-out de esta reserva? La habitación pasará a estado limpieza.',
    async (id) => {
      await axiosInstance.post(`/api/reservations/${id}/checkout`);
      toast.success('Check-out realizado correctamente.');
    }
  );

  const handleSetAvailable = createModalHandler(
    'Marcar habitación disponible',
    '¿Marcar la habitación como disponible después de limpieza?',
    async (roomId) => {
      await axiosInstance.post(`/api/rooms/${roomId}/set-available`);
      toast.success('Habitación marcada como disponible.');
    }
  );

  useEffect(() => {
    fetchReservations();
  }, []);

  return {
    // State
    reservation,
    reservations,
    isEditing,
    filter,
    modal,
    activeRoom,
    formRef,
    filteredReservations,
    estados,
    
    // Setters
    setReservation,
    setIsEditing,
    setFilter,
    setModal,
    setActiveRoom,
    
    // Handlers
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancel,
    handleCheckIn,
    handleCheckOut,
    handleSetAvailable,
    
    // Fetchers
    fetchReservations,
    fetchActiveByRoom,
    
    // Utils
    initialReservationState
  };
};
