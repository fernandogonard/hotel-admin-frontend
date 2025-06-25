// src/config/api.js

// 🔧 CONFIGURACIÓN CORREGIDA:
// En desarrollo, Vite proxy envía /api/* → http://localhost:2117
// En producción, usar la variable de entorno completa
const API_BASE_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL || '/api')
  : '/api'; // En desarrollo usar proxy de Vite

// 📝 EXPLICACIÓN DE LA CONFIGURACIÓN:
// - Desarrollo: '/api' → Vite proxy → 'http://localhost:2117/api'
// - Producción: Usar VITE_API_URL completa (ej: 'https://api.hotel.com/api')

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  ME: `${API_BASE_URL}/auth/me`,
  
  // Rooms
  ROOMS: `${API_BASE_URL}/rooms`,
  ROOMS_AVAILABLE: `${API_BASE_URL}/rooms/available`,
  ROOMS_CALENDAR: `${API_BASE_URL}/rooms/calendar`,
  ROOMS_STATS: `${API_BASE_URL}/rooms/admin-stats`,
  
  // Reservations
  RESERVATIONS: `${API_BASE_URL}/reservations`,
  RESERVATIONS_PUBLIC: `${API_BASE_URL}/reservations/public`,
  
  // Guests
  GUESTS: `${API_BASE_URL}/guests`,
  
  // Reports
  REPORTS: `${API_BASE_URL}/reports`,
  REPORTS_GENERAL: `${API_BASE_URL}/reports/general`,
  REPORTS_RESERVATIONS: `${API_BASE_URL}/reports/reservations`,
  REPORTS_ROOMS: `${API_BASE_URL}/reports/rooms`,
  REPORTS_EXPORT_RESERVATIONS: `${API_BASE_URL}/reports/reservations/export`,
  REPORTS_EXPORT_ROOMS: `${API_BASE_URL}/reports/rooms/export`,
  REPORTS_EXPORT_GUESTS: `${API_BASE_URL}/reports/guests/export`,
  
  // Health check
  TEST: `${API_BASE_URL}/test`,
};

export const createApiUrl = (endpoint, params = {}) => {
  let url = endpoint;
  
  // Reemplazar parámetros de ruta (ej: :id)
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
};

// 🔧 FIX CORS - Configuración de fetch con withCredentials
export const apiRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // ⚠️ Imprescindible para CORS con cookies/auth
  };

  // Agregar token de autorización si existe
  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// 🔧 FIX CORS - Helper para axios si lo usas
export const axiosConfig = {
  withCredentials: true, // ⚠️ Imprescindible para CORS
  headers: {
    'Content-Type': 'application/json',
  }
};

export default {
  API_ENDPOINTS,
  createApiUrl,
  apiRequest,
  axiosConfig
};
