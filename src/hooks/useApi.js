// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, data = null, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const config = {
        method,
        url,
        ...options
      };

      if (data) {
        config.data = data;
      }

      const response = await axiosInstance(config);
      
      // Mostrar mensaje de éxito si se especifica
      if (options.successMessage) {
        toast.success(options.successMessage);
      }

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error en la solicitud';
      setError(errorMessage);
      
      // Mostrar error automáticamente a menos que se especifique lo contrario
      if (options.showError !== false) {
        toast.error(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Métodos de conveniencia
  const get = useCallback((url, options = {}) => 
    request('GET', url, null, options), [request]);

  const post = useCallback((url, data, options = {}) => 
    request('POST', url, data, options), [request]);

  const put = useCallback((url, data, options = {}) => 
    request('PUT', url, data, options), [request]);

  const del = useCallback((url, options = {}) => 
    request('DELETE', url, null, options), [request]);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    del
  };
};

// Hook específico para operaciones CRUD
export const useCrud = (baseUrl, itemName = 'elemento') => {
  const api = useApi();
  const [items, setItems] = useState([]);

  const fetchItems = useCallback(async () => {
    try {
      const data = await api.get(baseUrl);
      setItems(Array.isArray(data) ? data : data.data || []);
    } catch {
      // Error ya manejado por useApi
    }
  }, [api, baseUrl]);

  const createItem = useCallback(async (itemData) => {
    const newItem = await api.post(baseUrl, itemData, {
      successMessage: `${itemName} creado exitosamente`
    });
    setItems(prev => [...prev, newItem]);
    return newItem;
  }, [api, baseUrl, itemName]);

  const updateItem = useCallback(async (id, itemData) => {
    const updatedItem = await api.put(`${baseUrl}/${id}`, itemData, {
      successMessage: `${itemName} actualizado exitosamente`
    });
    setItems(prev => prev.map(item => 
      item._id === id ? updatedItem : item
    ));
    return updatedItem;
  }, [api, baseUrl, itemName]);

  const deleteItem = useCallback(async (id) => {
    await api.del(`${baseUrl}/${id}`, {
      successMessage: `${itemName} eliminado exitosamente`
    });
    setItems(prev => prev.filter(item => item._id !== id));
  }, [api, baseUrl, itemName]);

  return {
    items,
    setItems,
    loading: api.loading,
    error: api.error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem
  };
};
