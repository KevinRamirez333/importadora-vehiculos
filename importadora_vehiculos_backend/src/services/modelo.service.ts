import { ModeloRepositoryMySQL } from "./repositories/implements/mysql/modelo.repository.mysql";
import { MarcaRepositoryMySQL } from "./repositories/implements/mysql/marca.repository.mysql";
import { error } from "node:console";

export class ModeloService{
    private modeloRepo = new ModeloRepositoryMySQL()
    private marcaRepo = new MarcaRepositoryMySQL()

    async crearModelo(nombre: string, id_marca: number) {

        if (!nombre) {
        throw new Error("Nombre requerido")
        }

        const marca = await this.marcaRepo.findById(id_marca)

        if (!marca) {
        throw new Error("Marca no existe")
        }

        const id = await this.modeloRepo.create({ nombre, id_marca })

        return {
        message: "Modelo creado",
        id
        }
    }

  async listarModelos() {
    return await this.modeloRepo.findAll()
  }
  async buscarPorId(id:number){
    const modelo= await this.modeloRepo.findById(id)

    if(!modelo){
      throw new Error("Modelo no encontrado")
    }
    return modelo
  }
  async listarPorMarca(id_marca: number) {
    return await this.modeloRepo.findByMarca(id_marca)
  }

  async editarModelo(id: number, nombre: string, id_marca: number) {

    await this.modeloRepo.update(id, { nombre, id_marca })

    return { message: "Modelo actualizado" }
  }

  async desactivar(id: number) {
    await this.modeloRepo.deactivate(id)
    return { message: "Modelo desactivado" }
  }

  async activar(id: number) {
    await this.modeloRepo.activate(id)
    return { message: "Modelo activado" }
  }

}
