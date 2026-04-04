import { Request,Response } from "express";
import { route,GET,POST,PUT } from "awilix-router-core";
import { BaseController } from "../common/base.controller";
import { ModeloService } from "../services/modelo.service";

@route('/modelos')
export class ModeloController extends BaseController {

  private service = new ModeloService()

  @POST()
  public async crear(req: Request, res: Response) {
    try {

      const { nombre, id_marca } = req.body

      const result = await this.service.crearModelo(nombre, id_marca)

      res.status(201).send(result)

    } catch (error: any) {
      res.status(500).send({ message: error.message })
    }
  }

  @GET()
  public async listar(req: Request, res: Response) {
    try{
        const data = await this.service.listarModelos()
        res.send(data)
    }catch(error:any){
        res.status(500).send({message:error.message})
    }
    
  }
  @GET()
  @route("/:id")
  public async buscarPorId(req:Request, res:Response){
    try{
        const id=Number(req.params.id)
        const modelo=await this.service.buscarPorId(id)
        res.send(modelo)
    }catch(error:any){
        res.status(500).send({message:error.message})
    }
  }

  @GET()
  @route('/marca/:id_marca')
  public async listarporMarca(req: Request, res: Response) {
    try{
        const id = Number(req.params.id_marca)
        const data = await this.service.listarPorMarca(id)
        res.send(data)
    } catch(error:any){
        res.status(500).send({message:error.message})
    }
    
  }
  @PUT()
  @route('/:id')
  public async editar(req:Request,res:Response){
    try{
        const id=Number(req.params.id)
    
        const data= await this.service.editarModelo(id,req.body.nombre,req.body.id_marca)
        res.send(data)
    } catch(error:any){
        res.status(500).send({message:error.message})
    }
  }
  @POST()
  @route('/desactivar/:id')
  public async darDeBaja(req:Request,res:Response){
    try{
        const id= Number(req.params.id)

        const result= await this.service.desactivar(id)
        res.send(result)
    }catch(error:any){
        res.status(500).send({message:error.message})
    }
  }
  @POST()
  @route('/activar/:id')
  public async activar(req:Request,res:Response){
    try{
        const id= Number(req.params.id)

        const result= await this.service.activar(id)
        res.send(result)
    }catch(error:any){
        res.status(500).send({message:error.message})
    }
  }
}