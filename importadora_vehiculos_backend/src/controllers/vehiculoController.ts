import { Request,Response } from "express";
import { route, GET,POST,PUT } from "awilix-router-core";
import { BaseController } from "../common/base.controller";
import { VehiculoService } from "../services/vehiculo.service";


@route("/vehiculos")
export class VehiculoController extends BaseController{
    private service=new VehiculoService()

    @POST()
    public async crear(req:Request,res:Response){
        try{
            const result = await this.service.crearVehiculo(req.body)
            res.status(201).send(result)
        }catch(error:any){
            res.status(400).send({message:error.message})
        }
    }
@GET()
public async listar(req: Request, res: Response) {
  try {

    const filtros = {
      marca: req.query.marca ? Number(req.query.marca) : undefined,
      modelo: req.query.modelo ? Number(req.query.modelo) : undefined,
      anio: req.query.anio ? Number(req.query.anio) : undefined,
      vin: req.query.vin ? String(req.query.vin) : undefined
    }

    const data = await this.service.listarVehiculos(filtros)

    res.send(data)

  } catch (error: any) {
    res.status(500).send({ message: error.message })
  }
}
    @GET()
    @route('/:vin')
    public async buscar(req:Request,res:Response){
        try{
            const vin=req.params.vin

            if (!vin || typeof vin !== 'string') {
            return res.status(400).send('VIN inválido')
            }
            const data = await this.service.buscarPorVin(vin)
            res.send(data)
        }catch(error:any){
            res.status(404).send({message:error.message})
        }
    }
    @PUT()
    @route('/:vin')
    public async editar(req:Request,res:Response){
        try{
            const vin=req.params.vin

            if (!vin || typeof vin !== 'string') {
            return res.status(400).send('VIN inválido')
            }
            const result = await this.service.editarVehiculo(vin,req.body)
            res.send(result);
        }catch(error:any){
            res.status(400).send({message:error.message})
        }
    }
    @POST()
    @route('/desactivar/:vin')
    public async desactivar(req:Request,res:Response){
        try{
            const vin=req.params.vin

            if (!vin || typeof vin !== 'string') {
            return res.status(400).send('VIN inválido')
            }
            const result = await this.service.darDeBaja(vin)
            res.send(result)
        }catch(error:any){
            res.status(400).send({message: error.message})
        }
    }
    @POST()
    @route('/activar/:vin')
    public async activar(req:Request, res:Response){
        try{
            const vin = req.params.vin
            if (!vin || typeof vin !== 'string') {
            return res.status(400).send('VIN inválido')
            }

            const result = await this.service.activar(vin)
            res.send(result)
        }catch(error:any){
            res.status(400).send({message:error.message})
        }
    }

}