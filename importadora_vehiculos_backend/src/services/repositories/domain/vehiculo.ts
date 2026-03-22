export interface Vehiculo{
    vin:string
    placa:string
    anio:number
    color:string
    precio_venta: number
    activo?: boolean
    id_marca:number
    id_estado:number
    id_modelo: number
}