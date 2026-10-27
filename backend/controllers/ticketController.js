
const Ticket = require("../models/ticket");

// Author creates a support ticket
const createTicket = async (req, res) => {
  try {
    const { book, subject, description } = req.body;

    // validate
    if (!subject?.trim() || !description?.trim()) {
      return res.status(400).json({
        message: "Subject and description are required",
      });
    }

    // Create ticket (only login user)
    const ticket = await Ticket.create({
      author: req.user.userId, //middleware se
      book: book || null,
      subject: subject.trim(),
      description: description.trim(),
    });

    return res.status(201).json({
      message: "Support ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error("Create ticket error:", error.message);

    return res.status(500).json({
      message: "Failed to create support ticket",
    });
  }
};

const getMyTickets = async (req, res) => {  //bas login wale
  try {
    const tickets = await Ticket.find({
      author: req.user.userId,
    })
      .populate("book", "title book_id") //book k field se title aur id 
      .select("-internalNotes") //exclude internalnotes -minus
      .sort({ createdAt: -1 });

    return res.status(200).json({
      tickets,
    });
  } catch (error) {
    console.error("Get tickets error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch tickets",
    });
  }
};


// Author or admin replies to a ticket
const addReply = async (req, res) => {
  try {
    const { message } = req.body;
    const { ticketId } = req.params;

    // Validate 
    if (!message?.trim()) {
      return res.status(400).json({
        message: "Reply message is required",
      });
    }

    // Find ticket
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    // Author can reply only to their own ticket
    if (
      req.user.role === "author" &&
      ticket.author.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "You are not allowed to reply to this ticket",
      });
    }

    // Only authors and admins can reply
    if (!["author", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // Save reply
    ticket.responses.push({
      message: message.trim(),
      sender: req.user.userId,
    });

    await ticket.save();

    const io = req.app.get("io");

io.to(`ticket:${ticketId}`).emit("new-reply", {
  ticketId: ticket._id,
});

    // Return updated ticket without internal notes
    const updatedTicket = await Ticket.findById(ticketId)
      .populate("book", "title book_id")
      .populate("responses.sender", "name role")
      .select("-internalNotes");

    return res.status(201).json({
      message: "Reply added successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Add reply error:", error.message);

    return res.status(500).json({
      message: "Failed to add reply",
    });
  }
};


// Fetch one ticket by ID
const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId)
      .populate("book", "title book_id")
      .populate("author", "name email")
      .populate("responses.sender", "name role")
      .select("-internalNotes");

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    // Authors can only view their own tickets
    if (
      req.user.role === "author" &&
      ticket.author._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "You are not allowed to view this ticket",
      });
    }

    return res.status(200).json({ ticket });
  } catch (error) {
    console.error("Get ticket by ID error:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ticket ID",
      });
    }

    return res.status(500).json({
      message: "Failed to fetch ticket",
    });
  }
};


const getAllTickets = async (req, res) => { //sab users k
  try {
    // Only admin can access all tickets
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const tickets = await Ticket.find()
      .populate("author", "name email")
      .populate("book", "title book_id")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .select("-internalNotes");

    return res.status(200).json({ tickets });
  } catch (error) {
    console.error("Get all tickets error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch all tickets",
    });
  }
};


const updateTicketStatus = async (req, res) => {
  try {
    // Only admin can update ticket status
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const { ticketId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Open",
      "In Progress",
      "Resolved",
      "Closed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid ticket status",
        allowedStatuses,
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { $set: { status } },
      { new: true, runValidators: true }
    )
      .populate("author", "name email")
      .populate("book", "title book_id")
      .populate("assignedTo", "name email")
      .select("-internalNotes");

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      message: "Ticket status updated successfully",
      ticket,
    });
  } catch (error) {
    console.error("Update ticket status error:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ticket ID",
      });
    }

    return res.status(500).json({
      message: "Failed to update ticket status",
    });
  }
};




module.exports = { createTicket ,getMyTickets ,addReply , getTicketById , getAllTickets , updateTicketStatus};
