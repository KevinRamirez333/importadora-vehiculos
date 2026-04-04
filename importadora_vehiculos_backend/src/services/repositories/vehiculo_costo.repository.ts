import { VehiculoCosto } from "./domain/vehiculo_costo"
export interface VehiculoCostoRepository {
    crear(data:VehiculoCosto):Promise<number>
    buscarPorId(id:number):Promise<VehiculoCosto|null>
    listar():Promise<VehiculoCosto[]>
    buscarPorVin(vin:string):Promise<VehiculoCosto[]>
    editar(id:number, data:Partial<VehiculoCosto>):Promise<void>
    anular(id:number):Promise<void>
    activar(id:number):Promise<void>
}