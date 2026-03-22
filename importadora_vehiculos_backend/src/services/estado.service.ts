import { EstadoRepository } from "./repositories/estado.repository";
import { EstadoRepositoryMySQL } from "./repositories/implements/mysql/estado.repository.mysql";
import { Estado } from "./repositories/domain/estado";

export class EstadoService {
    private estadoRepository: EstadoRepository = new EstadoRepositoryMySQL()

    async crearEstado(nombre:string){
        if(!nombre){
            throw new Error("El nombre es requerido")
        }
        const id = await this.estadoRepository.create({nombre})

        return {
            message: "Estado creado exitosamente",
            id
        }
    }
    async listarEstados(){
        return await this.estadoRepository.findAll()
    }

    async buscarPorId(id:number){
        const estado = await this.estadoRepository.findById(id)

        if(!estado){
            throw new Error("Estado no encontrado")
        }
        return estado
    }

    async editarEstado(id:number, nombre:string){
        if(!nombre){
            throw new Error("El nombre es requerido")
        }
        await this.estadoRepository.update(id,{nombre})

        return{
            message: "Estado actualizado exitosamente"
        }
    }
    async darDeBaja(id:number){
        await this.estadoRepository.deactivate(id)

        return{
            message: "Estado dado de baja exitosamente"
        }
    }
    async activar(id:number){
        await this.estadoRepository.activate(id)

        return{
            message:"Estado activado exitosamente"
        }
    }

}