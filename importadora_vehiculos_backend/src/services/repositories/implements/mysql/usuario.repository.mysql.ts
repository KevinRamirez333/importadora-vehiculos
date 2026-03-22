import { Usuario } from "../../domain/usuario";
import { UsuarioRepository } from "../../usuario.repository";
import connector from "../../../../common/persistence/persistence.mysql"

export class UsuarioRepositoryMySQL implements UsuarioRepository {
    async create(user: Usuario): Promise<number> {
    const query = `
      INSERT INTO usuario (nombre, email, password_hash, id_rol)
      VALUES (?, ?, ?, ?)
    `;

    const values = [
      user.nombre,
      user.email,
      user.password_hash,
      user.id_rol
    ];

    const [result]: any = await connector.query(query, values);
    return result.insertId;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const query = `
    SELECT u.*, r.nombre AS rol
    FROM usuario u
    JOIN rol r ON u.id_rol = r.id_rol
    WHERE u.email = ?
  `;
    const [rows]: any = await connector.query(query, [email]);

    if (rows.length === 0) return null;

    return rows[0] as Usuario;
  }

  async findAll(): Promise<Usuario[]> {

  const query = `SELECT u.id_usuario, u.nombre, u.email, r.nombre AS rol, u.activo
FROM usuario u
LEFT JOIN rol r ON u.id_rol = r.id_rol`

  const [rows]: any = await connector.query(query)

  return rows
}
async updateUser(id: number, nombre: string, rol: string): Promise<void> {

  const query = `
    UPDATE usuario
    SET nombre = ?, id_rol = ?
    WHERE id_usuario = ?
  `

  await connector.query(query, [nombre, Number(rol), id])
}
async desactivarUsuario(id: number): Promise<void> {

  const query = `
    UPDATE usuario
    SET activo = FALSE
    WHERE id_usuario = ?
  `

  await connector.query(query, [id])
}
async activarUsuario(id: number): Promise<void> {
  const query =`
  UPDATE usuario
  SET activo = TRUE
  WHERE id_usuario = ?`
  await connector.query(query,[id])
}
async obtenerUsuarioPorId(id: number): Promise<Usuario | null> {
const [rows]: any = await connector.execute(
  `SELECT u.id_usuario, u.nombre, u.email, 
          r.nombre AS rol, 
          u.activo, u.password_hash
   FROM usuario u
   LEFT JOIN rol r ON u.id_rol = r.id_rol
   WHERE u.id_usuario = ?`,
  [id]
);

  if (rows.length === 0) return null

  return rows[0]
}
async updatePassword(id: number, passwordHash: string): Promise<void> {
  
  const query = `
UPDATE usuario
SET password_hash = ?
WHERE id_usuario = ?
`

await connector.query(query,[passwordHash,id])
}
}
  
