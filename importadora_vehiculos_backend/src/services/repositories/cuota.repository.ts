import { PoolConnection } from "mysql2/promise";
import { Cuota } from "./domain/cuota";

export interface CuotaRepository {
    generarCuotas(data:Cuota, connection:PoolConnection):Promise<void>
}