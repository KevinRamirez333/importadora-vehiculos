export interface Cuota {
    id_cuota?:number
    fecha_pago:string
    monto: number
    interes: number
    estado: 'PENDIENTE'|'PAGADO'
    id_venta: number
}