
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config.js";

function AuthorDashboard() {
  const navigate = useNavigate();

  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await axios.get(
          `${API_URL}/books/my-books`,
          { withCredentials: true }
        );

        setAuthor(response.data.author);
        setBooks(response.data.books || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Books not loaded check backend"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const query = search.toLowerCase(); //search kiya toh vo milega nhi toh pura list 

    return (
      (book.title || "").toLowerCase().includes(query) ||
      (book.isbn || "").toLowerCase().includes(query)
    );
  });

  const totalSold = books.reduce(
    (sum, book) => sum + Number(book.total_copies_sold || 0),
    0
  );

  const totalEarned = books.reduce(
    (sum, book) => sum + Number(book.total_royalty_earned || 0),
    0
  );

  const totalPaid = books.reduce(
    (sum, book) => sum + Number(book.
        royalty_paid || 0),
    0
  );

  const totalPending = books.reduce(
    (sum, book) => sum + Number(book.royalty_pending || 0),
    0
  );

  const money = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  if (loading) {
    return <div className="container py-5">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light min-vh-100 p-4">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-primary">BookLeaf</h2>
          <h4>Welcome, {author?.name || "Author"}!</h4>
          <p className="text-secondary">{author?.email}</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/author/tickets/new")}
        >
          Raise Support Ticket
        </button>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/author/tickets/")}
        >
          My  Ticket
        </button>
      </header>

      <div className="row g-3 mb-4">
        <SummaryCard title="Copies Sold" value={totalSold.toLocaleString("en-IN")} />
        <SummaryCard title="Royalty Earned" value={money(totalEarned)} />
        <SummaryCard title="Royalty Paid" value={money(totalPaid)} />
        <SummaryCard title="Royalty Pending" value={money(totalPending)} />
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h4 className="fw-bold mb-3">My Books</h4>

          <input
            className="form-control mb-3"
            placeholder="Search by book title or ISBN..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>ISBN</th>
                  <th>Status</th>
                  <th>MRP</th>
                  <th>Royalty / Copy</th>
                  <th>Copies Sold</th>
                  <th>Earned</th>
                  <th>Paid</th>
                  <th>Pending</th>
                </tr>
              </thead>

              <tbody>
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No books found.
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => (
                    <tr key={book._id || book.book_id}>
                      <td className="fw-semibold">{book.title}</td>
                      <td>{book.isbn || "—"}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {book.status || "Unknown"}
                        </span>
                      </td>
                      <td>{book.mrp == null ? "—" : money(book.mrp)}</td>
                      <td>  
                        {book.author_royalty_per_copy == null
                          ? "—"
                          : money(book.author_royalty_per_copy)}
                      </td>
                      <td>{book.total_copies_sold || 0}</td>
                      <td>{money(book.total_royalty_earned)}</td>
                      <td>{money(book.royalty_paid)}</td>
                      <td>{money(book.royalty_pending)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="col-12 col-sm-6 col-xl-3">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <p className="text-secondary mb-2">{title}</p>
          <h3 className="fw-bold mb-0">{value}</h3>
        </div>
      </div>
    </div>
  );
}

export default AuthorDashboard;
