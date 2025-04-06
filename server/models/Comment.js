const pool = require('../config/db');

class Comment {
    static async getAllByTicketId(ticketId) {
        const query = 'SELECT * FROM comments WHERE ticket_id = $1';
        const values = [ticketId];
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async create(ticketId, userId, content) {
        const query = 'INSERT INTO comments (ticket_id, user_id, content) VALUES ($1, $2, $3) RETURNING *';
        const values = [ticketId, userId, content];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}

module.exports = Comment;