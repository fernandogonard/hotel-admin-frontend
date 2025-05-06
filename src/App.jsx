import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import ManageRooms from './pages/ManageRooms';
import ManageReservations from './pages/ManageReservations';
import Reports from './pages/Reports';

function App() {
  return (
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
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
