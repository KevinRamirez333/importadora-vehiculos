import { VehiculoCostoRepositoryMySQL } from "./repositories/implements/mysql/vehiculo_costo.repository.mysql";
import { VehiculoCosto } from "./repositories/domain/vehiculo_costo";
export class VehiculoCostoService {
    private repository=new VehiculoCostoRepositoryMySQL()

    async crear(data:any){
        if(!data.tipo_costo||!data.monto||!data.fecha){
            throw new Error('Faltan colocar datos obligatorios')
        }
        const id=await this.repository.crear(data)

        return{
            message:'Costo creado correctamente ',
            id,
        }
    }
    async buscarPorId(id:number):Promise<VehiculoCosto|null>{
        if(!id) throw new Error('ID requerido')
        const costo= await this.repository.buscarPorId(id)
        if(!costo){
            throw new Error('Costo no encontrado')
        }
        return costo
    }
    async listar():Promise<VehiculoCosto[]>{
        return await this.repository.listar()
    }
    async buscarPorVin(vin:string):Promise<VehiculoCosto[]>{
        if(!vin) throw new Error('VIN requerido')
        const costos = await this.repository.buscarPorVin(vin)
       
        return costos
    }
    async editar(id:number,data:Partial<VehiculoCosto>){
        if(!id) throw new Error('ID requerido')
        const costo = await this.buscarPorId(id)
        if(!costo) throw new Error('Costo no encontrado, no se puede editar')
        await this.repository.editar(id,data)
        return{
            message: 'Costo editado correctamente'
        }
    }
    async anular(id:number){
        if(!id) throw new Error('ID requerido')
        const costo = await this.buscarPorId(id)
        if(!costo) throw new Error('Costo no encontrado, no se puede anular')
        await this.repository.anular(id)
        return{
            message: 'Costo anulado correctamente'
        }
    }
    async activar(id:number){
        if(!id) throw new Error('ID requerido')
        const costo = await this.buscarPorId(id)
        if(!costo) throw new Error('Costo no encontrado, no se puede activar')
        await this.repository.activar(id)        
        return{
            message:'Costo activado correctamente'
        }
    }
}