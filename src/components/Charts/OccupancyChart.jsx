// src/components/Charts/OccupancyChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = [
  { name: 'Lunes', ocupación: 30 },
  { name: 'Martes', ocupación: 50 },
  { name: 'Miércoles', ocupación: 70 },
  { name: 'Jueves', ocupación: 65 },
  { name: 'Viernes', ocupación: 80 },
  { name: 'Sábado', ocupación: 95 },
  { name: 'Domingo', ocupación: 60 },
];

const OccupancyChart = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Ocupación semanal</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sampleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis unit="%" />
          <Tooltip />
          <Bar dataKey="ocupación" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OccupancyChart;
