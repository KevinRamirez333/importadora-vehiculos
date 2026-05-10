import { POST, route } from "awilix-router-core";
import { BaseController } from "../common/base.controller";
import { Request,Response } from "express";

@route('/cuotas')
export class CuotaController extends BaseController{
@POST()
async  crear(req:Request,res:Response){
const {cuotas, id_venta, precio_venta}=req.body

}
}