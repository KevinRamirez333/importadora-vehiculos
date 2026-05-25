import { CuotaRepository } from "../../cuota.repository";
import { Cuota } from "../../domain/cuota";
import connector from "../../../../common/persistence/persistence.mysql"
import { PoolConnection } from "mysql2/promise";

export class CuotaRepositoryMySQL implements CuotaRepository{
    async generarCuotas(data:Cuota, connection:PoolConnection): Promise<void> {
        const query=`insert into venta_cuota ( interes, fecha_pago, monto, estado, id_venta)
        values (?,?,?,?,?)`
        const dataCuota =[
            data.interes,
            data.fecha_pago,
            data.monto,
            data.estado,
            data.id_venta
        ]
        await connection.query(query,dataCuota)
    }
}