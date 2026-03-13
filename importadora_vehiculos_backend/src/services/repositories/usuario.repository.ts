import {Usuario} from './domain/usuario';

export interface UsuarioRepository {
    create(user:Usuario): Promise<number>;
    findByEmail(email:string): Promise<Usuario|null>;
    findAll(): Promise<Usuario[]>;
    updateUser(id:number, nombre:string, rol:string): Promise<void>;
    desactivarUsuario(id:number): Promise<void>;
    activarUsuario(id:number): Promise<void>;
    obtenerUsuarioPorId(id: number): Promise<Usuario | null>;
    updatePassword(id: number, passwordHash:string): Promise<void>;
}