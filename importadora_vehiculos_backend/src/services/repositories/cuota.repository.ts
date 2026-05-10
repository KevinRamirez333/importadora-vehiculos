import { Cuota } from "./domain/cuota";

export interface CuotaRepository {
    generarCuotas(data:Cuota):Promise<void>
}