import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CleaningDashboard from "./pages/cleaning/CleaningDashboard";
import ServicesDashboard from "./pages/services/ServicesDashboard";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Rutas protegidas generales */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          {/* Rutas de administración */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />

          {/* Rutas de limpieza */}
          <Route path="/cleaning" element={
            <PrivateRoute allowedRoles={['admin', 'limpieza', 'supervisor']}>
              <CleaningDashboard />
            </PrivateRoute>
          } />

          {/* Rutas de servicios */}
          <Route path="/services" element={
            <PrivateRoute allowedRoles={['admin', 'recepcionista', 'servicio']}>
              <ServicesDashboard />
            </PrivateRoute>
          } />

          {/* Ruta por defecto */}
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
