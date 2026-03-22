import { Modelo } from "./domain/modelo";

export interface ModeloRepository{
    create(modelo:Modelo):Promise<number>
    findById(id:number):Promise<Modelo | null>
    findAll():Promise<Modelo[]>
    findByMarca(id_marca:number):Promise<Modelo[]>
    update(id:number,modelo:Modelo):Promise<void>
    deactivate(id:number):Promise<void>
    activate(id:number):Promise<void>
}