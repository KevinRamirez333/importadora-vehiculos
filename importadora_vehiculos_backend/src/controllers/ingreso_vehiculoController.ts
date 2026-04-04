import { Request, Response } from 'express'
import { route, GET, POST,PUT } from 'awilix-router-core'
import { BaseController } from '../common/base.controller'
import { IngresoVehiculoService } from '../services/ingreso_vehiculo.service'

@route('/ingresos')
export class IngresoVehiculoController extends BaseController {

  private service = new IngresoVehiculoService()

  @POST()
  public async crear(req: Request, res: Response) {
    try {

      const result = await this.service.crearIngreso(req.body)

      res.status(201).send(result)

    } catch (error: any) {

      
      res.status(500).send({ message: error.message })
    }
  }

  @GET()
  public async listar(req: Request, res: Response) {

    const data = await this.service.listar()

    res.send(data)
  }
  @GET()
  @route('/:id')
  public async buscarPorId(req:Request,res:Response){
    try{
        const id = Number(req.params.id)
        const data = await this.service.BuscarPorId(id)
        res.send(data)
    } catch(error:any){
        res.status(500).send({message:error.message})
    }
  }
  @PUT()
@route('/:id')
public async editar(req: Request, res: Response) {
  try {

    const id = Number(req.params.id)

    const result = await this.service.editarIngreso(id, req.body)

    res.send(result)

  } catch (error: any) {
    res.status(500).send({ message: error.message })
  }
}

@POST()
@route('/anular/:id')
public async anular(req:Request,res:Response){
  try{
    const id = Number(req.params.id)
    const result = await this.service.anular(id)
    res.send(result)
  }catch(error:any){
    res.status(500).send({message:error.message})
  }
}
@POST()
@route('/activar/:id')
public async activar(req:Request,res:Response){
  try{
    const id=Number(req.params.id)
    const result= await this.service.activar(id)
    res.send(result)
  } catch(error:any){
    res.status(500).send({message:error.message})
  }
}

}