import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config.js";

function CreateTicket() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [book, setBook] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await axios.get(`${API_URL}/books/my-books`, {
          withCredentials: true,
        });
        setBooks(Array.isArray(response.data.books) ? response.data.books : []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Could not load your books. You can still submit a general inquiry."
        );
      } finally {
        setLoadingBooks(false);
      }
    }
    fetchBooks();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!subject.trim() || !description.trim()) {
      setError("Please enter both a subject and a description.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${API_URL}/tickets`,
        {
          book: book || null,
          subject: subject.trim(),
          description: description.trim(),
        },
        { withCredentials: true }
      );

      setSuccess(response.data.message || "Your support ticket was created.");
      window.setTimeout(() => navigate("/author/tickets"), 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Ticket could not be submitted. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-light min-vh-100 py-4 py-md-5">
      <div className="container" style={{ maxWidth: "850px" }}>
        <button
          type="button"
          className="btn btn-link text-decoration-none px-0 mb-3"
          onClick={() => navigate("/author/dashboard")}
        >
          <i className="bi bi-arrow-left me-2" aria-hidden="true" />
          Back to dashboard
        </button>

        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="bg-primary text-white p-4 p-md-5">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-white bg-opacity-25 rounded-3 p-3" aria-hidden="true">
                <i className="bi bi-headset fs-3" />
              </div>
              <div>
                <h2 className="fw-bold mb-1">How can we help?</h2>
                <p className="mb-0 text-white-50">BookLeaf Author Support</p>
              </div>
            </div>
            <p className="mb-0">
              Tell us what you need help with. Our support team will review your
              request and respond to your ticket.
            </p>
          </div>

          <div className="card-body p-4 p-md-5">
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {success && <div className="alert alert-success" role="status">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="ticketBook" className="form-label fw-semibold">
                  Related book <span className="text-secondary fw-normal">(optional)</span>
                </label>
                <select
                  id="ticketBook"
                  className="form-select"
                  value={book}
                  onChange={(event) => setBook(event.target.value)}
                  disabled={loadingBooks}
                >
                  <option value="">
                    {loadingBooks ? "Loading your books..." : "General inquiry / no specific book"}
                  </option>
                  {books.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.title} {item.book_id ? `(${item.book_id})` : ""}
                    </option>
                  ))}
                </select>
                <div className="form-text">
                  Choose a book if your issue is related to its royalty, ISBN,
                  printing, or availability.
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="ticketSubject" className="form-label fw-semibold">Subject</label>
                <input
                  id="ticketSubject"
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="e.g. Royalty payment has not arrived"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  maxLength={150}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="ticketDescription" className="form-label fw-semibold">
                  Describe your issue
                </label>
                <textarea
                  id="ticketDescription"
                  className="form-control"
                  rows={6}
                  placeholder="Explain what happened and include details that may help our support team..."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={5000}
                  required
                />
                <div className="form-text text-end">{description.length}/5000 characters</div>
              </div>

              <div className="d-flex flex-column flex-sm-row justify-content-between gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/author/dashboard")}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2" aria-hidden="true" />
                      Submit Ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="text-center text-secondary small mt-3">
          Please do not include passwords or other sensitive login information in your support request.
        </p>
      </div>
    </div>
  );
}

export default CreateTicket;
