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
        const res = await axiosInstance.get('/rooms');
        setRooms(res.data);
      } catch {
        setRooms([]);
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
