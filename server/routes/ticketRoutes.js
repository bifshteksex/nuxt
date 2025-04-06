const express = require('express');
const router = express.Router();
const { createTicket, getTicketById, getAllTickets, updateTicket, deleteTicket } = require('../controllers/ticketController');

router.post('/', createTicket);
router.get('/:id', getTicketById);
router.get('/', getAllTickets);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);

module.exports = router;