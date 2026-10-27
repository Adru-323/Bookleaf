
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { API_URL, SOCKET_URL } from "../../config.js";

function AdminTicketDetails() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const fetchTicket = useCallback(async () => {
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
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Admin socket connected:", socket.id);

      socket.emit("join-ticket", ticketId, (result) => {
        if (result?.ok) {
          console.log("Admin joined ticket room successfully");
        } else {
          console.error("Ticket room join failed:", result?.message);
        }
      });
    });

    socket.on("new-reply", (data) => {
      if (String(data.ticketId) === String(ticketId)) {
        fetchTicket();
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Admin socket error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [ticketId, fetchTicket]);

  
const handleStatusChange = async (e) => {
  const newStatus = e.target.value;

  try {
    setError("");

    const response = await axios.patch(
      `${API_URL}/tickets/${ticketId}/status`,
      { status: newStatus },
      { withCredentials: true }
    );

    setTicket(response.data.ticket);
  } catch (err) {
    setError(
      err.response?.data?.message || "Failed to update ticket status"
    );
  }
};

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
        <div className="alert alert-danger">
          {error || "Ticket not found"}
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate("/admin/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between gap-3">
            <h2 className="fw-bold">{ticket.subject}</h2>


<select
  className="form-select"
  style={{ width: "180px" }}
  value={ticket.status}
  onChange={handleStatusChange}
>
  <option value="Open">Open</option>
  <option value="In Progress">In Progress</option>
  <option value="Resolved">Resolved</option>
  <option value="Closed">Closed</option>
</select>

          </div>

          <p className="text-muted">
            Author: {ticket.author?.name || "Unknown"} (
            {ticket.author?.email || "No email"})
          </p>

          <p className="text-muted">
            Book: {ticket.book?.title || "General Inquiry"}
          </p>

          <p>{ticket.description}</p>

          <hr />

          <p><strong>Category:</strong> {ticket.category}</p>
          <p><strong>Priority:</strong> {ticket.priority}</p>
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
            <p className="text-muted">No replies yet.</p>
          )}

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          <form onSubmit={handleReply}>
            <label className="form-label fw-semibold">
              Reply to author
            </label>

            <textarea
              className="form-control mb-3"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your reply..."
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

export default AdminTicketDetails;
