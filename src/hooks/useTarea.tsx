import { useReducer, useEffect } from "react"
import tareasReducer from "../reducers/tareasReducers"
import type { Tarea } from "../types/TareasTypes"

// Cargar tareas desde localStorage
const cargarTareas = (): Tarea[] => {
  try {
    const tareasGuardadas = localStorage.getItem('tareas');
    return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
  } catch (error) {
    console.error('Error al cargar tareas:', error);
    return [];
  }
};

// Guardar tareas en localStorage
const guardarTareas = (tareas: Tarea[]) => {
  try {
    localStorage.setItem('tareas', JSON.stringify(tareas));
  } catch (error) {
    console.error('Error al guardar tareas:', error);
  }
};

export default function useTarea() {
  const [tareas, dispatch] = useReducer(tareasReducer, cargarTareas())
   
  const crearTarea = (tarea: Tarea) => {
    dispatch({type: "Nueva_tarea", payload: tarea})
  }

  const editarTarea = (tareaActualizada: Tarea) => {
    dispatch({type: "Editar_tarea", payload: tareaActualizada})
  }

  const eliminarTarea = (id: string) => {
    dispatch({type: "Eliminar_tarea", payload: id})
  }

  // Guardar tareas en localStorage cuando cambien
  useEffect(() => {
    guardarTareas(tareas);
  }, [tareas]);

  return {tareas, crearTarea, editarTarea, eliminarTarea}
}