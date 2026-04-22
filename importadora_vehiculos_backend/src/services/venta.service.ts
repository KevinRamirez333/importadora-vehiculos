import { Venta } from "./repositories/domain/venta";
import { VentaRepositoryMySQL } from "./repositories/implements/mysql/venta.repository.mysql";
import connector from '../common/persistence/persistence.mysql'
import { VehiculoService } from "./vehiculo.service";
export class VentaService {
    private ventaRepo =  new VentaRepositoryMySQL()
    private vehiculoService = new VehiculoService()
    

    async crear(venta:Venta){
        const connection = await connector.getConnection();
        try{
            if(!venta.vin){
                throw new Error("VIN es requerido")
            }
            if(!venta.id_cliente){
                throw new Error('Cliente es requerido')
            }
            await connection.beginTransaction();
            const vehiculo = await this.vehiculoService.buscarPorVin(venta.vin)
            if(vehiculo.id_estado===3 || vehiculo.id_estado===1){
                throw new Error('Este vehiculo no esta disponible')
            }
            await this.ventaRepo.create(venta);
            await this.vehiculoService.estadoVendido(venta.vin);

            await connection.commit()

            return{message:'Venta guardada correctamente'}
        } catch(error){
            await connection.rollback()
            throw error 

        } finally{
             connection.release()
        }
    }
    async listarVentas() {
        return await this.ventaRepo.findAll()
    }
    async buscarPorId(id:number){
        if(!id){
            throw new Error('ID de venta es requerido')
        }

        const venta = await this.ventaRepo.findById(id)
        if(!venta){
            throw new Error('No se encontra ninguna venta asociada al ID')
        }
        return venta
    }
    async buscarPorVin(vin:string){
        if(!vin){
            throw new Error('VIN es requerido')
        }
        const venta = await this.ventaRepo.findByVin(vin)
        if(!venta){
            throw new Error('No se encontro ninguna venta asociada al VIN')
        }
        return venta

    }
    async anularVenta(id:number){
        if(!id){
            throw new Error('ID es requerido')

        }
        const venta = await this.ventaRepo.findById(id)
        if(!venta){
            throw new Error('Venta no encontrada')
        }
        await this.ventaRepo.anularVenta(id)
        return{message:'Venta anulada correctamente'}
    }
}