import { useState, useEffect } from "react"
import { useTareasContext } from "../context/tareasContext"
import Modal from "./Modal"
import type { Tarea } from "../types/TareasTypes"

function Formulario() {
  const { tareas, crearTarea, editarTarea, eliminarTarea } = useTareasContext()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null)
  const [modo, setModo] = useState<'crear' | 'editar'>('crear')

  const [nombre, setNombre] = useState<string>('')
  const [comienzo, setComienzo] = useState<Date>(new Date())
  const [final, setFinal] = useState<Date>(new Date())
  const [progreso, setProgreso] = useState<number>(0)

  const abrirModalCrear = () => {
    setTareaSeleccionada(null)
    setModo('crear')
    setModalAbierto(true)
  }

  const abrirModalEditar = () => {
    if (tareaSeleccionada) {
      setModo('editar')
      setModalAbierto(true)
    }
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setTareaSeleccionada(null)
  }

  const guardarTarea = (tarea: Tarea) => {
    if (modo === 'crear') {
      crearTarea(tarea)
    } else {
      editarTarea(tarea)
    }
  }

  const eliminarTareaModal = (id: string) => {
    eliminarTarea(id)
    setTareaSeleccionada(null)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fechaComienzoFormateada = comienzo.toISOString().split('T')[0]
    const fechaFinalFormateada = final.toISOString().split('T')[0]
    const nuevaTarea = {
      id: Date.now().toString(),
      comienzo: fechaComienzoFormateada,
      final: fechaFinalFormateada,
      progreso: progreso || 0,
      nombre: nombre,
    }
    console.log(nuevaTarea)
    crearTarea(nuevaTarea)
    resetForm()
  }

  const resetForm = () => {
    setNombre('')
    setComienzo(new Date())
    setFinal(new Date())
    setProgreso(0)
    setModo('crear')
    setTareaSeleccionada(null)
  }

  return (
    <>
      <form className="flex flex-nowrap items-center gap-3 p-4 bg-white shadow-md rounded-lg border border-gray-200 w-full overflow-x-auto"
        onSubmit={handleSubmit}
      >
        {/* Input para nuevo proyecto */}
        {modo === 'crear' ? (
          <input
            type="text"
            placeholder="Nombre del proyecto"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-48 p-2 border border-amber-500 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        ) : (
          <select
            className="w-56 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
            value={tareaSeleccionada?.id || ''}
            onChange={(e) => {
              const tarea = tareas.find(t => t.id === e.target.value)
              setTareaSeleccionada(tarea || null)
            }}
          >
            <option value="">--- Seleccionar Proyecto ---</option>
            {tareas.map((tarea) => (
              <option key={tarea.id} value={tarea.id}>
                {tarea.nombre}
              </option>
            ))}
          </select>
        )}

        {/* Campos de fecha */}
        <input
          type="date"
          required
          value={comienzo.toISOString().split('T')[0]}
          onChange={(e) => setComienzo(new Date(e.target.value))}
          className="w-40 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <input
          type="date"
          required
          value={final.toISOString().split('T')[0]}
          onChange={(e) => setFinal(new Date(e.target.value))}
          className="w-40 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        {/* Campo de progreso */}
        <div className="relative w-24">
          <input
            type="number"
            min={0}
            max={100}
            placeholder="Progreso"
            value={progreso}
            onChange={(e) => setProgreso(Number(e.target.value))}
            className="w-full p-2 pr-8 border border-gray-300 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 font-medium">%</span>
        </div>

        <div className="flex items-center gap-3 flex-none">
          {/* Crear / Editar */}
          <button
            type="submit"
            className="inline-flex items-center justify-center h-9 px-3 text-sm font-medium
                       bg-amber-500 text-white rounded hover:bg-amber-600 transition
                       whitespace-nowrap flex-none w-36"
          >
            {modo === 'crear' ? 'Crear Tarea' : 'Editar Tarea'}
          </button>

          {/* Eliminar: si no está en editar, se reemplaza por un espacio vacío del mismo tamaño */}
          {modo === 'editar' ? (
            <button
              type="button"
              onClick={() => tareaSeleccionada && eliminarTarea(tareaSeleccionada.id)}
              className="inline-flex items-center justify-center h-9 px-3 text-sm font-medium
                         bg-red-500 text-white rounded hover:bg-red-600 transition
                         whitespace-nowrap flex-none w-28"
            >
              Eliminar
            </button>
          ) : (
            <div className="w-28"></div> // placeholder vacío
          )}

          {/* Toggle */}
          <button
            type="button"
            onClick={() => setModo(modo === 'crear' ? 'editar' : 'crear')}
            className="inline-flex items-center justify-center h-9 px-3 text-sm font-medium
                       bg-gray-600 text-white rounded hover:bg-gray-700 transition
                       whitespace-nowrap flex-none w-44"
          >
            {modo === 'crear' ? 'Cambiar a editar' : 'Cambiar a crear'}
          </button>
        </div>
      </form>

      <Modal
        isOpen={modalAbierto}
        onClose={cerrarModal}
        tarea={tareaSeleccionada}
        onSave={guardarTarea}
        onDelete={eliminarTareaModal}
      />
    </>
  )
}

export default Formulario;