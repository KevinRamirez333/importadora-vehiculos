export interface Usuario {
    id_usuario?: number;
    nombre: string;
    email:string;
    password_hash: string;
    id_rol:number ;
    activo: boolean;
    rol?:string;
}