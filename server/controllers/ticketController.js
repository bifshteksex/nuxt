const Ticket = require("../models/Ticket");
const Status = require("../models/Status");

async function createTicket(req, res) {
  try {
    const {
      title,
      description,
      status,
      priority,
      category,
      created_by,
      assigned_to,
    } = req.body;
    const ticket = new Ticket(
      title,
      description,
      status,
      priority,
      category,
      created_by,
      assigned_to
    );
    const newTicket = await ticket.save();
    res.status(201).json(newTicket);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

async function getTicketById(req, res) {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).send("Ticket not found");
    }
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

async function getAllTickets(req, res) {
  try {
    const statusId = req.query.status_id;
    const userId = req.query.user_id;
    const tickets = await Ticket.findAll(statusId, userId);
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

async function updateTicket(req, res) {
  try {
    const { title, description, priority_id, status_id, assigned_to } =
      req.body;
    const ticketId = req.params.id;

    // Получаем текущее состояние тикета
    const currentTicket = await Ticket.findById(ticketId);
    if (!currentTicket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Если изменяется статус, проверяем допустимость перехода
    if (status_id && status_id !== currentTicket.status_id) {
      const userRole = req.user.roles; // Предполагается middleware для аутентификации
      const userId = req.user.id;

      const validation = await Status.canTransition(
        currentTicket.status_id,
        status_id,
        userRole,
        userId,
        currentTicket.assigned_to
      );

      if (!validation.allowed) {
        return res.status(403).json({ error: validation.reason });
      }
    }

    const updated_at = new Date();
    const updatedTicket = await Ticket.update(
      ticketId,
      title,
      description,
      priority_id,
      status_id,
      assigned_to,
      updated_at
    );

    res.json(updatedTicket);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

async function getAvailableTransitions(req, res) {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const transitions = await Status.getTransitions(ticket.status_id);

    // Фильтруем по правам пользователя
    const userRole = req.user.roles;
    const userId = req.user.id;

    const availableTransitions = [];
    for (const transition of transitions) {
      const validation = await Status.canTransition(
        ticket.status_id,
        transition.to_status_id,
        userRole,
        userId,
        ticket.assigned_to
      );

      if (validation.allowed) {
        availableTransitions.push(transition);
      }
    }

    res.json(availableTransitions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

async function deleteTicket(req, res) {
  try {
    const deletedTicket = await Ticket.delete(req.params.id);
    if (!deletedTicket) {
      return res.status(404).send("Ticket not found");
    }
    res.json(deletedTicket);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

module.exports = {
  createTicket,
  getTicketById,
  getAllTickets,
  updateTicket,
  deleteTicket,
  getAvailableTransitions,
};
