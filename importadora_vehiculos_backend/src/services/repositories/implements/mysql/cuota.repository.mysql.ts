import { CuotaRepository } from "../../cuota.repository";
import { Cuota } from "../../domain/cuota";
import connector from "../../../../common/persistence/persistence.mysql"

export class CuotaRepositoryMySQL implements CuotaRepository{
    async generarCuotas(data:Cuota): Promise<void> {
        const query=`insert into cuota ( intereses, fecha_pago, monto, estado, id_venta)
        values (?,?,?,?,?)`
        const dataCuota =[
            data.interes,
            data.fecha_pago,
            data.monto,
            data.estado,
            data.id_venta
        ]
        await connector.query(query,dataCuota)
    }
}