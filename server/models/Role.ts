const pool = require('../config/db');

class Role {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    async save() {
        const query = 'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *';
        const values = [this.name, this.description];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM roles WHERE id = $1';
        const values = [id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async findAll() {
        const query = 'SELECT * FROM roles';
        const { rows } = await pool.query(query);
        return rows;
    }

    static async update(id, name, description) {
        const query = 'UPDATE roles SET name = $1, description = $2 WHERE id = $3 RETURNING *';
        const values = [name, description, id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM roles WHERE id = $1';
        const values = [id];
        await pool.query(query, values);
    }
}

module.exports = Role;