import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, rolesPermitidos }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token) return <Navigate to="/login" />;
  if (rolesPermitidos && !rolesPermitidos.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
};

export default PrivateRoute;
