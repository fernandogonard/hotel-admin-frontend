// src/pages/DashboardAvanzado.jsx
import React, { useEffect, useState } from 'react';
import AdminDashboardAvanzado from '../components/dashboard/AdminDashboardAvanzado';
import '../styles/dashboard.css';
import axiosInstance from '../utils/axiosInstance';

function DashboardAvanzado() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Polling cada 30 segundos
  useEffect(() => {
    let interval;
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/reports/general');
        setStats(res.data.data || res.data);
      } catch (error) {
        setStats(null);
      }
      setLoading(false);
    };
    fetchStats();
    interval = setInterval(fetchStats, 30000); // Actualiza cada 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container">
      <AdminDashboardAvanzado stats={stats} loading={loading} />
    </div>
  );
};

export default DashboardAvanzado;
