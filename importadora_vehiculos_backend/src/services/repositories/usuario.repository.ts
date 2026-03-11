import {Usuario} from './domain/usuario';

export interface UsuarioRepository {
    create(user:Usuario): Promise<number>;
    findByEmail(email:string): Promise<Usuario|null>;
}