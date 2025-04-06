import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/dashboard" className="text-white font-bold text-xl">
                Hotel Admin
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {/* Enlaces comunes */}
                <Link
                  to="/dashboard"
                  className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>

                {/* Enlaces según rol */}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}

                {(user?.role === 'admin' || user?.role === 'limpieza' || user?.role === 'supervisor') && (
                  <Link
                    to="/cleaning"
                    className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Limpieza
                  </Link>
                )}

                {(user?.role === 'admin' || user?.role === 'recepcionista' || user?.role === 'servicio') && (
                  <Link
                    to="/services"
                    className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Servicios
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <span className="text-white mr-4">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-500 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/dashboard"
              className="text-white hover:bg-indigo-500 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="text-white hover:bg-indigo-500 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                Admin
              </Link>
            )}

            {(user?.role === 'admin' || user?.role === 'limpieza' || user?.role === 'supervisor') && (
              <Link
                to="/cleaning"
                className="text-white hover:bg-indigo-500 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                Limpieza
              </Link>
            )}

            {(user?.role === 'admin' || user?.role === 'recepcionista' || user?.role === 'servicio') && (
              <Link
                to="/services"
                className="text-white hover:bg-indigo-500 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                Servicios
              </Link>
            )}

            <div className="pt-4 pb-3 border-t border-indigo-500">
              <div className="px-2">
                <span className="block text-white px-3 py-2">{user?.name}</span>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="text-white hover:bg-indigo-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
