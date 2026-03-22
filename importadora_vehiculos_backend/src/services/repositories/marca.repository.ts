import { Marca } from "./domain/marca";
export interface MarcaRepository{
    create(marca: Marca): Promise<number>
    findById(id:number ): Promise<Marca | null>
    findAll(): Promise<Marca[]>
    update(id:number, marca: Marca): Promise<void>
    deactivate(id:number): Promise<void>
    activate(id:number):Promise<void>
}