import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, token } = useContext(AuthContext);

  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si hay roles permitidos especificados, verificar si el usuario tiene el rol adecuado
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Si el usuario es admin, permitir acceso a todas las rutas
    if (user?.role === 'admin') {
      return children;
    }
    // Si no es admin y no tiene el rol adecuado, redirigir al dashboard general
    return <Navigate to="/dashboard" />;
  }

  // Si no hay restricción de roles o el usuario tiene el rol adecuado, mostrar el componente
  return children;
};

export default PrivateRoute;
