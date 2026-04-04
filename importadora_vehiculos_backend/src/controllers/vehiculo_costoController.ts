import { GET, POST, PUT, route } from "awilix-router-core";
import { VehiculoCostoService } from "../services/vehiculo_costo.service";
import { BaseController } from "../common/base.controller";
import { Request,Response } from "express";
@route("/vehiculo-costos")
export class VehiculoCostoController extends BaseController {
    private service = new VehiculoCostoService()


    @POST()
    async crear(req:Request,res:Response){
        try{
            const result = await this.service.crear(req.body)
            res.status(201).send(result)
        } catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @GET()
    async listar(req:Request,res:Response){
        try{
            const result = await this.service.listar()
            res.status(200).send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    
    @GET()
    @route("/:id")
    async buscarPorId(req:Request,res:Response){
        try{
            const id=Number(req.params.id)
            const result = await this.service.buscarPorId(id)
            res.status(200).send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @GET()
    @route("/vin/:vin")
    async buscarPorVin(req:Request,res:Response){
        try{
            const vin=String(req.params.vin)
            const result = await this.service.buscarPorVin(vin)
            res.status(200).send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @PUT()
    @route("/:id")
    async editar(req:Request,res:Response){
        try{
            const id=Number(req.params.id)
            const result = await this.service.editar(id,req.body)
            res.status(200).send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @POST()
    @route("/anular/:id")
    async anular(req:Request,res:Response){
        try{
            const id=Number(req.params.id)
            const result = await this.service.anular(id)
            res.status(200).send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @POST()
    @route("/activar/:id")
    async activar(req:Request,res:Response){
        try{
            const id=Number(req.params.id)
            const result = await this.service.activar(id)
            res.status(200).send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
}