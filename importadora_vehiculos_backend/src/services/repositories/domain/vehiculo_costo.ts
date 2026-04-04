export interface VehiculoCosto {
    id_costo?: number
    vin: string
    tipo_costo: 'TRASPASO'|'TALLER'|'IMPUESTO'|'PLACAS' |'TRAMITES'|'OTRO'
    descripcion: string
    monto: number
    fecha: string
    estado?: 'ACTIVO'|'ANULADO'
}

