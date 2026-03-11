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

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new Error('Contraseña incorrecta');
    }

    
    // Generar token
  const token = jwt.sign(
  {
    id: user.id,
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
      rol: rol as any
    });

    return {
      message: 'Usuario creado correctamente',
      id
    };
  }
}