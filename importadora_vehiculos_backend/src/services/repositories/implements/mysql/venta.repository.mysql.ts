import { Venta } from "../../domain/venta";
import { VentaRepository } from "../../venta.repository";
import connector from '../../../../common/persistence/persistence.mysql'

export class VentaRepositoryMySQL implements VentaRepository {
    async create(venta: Venta): Promise<void> {
        const query = `insert into venta (fecha,vin,id_cliente,tipo_pago,cuotas,precio_venta,estado)
        values (?,?,?,?,?,?,?)`

        const values = [
            venta.fecha,
            venta.vin,
            venta.id_cliente,
            venta.tipo_pago,
            venta.cuotas,
            venta.precio_venta,
            venta.estado
        ]
        await connector.query(query,values)
    }
    async findAll(): Promise<Venta[]> {
        const query=`select * from venta`
        const [rows]:any= await connector.query(query)
        return rows
    }
    async findById(id: number): Promise<Venta | null> {
        const query=`select * from venta where id_venta=?`

        const [rows]:any = await connector.query(query,[id])
        return rows.length ? rows[0]:null
    }

    async findByVin(vin: string): Promise<Venta | null> {
        const query = `select * from venta where vin=?`

        const [rows]:any = await connector.query(query,[vin])
        return rows.length ? rows[0]:null
    }
    async anularVenta(id: number): Promise<void> {
        const query =`update venta set estado='ANULADO' where id_venta=?`

        await connector.query(query,[id])
    }
}