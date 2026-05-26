import { PoolConnection } from "mysql2/promise";
import { Cuota } from "./domain/cuota";

export interface CuotaRepository {
    generarCuotas(data:Cuota, connection:PoolConnection):Promise<void>
    listarCuotasPorVenta(idVenta:number):Promise<Cuota[]>
    pagarCuota(idCuota: number,fechaPagado:string): Promise<void> 
    buscarCuotaPorId(idCuota:number): Promise<Cuota>
}