// components/dashboard/KPIGrid.jsx
import React from 'react';

const KPIGrid = ({ kpis, loading }) => {
  if (loading) {
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '32px' 
      }}>
        {[...Array(6)].map((_, index) => (
          <div key={index} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(229, 231, 235, 1)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: 0.6
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'rgba(229, 231, 235, 1)',
              borderRadius: '8px'
            }} />
            <div>
              <div style={{
                width: '80px',
                height: '12px',
                background: 'rgba(229, 231, 235, 1)',
                marginBottom: '8px',
                borderRadius: '4px'
              }} />
              <div style={{
                width: '40px',
                height: '16px',
                background: 'rgba(229, 231, 235, 1)',
                borderRadius: '4px'
              }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '16px', 
      marginBottom: '32px' 
    }}>
      {kpis.map((kpi, index) => (
        <div key={index} style={{
          background: 'var(--card-bg)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'default'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}>
          <div style={{
            fontSize: '24px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `var(--primary-light)`,
            borderRadius: '8px',
            color: 'var(--primary-dark)'
          }}>
            {kpi.icon}
          </div>
          <div>
            <div style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginBottom: '2px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {kpi.label}
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--primary-dark)',
              lineHeight: '1'
            }}>
              {kpi.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPIGrid;
