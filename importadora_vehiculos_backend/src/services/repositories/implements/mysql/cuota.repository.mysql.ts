import { CuotaRepository } from "../../cuota.repository";
import { Cuota } from "../../domain/cuota";
import connector from "../../../../common/persistence/persistence.mysql"
import { PoolConnection } from "mysql2/promise";
import { RowDataPacket } from 'mysql2';

export class CuotaRepositoryMySQL implements CuotaRepository{
    async generarCuotas(data:Cuota, connection:PoolConnection): Promise<void> {
        const query=`insert into venta_cuota ( interes, fecha_pago, monto, estado, id_venta)
        values (?,?,?,?,?)`
        const dataCuota =[
            data.interes,
            data.fecha_pago,
            data.monto,
            data.estado,
            data.id_venta
        ]
        await connection.query(query,dataCuota)
    }
    async listarCuotasPorVenta(idVenta: number): Promise<Cuota[]> {
        const query = `select vc.*, c.nombre as nombre_cliente from venta_cuota vc
        inner join venta v on vc.id_venta = v.id_venta
        inner join cliente c on v.id_cliente = c.id_cliente
        where vc.id_venta = ?`
        const [rows]= await connector.query(query,[idVenta])
        return rows as Cuota[]

    }
    async pagarCuota(idCuota: number,fechaPagado:string): Promise<void> {
        const query = `update venta_cuota set estado='PAGADO', fecha_pagado =? where id_cuota=?`
        await connector.query(query,[fechaPagado,idCuota])
    }
    async buscarCuotaPorId(idCuota:number): Promise<Cuota>{
        const query =`select * from venta_cuota where id_cuota=?`
        const [rows]= await connector.query<RowDataPacket[]>(query,[idCuota])
        return rows[0] as Cuota
    }
}