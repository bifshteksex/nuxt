const pool = require('../config/db');

class Priority {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static async findAll() {
        const query = 'SELECT * FROM priority';
        const { rows } = await pool.query(query);
        return rows.map(row => new Priority(row.id, row.name));
    }

    static async findById(id) {
        const query = 'SELECT * FROM priority WHERE id = $1';
        const values = [id];
        const { rows } = await pool.query(query, values);
        if (rows.length > 0) {
            return new Priority(rows[0].id, rows[0].name);
        }
        return null;
    }
}

module.exports = Priority;