import { PoolConnection } from "mysql2/promise";
import { Vehiculo } from "./domain/vehiculo";

export interface VehiculoRepository{
    create(vehiculo:Vehiculo):Promise<void>
    findByVin(vin:string):Promise<Vehiculo|null>
    findAll(filtros?: any): Promise<any[]>
    update(vin:string,vehiculo:Vehiculo):Promise<void>
    deactivate(vin:string):Promise<void>
    activate(vin:string):Promise<void>
    actualizarPrecio(vin:string,precio:number, porcentaje:number):Promise<void>
    estadoVendido(vin:string, connection:PoolConnection):Promise<void>
}
