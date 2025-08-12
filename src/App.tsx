import { TareasProvider } from "./context/tareasContext";
import Formulario from "./components/Formulario";
import GanttTareas from "./components/GanttTareas";

export default function App() {
  return (
    <TareasProvider>
      <div className="flex justify-center pt-10 min-h-screen bg-slate-300">
        <div className="w-full bg-slate-200 rounded shadow-md">
          <h1 className="text-2xl mb-4 text-center">Gestor de Tareas</h1>
          <div className="w-11/12 mx-auto">
            <Formulario />
            <GanttTareas />
          </div>
        </div>
      </div>
    </TareasProvider>
  );
} 