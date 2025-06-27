// services/dashboardService.js - Frontend service para dashboard
import axiosInstance from '../utils/axiosInstance';

/**
 * Servicio de Dashboard para Frontend
 * Proporciona métodos para obtener métricas del backend
 */
class DashboardService {
  /**
   * Obtener métricas completas del dashboard
   */
  async getDashboardMetrics() {
    try {
      const response = await axiosInstance.get('/dashboard/metrics');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo métricas completas:', error);
      throw error;
    }
  }

  /**
   * Obtener resumen ejecutivo
   */
  async getSummary() {
    try {
      const response = await axiosInstance.get('/dashboard/summary');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo resumen:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas generales
   */
  async getStats() {
    try {
      const response = await axiosInstance.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de ocupación por tipo
   */
  async getOccupancy() {
    try {
      const response = await axiosInstance.get('/dashboard/occupancy');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo ocupación:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de ingresos (solo admins)
   */
  async getRevenue(startDate, endDate) {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await axiosInstance.get('/dashboard/revenue', { params });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo ingresos:', error);
      throw error;
    }
  }

  /**
   * Obtener actividad reciente
   */
  async getActivity(limit = 10) {
    try {
      const response = await axiosInstance.get('/dashboard/activity', { 
        params: { limit } 
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo actividad:', error);
      throw error;
    }
  }

  /**
   * Obtener tendencia de ocupación
   */
  async getTrend(days = 30) {
    try {
      const response = await axiosInstance.get('/dashboard/trend', { 
        params: { days } 
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo tendencia:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
const dashboardService = new DashboardService();
export default dashboardService;
