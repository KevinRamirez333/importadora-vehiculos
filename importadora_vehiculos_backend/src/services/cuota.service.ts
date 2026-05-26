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
    async listarCuotasPorVenta(idVenta:number){
        if(!idVenta){
            throw new Error('ID de venta es requerido')
        }
        const result = await this.cuotaRepo.listarCuotasPorVenta(idVenta)
        return result
    }
    async buscarCuotaPorId(idCuota:number){
        if(!idCuota){
            throw new Error('ID de cuota es requerido')
        }
        
        const result = await this.cuotaRepo.buscarCuotaPorId(idCuota)
        return result
    }
    async pagarCuota(idCuota: number, fechaPagado:string){
        if(!idCuota || !fechaPagado){
            throw new Error('ID de cuota y fecha de pago son requeridos')
        }
        const cuota = await this.cuotaRepo.buscarCuotaPorId(idCuota)
        if(!cuota){
            throw new Error('Cuota no encontrada')
        }
        if(cuota.estado==='PAGADO'){
            throw new Error('La cuota ya ha sido pagada')
        }
        await this.cuotaRepo.pagarCuota(idCuota, fechaPagado)
        return {
            message: 'Cuota pagada correctamente'
        }
    }
}