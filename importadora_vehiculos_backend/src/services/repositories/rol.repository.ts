import { Rol } from "./domain/rol";

export interface RolRepository{
    create(rol:Rol):Promise<number>
    findById(id:number):Promise<Rol|null>
    findAll():Promise<Rol[]>
    update(id:number,rol:Rol):Promise<void>
    deactivate(id:number):Promise<void>
    activate(id:number):Promise<void>
}