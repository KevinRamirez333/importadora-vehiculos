import { ClienteRepository } from "../../cliente.repository";
import { Cliente } from "../../domain/cliente";
import connector from "../../../../common/persistence/persistence.mysql"

export class ClienteRepositoryMySQL implements ClienteRepository{
    async crear(cliente: Cliente): Promise<number> {
        const query=`insert into cliente(nombre,apellido,nit,dpi,telefono,direccion) values(?,?,?,?,?,?)`

        const values=[
            cliente.nombre,
            cliente.apellido,
            cliente.nit,
            cliente.dpi,
            cliente.telefono,
            cliente.direccion
        ]
        const result:any =await connector.query(query,values)
        return result.insertId
    }
    async buscarPorId(id: number): Promise<Cliente | null> {
        const query=`select * from cliente where id_cliente=?`
        const [rows]:any=await connector.query(query,[id])
        return rows.length ? rows[0]:null
    }
    async buscarporNit(nit: string): Promise<Cliente | null> {
        const query=`select * from cliente where nit=?`
        const [rows]:any=await connector.query(query,[nit])
        return rows.length ? rows[0]:null
    }
    async buscarporDpi(dpi: string): Promise<Cliente | null> {
        const query=`select * from cliente where dpi=?`
        const [rows]:any=await connector.query(query,[dpi])
        return rows.length ? rows[0]:null
    }
    async listar(): Promise<Cliente[]> {
        const query=`select * from cliente`
        const [rows]:any = await connector.query(query)
        return rows
    }
    async editar(id: number, cliente: Partial<Cliente>): Promise<void> {
        const query=`update cliente set nombre=?,apellido=?,nit=?,dpi=?,telefono=?,direccion=? where id_cliente=?`
        const values=[
            cliente.nombre,
            cliente.apellido,
            cliente.nit,
            cliente.dpi,
            cliente.telefono,
            cliente.direccion,
            id
        ]
        await connector.query(query,values)
    }
    async desactivar(id: number): Promise<void> {
        const query=`update cliente set estado=0 where id_cliente=?`
        await connector.query(query,[id])
    }
    async activar(id: number): Promise<void> {
        const query=`update cliente set estado=1 where id_cliente=?`
        await connector.query(query,[id])
    }
}