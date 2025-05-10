// Datos simulados para 40 habitaciones en 4 pisos
const estados = ['disponible', 'ocupada', 'limpieza', 'mantenimiento'];

export const mockRooms = Array.from({ length: 40 }, (_, i) => {
  const piso = Math.floor(i / 10) + 1;
  const numero = (piso * 100) + ((i % 10) + 1);
  return {
    id: i + 1,
    numero,
    piso,
    estado: estados[Math.floor(Math.random() * estados.length)],
  };
});