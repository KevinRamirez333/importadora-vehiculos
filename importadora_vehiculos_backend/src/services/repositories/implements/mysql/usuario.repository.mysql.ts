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

  async findAll(): Promise<Usuario[]> {

  const query = "SELECT id, nombre, email, rol, activo FROM usuarios"

  const [rows]: any = await connector.query(query)

  return rows
}
async updateUser(id: number, nombre: string, rol: string): Promise<void> {

  const query = `
    UPDATE usuarios
    SET nombre = ?, rol = ?
    WHERE id = ?
  `

  await connector.query(query, [nombre, rol, id])
}
async desactivarUsuario(id: number): Promise<void> {

  const query = `
    UPDATE usuarios
    SET activo = FALSE
    WHERE id = ?
  `

  await connector.query(query, [id])
}
async activarUsuario(id: number): Promise<void> {
  const query =`
  UPDATE usuarios
  SET activo = TRUE
  WHERE id = ?`
  await connector.query(query,[id])
}
async obtenerUsuarioPorId(id: number): Promise<Usuario | null> {
  const [rows]: any = await connector.execute(
    'SELECT id, nombre, email, rol, activo,password_hash FROM usuarios WHERE id = ?',
    [id]
  )

  if (rows.length === 0) return null

  return rows[0]
}
async updatePassword(id: number, passwordHash: string): Promise<void> {
  console.log(id, passwordHash);
  const query = `
UPDATE usuarios
SET password_hash = ?
WHERE id = ?
`

await connector.query(query,[passwordHash,id])
}
}
  
