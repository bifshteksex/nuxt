import pool from "../utils/db";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
}

export class UserModel {
  static async create(
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) {
    const query = `
      INSERT INTO users (first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, first_name, last_name, email, avatar
    `;
    const { rows } = await pool.query(query, [
      first_name,
      last_name,
      email,
      password,
    ]);
    return rows[0];
  }

  static async findByEmail(email: string) {
    const query = "SELECT * FROM users WHERE email = $1";
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  static async findById(id: number): Promise<User | null> {
    const query =
      "SELECT id, first_name, last_name, email, avatar FROM users WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  static async findAll(): Promise<User[]> {
    const query =
      "SELECT id, first_name, last_name, email, avatar FROM users ORDER BY id";
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getUserRoles(userId: number): Promise<string[]> {
    const query = `
      SELECT r.name 
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = $1
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows.map((r) => r.name);
  }

  static async updateUserRoles(userId: number, roleIds: number[]) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("DELETE FROM user_roles WHERE user_id = $1", [userId]);

      for (const roleId of roleIds) {
        await client.query(
          "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
          [userId, roleId]
        );
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(userId: number, data: Partial<User>) {
    const fields = Object.keys(data).filter((k) => k !== "id");
    const values = fields.map((k) => data[k as keyof User]);
    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(", ");

    const query = `
      UPDATE users SET ${setClause}
      WHERE id = $1
      RETURNING id, first_name, last_name, email, avatar
    `;

    const { rows } = await pool.query(query, [userId, ...values]);
    return rows[0];
  }

  static async delete(userId: number) {
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
  }
}
