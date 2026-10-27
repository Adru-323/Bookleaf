
const mongoose = require("mongoose");
const Ticket = require("../models/ticket");

const ticketSocket = (io, socket) => {
  socket.on("join-ticket", async (ticketId, callback) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(ticketId)) {
        return callback?.({
          ok: false,
          message: "Invalid ticket ID",
        });
      }

      const ticket = await Ticket.findById(ticketId).select("author");

      if (!ticket) {
        return callback?.({
          ok: false,
          message: "Ticket not found",
        });
      }

      if (
        socket.role === "author" &&
        ticket.author.toString() !== socket.userId
      ) {
        return callback?.({
          ok: false,
          message: "Access denied",
        });
      }

      if (!["author", "admin"].includes(socket.role)) {
        return callback?.({
          ok: false,
          message: "Access denied",
        });
      }

      socket.join(`ticket:${ticketId}`);

      console.log(`Socket ${socket.id} joined ticket:${ticketId}`);

      callback?.({ ok: true });
    } catch (error) {
      console.error("Join ticket error:", error.message);

      callback?.({
        ok: false,
        message: "Could not join ticket",
      });
    }
  });
};

module.exports = ticketSocket;
