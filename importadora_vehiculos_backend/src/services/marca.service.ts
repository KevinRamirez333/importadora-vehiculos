import { MarcaRepository } from "./repositories/marca.repository";
import { MarcaRepositoryMySQL } from "./repositories/implements/mysql/marca.repository.mysql";

export class MarcaService{
    private marcaRepository: MarcaRepository = new MarcaRepositoryMySQL()

    async create(nombre: string){
        if (!nombre){
            throw new Error("El nombre es requerido")
        }

        const id = await this.marcaRepository.create({nombre})
        
        return{
        message:"Marca creada correctamente",
        id
        }
    }
    async listarMarcas(){
        return await this.marcaRepository.findAll()
    }
    async buscarPorId(id:number){
        const marca = await this.marcaRepository.findById(id)

        if(!marca){
            throw new Error("Marca no encontrada")
        }
        return marca
    }
    async editarMarca(id:number, nombre:string){
        if(!nombre){
            throw new Error("El nombre es requerido")
        }
        await this.marcaRepository.update(id,{nombre})

        return{
            message: "Marca actualizada correctamente"
        }
    }
    async darDeBaja(id:number){
        await this.marcaRepository.deactivate(id)

        return{
            message:"Marca desactivada correctamente"
        }
    }
    async activar(id:number){
        await this.marcaRepository.activate(id)

        return{
            message:"Marca activada correctamente"
        }
    }
}