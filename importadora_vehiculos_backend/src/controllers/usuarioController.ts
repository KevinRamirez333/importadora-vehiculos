import { Request, Response } from 'express';
import { POST, GET, PUT,PATCH, route } from 'awilix-router-core';
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
  // Obtener usuario por ID
@GET()
@route('/:id')
public async getUsuarioById(req: Request, res: Response) {
  try {

    const id = Number(req.params.id)

    const usuario = await this.usuarioService.getUsuarioById(id)

    res.send(usuario)

  } catch (error) {
    const err = error as Error
    res.status(404).send({ message: err.message })
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
  //Listar usuarios
  @GET()
public async getUsuarios(req: Request, res: Response) {
  try{
  const usuarios = await this.usuarioService.getUsuarios()
  res.send(usuarios)
  }
catch (error) {
      const err = error as Error;
      res.status(400).send({ message: err.message });
    }
  
}
//Actualizar usuario
@PUT()
@route('/:id')
public async updateUser(req: Request, res: Response) {
try{
const id = Number(req.params.id)

  const { nombre, rol } = req.body

  const result = await this.usuarioService.updateUser(
    id,
    nombre,
    rol
  )

  res.send(result)
}
  catch (error) {
      const err = error as Error;
      res.status(400).send({ message: err.message });
    }
}
//Desactivar usuario
@POST()
@route('/:id/desactivar')
public async desactivarUsuario(req: Request, res: Response) {
try{
const id = Number(req.params.id)

  const result = await this.usuarioService.desactivarUsuario(id)

  res.send(result)
}
  catch (error) {
      const err = error as Error;
      res.status(400).send({ message: err.message });
    }
  
}
@POST()
@route('/:id/activar')
public async activarUsuario(req: Request, res: Response){
  try{
    const id = Number(req.params.id)
    const result = await this.usuarioService.activarUsuario(id)
    res.send(result)

  }
  catch(error){
    const err = error as Error;
    res.status(400).send({message: err.message});
  }
}
@route('/cambiar/password/:id')
@PATCH()
public async changePassword(req: Request, res: Response) {
try {
const { currentPassword, newPassword } = req.body
if (!currentPassword || !newPassword) {
  return res.status(400).send({
    message: "Contraseña actual y nueva son requeridas"
  })
}
  const userId = Number(req.params.id) // viene del JWT

  const result = await this.usuarioService.changePassword(
    userId,
    currentPassword,
    newPassword
  )
  
  res.send(result)
}
  catch(error){
    const err = error as Error;
    res.status(400).send({message: err.message});
  }
  
}
@route('/reset/password/:id')
@PATCH()
public async resetPassword(req: Request, res: Response) {
try{
  const id = Number(req.params.id)
  const { newPassword } = req.body

  const result = await this.usuarioService.resetPassword(
    id,
    newPassword
  )

  res.send(result)
}

  catch(error){
    const err = error as Error;
    res.status(400).send({message: err.message});
  }
}
}