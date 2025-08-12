export type Tarea = {
    id: string
    nombre: string
    comienzo: string
    final: string
    progreso: number
  
}

export type Action = {
    type: 'ADD_TAREA' | 'EDIT_TAREA' | 'DELETE_TAREA'
}