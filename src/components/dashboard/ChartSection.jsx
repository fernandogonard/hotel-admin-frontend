// components/dashboard/ChartSection.jsx
import React, { Suspense } from 'react';

// Lazy loading del componente de gráfico
const LazyBarChart = React.lazy(() => 
  import('react-chartjs-2').then(module => {
    return import('chart.js').then(({ Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend }) => {
      Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
      return { default: module.Bar };
    });
  }).catch(error => {
    console.error('Error cargando Chart.js:', error);
    // Fallback component
    return { 
      default: ({ data }) => (
        <div style={{ 
          height: '300px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'rgba(249, 250, 251, 1)',
          borderRadius: '8px',
          border: '2px dashed rgba(229, 231, 235, 1)',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <span style={{ fontSize: '24px' }}>📊</span>
          <p style={{ color: 'rgba(107, 114, 128, 1)', fontSize: '14px' }}>
            Error cargando Chart.js
          </p>
          <small style={{ color: 'rgba(156, 163, 175, 1)' }}>
            Datos: {data?.datasets?.[0]?.data?.join(', ')}
          </small>
        </div>
      )
    };
  })
);

const ChartSection = ({ chartData, chartOptions, error, loading }) => {
  return (
    <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px var(--border)', marginBottom: 24 }}>
      <h3 style={{ marginBottom: 8 }}>
        Estado actual de habitaciones
        {error && <span style={{ fontSize: 14, color: 'var(--warning)', marginLeft: 8 }}>(Datos de demostración)</span>}
      </h3>
      {loading ? (
        <div style={{ padding: 24, textAlign: 'center' }}>Cargando reporte...</div>
      ) : (
        <Suspense fallback={<div style={{ padding: 24, textAlign: 'center' }}>Cargando gráfico...</div>}>
          <div style={{ height: '350px' }}>
            <LazyBarChart data={chartData} options={chartOptions} />
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default ChartSection;
