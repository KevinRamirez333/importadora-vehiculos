export interface Venta {
    id_venta?: number
    fecha:Date
    vin:string
    id_cliente:number
    tipo_pago: 'CONTADO'|'CREDITO'
    cuotas?: number | null
    precio_venta?: number
    estado: 'PENDIENTE'|'PAGADO'|'ANULADO'
    enganche?: number
    saldo_financiado?: number
    nombre?:string
    apellido?:string
    nit:number
    marca?:string
    modelo?:string
    vehiculo_anio?:number
    placa?:string
}