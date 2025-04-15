// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Reports from './pages/Reports';
import AdminDashboard from './pages/AdminDashboard';
import ManageRooms from './pages/ManageRooms';
import ManageReservations from './pages/ManageReservations'; // 👉 importar tu nuevo componente

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/manage-rooms" element={<ManageRooms />} />
      <Route path="/manage-reservations" element={<ManageReservations />} /> {/* 👈 nueva ruta */}
      <Route path="/reports" element={<Reports />} />
    
    </Routes>
  );
}

export default App;
