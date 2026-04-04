import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UsuarioRepositoryMySQL } from './repositories/implements/mysql/usuario.repository.mysql';

export class UsuarioService {

  private usuarioRepository = new UsuarioRepositoryMySQL();
async login(email: string, password: string) {

    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    const user = await this.usuarioRepository.findByEmail(email);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (!user.activo) {
  throw new Error('Usuario desactivado');
}
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new Error('Contraseña incorrecta');
    }

    // Generar token
  const token = jwt.sign(
  {
    id_usuario: user.id_usuario,
    email: user.email,
    rol: user.rol
  },
  process.env.JWT_SECRET as string,
  { expiresIn: Number(process.env.JWT_EXPIRES) }
);

    return {
      message: 'Login exitoso',
      token
    };
  }
  async createUser(nombre: string, email: string, password: string, rol: string) {

    if (!nombre || !email || !password || !rol) {
      throw new Error('Todos los campos son obligatorios');
    }

    if (password.length < 6) {
      throw new Error('La contraseña debe tener mínimo 6 caracteres');
    }

    const userExists = await this.usuarioRepository.findByEmail(email);
    if (userExists) {
      throw new Error('El email ya está registrado');
    }

    const password_hash = await bcrypt.hash(password, 10);

    const id = await this.usuarioRepository.create({
      nombre,
      email,
      password_hash,
      id_rol: Number(rol),
      activo: true
    });

    return {
      message: 'Usuario creado correctamente',
      id
    };
  }
  async getUsuarios() {
  return await this.usuarioRepository.findAll()
}
async updateUser(id: number, nombre: string, rol: string) {

  if (!nombre || !rol) {
    throw new Error("Nombre y rol son obligatorios")
  }

  await this.usuarioRepository.updateUser(id, nombre, rol)

  return {
    message: "Usuario actualizado correctamente"
  }
}
async desactivarUsuario(id: number) {

  await this.usuarioRepository.desactivarUsuario(id)

  return {
    message: "Usuario desactivado correctamente"
  }
}
async activarUsuario(id:number){
  await this.usuarioRepository.activarUsuario(id)

  return {
    message: "Usuario activado correctamente"
  }
}
async getUsuarioById(id: number) {

  if (!id) {
    throw new Error("ID es requerido")
  }

  const usuario = await this.usuarioRepository.obtenerUsuarioPorId(id)

  if (!usuario) {
    throw new Error("Usuario no encontrado")
  }

  return usuario
}
async changePassword(
  id:number,
  currentPassword:string,
  newPassword:string
){

const user = await this.usuarioRepository.obtenerUsuarioPorId(id)


if(!user){
  throw new Error("Usuario no encontrado")
}

const match = await bcrypt.compare(
  currentPassword,
  user.password_hash
)

if(!match){
  throw new Error("Contraseña actual incorrecta")
}

const passwordHash = await bcrypt.hash(newPassword,10)

await this.usuarioRepository.updatePassword(
  id,
  passwordHash
)

return{
  message:"Contraseña actualizada correctamente"
}

}
//Reinicio de contraseña desde usuario admin 
async resetPassword(id:number,newPassword:string){

if(newPassword.length < 6){
  throw new Error("Contraseña debe tener mínimo 6 caracteres")
}

const passwordHash = await bcrypt.hash(newPassword,10)

await this.usuarioRepository.updatePassword(
  id,
  passwordHash
)

return{
  message:"Contraseña reseteada correctamente"
}

}
}