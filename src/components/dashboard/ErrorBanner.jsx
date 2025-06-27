// components/dashboard/ErrorBanner.jsx
import React from 'react';

const ErrorBanner = ({ error, loading, retryCount, onRetry }) => {
  if (!error) return null;

  return (
    <div style={{
      background: 'rgba(254, 243, 199, 1)',
      border: '1px solid rgba(251, 191, 36, 1)',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>⚠️</span>
        <div>
          <strong>Modo Demostración Activo</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
            {error}. Los datos mostrados son de ejemplo.
          </p>
        </div>
      </div>
      {retryCount < 3 && (
        <button 
          onClick={onRetry}
          disabled={loading}
          style={{
            background: 'rgba(251, 191, 36, 1)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Reintentando...' : `Reintentar (${retryCount}/3)`}
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
