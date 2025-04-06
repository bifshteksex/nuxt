const Comment = require('../models/Comment');
const User = require('../models/User');

async function getComments(req, res) {
    try {
        const ticketId = req.params.ticketId;
        const comments = await Comment.getAllByTicketId(ticketId);
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения комментариев' });
    }
}

async function addComment(req, res) {
    try {
        const ticketId = req.params.ticketId;
        const { userId, content } = req.body;
        const comment = await Comment.create(ticketId, userId, content);
        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка добавления комментария' });
    }
}

module.exports = {
    getComments,
    addComment
};