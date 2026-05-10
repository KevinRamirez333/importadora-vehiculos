import { GET, POST, route } from "awilix-router-core";
import { BaseController } from "../common/base.controller";
import { VentaService } from "../services/venta.service";
import { Request, Response } from "express";

@route('/ventas')
export class VentaController extends BaseController{
    private service = new VentaService()

    @POST()
    public async crear(req:Request, res:Response){
        try{
            const result = await this.service.crear(req.body)
            res.status(201).send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @GET()
    public async listarVentas(req:Request, res:Response){
        try{
            const result = await this.service.listarVentas()
            res.status(200).send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @GET()
    @route('/:id')
    public async buscarPorId(req:Request, res:Response){
        try{
            const id = Number(req.params.id)
            const result = await this.service.buscarPorId(id)
            res.status(200).send(result)
        }catch(error:any){
            res.status(500).send({message: error.message})

        }
    }
    @GET()
    @route('/vin/:vin')
    public async buscarPorVin(req:Request,res:Response){
        try{
            const vin = req.params.vin
            if (!vin || typeof vin !== 'string') {
            return res.status(400).send('VIN inválido')
            }
            const result = await this.service.buscarPorVin(vin)
            res.status(200).send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @GET()
    @route('/cliente/:id')
    public async buscarVentasPorCliente(req:Request, res:Response){
        try{
            const id = Number(req.params.id)
            const result = await this.service.buscarVentasPorCliente(id)
            res.status(200).send(result)
        }
        catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
    @POST()
    @route('/anular/:id')
    public async cancelarVenta(req:Request,res:Response){
        try{
            const id = Number(req.params.id)
            const result = await this.service.anularVenta(id)
            res.status(200).send(result)
        }catch(error:any){
            res.status(500).send({message:error.message})
        }
    }
}