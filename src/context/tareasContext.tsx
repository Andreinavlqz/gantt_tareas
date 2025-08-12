import { createContext, useContext } from "react";
import useTarea from "../hooks/useTarea";
import type { Tarea } from "../types/TareasTypes";

interface TareasContextType {
  tareas: Tarea[];
  crearTarea: (tarea: Tarea) => void;
  editarTarea: (tarea: Tarea) => void;
  eliminarTarea: (id: string) => void;
}

const TareasContext = createContext<TareasContextType | null>(null);

export const TareasProvider = ({ children }: { children: React.ReactNode }) => {
  const { tareas, crearTarea, editarTarea, eliminarTarea } = useTarea();

  return (
    <TareasContext.Provider value={{ tareas, crearTarea, editarTarea, eliminarTarea }}>
      {children}
    </TareasContext.Provider>
  );
};

export const useTareasContext = () => {
  const context = useContext(TareasContext);
  if (!context) {
    throw new Error("useTareasContext must be used within a TareasProvider");
  }
  return context;
};
