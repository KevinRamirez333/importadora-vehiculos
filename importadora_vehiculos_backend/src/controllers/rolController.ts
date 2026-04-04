import { Request,Response } from "express";
import { route,GET,POST,PUT } from "awilix-router-core";
import { BaseController } from "../common/base.controller";
import { RolService } from "../services/rol.service";

@route("/roles")
export class MarcaController extends BaseController{
    private rolService = new RolService()

    @POST()
    public async crear(req:Request, res:Response){
        try{
            const {nombre}= req.body
            const result= await this.rolService.create(nombre)

            res.status(201).send(result)
        } catch(error:any){
            res.status(500).send({message: error.message})
        }
    }
    @GET()
    public async listar(req:Request, res:Response){
        try{
            const roles = await this.rolService.findAll()
            res.send(roles)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @GET()
    @route('/:id')
    public async buscar(req:Request, res:Response){
        try{
            const id = Number(req.params.id)

            const rol = await this.rolService.findById(id)
            res.send(rol)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @PUT()
    @route('/:id')
    public async editar(req:Request, res:Response){
        try{
            const id = Number(req.params.id)
            const {nombre}= req.body

            const result = await this.rolService.editarRol(id,nombre)
            res.send(result)      
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @POST()
    @route('/desactivar/:id')
    public async desactivar(req:Request, res:Response){
        try{
            const id = Number(req.params.id)

            const result = await this.rolService.darDeBaja(id)
            res.send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @POST()
    @route('/activar/:id')
    public async activar(req:Request, res:Response){
        try{
            const id = Number(req.params.id)
            
            const result= await this.rolService.activar(id)
            res.send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
}