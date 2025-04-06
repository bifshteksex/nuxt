const pool = require('../config/db');

class Status {
    constructor(id, name, position) {
        this.id = id;
        this.name = name;
        this.position = position;
    }

    async save() {
        const query = 'INSERT INTO statuses (name) VALUES ($1) RETURNING *';
        const values = [this.name];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM statuses WHERE id = $1';
        const values = [id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async findAll() {
        const query = 'SELECT * FROM statuses';
        const { rows } = await pool.query(query);
        return rows;
    }

    static async update(id, name) {
        const query = 'UPDATE statuses SET name = $1 WHERE id = $2 RETURNING *';
        const values = [name, id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM statuses WHERE id = $1';
        const values = [id];
        await pool.query(query, values);
    }

    static async updatePositions(order) {
        for (let i = 0; i < order.length; i++) {
            await pool.query('UPDATE statuses SET position = $1 WHERE id = $2', [i, order[i]]);
        }
    }
}

module.exports = Status;