// hooks/useDashboard.js - Hook personalizado para dashboard
import { useState, useEffect, useCallback } from 'react';
import dashboardService from '../services/dashboardService';
import { useAuth } from './useAuth';

/**
 * Hook personalizado para manejar datos del dashboard
 */
export const useDashboard = () => {
  const { user, token } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Obtener resumen ejecutivo
  const fetchSummary = useCallback(async () => {
    if (!token) return;
    
    try {
      setError(null);
      const response = await dashboardService.getSummary();
      
      if (response.success) {
        setSummary(response.data);
        console.log('✅ Resumen del dashboard cargado');
      } else {
        throw new Error(response.message || 'Error obteniendo resumen');
      }
      
    } catch (error) {
      console.error('❌ Error en fetchSummary:', error);
      setError(error.message);
      setSummary(null); // No usar datos demo
    }
  }, [token]);

  // Obtener métricas completas
  const fetchMetrics = useCallback(async () => {
    if (!token) return;
    
    try {
      setError(null);
      const response = await dashboardService.getDashboardMetrics();
      
      if (response.success) {
        setMetrics(response.data);
        console.log('✅ Métricas completas del dashboard cargadas');
      } else {
        throw new Error(response.message || 'Error obteniendo métricas');
      }
      
    } catch (error) {
      console.error('❌ Error en fetchMetrics:', error);
      setError(error.message);
    }
  }, [token]);

  // Refrescar todos los datos
  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchSummary(), fetchMetrics()]);
    } finally {
      setRefreshing(false);
    }
  }, [fetchSummary, fetchMetrics]);

  // Cargar datos iniciales
  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchSummary().finally(() => setLoading(false));
    }
  }, [token, fetchSummary]);

  // Auto-refresh cada 5 minutos
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing dashboard data...');
      refresh();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [token, refresh]);

  return {
    // Datos
    summary,
    metrics,
    
    // Estados
    loading,
    error,
    refreshing,
    
    // Acciones
    refresh,
    fetchSummary,
    fetchMetrics,
    
    // Utilidades
    isAdmin: user?.role === 'admin',
    isStaff: ['admin', 'receptionist'].includes(user?.role)
  };
};
