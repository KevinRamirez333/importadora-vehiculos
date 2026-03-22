import { ModeloRepository } from "../../modelo.repository";
import { Modelo } from "../../domain/modelo";
import connector from '../../../../common/persistence/persistence.mysql';

export class ModeloRepositoryMySQL implements ModeloRepository {

  async create(modelo: Modelo): Promise<number> {

    const query = `
      INSERT INTO modelo (nombre, id_marca)
      VALUES (?, ?)
    `

    const [result]: any = await connector.query(query, [
      modelo.nombre,
      modelo.id_marca
    ])

    return result.insertId
  }

  async findById(id: number): Promise<Modelo | null> {

    const query = `SELECT * FROM modelo WHERE id_modelo = ?`
    const [rows]: any = await connector.query(query, [id])

    return rows.length ? rows[0] : null
  }

  async findAll(): Promise<Modelo[]> {

    const query = `
      SELECT m.*, ma.nombre AS marca
      FROM modelo m
      INNER JOIN marca ma ON m.id_marca = ma.id_marca
    `

    const [rows]: any = await connector.query(query)
    return rows
  }

  async findByMarca(id_marca: number): Promise<Modelo[]> {

    const query = `
      SELECT * FROM modelo
      WHERE id_marca = ? AND activo = true
    `

    const [rows]: any = await connector.query(query, [id_marca])
    return rows
  }

  async update(id: number, modelo: Modelo): Promise<void> {

    const query = `
      UPDATE modelo
      SET nombre = ?, id_marca = ?
      WHERE id_modelo = ?
    `

    await connector.query(query, [
      modelo.nombre,
      modelo.id_marca,
      id
    ])
  }

  async deactivate(id: number): Promise<void> {

    await connector.query(
      `UPDATE modelo SET activo = false WHERE id_modelo = ?`,
      [id]
    )
  }

  async activate(id: number): Promise<void> {

    await connector.query(
      `UPDATE modelo SET activo = true WHERE id_modelo = ?`,
      [id]
    )
  }

}