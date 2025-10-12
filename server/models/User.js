const pool = require("../config/db");

class User {
  constructor(first_name, last_name, email, password, id, avatar) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.id = id;
    this.avatar = avatar;
  }

  async save() {
    const query =
      "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [this.first_name, this.last_name, this.email, this.password];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findAll() {
    const query = "SELECT id, first_name, last_name, email, avatar FROM users";
    const { rows } = await pool.query(query);
    return rows.map(
      (row) =>
        new User(
          row.first_name,
          row.last_name,
          row.email,
          null,
          row.id,
          row.avatar
        )
    );
  }

  static async findById(id) {
    const query =
      "SELECT id, first_name, last_name, email, avatar FROM users WHERE id = $1";
    const values = [id];
    const { rows } = await pool.query(query, values);
    if (rows.length > 0) {
      return new User(
        rows[0].first_name,
        rows[0].last_name,
        rows[0].email,
        null,
        rows[0].id,
        rows[0].avatar
      );
    }
    return rows[0];
  }

  static async getUserRoles(userId) {
    const query = `
    SELECT r.name 
    FROM user_roles ur
    INNER JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = $1
  `;
    const values = [userId];
    const { rows } = await pool.query(query, values);
    return rows.map((row) => row.name);
  }

  static async updateUserRoles(userId, roleIds) {
    try {
      await pool.query("DELETE FROM user_roles WHERE user_id = $1", [userId]);

      if (roleIds && roleIds.length > 0) {
        for (const roleId of roleIds) {
          await pool.query(
            "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
            [userId, roleId]
          );
        }
      }
      return true;
    } catch (error) {
      console.error("Error updating user roles:", error);
      return false;
    }
  }

  static async update(userId, email, first_name, last_name, avatar) {
    try {
      const query = `
        UPDATE users
        SET email = $1, first_name = $2, last_name = $3, avatar = $4
        WHERE id = $5
        RETURNING id, first_name, last_name, email, avatar
      `;
      const values = [email, first_name, last_name, avatar, userId];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  }

  static async delete(userId) {
    try {
      await pool.query("DELETE FROM user_roles WHERE user_id = $1", [userId]);

      const query = "DELETE FROM users WHERE id = $1";
      const values = [userId];
      await pool.query(query, values);
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }
}

module.exports = User;
