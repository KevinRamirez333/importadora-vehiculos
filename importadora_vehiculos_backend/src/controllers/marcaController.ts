import { Request,Response } from "express";
import { route,GET,POST,PUT } from "awilix-router-core";
import { BaseController } from "../common/base.controller";
import { MarcaService } from "../services/marca.service";

@route("/marcas")
export class MarcaController extends BaseController{
    private marcaService = new MarcaService()

    @POST()
    public async crear(req:Request, res:Response){
        try{
            const {nombre}= req.body
            const result= await this.marcaService.create(nombre)

            res.status(201).send(result)
        } catch(error:any){
            res.status(500).send({message: error.message})
        }
    }
    @GET()
    public async listar(req:Request, res:Response){
        try{
            const marcas = await this.marcaService.listarMarcas()
            res.send(marcas)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @GET()
    @route('/:id')
    public async buscar(req:Request, res:Response){
        try{
            const id = Number(req.params.id)

            const marca = await this.marcaService.buscarPorId(id)
            res.send(marca)
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

            const result = await this.marcaService.editarMarca(id,nombre)
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

            const result = await this.marcaService.darDeBaja(id)
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
            
            const result= await this.marcaService.activar(id)
            res.send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
}