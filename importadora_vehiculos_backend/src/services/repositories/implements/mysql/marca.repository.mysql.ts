import { MarcaRepository } from "../../marca.repository";
import { Marca } from "../../domain/marca";
import connector from "../../../../common/persistence/persistence.mysql"

export class MarcaRepositoryMySQL implements MarcaRepository{
    async create(marca: Marca): Promise<number>{
        const query=`
        insert into marca (nombre) values (?)`

        const [result]:any= await connector.query(query,[marca.nombre])
        return result.insertId
    }
    async findById(id:number): Promise<Marca | null>{
        const query=`select * from marca where id_marca=?`
        const [rows]:any=await connector.query(query,[id])

        return rows.length ? rows[0]:null
    }
    async findAll(): Promise<Marca[]>{
        const query=`select * from marca`
        const [rows]:any=await connector.query(query)

        return rows
    }
    async update(id:number, marca:Marca): Promise<void>{
        const query =`update marca set nombre=? where id_marca=?`

        await connector.query(query,[marca.nombre,id])
    }
    async deactivate(id:number):Promise<void>{
        const query =`update marca set activo=false where id_marca=?`

        await connector.query(query,[id])
    }
    async activate(id:number):Promise<void>{
        const query =`update marca set activo=true where id_marca=?`

        await connector.query(query,[id])
    }
}