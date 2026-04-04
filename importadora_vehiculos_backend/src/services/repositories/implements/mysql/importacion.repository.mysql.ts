import { Importacion } from "../../domain/importacion";
import { ImportacionRepository } from "../../importacion.repository";
import connector from "../../../../common/persistence/persistence.mysql"

export class ImportacionRepositoryMySQL implements ImportacionRepository{
    async crearImportacion(data: Importacion): Promise<number> {
        const query = `
        insert into importacion(id_ingreso,pais_origen,costo_dolares,tipo_cambio,estado)
        values(?,?,?,?,'ACTIVO')`

        const values =[
            data.id_ingreso,
            data.pais_origen,
            data.costo_dolares,
            data.tipo_cambio,
        ]
        const [result]:any=await connector.query(query,values)
        return result.insertId
    }
    async buscarPorId(id: number): Promise<Importacion | null> {
        const query = `SELECT i.*, iv.vin
        FROM importacion i
        JOIN ingreso_vehiculo iv ON i.id_ingreso = iv.id_ingreso where id_importacion=?`

        const [rows]:any=await connector.query(query,[id])
        return rows[0]||null
    }
    async listarImportacion(): Promise<Importacion[]> {
        const query= `
        SELECT i.*, iv.vin
        FROM importacion i
        JOIN ingreso_vehiculo iv ON i.id_ingreso = iv.id_ingreso`

        const[rows]:any=await connector.query(query)
        return rows
    }
    async editarImportacion(id: number, data: Partial<Importacion>): Promise<void> {
        const query =`
        update importacion set pais_origen=?, costo_dolares=?,tipo_cambio=?
        where id_importacion=?`

        const values=[
            data.pais_origen,
            data.costo_dolares,
            data.tipo_cambio,
            id
        ]
        await connector.query(query,values)
    }
    async darDeBaja(id:number):Promise<void>{
        await connector.query(`update importacion set estado='ANULADO' where id_importacion=?`,[id])
    }
    async activate(id:number):Promise<void>{
        await connector.query(`update importacion set estado='ACTIVO' where id_importacion=?`,[id])
    }
    async buscarPorIdIngreso(id: number): Promise<Importacion | null> {
        const query = `select * from importacion where id_ingreso=?`

        const [rows]:any=await connector.query(query,[id])
        return rows[0]||null
    }
}