import { useState, useEffect } from "react";
import type { Tarea } from "../types/TareasTypes";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  tarea: Tarea | null;
  onSave: (tarea: Tarea) => void;
  onDelete: (id: string) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, tarea, onSave, onDelete }) => {
  const [formData, setFormData] = useState<Tarea>({
    id: "",
    nombre: "",
    comienzo: "",
    final: "",
    progreso: 0,
  });

  useEffect(() => {
    if (tarea) {
      // Modo edición: usar datos de la tarea existente
      setFormData(tarea);
    } else {
      // Modo creación: resetear formulario
      setFormData({
        id: "",
        nombre: "",
        comienzo: new Date().toISOString().split('T')[0],
        final: new Date().toISOString().split('T')[0],
        progreso: 0,
      });
    }
  }, [tarea, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si es una nueva tarea, generar ID
    const tareaParaGuardar = {
      ...formData,
      id: tarea ? tarea.id : Date.now().toString(),
    };
    
    onSave(tareaParaGuardar);
    onClose();
  };

  const handleDelete = () => {
    if (tarea) {
      onDelete(tarea.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {tarea ? "Editar Tarea" : "Nueva Tarea"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la tarea
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de inicio
              </label>
              <input
                type="date"
                value={formData.comienzo}
                onChange={(e) => setFormData({ ...formData, comienzo: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de fin
              </label>
              <input
                type="date"
                value={formData.final}
                onChange={(e) => setFormData({ ...formData, final: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Progreso (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.progreso}
              onChange={(e) => setFormData({ ...formData, progreso: Number(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              {tarea ? "Guardar Cambios" : "Crear Tarea"}
            </button>
            {tarea && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
