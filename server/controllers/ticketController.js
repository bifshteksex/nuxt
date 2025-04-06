const Ticket = require('../models/Ticket');

async function createTicket(req, res) {
  try {
    const { title, description, status, priority, category, created_by, assigned_to } = req.body;
    const ticket = new Ticket(title, description, status, priority, category, created_by, assigned_to);
    const newTicket = await ticket.save();
    res.status(201).json(newTicket);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

async function getTicketById(req, res) {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).send('Ticket not found');
    }
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

async function getAllTickets(req, res) {
  try {
    const statusId = req.query.status_id;
    const assignedTo = req.query.assigned_to;
    const tickets = await Ticket.findAll(statusId, assignedTo);
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

async function updateTicket(req, res) {
  try {
    const { title, description, priority_id, status_id, assigned_to } = req.body;
    const updated_at = new Date();
    const updatedTicket = await Ticket.update(req.params.id, title, description, priority_id, status_id, assigned_to, updated_at);
    if (!updatedTicket) {
      return res.status(404).send('Ticket not found');
    }
    res.json(updatedTicket);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

async function deleteTicket(req, res) {
  try {
    const deletedTicket = await Ticket.delete(req.params.id);
    if (!deletedTicket) {
      return res.status(404).send('Ticket not found');
    }
    res.json(deletedTicket);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

module.exports = {
  createTicket,
  getTicketById,
  getAllTickets,
  updateTicket,
  deleteTicket,
};