import { GET, POST, route } from "awilix-router-core";
import { BaseController } from "../common/base.controller";
import { Request,Response } from "express";
import { CuotaService } from "../services/cuota.service";

@route('/cuotas')
export class CuotaController extends BaseController{
    private cuotaService = new CuotaService()

@GET()
@route('/venta/:idVenta')
public async listarCuotasPorVenta(req:Request, res:Response){
    try{
        const idVenta = Number(req.params.idVenta)
        const result = await this.cuotaService.listarCuotasPorVenta(idVenta)
        res.status(200).send(result)
    }catch(error:any){
        res.status(500).send({message:error.message})
    }
}
@POST()
@route('/pagar/:idCuota')
public async pagarCuota(req:Request,res:Response){
    try{
        const idCuota = Number(req.params.idCuota)
        const {fecha_pagado}= req.body
         const result =await this.cuotaService.pagarCuota(idCuota,fecha_pagado)
        res.status(200).send(result)
    }catch(error:any){
        res.status(500).send({message:error.message})
    }
}
}
