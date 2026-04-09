import { IngresoVehiculo } from "../../domain/ingreso_vehiculo";
import { IngresoVehiculoRepository } from "../../ingreso_vehiculo.repository";
import connector from "../../../../common/persistence/persistence.mysql"

export class IngresoVehiculoRepositoryMySQL implements IngresoVehiculoRepository {

  async create(data: IngresoVehiculo): Promise<number> {

    const query = `
      INSERT INTO ingreso_vehiculo
      (vin, tipo_ingreso, fecha, id_cliente, valor_ingreso)
      VALUES (?, ?, ?, ?, ?)
    `

    const [result]: any = await connector.query(query, [
      data.vin,
      data.tipo_ingreso,
      data.fecha,
      data.id_cliente ?? null,
      data.valor_ingreso
    ])

    return result.insertId
  }

  async findAll(): Promise<any[]> {

    const query = `
      SELECT i.*, v.placa, v.anio
      FROM ingreso_vehiculo i
      INNER JOIN vehiculo v ON i.vin = v.vin
    `

    const [rows]: any = await connector.query(query)
    return rows
  }

  async findById(id: number): Promise<IngresoVehiculo | null> {


    const [rows]: any = await connector.query(
      `SELECT * FROM ingreso_vehiculo WHERE id_ingreso = ?`,
      [id]
    )
  

   return rows.length ? rows[0]:null
  }

  async findByVin (vin:string): Promise<IngresoVehiculo|null>{
    const [rows]:any=await connector.query(`select * from ingreso_vehiculo where vin=?`,[vin])
    return rows.length ? rows[0]:null
  }
 
  async update(id: number, data: IngresoVehiculo): Promise<void> {
      const query = `
    UPDATE ingreso_vehiculo
    SET tipo_ingreso = ?, fecha = ?, id_cliente = ?, valor_ingreso = ?
    WHERE id_ingreso = ?
  `

  await connector.query(query, [
    data.tipo_ingreso,
    data.fecha,
    data.id_cliente ?? null,
    data.valor_ingreso,
    id
  ])
  }

  async actualizarValorIngreso(id: number, valor: number): Promise<void> {
    const query = `update ingreso_vehiculo set valor_ingreso=? where id_ingreso=?`

    await connector.query(query,[valor,id])
  }

  async deactivate(id: number): Promise<void> {
    const query=`UPDATE ingreso_vehiculo
    SET estado_ingreso = 'ANULADO'
    WHERE id_ingreso = ?`
    await connector.query(query,[id])
  }
  async activate(id: number): Promise<void> {
    const query =`update ingreso_vehiculo
    set estado_ingreso = 'ACTIVO' where id_ingreso=?`
    await connector.query(query,[id])
  }

}