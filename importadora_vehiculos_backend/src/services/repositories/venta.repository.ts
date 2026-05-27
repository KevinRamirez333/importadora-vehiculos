
import { PoolConnection } from "mysql2/promise";
import { Venta } from "./domain/venta";

export interface VentaRepository{
    create(venta:Venta, connection:PoolConnection):Promise<number>
    findAll():Promise<Venta[]>
    findById(id:number):Promise<Venta|null>
    findByVin(vin:string):Promise<Venta|null>
    anularVenta(id:number): Promise<void>
    buscarVentasPorCliente(id_cliente:number):Promise<any[]>
    EstadoPagadoVenta(id:number):Promise<void>
}