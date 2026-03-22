import { Vehiculo } from "./domain/vehiculo";

export interface VehiculoRepository{
    create(vehiculo:Vehiculo):Promise<void>
    findByVin(vin:string):Promise<Vehiculo|null>
    findAll():Promise<Vehiculo[]>
    update(vin:string,vehiculo:Vehiculo):Promise<void>
    deactivate(vin:string):Promise<void>
    activate(vin:string):Promise<void>
}
