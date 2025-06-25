import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // Usar proxy de Vite para evitar problemas de CORS y entorno
  timeout: 30000, // 30 segundos timeout (aumentado para consultas pesadas)
});

// Interceptor para agregar el token a cada request si existe
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`, token ? '🔐' : '🔓');
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ ${error.response?.status || 'NETWORK'} ${error.config?.url}:`, error.response?.data || error.message);
    
    // Si es 401, redirigir al login
    if (error.response?.status === 401) {
      console.warn('🔐 Token inválido o expirado. Redirigiendo al login...');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;