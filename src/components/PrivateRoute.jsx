import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { user, loading, storageError } = useAuth();

  if (loading) {
    return <div style={{ padding: 32 }}>Cargando autenticación...</div>;
  }

  if (storageError) {
    return (
      <div style={{ color: 'red', padding: 24 }}>
        <h2>Error de seguridad</h2>
        <p>No se puede acceder al almacenamiento local del navegador.<br />
        Por favor, revisa la configuración de privacidad o prueba en otro navegador.</p>
        <pre>{storageError}</pre>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
