// src/components/ServerStatus.jsx
import { useState, useEffect } from 'react';

const ServerStatus = () => {
  const [status, setStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);
  const [responseTime, setResponseTime] = useState(null);

  const checkServerStatus = async () => {
    const startTime = Date.now();
    try {
      const response = await fetch('/api/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000, // 5 segundos timeout
      });
      
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      
      if (response.ok) {
        setStatus('connected');
      } else if (response.status === 404) {
        // Silenciar 404, considerar como "conectado" si responde
        setStatus('connected');
      } else {
        setStatus('error');
      }
    } catch (error) {
      // Silenciar error de /api/test
      setStatus('disconnected');
      setResponseTime(null);
    }
    setLastCheck(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return '#10b981';
      case 'disconnected': return '#ef4444';
      case 'error': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': 
        return `Servidor conectado${responseTime ? ` (${responseTime}ms)` : ''}`;
      case 'disconnected': 
        return 'Servidor desconectado - Verificar backend';
      case 'error': 
        return 'Error de servidor';
      default: 
        return 'Verificando...';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '8px 12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: getStatusColor(),
            animation: status === 'checking' ? 'pulse 2s infinite' : 'none'
          }}
        />
        <span>{getStatusText()}</span>
      </div>
      {lastCheck && (
        <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
          Última verificación: {lastCheck}
        </div>
      )}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

export default ServerStatus;
