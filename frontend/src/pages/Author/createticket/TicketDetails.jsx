
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { API_URL, SOCKET_URL } from "../../../config.js";

function TicketDetails() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const fetchTicket = async () => {



    //main displat 
    try {
      const response = await axios.get(
        `${API_URL}/tickets/${ticketId}`,
        { withCredentials: true }
      );

      setTicket(response.data.ticket);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load ticket"
      );
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  //socket 
useEffect(() => {
  const socket = io(SOCKET_URL, {
    withCredentials: true,
  });


socket.on("connect", () => {
  console.log("Socket connected:", socket.id);

  socket.emit("join-ticket", ticketId, (result) => {
    if (result?.ok) {
      console.log("Joined ticket room successfully");
    } else {
      console.error("Join failed:", result?.message);
    }
  });
});


socket.on("new-reply", (data) => {
  console.log("New reply event received:", data);

  if (data.ticketId === ticketId) {
    fetchTicket();
  }
});


  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
  });

  return () => {
    socket.off("new-reply");
    socket.disconnect();
  };
}, [ticketId]);



  const handleReply = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      setSending(true);
      setError("");

      const response = await axios.post(
        `${API_URL}/tickets/${ticketId}/replies`,
        { message: message.trim() },
        { withCredentials: true }
      );

      setTicket(response.data.ticket);
      setMessage("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send reply"
      );
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading ticket...</div>;
  }

  if (!ticket) {
    return (
      <div className="container mt-4">
        <p>{error || "Ticket not found"}</p>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/author/tickets")}
        >
          Back to My Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate("/author/tickets")}
      >
        ← Back to My Tickets
      </button>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between gap-3">
            <h2 className="fw-bold">{ticket.subject}</h2>
            <span className="badge bg-primary align-self-start">
              {ticket.status}
            </span>
          </div>

          <p className="text-muted">
            {ticket.book?.title || "General Inquiry"}
          </p>

          <p>{ticket.description}</p>

          <hr />

          <p>
            <strong>Category:</strong> {ticket.category}
          </p>
          <p>
            <strong>Priority:</strong> {ticket.priority}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(ticket.createdAt).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h4 className="fw-bold mb-4">Conversation</h4>

          {ticket.responses?.length ? (
            ticket.responses.map((reply, index) => (
              <div
                key={reply._id || index}
                className="border rounded p-3 mb-3"
              >
                <div className="d-flex justify-content-between gap-2">
                  <strong>
                    {reply.sender?.name || "Support Team"}
                  </strong>
                  <small className="text-muted">
                    {new Date(reply.createdAt).toLocaleString("en-IN")}
                  </small>
                </div>

                <p className="mb-0 mt-2">{reply.message}</p>
              </div>
            ))
          ) : (
            <p className="text-muted">
              No replies yet. You can send a message below.
            </p>
          )}

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          <form onSubmit={handleReply}>
            <label className="form-label fw-semibold">
              Write a reply
            </label>

            <textarea
              className="form-control mb-3"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              required
            />

            <button
              type="submit"
              className="btn btn-primary"
              disabled={sending || !message.trim()}
            >
              {sending ? "Sending..." : "Send Reply"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TicketDetails;
