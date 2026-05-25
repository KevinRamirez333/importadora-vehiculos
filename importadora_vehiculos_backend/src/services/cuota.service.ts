import { CuotaRepositoryMySQL } from "./repositories/implements/mysql/cuota.repository.mysql";
import { CuotaRepository } from "./repositories/cuota.repository";
import { PoolConnection } from "mysql2/promise";

interface GenerarCuotas {
    id_venta:number,
    saldo_financiado: number,
    cuotas:number
    interes:number
}

export class CuotaService {
    private cuotaRepo:CuotaRepository = new CuotaRepositoryMySQL()

    async crear(data:GenerarCuotas, connection:PoolConnection){
        if(!data.saldo_financiado||!data.cuotas||!data.id_venta){
            throw new Error ('Datos incompletos')
        }
        const saldoFinanciado= data.saldo_financiado
        const montoCuota = saldoFinanciado/data.cuotas


        const hoy = new Date()

        for(let i=1; i<=data.cuotas; i++){
            const fechaPago = new Date(hoy)
            fechaPago.setMonth(fechaPago.getMonth()+i)

            await this.cuotaRepo.generarCuotas({
                fecha_pago: fechaPago,
                monto: montoCuota,
                interes: data.interes,
                estado: 'PENDIENTE',
                id_venta: data.id_venta

            }, connection)
        }
        return {
            message: 'Cuotas creadas correctamente'
        } 
    }
}