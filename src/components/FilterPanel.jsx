import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';

const FilterPanel = () => {
  const [floor, setFloor] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">🔍 Filtros Generales</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select value={floor} onChange={(e) => setFloor(e.target.value)}>
          <SelectItem value="">Filtrar por Piso</SelectItem>
          <SelectItem value="1">Piso 1</SelectItem>
          <SelectItem value="2">Piso 2</SelectItem>
          <SelectItem value="3">Piso 3</SelectItem>
        </Select>

        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <SelectItem value="">Estado de Habitación</SelectItem>
          <SelectItem value="libre">Libre</SelectItem>
          <SelectItem value="reservado">Reservado</SelectItem>
          <SelectItem value="ocupado">Ocupado</SelectItem>
          <SelectItem value="fuera_servicio">Fuera de Servicio</SelectItem>
        </Select>

        <Input
          type="text"
          placeholder="Buscar por Tipo (ej: Doble, Suite)"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FilterPanel;
