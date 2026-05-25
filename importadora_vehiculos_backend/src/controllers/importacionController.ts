import { Request,Response } from "express";
import { route,GET,POST,PUT } from "awilix-router-core";
import { BaseController } from "../common/base.controller";
import { ImportacionService } from "../services/importacion.service";

@route("/importaciones")
export class ImportacionController extends BaseController{
    private service = new ImportacionService()

    @POST()
    async crearImportacion(req:Request,res:Response){
        try{
            const result = await this.service.crearImportacion(req.body)
            res.status(201).send(result)
        }catch(error:any){
        res.status(500).send({message:error.message})
        }
    }
    @GET()
    async listarImportacion(req:Request,res:Response){
        try{
            const data= await this.service.listarImportacion()
            res.send(data)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @GET() 
    @route("/:id")
    async buscarPorId(req:Request,res:Response){
        try{
            const id = Number(req.params.id)
            const data = await this.service.buscarPorId(id)
            res.send(data)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @PUT()
    @route("/:id")
    async editarImportacion(req:Request,res:Response){
        try{
            const id= Number(req.params.id)
           const result= await this.service.editarImportacion(id,req.body)
             res.send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @POST()
    @route("/anular/:id")
    async darDeBaja(req:Request,res:Response){
        try{
            const id = Number(req.params.id)
            const result=await this.service.darDeBaja(id)
            res.send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @POST()
    @route("/activar/:id")
    async activate(req:Request,res:Response){
        try{
            const id = Number(req.params.id)
            const result = await this.service.activate(id)
            res.send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
}