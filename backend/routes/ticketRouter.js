
const express = require("express");
const router = express.Router();

const { createTicket ,getMyTickets , addReply ,getTicketById , getAllTickets, updateTicketStatus} = require("../controllers/ticketController.js");
const authMiddleware = require("../middleware/authmiddleware.js");

router.post("/", authMiddleware, createTicket);
router.get("/my-tickets", authMiddleware, getMyTickets);
router.post("/:ticketId/replies", authMiddleware, addReply);
router.get("/:ticketId", authMiddleware, getTicketById);
router.get("/", authMiddleware, getAllTickets);
router.patch(
  "/:ticketId/status",
  authMiddleware,
  updateTicketStatus
);
module.exports = router;
