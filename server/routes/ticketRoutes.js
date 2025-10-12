const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  getTicketById,
  getAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  getAvailableTransitions,
} = require("../controllers/ticketController");

router.get("/", authenticateToken, getAllTickets);
router.post("/", authenticateToken, createTicket);

router.get("/:id/transitions", authenticateToken, getAvailableTransitions);

router.get("/:id", authenticateToken, getTicketById);
router.put("/:id", authenticateToken, updateTicket);
router.delete("/:id", authenticateToken, deleteTicket);

module.exports = router;
