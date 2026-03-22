import { Rol } from "../../domain/rol";
import { RolRepository } from "../../rol.repository";
import connector from "../../../../common/persistence/persistence.mysql"

export class RolRepositoryMySQL implements RolRepository{

    async create(rol:Rol):Promise<number>{
        const query=`insert into rol(nombre) values(?)`

        const [result]:any= await connector.query(query,[rol.nombre])
        return result.insertId
    }
    async findById(id:number):Promise<Rol|null>{
        const query=`select * from rol where id_rol=?`

        const [rows]:any=await connector.query(query,[id]) 
        return rows.length ? rows[0]:null
    }
    async findAll():Promise<Rol[]>{
        const query=`select * from rol`

        const[rows]:any=await connector.query(query)
        return rows
    }
    async update(id: number, rol: Rol): Promise<void> {
        const query=`update rol set nombre=? where id_rol=? `

        await connector.query(query,[rol.nombre,id])
    }
    async deactivate(id: number): Promise<void> {
        const query =`update rol set activo=false where id_rol=?`

        await connector.query(query,[id])
    }
    async activate(id: number): Promise<void> {
        const query=`update rol set activo=true where id_rol=?`
        await connector.query(query,[id])
    }
}