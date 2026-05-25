import { Venta } from "./repositories/domain/venta";
import { VentaRepositoryMySQL } from "./repositories/implements/mysql/venta.repository.mysql";
import connector from '../common/persistence/persistence.mysql'
import { VehiculoService } from "./vehiculo.service";
import { CuotaService } from "./cuota.service";
import PDFDocument from 'pdfkit'
import { formatearFecha } from "../helpers/formatearFecha";
import { formatearMoneda } from "../helpers/formatearMoneda";

export class VentaService {
    private ventaRepo =  new VentaRepositoryMySQL()
    private cuotaRepo = new CuotaService()
    private vehiculoService = new VehiculoService()
    

    async crear(venta:Venta){
        const connection = await connector.getConnection();
        try{
            if(!venta.vin){
                throw new Error("VIN es requerido")
            }
            if(!venta.id_cliente){
                throw new Error('Cliente es requerido')
            }
            await connection.beginTransaction();
            const vehiculo = await this.vehiculoService.buscarPorVin(venta.vin)
            if(vehiculo.id_estado===3 || vehiculo.id_estado===1){
                throw new Error('Este vehiculo no esta disponible')
            }
            if (venta.tipo_pago==='CONTADO'){
                const ventaContado = {
                ...venta,
                precio_venta: vehiculo.precio_venta
            }
            
            await this.ventaRepo.create(ventaContado,connection);
            await this.vehiculoService.estadoVendido(venta.vin,connection);
            }
            else if (venta.tipo_pago==='CREDITO'){
                if(!venta.cuotas){
                    throw new Error('Numero de cuotas es requerido')
                }
                const engache = 0.2
                const interes = 0.15
                const precioVenta = vehiculo.precio_venta * (1+interes)
                const engancheMonto= precioVenta*engache
                const saldoFinanciado= precioVenta-engancheMonto
                
                const ventaCredito = {
                    ...venta,
                    precio_venta: precioVenta,
                    enganche: engancheMonto,
                    saldo_financiado: saldoFinanciado,

                }
                const ventaId= await this.ventaRepo.create(ventaCredito,connection)
                await this.vehiculoService.estadoVendido(venta.vin,connection);

                const datosCuota ={
                  id_venta: ventaId,
                  cuotas: venta.cuotas,
                  saldo_financiado: saldoFinanciado,
                  interes: interes
                }
                
                await this.cuotaRepo.crear(datosCuota, connection)
                
            }

            await connection.commit()

            return{message:'Venta guardada correctamente'}
        } catch(error){
            await connection.rollback()
            throw error 

        } finally{
             connection.release()
        }
    }
    async listarVentas() {
        return await this.ventaRepo.findAll()
    }
    async buscarPorId(id:number){
        if(!id){
            throw new Error('ID de venta es requerido')
        }

        const venta = await this.ventaRepo.findById(id)
        if(!venta){
            throw new Error('No se encontra ninguna venta asociada al ID')
        }
        return venta
    }
    async buscarPorVin(vin:string){
        if(!vin){
            throw new Error('VIN es requerido')
        }
        const venta = await this.ventaRepo.findByVin(vin)
        if(!venta){
            throw new Error('No se encontro ninguna venta asociada al VIN')
        }
        return venta

    }
    async anularVenta(id:number){
        if(!id){
            throw new Error('ID es requerido')

        }
        const venta = await this.ventaRepo.findById(id)
        if(!venta){
            throw new Error('Venta no encontrada')
        }
        await this.ventaRepo.anularVenta(id)
        return{message:'Venta anulada correctamente'}
    }
    async buscarVentasPorCliente(id:number){
        if(!id){
            throw new Error('ID de cliente es requerido')
        }
        const ventas = await this.ventaRepo.buscarVentasPorCliente(id)
        if(!ventas|| ventas.length===0){
            throw new Error('Ventas no encontradas para este cliente')
        }
        return ventas
    }

async generarComprobante(idVenta: number) {

    const venta = await this.buscarPorId(idVenta)

    const doc = new PDFDocument({
        margin: 50,
        size: 'A4'
    })

    // ===== FUNCIONES =====

    const formatearMoneda = (valor: number) => {
        return Number(valor).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    }

    const clienteNombre = [venta.nombre, venta.apellido]
        .filter(Boolean)
        .join(' ')
        .trim() || 'Cliente desconocido'

    // ===== HEADER EMPRESA =====

    doc
        .fontSize(12)
        .fillColor('#666')
        .font('Helvetica-Bold')
        .text('AutoVentas GT', 50, 40)

    doc
        .fontSize(10)
        .font('Helvetica')
        .text('Escuintla, Guatemala', 50, 58)

    doc.text('Tel: 5555-5555', 50, 72)

    // ===== NUMERO COMPROBANTE =====

    doc
        .fontSize(10)
        .fillColor('#666')
        .text(`Venta No. ${venta.id_venta}`, 400, 40)

    // ===== TITULO =====

    doc
        .fontSize(24)
        .fillColor('#1F3A5F')
        .font('Helvetica-Bold')
        .text('COMPROBANTE DE VENTA', 0, 110, {
            align: 'center'
        })

    // ===== LINEA =====

    doc
        .strokeColor('#1F3A5F')
        .lineWidth(2)
        .moveTo(50, 150)
        .lineTo(550, 150)
        .stroke()

    // ===== INFORMACION CLIENTE =====

    doc
        .fontSize(16)
        .fillColor('#000')
        .font('Helvetica-Bold')
        .text('Información del cliente', 50, 180)

    // Línea decorativa
    doc
        .strokeColor('#D6DCE5')
        .lineWidth(1)
        .moveTo(50, 205)
        .lineTo(550, 205)
        .stroke()

    doc.fontSize(12)

    // Columna izquierda
    doc
        .font('Helvetica-Bold')
        .text('Cliente:', 50, 225)

    doc
        .font('Helvetica')
        .text(clienteNombre, 120, 225)

    doc
        .font('Helvetica-Bold')
        .text('NIT:', 50, 250)

    doc
        .font('Helvetica')
        .text(venta.nit ? String(venta.nit) : 'CF', 120, 250)

    // Columna derecha
    doc
        .font('Helvetica-Bold')
        .text('Fecha:', 320, 225)

    doc
        .font('Helvetica')
        .text(formatearFecha(venta.fecha), 390, 225)

    doc
        .font('Helvetica-Bold')
        .text('Estado:', 320, 250)

    doc
        .fontSize(12)
        .fillColor(
            venta.estado === 'PAGADO'
                ? 'green'
                : 'orange'
        )
        .font('Helvetica-Bold')
        .text(venta.estado, 390, 250)

    // Restaurar color
    doc.fillColor('#000')

    // ===== INFORMACION VEHICULO =====

    doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('Información de la venta', 50, 310)

    doc
        .strokeColor('#D6DCE5')
        .lineWidth(1)
        .moveTo(50, 335)
        .lineTo(550, 335)
        .stroke()

    doc.fontSize(12)

    doc
        .font('Helvetica-Bold')
        .text('VIN del vehículo:', 50, 355)

    doc
        .font('Helvetica')
        .text(venta.vin, 170, 355)

    doc
        .font('Helvetica-Bold')
        .text('Tipo de pago:', 50, 380)

    doc
        .font('Helvetica')
        .text(venta.tipo_pago, 170, 380)

    doc
        .font('Helvetica-Bold')
        .text('Cuotas:', 320, 380)

    doc
        .font('Helvetica')
        .text(String(venta.cuotas || 'No aplica'), 390, 380)

    // ===== CAJA FINANCIERA =====

    doc
        .roundedRect(50, 430, 500, 120, 10)
        .fillAndStroke('#F5F7FA', '#D6DCE5')

    doc.fillColor('#000')

    doc
        .fontSize(15)
        .font('Helvetica-Bold')
        .text('Resumen financiero', 70, 445)

    doc.fontSize(12)

    doc
        .font('Helvetica')
        .text(
            `Precio de venta: Q${formatearMoneda(venta.precio_venta || 0)}`,
            70,
            475
        )

    doc.text(
        `Enganche: ${
            venta.enganche
                ? `Q${formatearMoneda(venta.enganche)}`
                : 'No aplica'
        }`,
        70,
        500
    )

    doc.text(
        `Saldo financiado: ${
            venta.saldo_financiado
                ? `Q${formatearMoneda(venta.saldo_financiado)}`
                : 'No aplica'
        }`,
        70,
        525
    )

    // ===== FOOTER =====

    doc
        .strokeColor('#D6DCE5')
        .lineWidth(1)
        .moveTo(50, 700)
        .lineTo(550, 700)
        .stroke()

    doc
        .fontSize(9)
        .fillColor('#777')
        .font('Helvetica')
        .text(
            'Documento generado automáticamente por el sistema de ventas.',
            50,
            715,
            {
                align: 'center'
            }
        )

    doc.text(
        `Fecha de impresión: ${new Date().toLocaleString()}`,
        {
            align: 'center'
        }
    )

    // ===== NOMBRE ARCHIVO =====

    const nombreLimpio = clienteNombre
        .replace(/\s+/g, '_')
        .replace(/[^A-Za-z0-9_\-]/g, '') || 'cliente'

    const nombreArchivo =
        `comprobante-${nombreLimpio}-${venta.vin || idVenta}.pdf`

    return {
        doc,
        nombreArchivo
    }
}


}