import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, BarChart } from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold">⚡ Acciones Rápidas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate('/admin/rooms/new')}
        >
          <Plus size={18} />
          Nueva Habitación
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate('/admin/reservations/new')}
        >
          <Calendar size={18} />
          Crear Reserva
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate('/admin/reports')}
        >
          <BarChart size={18} />
          Ver Estadísticas
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
