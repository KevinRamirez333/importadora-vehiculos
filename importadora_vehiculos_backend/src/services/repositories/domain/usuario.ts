export interface Usuario {
    id?: number;
    nombre: string;
    email:string;
    password_hash: string;
    rol: 'ADMIN' | 'SUPERVISOR' | 'VENDEDOR';
    activo: boolean;
}