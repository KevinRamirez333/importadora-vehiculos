import {EstadoRepository} from "../../estado.repository"
import {Estado} from "../../domain/estado"
import connector from "../../../../common/persistence/persistence.mysql"

export class EstadoRepositoryMySQL implements EstadoRepository {
    async create(estado:Estado): Promise<number>{
        const query =`
        insert into estado (nombre) values (?)`
        const [result]:any =await connector.query(query,[estado.nombre])
        return result.insertId
    }
async findById(id:number):Promise<Estado | null>{
    const query =`Select * from estado where id_estado=?`
    const [rows]:any = await connector.query(query,[id]);
    return rows.length ? rows[0]:null
}
async findAll():Promise<Estado[]>{
    const query =`select * from estado`
    const [rows]:any =await connector.query(query)

    return rows;
}
async update(id:number, estado:Estado): Promise<void>{
    const query =`update estado set nombre=? where id_estado=?`

    await connector.query(query,[estado.nombre,id])
}
async deactivate(id: number): Promise<void> {
    const query =`update estado set activo=false where id_estado=?`
    await connector.query(query,[id])
}
async activate(id:number):Promise<void>{
    const query =`update estado set activo=true where id_estado=?`
    await connector.query(query,[id])
}
}