import { GET, POST, PUT, route } from "awilix-router-core";
import { BaseController } from "../common/base.controller";
import { ClienteService } from "../services/cliente.service";
import { Cliente } from "../services/repositories/domain/cliente";
import { Response,Request } from "express";
@route("/clientes")
export class ClienteController extends BaseController{
    private clienteService: ClienteService = new ClienteService()

    @POST()
    async crear(req:Request,res:Response){
        try{
            const cliente = req.body
            const result = await this.clienteService.crear(cliente)
            res.status(201).send(result)

        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @GET()
    async listar(req:Request,res:Response){
        try{
            const result = await this.clienteService.listar()
            res.status(200).send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    
    @GET()
    @route("/:id")
    async buscarPorId(req:Request,res:Response){
        try{
            const id= Number(req.params.id)
            const result = await this.clienteService.buscarPorId(id)
            res.status(200).send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @GET()
    @route("/nit/:nit")
    async buscarPorNit(req:Request,res:Response){
        try{
            const nit = String(req.params.nit)
            const result = await this.clienteService.buscarPorNit(nit)
            res.status(200).send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }

    @GET()
    @route("/dpi/:dpi")
    async buscarPorDpi(req:Request,res:Response){
        try{
            const dpi = String(req.params.dpi)
            const result = await this.clienteService.buscarPorDpi(dpi)
            res.status(200).send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @PUT()
    @route("/:id")
    async editar(req:Request,res:Response){
        try{
            const id = Number(req.params.id)
            const cliente:Partial<Cliente>=req.body
            const result = await this.clienteService.editar(id,cliente)
            res.status(200).send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})        
        }
    }
    @POST()
    @route("/desactivar/:id")
    async desactivar(req:Request,res:Response){
        try{
            const id = Number(req.params.id)
            const result = await this.clienteService.desactivar(id)
            res.status(200).send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @POST()
    @route("/activar/:id")
    async activar(req:Request, res:Response){
        try{
            const id = Number(req.params.id)
            const result = await this.clienteService.activar(id)
            res.status(200).send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
}