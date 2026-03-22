import { RolRepositoryMySQL } from "./repositories/implements/mysql/rol.repository.mysql";
import { RolRepository } from "./repositories/rol.repository";

export class RolService{
    private rolRepository:RolRepository= new RolRepositoryMySQL()

    async create(nombre:string){
        if(!nombre){
            throw new Error("Nombre de rol es requerido")
        }
        const id= await this.rolRepository.create({nombre})

        return{
            message:"Rol creado correctamente",
            id
        }
    }
    async findById(id:number){
        const rol = await this.rolRepository.findById(id)

        if(!rol){
            throw new Error("Rol no encontrado")
        }

        return rol
    }
    async findAll(){
        return await this.rolRepository.findAll()
    }
    async editarRol(id:number,nombre:string){
        if(!nombre){
            throw new Error("El nombre es requerido")
        }
        await this.rolRepository.update(id,{nombre})
        return{
            message:"Rol actualizado correctamente"
        }
    }
    async darDeBaja(id:number){
        await this.rolRepository.deactivate(id)

        return{
            message:"Rol desactivado correctamente"
        }
    }
    async activar(id:number){
        await this.rolRepository.activate(id)
        return{
            message:"Rol activado correctamente"
        }
    }
}