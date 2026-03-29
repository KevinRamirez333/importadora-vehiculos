import { IngresoVehiculo } from "./repositories/domain/ingreso_vehiculo";
import { IngresoVehiculoRepositoryMySQL } from "./repositories/implements/mysql/ingreso_vehiculo.repository.mysql";
import { VehiculoRepositoryMySQL } from "./repositories/implements/mysql/vehiculo.repository.mysql";

export class IngresoVehiculoService {

  private ingresoRepo = new IngresoVehiculoRepositoryMySQL()
  private vehiculoRepo = new VehiculoRepositoryMySQL()

  async crearIngreso(data: any) {

    // Validar VIN
    const vehiculo = await this.vehiculoRepo.findByVin(data.vin)

    if (!vehiculo) {
      throw new Error("Vehículo no existe")
    }

    // Validar tipo
    const tiposValidos = ['IMPORTACION','COMPRA_LOCAL','RECIBIDO_COMO_PAGO']

    if (!tiposValidos.includes(data.tipo_ingreso)) {
      throw new Error("Tipo de ingreso inválido")
    }

    // Validación especial
    if (data.tipo_ingreso === 'RECIBIDO_COMO_PAGO' && !data.id_cliente) {
      throw new Error("Debe especificar cliente")
    }

    const id = await this.ingresoRepo.create(data)

    return {
      message: "Ingreso registrado correctamente",
      id
    }
  }

  async listar() {
    return await this.ingresoRepo.findAll()
  }
  async BuscarPorId(id:number){

    const result = await this.ingresoRepo.findById(id)

    if(!result){
        throw new Error("Ingreso no encontrado")
    }
    return result;
  }
async editarIngreso(id: number, data: any) {

  const ingreso = await this.ingresoRepo.findById(id)

  if (!ingreso) {
    throw new Error("Ingreso no existe")
  }

  const tiposValidos = ['IMPORTACION','COMPRA_LOCAL','RECIBIDO_COMO_PAGO']

  if (!tiposValidos.includes(data.tipo_ingreso)) {
    throw new Error("Tipo inválido")
  }

  if (data.tipo_ingreso === 'RECIBIDO_COMO_PAGO' && !data.id_cliente) {
    throw new Error("Debe indicar cliente")
  }

  await this.ingresoRepo.update(id, data)

  return {
    message: "Ingreso actualizado correctamente"
  }
}
async anular(id:number){
  await this.ingresoRepo.deactivate(id);

  return{
    message: "Ingreso de vehiculo anulado correctamente"
  }
}
async activar(id:number){
  await this.ingresoRepo.activate(id);
  return{
    message:"Ingreso de vehiculo activado correctamente"
  }
}
}