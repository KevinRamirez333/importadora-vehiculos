import { ClienteRepository } from "./repositories/cliente.repository";
import { Cliente } from "./repositories/domain/cliente";
import { ClienteRepositoryMySQL } from "./repositories/implements/mysql/cliente.repository.mysql";

export class ClienteService{
    private clienteRepo: ClienteRepository = new ClienteRepositoryMySQL()

    async crear(cliente:Cliente){
        if(await this.clienteRepo.buscarporNit(cliente.nit)){
            throw new Error("El NIT ya existe")
        }
        if(await this.clienteRepo.buscarporDpi(cliente.dpi)){
            throw new Error("El DPI ya existe")
        }
        const id= await this.clienteRepo.crear(cliente)

         return{
            message: "Cliente creado exitosamente", 
            id
         }
    }
    async buscarPorId(id:number){
        if(!id){
            throw new Error("El ID es requerido")
        }
        const cliente = await this.clienteRepo.buscarPorId(id)
        if(!cliente){
            throw new Error("Cliente no encontrado")
        }
        return cliente
    }
    async buscarPorNit(nit:string){
        if(!nit){
            throw new Error("El NIT es requerido")
        }
        const cliente = await this.clienteRepo.buscarporNit(nit)
        if(!cliente){
            throw new Error("Cliente no encontrado")

        }
        return cliente
    }
    async buscarPorDpi(dpi:string){
        if(!dpi){
            throw new Error("El DPI es requerido")
        }
        const cliente = await this.clienteRepo.buscarporDpi(dpi)

        if(!cliente){
            throw new Error("Cliente no encontrado")
        }
        return cliente
    }
    async listar(){
        return await this.clienteRepo.listar()
    }
    async editar(id:number, cliente: Partial<Cliente>){
        if(!id){
            throw new Error("El ID es requerido")
        }
        const clienteExistente = await this.clienteRepo.buscarPorId(id)
        if(!clienteExistente){
            throw new Error("Cliente no encontrado")
        }
        const clienteNit = await this.clienteRepo.buscarporNit(cliente.nit as string)
        if(clienteNit && clienteNit.id_cliente !=id) {
            throw new Error('El numero de NIT ya existe')
        }
        const clienteDpi=await this.clienteRepo.buscarporDpi(cliente.dpi as string)
        if(clienteDpi&&clienteDpi.id_cliente!=id){
            throw new Error('El numero de DPI ya existe')
        }
        await this.clienteRepo.editar(id,cliente)

        return{
            message: "Cliente actualizado correctamente"
        }
    }
    async desactivar(id:number){
        if(!id){
            throw new Error("El ID es requerido")
        }
        const clienteExistente = await this.clienteRepo.buscarPorId(id)
        if(!clienteExistente){
            throw new Error("Cliente no encontrado")
        }
        await this.clienteRepo.desactivar(id)

        return {
            message: "Cliente desactivado correctamente"
        }
    }
    async activar(id:number){
        if(!id){
            throw new Error("El ID es requerido")
        }
        const clienteExistente = await this.clienteRepo.buscarPorId(id)
        if(!clienteExistente){
            throw new Error("Cliente no encontrado")
        }
        await this.clienteRepo.activar(id)
        return{
            message: "Cliente activado correctamente"
        }
    }
}