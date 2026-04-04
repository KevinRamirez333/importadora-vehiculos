import { Importacion } from "./domain/importacion";

export interface ImportacionRepository{
    crearImportacion(data:Importacion): Promise<number>;
    buscarPorId(id:number): Promise<Importacion|null>;
    listarImportacion():Promise<Importacion[]>;
    editarImportacion(id:number, data:Partial<Importacion>):Promise<void>;
    darDeBaja(id:number):Promise<void>
    activate(id:number):Promise<void>
    buscarPorIdIngreso(id:number): Promise<Importacion|null>;
}

