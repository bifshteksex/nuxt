import pool from "../utils/db";

export interface Ticket {
  id: number;
  title: string;
  description?: string;
  status_id: number;
  priority_id: number;
  category?: string;
  created_by: number;
  assigned_to?: number;
  created_at: Date;
  updated_at: Date;
}

export class TicketModel {
  static async create(data: Omit<Ticket, "id" | "created_at" | "updated_at">) {
    const query = `
      INSERT INTO tickets (title, description, status_id, priority_id, category, created_by, assigned_to)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      data.title,
      data.description,
      data.status_id || 1,
      data.priority_id || 1,
      data.category,
      data.created_by,
      data.assigned_to,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findById(id: number): Promise<Ticket | null> {
    const query = "SELECT * FROM tickets WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  static async findAll(filters?: {
    status_id?: number;
    user_id?: number;
  }): Promise<Ticket[]> {
    let query = "SELECT * FROM tickets WHERE 1=1";
    const values: any[] = [];
    let paramCount = 1;

    if (filters?.status_id) {
      query += ` AND status_id = $${paramCount}`;
      values.push(filters.status_id);
      paramCount++;
    }

    if (filters?.user_id) {
      query += ` AND (assigned_to = $${paramCount} OR created_by = $${paramCount})`;
      values.push(filters.user_id);
      paramCount++;
    }

    query += " ORDER BY updated_at DESC";

    const { rows } = await pool.query(query, values);
    return rows;
  }

  static async update(id: number, data: Partial<Ticket>) {
    const fields = Object.keys(data).filter(
      (k) => k !== "id" && k !== "created_at"
    );
    const values = fields.map((k) => data[k as keyof Ticket]);
    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(", ");

    const query = `
      UPDATE tickets 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const { rows } = await pool.query(query, [id, ...values]);
    return rows[0];
  }

  static async delete(id: number) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("DELETE FROM comments WHERE ticket_id = $1", [id]);
      await client.query("DELETE FROM tickets WHERE id = $1", [id]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
