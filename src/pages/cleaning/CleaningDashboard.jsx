import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const CleaningDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cleaning', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setTasks(data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(`Error al actualizar la tarea: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cleaning/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setTasks(tasks.map(task => 
          task._id === taskId ? { ...task, status: newStatus } : task
        ));
      }
    } catch (err) {
      setError(`Error al actualizar la tarea: ${err.message}`);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Limpieza</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map(task => (
          <div key={task._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                Habitación {task.room.number}
              </h3>
              <span className={`px-2 py-1 rounded text-sm ${
                task.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                task.status === 'en_proceso' ? 'bg-blue-100 text-blue-800' :
                task.status === 'completada' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {task.status}
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600">
                <span className="font-medium">Tipo:</span> {task.type}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Prioridad:</span> {task.priority}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Fecha programada:</span>{' '}
                {new Date(task.scheduledDate).toLocaleDateString()}
              </p>
            </div>

            {task.notes && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">{task.notes}</p>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              {task.status === 'pendiente' && (
                <button
                  onClick={() => updateTaskStatus(task._id, 'en_proceso')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Iniciar
                </button>
              )}
              {task.status === 'en_proceso' && (
                <button
                  onClick={() => updateTaskStatus(task._id, 'completada')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Completar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CleaningDashboard;
