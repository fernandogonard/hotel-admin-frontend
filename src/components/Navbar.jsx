import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, X } from "lucide-react"; // Íconos modernos

const Navbar = () => {
  const { user, token, setUser, setToken } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!token) return null;

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="text-white font-bold text-2xl">
            Hotel Admin
          </Link>

          {/* Menú Desktop */}
          <div className="hidden md:flex space-x-6">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            {user?.role === 'admin' && <Link to="/admin/dashboard" className="nav-link">Admin</Link>}
            {(user?.role === 'admin' || user?.role === 'limpieza' || user?.role === 'supervisor') && (
              <Link to="/cleaning" className="nav-link">Limpieza</Link>
            )}
            {(user?.role === 'admin' || user?.role === 'recepcionista' || user?.role === 'servicio') && (
              <Link to="/services" className="nav-link">Servicios</Link>
            )}
          </div>

          {/* User & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-white font-medium">{user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
          </div>

          {/* Botón Menú Móvil */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-700 transition-all duration-300">
          <div className="flex flex-col space-y-2 p-4">
            <Link to="/dashboard" className="mobile-link" onClick={toggleMenu}>Dashboard</Link>
            {user?.role === 'admin' && <Link to="/admin/dashboard" className="mobile-link" onClick={toggleMenu}>Admin</Link>}
            {(user?.role === 'admin' || user?.role === 'limpieza' || user?.role === 'supervisor') && (
              <Link to="/cleaning" className="mobile-link" onClick={toggleMenu}>Limpieza</Link>
            )}
            {(user?.role === 'admin' || user?.role === 'recepcionista' || user?.role === 'servicio') && (
              <Link to="/services" className="mobile-link" onClick={toggleMenu}>Servicios</Link>
            )}
            <button onClick={() => { handleLogout(); toggleMenu(); }} className="logout-btn w-full text-left">
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
