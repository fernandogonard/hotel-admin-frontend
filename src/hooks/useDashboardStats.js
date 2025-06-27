// hooks/useDashboardStats.js
import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

export const useDashboardStats = () => {
  const [stats, setStats] = useState({ 
    totalRooms: 0, 
    availableRooms: 0, 
    occupiedRooms: 0,
    cleaningRooms: 0,
    maintenanceRooms: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchStats = async (useCache = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Usar endpoint real con parámetros de caché
      const cacheParam = useCache ? '?cache=true' : '';
      const res = await axiosInstance.get(`/reports/general${cacheParam}`, { 
        timeout: 10000,
        retry: retryCount < 2 
      });
      
      if (res.data.success) {
        setStats({
          totalRooms: res.data.data.totalRooms || 0,
          availableRooms: res.data.data.availableRooms || 0,
          occupiedRooms: res.data.data.occupiedRooms || 0,
          cleaningRooms: res.data.data.cleaningRooms || 0,
          maintenanceRooms: res.data.data.maintenanceRooms || 0
        });
        setRetryCount(0); // Reset retry count on success
        console.log('✅ Estadísticas cargadas desde backend real');
      } else {
        throw new Error(res.data.message || 'Datos inválidos del servidor');
      }
      
    } catch (err) {
      console.error('Error obteniendo estadísticas:', err);
      
      // Manejar diferentes tipos de error
      if (err.code === 'ECONNABORTED') {
        setError('Timeout - El servidor tardó demasiado en responder');
      } else if (err.response?.status === 503) {
        setError('Servicio temporalmente no disponible');
      } else if (err.response?.status >= 500) {
        setError('Error interno del servidor');
      } else if (err.response?.status === 404) {
        setError('Endpoint de estadísticas no encontrado');
      } else {
        setError(`Error de conexión: ${err.message}`);
      }
      
      // Fallback con datos demo solo después de varios intentos
      if (retryCount >= 2) {
        // No usar datos demo, solo dejar el error
        setStats({
          totalRooms: 0,
          availableRooms: 0,
          occupiedRooms: 0,
          cleaningRooms: 0,
          maintenanceRooms: 0
        });
      }
      
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Calcular KPIs
  const occupancyRate = stats.totalRooms > 0 
    ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) 
    : 0;

  const availabilityRate = stats.totalRooms > 0 
    ? Math.round((stats.availableRooms / stats.totalRooms) * 100) 
    : 0;

  const kpis = [
    {
      label: 'Total de Habitaciones',
      value: stats.totalRooms,
      icon: '🏨',
      color: 'var(--primary)'
    },
    {
      label: 'Habitaciones Ocupadas',
      value: stats.occupiedRooms,
      icon: '🔴',
      color: 'var(--danger)'
    },
    {
      label: 'Habitaciones Disponibles',
      value: stats.availableRooms,
      icon: '🟢',
      color: 'var(--success)'
    },
    {
      label: 'Tasa de Ocupación',
      value: `${occupancyRate}%`,
      icon: '📊',
      color: occupancyRate > 70 ? 'var(--success)' : occupancyRate > 50 ? 'var(--warning)' : 'var(--danger)'
    },
    {
      label: 'Disponibilidad',
      value: `${availabilityRate}%`,
      icon: '✅',
      color: availabilityRate > 30 ? 'var(--success)' : 'var(--warning)'
    },
    {
      label: 'En Limpieza',
      value: stats.cleaningRooms,
      icon: '🧹',
      color: 'var(--warning)'
    }
  ];

  // Datos para gráfico
  const chartData = {
    labels: ['Disponibles', 'Ocupadas', 'Limpieza', 'Mantenimiento'],
    datasets: [{
      label: 'Habitaciones',
      data: [
        stats.availableRooms, 
        stats.occupiedRooms, 
        stats.cleaningRooms, 
        stats.maintenanceRooms
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',  // Verde para disponibles
        'rgba(239, 68, 68, 0.8)',  // Rojo para ocupadas
        'rgba(251, 191, 36, 0.8)', // Amarillo para limpieza
        'rgba(107, 114, 128, 0.8)' // Gris para mantenimiento
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(251, 191, 36, 1)',
        'rgba(107, 114, 128, 1)'
      ],
      borderWidth: 2,
      borderRadius: 4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 16,
          font: { size: 12 },
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: error ? 'Datos de Demostración - Backend No Disponible' : 'Estado Actual de Habitaciones',
        color: error ? 'rgba(251, 191, 36, 1)' : 'rgba(55, 65, 81, 1)',
        font: { size: 14, weight: 'bold' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return {
    stats,
    loading,
    error,
    retryCount,
    kpis,
    chartData,
    chartOptions,
    occupancyRate,
    availabilityRate,
    fetchStats,
    handleRetry
  };
};
