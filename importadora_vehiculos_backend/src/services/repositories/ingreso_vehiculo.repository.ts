import { IngresoVehiculo } from "./domain/ingreso_vehiculo"

export interface IngresoVehiculoRepository {

  create(data: IngresoVehiculo): Promise<number>

  findAll(): Promise<IngresoVehiculo[]>

  findById(id: number): Promise<IngresoVehiculo | null>

  update(id:number,data:IngresoVehiculo):Promise<void>

  actualizarValorIngreso(id:number,valor:number):Promise<void>

  deactivate(id:number):Promise<void>

  activate (id:number):Promise<void>

}