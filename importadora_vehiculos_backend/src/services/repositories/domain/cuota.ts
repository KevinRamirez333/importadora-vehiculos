export interface Cuota {
    id_cuota?:number
    fecha_pago:Date
    monto: number
    interes: number
    estado: 'PENDIENTE'|'PAGADO'
    id_venta: number
    nombre_cliente?:string
}