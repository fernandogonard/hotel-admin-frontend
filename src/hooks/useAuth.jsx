// hooks/useAuth.jsx - Autenticación robusta y segura con cookies httpOnly
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

// Hook personalizado para manejar autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Provider de autenticación mejorado
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [storageError, setStorageError] = useState(null);

  // Verificar autenticación al cargar la app SOLO una vez
  useEffect(() => {
    let called = false;
    if (!called) {
      checkAuth();
      called = true;
    }
    // eslint-disable-next-line
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    try {
      // Intentar obtener usuario autenticado desde el backend
      const response = await axiosInstance.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
        setToken('authenticated');
        setStorageError(null);
        console.log('✅ Usuario autenticado:', response.data.user.email);
      }
    } catch (error) {
      setUser(null);
      setToken(null);
      // Limpiar localStorage de forma segura
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (e) {
        setStorageError('No se pudo limpiar localStorage: ' + e.message);
        console.warn('No se pudo limpiar localStorage:', e.message);
      }
      // Intentar migrar token si existe
      let oldToken = null;
      try {
        oldToken = localStorage.getItem('token');
      } catch (e) {
        setStorageError('No se pudo leer token de localStorage: ' + e.message);
        console.warn('No se pudo leer token de localStorage:', e.message);
      }
      if (oldToken && error.response?.status === 401) {
        try {
          const migrateResponse = await axiosInstance.post('/auth/migrate-token', { token: oldToken });
          if (migrateResponse.data.success) {
            setUser(migrateResponse.data.user);
            setToken('authenticated');
            try {
              localStorage.removeItem('token');
            } catch (e) {
              setStorageError('No se pudo limpiar token migrado: ' + e.message);
            }
          }
        } catch (migrateError) {
          console.log('❌ Error migrando token:', migrateError.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      if (response.data.success && response.data.token) {
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        setStorageError(null);
        // Guardar token en localStorage
        try {
          localStorage.setItem('token', token);
        } catch (e) {
          setStorageError('No se pudo guardar token en localStorage: ' + e.message);
        }
        return { success: true, user, message: response.data.message };
      } else {
        return { success: false, message: response.data.message || 'Error de autenticación' };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error de autenticación';
      return { success: false, message, code: error.response?.data?.code };
    }
  };

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      // No romper si falla el logout
    } finally {
      setUser(null);
      setToken(null);
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (e) {
        setStorageError('No se pudo limpiar localStorage en logout: ' + e.message);
      }
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh');
      if (response.data.success) {
        setUser(response.data.user);
        setToken('authenticated');
        setStorageError(null);
        if (response.data.token) {
          try {
            localStorage.setItem('token', response.data.token);
          } catch (e) {
            setStorageError('No se pudo guardar token renovado en localStorage: ' + e.message);
          }
        }
        return true;
      }
    } catch (error) {
      logout();
      return false;
    }
  }, [logout]);

  const updateProfile = async (profileData) => {
    try {
      const response = await axiosInstance.put('/users/profile', profileData);
      if (response.data.success) {
        setUser(response.data.data);
        return { success: true, user: response.data.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error actualizando perfil';
      return { success: false, message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await axiosInstance.post('/auth/change-password', passwordData);
      if (response.data.success) {
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error cambiando contraseña';
      return { success: false, message };
    }
  };

  // Verificaciones de rol
  const isAdmin = () => user?.role === 'admin';
  const isReceptionist = () => user?.role === 'receptionist';
  const isStaff = () => ['admin', 'receptionist', 'cleaning'].includes(user?.role);

  // Auto-refresh token cada 30 minutos si está autenticado
  useEffect(() => {
    if (!user || !token) return;
    const interval = setInterval(async () => {
      await refreshToken();
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, token, refreshToken]);

  const value = {
    user,
    token: !!token,
    loading,
    login,
    logout,
    refreshToken,
    updateProfile,
    changePassword,
    checkAuth,
    isAdmin,
    isReceptionist,
    isStaff,
    storageError
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div style={{padding: 32}}>Cargando autenticación...</div> : null}
      {storageError && <div style={{color: 'red', padding: 16}}>Error de almacenamiento: {storageError}</div>}
      {!loading && !storageError ? children : null}
    </AuthContext.Provider>
  );
};
// 🚨 Este archivo contiene JSX pero tiene extensión .js. Eso causa errores con Vite.

// ✅ Tareas para Copilot:
// 1. Renombrar virtualmente este archivo a .jsx o corregir la sintaxis si no es JSX.
// 2. Revisar desde la línea 210 en adelante y eliminar cualquier JSX fuera de lugar.
// 3. Si hay un `return (<div>...</div>)`, asegurarse de que esté dentro de un componente.
// 4. Asegurarse de que el archivo exporte correctamente el hook useAuth.
// 5. Eliminar cualquier código roto o incompleto al final del archivo.
// 6. Si no es JSX, corregir el error de sintaxis que impide que Vite lo compile.

// 👉 Dejar el archivo funcionando como hook de autenticación funcional en React.
