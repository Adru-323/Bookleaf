
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config.js";

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/tickets/my-tickets`,
          { withCredentials: true }
        );

        setTickets(response.data.tickets);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch tickets"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <p>Loading your tickets...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

return (
  <div className="container mt-4 mb-5">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="fw-bold">My Support Tickets</h2>
        <p className="text-muted mb-0">
          Track your support requests and their status.
        </p>
      </div>

      <span className="badge bg-primary fs-6">
        {tickets.length} Tickets
      </span>
    </div>

    {tickets.length === 0 ? (
      <div className="text-center p-5 border rounded">
        <h5>No tickets yet</h5>
        <p className="text-muted">
          You haven't raised any support tickets.
        </p>
      </div>
    ) : (
      <div className="row g-3">
        {tickets.map((ticket) => (
          <div className="col-12" key={ticket._id}>

              <div
    className="card shadow-sm border-0"
    role="button"
    onClick={() => navigate(`/author/tickets/${ticket._id}`)}
    style={{ cursor: "pointer" }}
  >
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <h5 className="fw-bold mb-2">
                      {ticket.subject}
                    </h5>

                    <p className="text-muted mb-2">
                      {ticket.book?.title || "General Inquiry"}
                    </p>
                  </div>

                  <span
                    className={`badge ${
                      ticket.status === "Resolved" ||
                      ticket.status === "Closed"
                        ? "bg-success"
                        : ticket.status === "In Progress"
                        ? "bg-primary"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <p className="mb-3">{ticket.description}</p>

                <div className="d-flex flex-wrap gap-3 text-muted small">
                  <span>
                    <strong>Category:</strong>{" "}
                    {ticket.category}
                  </span>

                  <span>
                    <strong>Priority:</strong>{" "}
                    {ticket.priority}
                  </span>

                  <span>
                    <strong>Created:</strong>{" "}
                    {new Date(ticket.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
            </div>
          </div>
        ))}

        
      </div>
    )}
  </div>
);
}

export default MyTickets;




