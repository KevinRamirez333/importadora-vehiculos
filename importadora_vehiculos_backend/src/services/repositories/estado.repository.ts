import {Estado} from "./domain/estado"

export interface EstadoRepository {
    create(estado: Estado): Promise<number>;
    findById(id:number):Promise<Estado | null>;
    findAll(): Promise<Estado[]>;
    update(id:number, estado:Estado):Promise<void>;
    deactivate(id:number): Promise<void>;
    activate(id:number):Promise<void>;
}