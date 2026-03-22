import { Request,Response } from "express";
import{route,GET,POST,PUT} from 'awilix-router-core';
import {BaseController} from '../common/base.controller'
import { EstadoService } from "../services/estado.service";

@route('/estados')
export class EstadoController extends BaseController{
    private estadoService = new EstadoService()

    @POST()
    public async crear(req:Request, res:Response){
        try{
            const {nombre}=req.body
            const result = await this.estadoService.crearEstado(nombre)
            res.status(201).send(result)
        }catch(error:any){
            res.status(400).send({message:error.message})
        }
    }
    @GET()
    public async listar(req:Request, res:Response){
        try{
            const estados = await this.estadoService.listarEstados()
            res.send(estados)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @GET()
    @route('/:id')
    public async buscar(req:Request, res:Response){
        try{
            const id = Number(req.params.id)
            const estado = await this.estadoService.buscarPorId(id)
            res.send(estado)
        } catch(error:any){
            res.status(404).send({message:error.message})
        }
    }
    @PUT()
    @route('/:id')
    public async editar(req:Request, res:Response){
        try{
            const id = Number(req.params.id)
            const {nombre}=req.body

            const result = await this.estadoService.editarEstado(id,nombre)
            res.send(result)
        } catch(error:any){
            res.status(400).send({message:error.message})
        }
    }
    @POST()
    @route('/desactivar/:id')
    public async desactivar(req:Request, res:Response){
        try{
            const id = Number(req.params.id)
            const result = await this.estadoService.darDeBaja(id)
            res.send(result)
        }catch(error:any){
            res.status(400).send({message: error.message})
        }
    }
    @POST()
    @route('/activar/:id')
    public async activar(req:Request, res:Response){
        try{
            const id = Number(req.params.id)
            const result = await this.estadoService.activar(id)
            res.send(result)
        }catch(error:any){
            res.status(400).send({message:error.message})
        }
    }
}