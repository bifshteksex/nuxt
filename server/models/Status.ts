import pool from "../utils/db";

export interface StatusTransition {
  to_status_id: number;
  name: string;
  code: string;
  required_role: string;
  requires_assignment: boolean;
}

export class StatusModel {
  static async findAll() {
    const query = "SELECT * FROM statuses ORDER BY position";
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findById(id: number) {
    const query = "SELECT * FROM statuses WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async getTransitions(
    fromStatusId: number
  ): Promise<StatusTransition[]> {
    const query = `
      SELECT st.to_status_id, s.name, s.code, 
             st.required_role, st.requires_assignment
      FROM status_transitions st
      JOIN statuses s ON st.to_status_id = s.id
      WHERE st.from_status_id = $1
    `;
    const { rows } = await pool.query(query, [fromStatusId]);
    return rows;
  }

  static async canTransition(
    fromStatusId: number,
    toStatusId: number,
    userRoles: string[],
    userId: number,
    assignedTo?: number
  ): Promise<{ allowed: boolean; reason?: string }> {
    // Проверяем каждую роль пользователя
    for (const role of userRoles) {
      const query = `
        SELECT * FROM status_transitions 
        WHERE from_status_id = $1 AND to_status_id = $2 AND required_role = $3
      `;
      const { rows } = await pool.query(query, [
        fromStatusId,
        toStatusId,
        role,
      ]);

      if (rows.length > 0) {
        const transition = rows[0];

        // Проверка назначения
        if (transition.requires_assignment && userId !== assignedTo) {
          return {
            allowed: false,
            reason: "Вы должны быть ответственным за этот тикет",
          };
        }

        return { allowed: true };
      }
    }

    return {
      allowed: false,
      reason: "Переход не разрешен для вашей роли",
    };
  }

  static async updatePositions(order: number[]) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (let i = 0; i < order.length; i++) {
        await client.query("UPDATE statuses SET position = $1 WHERE id = $2", [
          i,
          order[i],
        ]);
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
