import { Request, Response } from 'express';
import { POST, route } from 'awilix-router-core';
import { BaseController } from '../common/base.controller';
import { UsuarioService } from '../services/usuario.service';


@route('/usuarios')
export class UsuarioController extends BaseController {

  private readonly usuarioService = new UsuarioService();

  // LOGIN
  @route('/login')
  @POST()
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).send({
          message: 'Email y contraseña son requeridos'
        });
      }

      const result = await this.usuarioService.login(email, password);

      res.status(200).send(result);

    } catch (error) {
      const err = error as Error;
      res.status(401).send({ message: err.message });
    }
  }

  // REGISTRO
  @POST()
  public async createUser(req: Request, res: Response) {
    try {
      const { nombre, email, password, rol } = req.body;

      if (!nombre || !email || !password || !rol) {
        return res.status(400).send({
          message: 'Todos los campos son requeridos'
        });
      }

      const result = await this.usuarioService.createUser(
        nombre,
        email,
        password,
        rol
      );

      res.status(201).send(result);

    } catch (error) {
      const err = error as Error;
      res.status(400).send({ message: err.message });
    }
  }
}