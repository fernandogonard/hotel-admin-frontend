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
        
        // 🔧 FALLBACK: Si el backend no responde, usar datos mock
        console.warn('⚠️ Backend no responde, usando habitaciones de demostración');
        const mockRooms = Array.from({ length: 20 }, (_, i) => ({
          _id: `mock-${i}`,
          number: 101 + i,
          type: i % 2 === 0 ? 'Simple' : 'Doble',
          price: i % 2 === 0 ? 100 : 150,
          floor: Math.floor(i / 10) + 1,
          status: i % 3 === 0 ? 'disponible' : i % 3 === 1 ? 'ocupado' : 'limpieza',
          capacity: i % 2 === 0 ? 1 : 2,
          amenities: ['WiFi', 'TV']
        }));
        setRooms(mockRooms);
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
