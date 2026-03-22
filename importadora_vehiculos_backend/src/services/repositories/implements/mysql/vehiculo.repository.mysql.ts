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
    async findAll():Promise<Vehiculo[]>{
        const query =`select v.*, m.nombre as marca, e.nombre as estado
        from vehiculo v
        inner join marca m on v.id_marca =m.id_marca
        inner join estado e on v.id_estado=e.id_estado`

        const[rows]:any=await connector.query(query)
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