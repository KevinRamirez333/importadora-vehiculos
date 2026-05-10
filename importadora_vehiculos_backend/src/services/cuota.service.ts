import { CuotaRepositoryMySQL } from "./repositories/implements/mysql/cuota.repository.mysql";
import { CuotaRepository } from "./repositories/cuota.repository";

interface GenerarCuotas {
    id_venta:number,
    precio_venta: number,
    cuotas:number
}

export class CuotaService {
    private cuotaRepo:CuotaRepository = new CuotaRepositoryMySQL()

    async crear(data:GenerarCuotas){
        if(!data.precio_venta||!data.cuotas||!data.id_venta){
            throw new Error ('Datos incompletos')
        }
        const interes = 0.15
        const enganche = 0.2

        const total = data.precio_venta *(1+interes)
        const saldoFinanciado = total-enganche

        
        await this.cuotaRepo.generarCuotas(data)
    }
}