import { VehiculoCosto } from "../../domain/vehiculo_costo";
import { VehiculoCostoRepository } from "../../vehiculo_costo.repository";
import connector from "../../../../common/persistence/persistence.mysql"

export class VehiculoCostoRepositoryMySQL implements VehiculoCostoRepository{
    async crear(data: VehiculoCosto): Promise<number> {
        const query = `insert into vehiculo_costo
        (vin,tipo_costo,descripcion,monto,fecha,estado) values
        (?,?,?,?,?,'ACTIVO')`

        const values=[
            data.vin,
            data.tipo_costo,
            data.descripcion,
            data.monto,
            data.fecha,
        ]
        const [result]:any= await connector.query(query,values)
        return result.insertId
    }
    async buscarPorId(id: number): Promise<VehiculoCosto | null> {
        const query = `select * from vehiculo_costo where id_costo=?`
        const [rows]:any=await connector.query(query,[id])
        return rows[0]||null
    }
    async listar(): Promise<VehiculoCosto[]> {
        const [rows]:any=await connector.query(`select * from vehiculo_costo`)
        return rows
    }
    async buscarPorVin(vin: string): Promise<VehiculoCosto[]> {
        const [rows]:any=await connector.query(`select * from vehiculo_costo where vin=?`,[vin])
        return rows
    }
    async editar(id: number, data: Partial<VehiculoCosto>): Promise<void> {
        const query = `update vehiculo_costo set 
        tipo_costo=?,descripcion=?,monto=?,fecha=? where id_costo=?`

        const values=[
            data.tipo_costo,
            data.descripcion,
            data.monto,
            data.fecha,
            id
        ]
        await connector.query(query,values)
    }
    async anular(id: number): Promise<void> {
        await connector.query(`update vehiculo_costo set estado='ANULADO' where id_costo=?`,[id])
    }
    async activar(id: number): Promise<void> {
        await connector.query(`update vehiculo_costo set estado='ACTIVO' where id_costo=?`,[id])
    }
}