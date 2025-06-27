// Custom hook para lógica de habitaciones (fetch, orden, etc)
import { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../utils/axiosInstance';

export function useRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        console.log('🔍 Fetching rooms... Token:', localStorage.getItem('token') ? 'Present' : 'Missing');
        const res = await axiosInstance.get('/rooms', { timeout: 5000 }); // 5 segundos timeout
        console.log('✅ Rooms fetched successfully:', res.data?.length || 0, 'rooms');
        setRooms(res.data);
      } catch (error) {
        console.error('❌ Error fetching rooms:', error);
        console.log('Error details:', error.response?.data || error.message);
        setRooms([]); // No mostrar datos demo
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Orden ascendente por número
  const roomsSorted = useMemo(() =>
    rooms.slice().sort((a, b) => Number(a.number) - Number(b.number)),
    [rooms]
  );

  return { rooms: roomsSorted, loading };
}
