import { VehiculoRepository } from "./repositories/vehiculo.repository";
import { VehiculoRepositoryMySQL } from "./repositories/implements/mysql/vehiculo.repository.mysql";
import { Vehiculo } from "./repositories/domain/vehiculo";
import { MarcaRepositoryMySQL } from "./repositories/implements/mysql/marca.repository.mysql";
import { EstadoRepositoryMySQL } from "./repositories/implements/mysql/estado.repository.mysql";
import { IngresoVehiculoService } from "./ingreso_vehiculo.service";
import { VehiculoCostoService } from "./vehiculo_costo.service";


export class VehiculoService{
    private vehiculoRepo:VehiculoRepository=new VehiculoRepositoryMySQL()
    private marcaRepo=new MarcaRepositoryMySQL()
    private estadoRepo=new EstadoRepositoryMySQL()
    private ingresoRepo= new IngresoVehiculoService()
    private costoRepo = new VehiculoCostoService()

    async crearVehiculo(data:Vehiculo){
        if(!data.vin){
            throw new Error("VIN es requerido")
        }
        const existe= await this.vehiculoRepo.findByVin(data.vin)
        if(existe){
            throw new Error("El vehiculo ya existe")
        }
        const marca = await this.marcaRepo.findById(data.id_marca)
        if(!marca) throw new Error("Marca no existe")

        const estado = await this.estadoRepo.findById(data.id_estado)
        if(!estado) throw new Error("Estado no existe")
        
        await this.vehiculoRepo.create(data)

        return{message:"Vehiculo creado exitosamente"}

    }
async listarVehiculos(filtros?: any) {
  return await this.vehiculoRepo.findAll(filtros)
}
    async buscarPorVin(vin:string){
        const vehiculo= await this.vehiculoRepo.findByVin(vin)

        if(!vehiculo){
            throw new Error("Vehiculo no encontrado")
        }
        return vehiculo
    }
    async editarVehiculo(vin:string,data:Vehiculo){
        if (!vin){
            throw new Error("VIN es requerido")
        }

        const busqueda= await this.vehiculoRepo.findByVin(vin);
        if(!busqueda){
            throw new Error("No existe datos asociados al numero de VIN")
        }
        await this.vehiculoRepo.update(vin,data)

        return{message:"Vehiculo actualizado exitosamente"}
    }
    async darDeBaja(vin:string){
        await this.vehiculoRepo.deactivate(vin)
        return {message:"Vehiculo desactivado"}
    }
    async activar(vin:string){
        await this.vehiculoRepo.activate(vin)
        return{message:"Vehiculo activado"}
    }
    async obtenerCostoTotal(vin:string){
        const ingreso = await this.ingresoRepo.obtenerPorVin(vin)
        const costos = await this.costoRepo.buscarPorVin(vin)

        const totalCostos = costos.reduce((sum,c)=> sum+Number(c.monto), 0)
        return{
            ingreso: ingreso.valor_ingreso,
            costos:totalCostos,
            total: Number(ingreso.valor_ingreso)+totalCostos

        }
    }
    async actualizarPrecio(vin:string, precio:number, porcentaje:number){
        if(!vin) throw new Error('VIN es requerido')
        if(!precio) throw new Error('Valor de precio de venta es requerido')
        await this.vehiculoRepo.actualizarPrecio(vin,precio,porcentaje)
        return{
            message:"Precio de venta y estado actualizado correctamente "
        }
    }
}