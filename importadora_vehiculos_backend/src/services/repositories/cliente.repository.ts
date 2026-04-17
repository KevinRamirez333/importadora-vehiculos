import { Cliente } from "./domain/cliente";

export interface ClienteRepository{
    crear(cliente:Cliente):Promise<number>
    buscarPorId(id:number):Promise<Cliente|null>
    buscarporNit(nit:string):Promise<Cliente|null>
    buscarporDpi(dpi:string):Promise<Cliente|null>
    listar():Promise<Cliente[]>
    editar(id:number,cliente:Partial<Cliente>):Promise<void>
    desactivar(id:number):Promise<void>
    activar(id:number):Promise<void>
}