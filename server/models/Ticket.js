const pool = require('../config/db');

class Ticket {
  constructor(title, description, status, priority, category, created_by, assigned_to) {
    this.title = title;
    this.description = description;
    this.status_id = status || 1;
    this.priority_id = priority || 1;
    this.category = category;
    this.created_by = created_by;
    this.assigned_to = assigned_to;
  }

  async save() {
    const query = 'INSERT INTO tickets (title, description, status_id, priority_id, category, created_by, assigned_to) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [this.title, this.description, this.status_id, this.priority_id, this.category, this.created_by, this.assigned_to];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM tickets WHERE id = $1';
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findAll(statusId, assignedTo) {
    let query = 'SELECT * FROM tickets';
    let values = [];
    let conditions = [];

    if (statusId !== null && statusId !== undefined) {
      conditions.push('status_id = $1');
      values.push(statusId);
    }

    if (assignedTo !== null && assignedTo !== undefined) {
      conditions.push(conditions.length > 0 ? 'assigned_to = $2' : 'assigned_to = $1'); // Учитываем порядок параметров
      values.push(assignedTo);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const { rows } = await pool.query(query, values);
    return rows;
  }

  static async update(id, title, description, priority_id, status_id, assigned_to, updated_at) {
    let query = 'UPDATE tickets SET ';
    let values = [id];
    let updates = [];

    if (title !== undefined) {
      updates.push('title = $' + (values.length + 1));
      values.push(title);
    }
    if (description !== undefined) {
      updates.push('description = $' + (values.length + 1));
      values.push(description);
    }
    if (priority_id !== undefined) {
      updates.push('priority_id = $' + (values.length + 1));
      values.push(priority_id);
    }
    if (status_id !== undefined) {
      updates.push('status_id = $' + (values.length + 1));
      values.push(status_id);
    }
    if (assigned_to !== undefined) {
      updates.push('assigned_to = $' + (values.length + 1));
      values.push(assigned_to);
    }
    updates.push('updated_at = $' + (values.length + 1));
    values.push(updated_at);

    query += updates.join(', ') + ' WHERE id = $1 RETURNING *';

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM tickets WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}

module.exports = Ticket;