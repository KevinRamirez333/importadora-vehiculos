export interface IngresoVehiculo {
  id_ingreso?: number
  vin: string
  tipo_ingreso: 'IMPORTACION' | 'COMPRA_LOCAL' | 'RECIBIDO_COMO_PAGO'
  fecha: string
  id_cliente?: number | null
  valor_ingreso: number
}