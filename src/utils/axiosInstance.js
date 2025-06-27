// utils/axiosInstance.js - Configuración de axios para conectar directo al backend real
import axios from 'axios';

// Configuración de axios para conectar directo al backend real
const axiosInstance = axios.create({
  baseURL: 'http://localhost:2117/api', // Apunta al backend Express
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para agregar el token a cada request (opcional)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores (opcional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default axiosInstance;