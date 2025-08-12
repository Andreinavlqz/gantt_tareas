import type { Tarea } from "../types/TareasTypes"

type Action = 
  | { type: "Nueva_tarea"; payload: Tarea }
  | { type: "Editar_tarea"; payload: Tarea }
  | { type: "Eliminar_tarea"; payload: string }

const initialState : Tarea[] = []

function tareasReducer(state: Tarea[] = initialState, action: Action): Tarea[] {

    switch (action.type) {
        case "Nueva_tarea":
            console.log("Nueva tarea al reducer", action.payload)
            return [...state, action.payload]
        
        case "Editar_tarea":
            console.log("Editar tarea en reducer", action.payload)
            return state.map(tarea => 
                tarea.id === action.payload.id ? action.payload : tarea
            )
        
        case "Eliminar_tarea":
            console.log("Eliminar tarea del reducer", action.payload)
            return state.filter(tarea => tarea.id !== action.payload)
        
        default:
            return state
    }
}

export default tareasReducer