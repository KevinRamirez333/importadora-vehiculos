export interface Venta {
    id_venta?: number
    fecha:string
    vin:string
    id_cliente:string
    tipo_pago: 'CONTADO'|'CREDITO'
    cuotas?: number | null
    precio_venta: number
    estado: 'PENDIENTE'|'PAGADO'|'ANULADO'
}