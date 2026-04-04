import { ImportacionRepositoryMySQL } from "./repositories/implements/mysql/importacion.repository.mysql";
import { Importacion } from "./repositories/domain/importacion";
import { IngresoVehiculoService } from "./ingreso_vehiculo.service";

export class ImportacionService {
    private repo = new ImportacionRepositoryMySQL();
    private ingresoRepo = new IngresoVehiculoService()

    async crearImportacion(data:Importacion){
        if(!data.id_ingreso) throw new Error("Ingreso requerido")
        if(!data.costo_dolares||!data.tipo_cambio) throw new Error("Datos de importacion incompletos")
        const existe=await this.repo.buscarPorIdIngreso(data.id_ingreso)
    if(existe) throw new Error("Ya existe una importacion referente a este ingreso de vehiculo")
        const valorQ = data.costo_dolares * data.tipo_cambio
         const id = await this.repo.crearImportacion(data)
         await this.ingresoRepo.actualizarValorIngreso(data.id_ingreso,valorQ)
         return{message:"Importacion creada exitosamente",
            id
         }

    }
    async buscarPorId(id:number):Promise<Importacion|null>{
        if(!id) throw new Error("ID requerido")
        const data = await this.repo.buscarPorId(id)
        if(!data) throw new Error("Importacion no encontrada")
        return data
    }
    async listarImportacion():Promise<Importacion[]>{
        return await this.repo.listarImportacion()
    }
    async editarImportacion(id:number,data:Partial<Importacion>){
        if(!id) throw new Error("ID requerido")
        const importacion = await this.buscarPorId(id)
        if(!importacion) throw new Error("Importacion no encontrada, no se puede editar")
         await this.repo.editarImportacion(id,data)
        const valorQ = (data.costo_dolares??importacion.costo_dolares) * (data.tipo_cambio??importacion.tipo_cambio)

        await this.ingresoRepo.actualizarValorIngreso(importacion.id_ingreso,valorQ)
        return{
            message: "Importacion editada correctamente"
        }
    }

    async darDeBaja(id:number){
        if(!id) throw new Error("ID requerido")
        const importacion = await this.buscarPorId(id)
        if(!importacion) throw new Error("Importacion no encontrada, no se puede dar de baja")
        await this.repo.darDeBaja(id)
        return{
            message: "Importacion anulada correctamente"
        }
    }
    async activate(id:number){
         if(!id) throw new Error("ID requerido")
        const importacion = await this.buscarPorId(id)
        if(!importacion) throw new Error("Importacion no encontrada, no se puede activar")
        await this.repo.activate(id)

        return{
            message: "Importacion activada correctamente"
        }
    }
}