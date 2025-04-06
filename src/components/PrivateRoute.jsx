import { useContext, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, token } = useContext(AuthContext);
  const [isVerifying, setIsVerifying] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Verificar token en el backend
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Token inválido');
        }

        setIsVerifying(false);
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    };

    if (token) {
      verifyAuth();
    } else {
      setIsVerifying(false);
    }
  }, [token]);

  // Mostrar spinner mientras se verifica
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar roles
  if (allowedRoles.length > 0) {
    // Si el usuario es admin, permitir acceso a todas las rutas
    if (user?.role === 'admin') {
      return children;
    }
    
    // Si el usuario no tiene el rol requerido
    if (!allowedRoles.includes(user?.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Si todo está bien, mostrar el componente
  return children;
};

export default PrivateRoute;
