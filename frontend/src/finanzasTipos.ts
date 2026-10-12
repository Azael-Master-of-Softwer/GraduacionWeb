export type ResumenFinanzas = {
  aportaciones: number
  ingresosActividades: number
  egresos: number
  disponible: number
}

export type Actividad = {
  id: number
  nombre: string
  descripcion: string
  meta: number | null
  fecha: string | null
  estado: string
  ingresos: number
  egresos: number
  neto: number
}

export type Movimiento = {
  id: number
  tipo: string
  monto: number
  fecha: string
  concepto: string
  actividadId: number | null
  actividad: string | null
  registradoPor: string | null
}
