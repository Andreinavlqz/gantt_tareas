import { useEffect, useState } from "react";
import type { Tarea } from "../types/TareasTypes";
import { useTareasContext } from "../context/tareasContext";
import Modal from "./Modal";

interface TareaGantt {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
}

export default function GanttTareas() {
  const { tareas, editarTarea, eliminarTarea } = useTareasContext();
  const [tareasGantt, setTareasGantt] = useState<TareaGantt[]>([]);
  const [modoVista, setModoVista] = useState<'medio-dia' | 'dia' | 'semana' | 'mes'>('semana');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null);

  useEffect(() => {
    const tareasValidas = tareas.filter((tarea) => tarea.comienzo && tarea.final);

    const tareasMapeadas = tareasValidas.map((tarea) => ({
      id: tarea.id,
      name: tarea.nombre,
      start: new Date(tarea.comienzo),
      end: new Date(tarea.final),
      progress: tarea.progreso || 0,
    }));

    setTareasGantt(tareasMapeadas);
  }, [tareas]);

  const calcularDuracion = (start: Date, end: Date): number => {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const obtenerFechaMinima = (): Date => {
    if (tareasGantt.length === 0) return new Date();
    return new Date(Math.min(...tareasGantt.map(t => t.start.getTime())));
  };

  const obtenerFechaMaxima = (): Date => {
    if (tareasGantt.length === 0) return new Date();
    return new Date(Math.max(...tareasGantt.map(t => t.end.getTime())));
  };

  const fechaMin = obtenerFechaMinima();
  const fechaMax = obtenerFechaMaxima();
  const duracionTotal = calcularDuracion(fechaMin, fechaMax);

  const abrirModalEditar = (tarea: Tarea) => {
    setTareaSeleccionada(tarea);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setTareaSeleccionada(null);
  };

  const guardarTarea = (tarea: Tarea) => {
    editarTarea(tarea);
  };

  const eliminarTareaModal = (id: string) => {
    eliminarTarea(id);
  };

  // Generar meses para el timeline
  const generarMeses = () => {
    const meses = [];
    const fechaActual = new Date(fechaMin);
    fechaActual.setMonth(fechaActual.getMonth() - 1); // Empezar un mes antes
    
    for (let i = 0; i < 12; i++) {
      meses.push(new Date(fechaActual));
      fechaActual.setMonth(fechaActual.getMonth() + 1);
    }
    return meses;
  };

  const meses = generarMeses();

  return (
    <div className="mt-4 relative">
      <h2 className="text-xl font-semibold mb-2">Gantt de Tareas</h2>

      {/* Controles de vista */}
      <div className="flex space-x-2 mb-4">
        <button 
          onClick={() => setModoVista('medio-dia')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            modoVista === 'medio-dia' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Medio Día
        </button>
        <button 
          onClick={() => setModoVista('dia')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            modoVista === 'dia' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Día
        </button>
        <button 
          onClick={() => setModoVista('semana')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            modoVista === 'semana' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Semana
        </button>
        <button 
          onClick={() => setModoVista('mes')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            modoVista === 'mes' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Mes
        </button>
      </div>

      {tareasGantt.length > 0 ? (
        <div className="border rounded-lg overflow-hidden bg-white">
          {/* Timeline header */}
          <div className="bg-gray-50 border-b p-2">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Timeline</span>
              <span>{fechaMin.getFullYear()} - {fechaMax.getFullYear()}</span>
            </div>
            <div className="flex">
              {meses.map((mes, index) => (
                <div key={index} className="flex-1 text-center text-xs font-medium text-gray-700 border-r border-gray-200 py-1">
                  {mes.toLocaleDateString('es-ES', { month: 'short' })}
                  {mes.getMonth() === 0 && (
                    <div className="text-xs text-gray-500">{mes.getFullYear()}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Tareas */}
          <div className="p-4 space-y-4">
            {tareasGantt.map((tarea) => {
              const duracion = calcularDuracion(tarea.start, tarea.end);
              const offset = calcularDuracion(fechaMin, tarea.start);
              const ancho = (duracion / duracionTotal) * 100;
              const margen = (offset / duracionTotal) * 100;

              // Encontrar la tarea original para el modal
              const tareaOriginal = tareas.find(t => t.id === tarea.id);

              return (
                <div key={tarea.id} className="relative">
                  <div className="flex items-center mb-2">
                    <span className="w-48 text-sm font-medium truncate pr-4">{tarea.name}</span>
                    <div className="flex gap-2 ml-auto">
                      <button
                        onClick={() => tareaOriginal && abrirModalEditar(tareaOriginal)}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarTarea(tarea.id)}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  
                  {/* Timeline container */}
                  <div className="relative h-8 bg-gray-100 rounded overflow-hidden border">
                    {/* Meses background */}
                    <div className="absolute inset-0 flex">
                      {meses.map((_, index) => (
                        <div key={index} className="flex-1 border-r border-gray-200"></div>
                      ))}
                    </div>
                    
                    {/* Task bar */}
                    <div
                      className="absolute h-full bg-purple-500 rounded transition-all duration-300 cursor-pointer hover:bg-purple-600"
                      style={{
                        left: `${margen}%`,
                        width: `${ancho}%`,
                      }}
                      onClick={() => tareaOriginal && abrirModalEditar(tareaOriginal)}
                    >
                      {/* Progress bar */}
                      <div
                        className="absolute h-full bg-green-400 rounded transition-all duration-300"
                        style={{
                          width: `${tarea.progress}%`,
                        }}
                      />
                      
                      {/* Task label */}
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                        {tarea.progress}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 bg-white rounded-lg border">
          No hay tareas para mostrar. Crea una tarea para ver el diagrama de Gantt.
        </div>
      )}

      <Modal
        isOpen={modalAbierto}
        onClose={cerrarModal}
        tarea={tareaSeleccionada}
        onSave={guardarTarea}
        onDelete={eliminarTareaModal}
      />
    </div>
  );
}
