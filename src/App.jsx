import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import DashboardAvanzado from './pages/DashboardAvanzado';
import CalendarioReservas from './pages/CalendarioReservas';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import ManageRooms from './pages/ManageRooms';
import ManageReservations from './pages/ManageReservations';
import Reports from './pages/Reports';
import ManageGuests from './pages/ManageGuests';
import ServerStatus from './components/ServerStatus';
import UserHistory from './pages/UserHistory';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard-avanzado"
          element={
            <PrivateRoute>
              <DashboardAvanzado />
            </PrivateRoute>
          }
        />
        <Route
          path="/calendario-reservas"
          element={
            <PrivateRoute>
              <CalendarioReservas />
            </PrivateRoute>
          }
        />
        <Route
          path="/receptionist-dashboard"
          element={
            <PrivateRoute>
              <ReceptionistDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-rooms"
          element={
            <PrivateRoute>
              <ManageRooms />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-reservations"
          element={
            <PrivateRoute>
              <ManageReservations />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-guests"
          element={
            <PrivateRoute>
              <ManageGuests />
            </PrivateRoute>
          }
        />
        <Route
          path="/mi-historial"
          element={
            <PrivateRoute>
              <UserHistory />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ServerStatus />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
}

export default App;
