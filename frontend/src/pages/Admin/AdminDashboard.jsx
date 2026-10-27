
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config.js";

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/tickets`, {
        withCredentials: true,
      });

      setTickets(response.data.tickets);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const openCount = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const progressCount = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  if (loading) {
    return <div className="container mt-4">Loading dashboard...</div>;
  }

  return (
    <div className="container-fluid py-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Admin Dashboard</h2>
          <p className="text-muted mb-0">
            Manage author support tickets
          </p>
        </div>

        <button className="btn btn-outline-primary" onClick={fetchTickets}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Total Tickets</p>
              <h3 className="fw-bold">{tickets.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Open</p>
              <h3 className="fw-bold text-primary">{openCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">In Progress</p>
              <h3 className="fw-bold text-warning">{progressCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Resolved</p>
              <h3 className="fw-bold text-success">{resolvedCount}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="fw-bold mb-3">All Support Tickets</h5>

          {tickets.length === 0 ? (
            <p className="text-muted">No tickets found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Author</th>
                    <th>Book</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket._id}
                      onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
                      style={{ cursor: "pointer" }}>
                      <td className="fw-semibold">{ticket.subject}</td>

                      <td>
                        <div>{ticket.author?.name || "Unknown"}</div>
                        <small className="text-muted">
                          {ticket.author?.email}
                        </small>
                      </td>

                      <td>{ticket.book?.title || "General Inquiry"}</td>
                      <td>{ticket.category}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {ticket.priority}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-primary">
                          {ticket.status}
                        </span>
                      </td>
                      <td>
                        {new Date(ticket.createdAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
