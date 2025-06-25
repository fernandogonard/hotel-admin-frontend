import { useEffect } from 'react';
import api from '../api/axios';

export const useAuth = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Opcional: refrescar token si está por expirar
      api.post('/auth/refresh', { token })
        .then(res => {
          localStorage.setItem('token', res.data.token);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        });
    }
  }, []);
};
