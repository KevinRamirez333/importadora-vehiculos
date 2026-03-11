import { Usuario } from "../../domain/usuario";
import { UsuarioRepository } from "../../usuario.repository";
import connector from "../../../../common/persistence/persistence.mysql"

export class UsuarioRepositoryMySQL implements UsuarioRepository {
    async create(user: Usuario): Promise<number> {
    const query = `
      INSERT INTO usuarios (nombre, email, password_hash, rol)
      VALUES (?, ?, ?, ?)
    `;

    const values = [
      user.nombre,
      user.email,
      user.password_hash,
      user.rol
    ];

    const [result]: any = await connector.query(query, values);
    return result.insertId;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const query = "SELECT * FROM usuarios WHERE email = ?";
    const [rows]: any = await connector.query(query, [email]);

    if (rows.length === 0) return null;

    return rows[0] as Usuario;
  }
}
