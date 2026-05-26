import { Venta } from "../../domain/venta";
import { VentaRepository } from "../../venta.repository";
import connector from '../../../../common/persistence/persistence.mysql'
import { PoolConnection } from "mysql2/promise";


export class VentaRepositoryMySQL implements VentaRepository {
    async create(venta: Venta, connection:PoolConnection): Promise<number> {

        const query = `insert into venta (fecha,vin,id_cliente,tipo_pago,cuotas,precio_venta,estado,enganche,saldo_financiado)
        values (?,?,?,?,?,?,?,?,?)`

        const values = [
            venta.fecha,
            venta.vin,
            venta.id_cliente,
            venta.tipo_pago,
            venta.cuotas,
            venta.precio_venta,
            venta.estado,
            venta.enganche || null,
            venta.saldo_financiado || null,
        ]
        const [result]:any =await connection.query(query,values)
        return result.insertId
    }
    async findAll(): Promise<Venta[]> {
        const query=`select v.*, c.nombre, c.apellido 
        from venta v
        inner join cliente c on v.id_cliente=c.id_cliente
        where v.id_cliente`
        const [rows]:any= await connector.query(query)
        return rows
    }
    async findById(id: number): Promise<Venta | null> {
        const query=`
        SELECT
    v.*,

    c.nombre,
    c.apellido,
    c.nit,

    veh.anio AS vehiculo_anio,
    veh.placa,

    ma.nombre AS marca,
    mo.nombre AS modelo

FROM venta v

INNER JOIN vehiculo veh
    ON v.vin = veh.vin

INNER JOIN cliente c
    ON v.id_cliente = c.id_cliente

INNER JOIN marca ma
    ON veh.id_marca = ma.id_marca

INNER JOIN modelo mo
    ON veh.id_modelo = mo.id_modelo

WHERE v.id_venta = ?`

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
    async buscarVentasPorCliente(id_cliente:number):Promise<any[]>{
      const query=`select v.*, c.nombre, c.apellido from venta v
      inner join cliente c on v.id_cliente = c.id_cliente
      where v.id_cliente=?`
      const [rows]:any = await connector.query(query,[id_cliente])
      return rows
    }
}