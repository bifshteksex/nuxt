const pool = require("../config/db");

class Status {
  constructor(id, name, position) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.position = position;
  }

  async save() {
    const query = "INSERT INTO statuses (name) VALUES ($1) RETURNING *";
    const values = [this.name];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findById(id) {
    const query = "SELECT * FROM statuses WHERE id = $1";
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findAll() {
    const query = "SELECT * FROM statuses";
    const { rows } = await pool.query(query);
    return rows;
  }

  static async update(id, name) {
    const query = "UPDATE statuses SET name = $1 WHERE id = $2 RETURNING *";
    const values = [name, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = "DELETE FROM statuses WHERE id = $1";
    const values = [id];
    await pool.query(query, values);
  }

  static async updatePositions(order) {
    for (let i = 0; i < order.length; i++) {
      await pool.query("UPDATE statuses SET position = $1 WHERE id = $2", [
        i,
        order[i],
      ]);
    }
  }

  static async getTransitions(fromStatusId) {
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
    fromStatusId,
    toStatusId,
    userRole,
    userId,
    assignedTo
  ) {
    const query = `
      SELECT * FROM status_transitions 
      WHERE from_status_id = $1 AND to_status_id = $2 AND required_role = $3
    `;
    const { rows } = await pool.query(query, [
      fromStatusId,
      toStatusId,
      userRole,
    ]);

    if (rows.length === 0) {
      return { allowed: false, reason: "Переход не разрешен для вашей роли" };
    }

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

module.exports = Status;
