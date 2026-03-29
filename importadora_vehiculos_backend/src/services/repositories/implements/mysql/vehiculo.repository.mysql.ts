import { VehiculoRepository } from "../../vehiculo.repository";
import { Vehiculo } from "../../domain/vehiculo";
import connector from "../../../../common/persistence/persistence.mysql";

export class VehiculoRepositoryMySQL implements VehiculoRepository{
    async create(vehiculo:Vehiculo):Promise<void>{
        const query=`insert into vehiculo
        (vin,id_modelo,placa,anio,color,precio_venta,id_marca,id_estado)
        values(?,?,?,?,?,?,?,?)`

        const values=[
            vehiculo.vin,
            vehiculo.id_modelo,
            vehiculo.placa,
            vehiculo.anio,
            vehiculo.color,
            vehiculo.precio_venta,
            vehiculo.id_marca,
            vehiculo.id_estado
        ]
        await connector.query(query,values)
    }
    async findByVin(vin:string):Promise<Vehiculo|null>{
        const query=`select * from vehiculo where vin=?`
        const[rows]:any=await connector.query(query,[vin])

        return rows.length ? rows[0]:null
    }
    async findAll(filtros?: any): Promise<any[]> {

  let query = `
    SELECT v.*, m.nombre as marca, mo.nombre as modelo, e.nombre as estado
    FROM vehiculo v
    INNER JOIN marca m ON v.id_marca = m.id_marca
    INNER JOIN modelo mo ON v.id_modelo = mo.id_modelo
    INNER JOIN estado e ON v.id_estado = e.id_estado
    WHERE 1=1
  `

  const params: any[] = []

  // filtros dinámicos

  if (filtros?.marca) {
    query += " AND v.id_marca = ?"
    params.push(filtros.marca)
  }

  if (filtros?.modelo) {
    query += " AND v.id_modelo = ?"
    params.push(filtros.modelo)
  }

  if (filtros?.anio) {
    query += " AND v.anio = ?"
    params.push(filtros.anio)
  }

  if (filtros?.vin) {
    query += " AND v.vin = ?"
    params.push(filtros.vin)
  }

  const [rows]: any = await connector.query(query, params)

  return rows

    }
    async update(vin:string,vehiculo:Vehiculo):Promise<void>{
        const query=`update vehiculo
        set id_modelo=?,placa=?,anio=?,color=?,precio_venta=?,id_marca=?,id_estado=?
        where vin=?`

        const values=[
            vehiculo.id_modelo,
            vehiculo.placa,
            vehiculo.anio,
            vehiculo.color,
            vehiculo.precio_venta,
            vehiculo.id_marca,
            vehiculo.id_estado,
            vin
        ]
        await connector.query(query,values)
    }
    async deactivate(vin:string):Promise<void>{
        const query=`update vehiculo
        set activo=false
        where vin=?`

        await connector.query(query,[vin])
    }
    async activate(vin:string):Promise<void>{
        const query=`update vehiculo
        set activo=true
        where vin=?`

        await connector.query(query,[vin])
    }
}