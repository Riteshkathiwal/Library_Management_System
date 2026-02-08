import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import bookService from '../../services/bookService';
import { confirmDelete } from '../../utils/sweetAlert';
import { MODULES, PERMISSIONS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (search = '') => {
    try {
      setLoading(true);
      const params = search ? { search } : {};
      const response = await bookService.getAll(params);
      setBooks(response.books || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(searchTerm);
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete('Delete Book?', 'This will soft delete the book.');
    if (confirmed) {
      try {
        await bookService.delete(id);
        toast.success('Book deleted successfully!');
        fetchBooks(searchTerm);
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold">
            <i className="bi bi-book me-2"></i>
            {MODULES.BOOKS}
          </h2>
        </div>
        <div className="col-auto">
          {hasPermission(PERMISSIONS.BOOK_CREATE) && (
            <Link to="/books/create" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              Add Book
            </Link>
          )}
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <form onSubmit={handleSearch} className="row g-3">
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Search by title or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                <i className="bi bi-search me-2"></i>
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
                <thead>
                <tr>
                  <th>S.No</th>
                  <th>Title</th>
                  <th>ISBN</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Available</th>
                  {(hasPermission(PERMISSIONS.BOOK_UPDATE) || hasPermission(PERMISSIONS.BOOK_DELETE)) && (
                    <th>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan={(hasPermission(PERMISSIONS.BOOK_UPDATE) || hasPermission(PERMISSIONS.BOOK_DELETE)) ? "8" : "7"} className="text-center text-muted py-4">
                      No books found
                    </td>
                  </tr>
                ) : (
                  books.map((book, index) => (
                    <tr key={book._id}>
                      <td>{index + 1}</td>
                      <td><strong>{book.title}</strong></td>
                      <td>{book.isbn}</td>
                      <td>{book.author_id?.name || 'N/A'}</td>
                      <td>
                        <span className="badge bg-info">
                          {book.category_id?.name || 'N/A'}
                        </span>
                      </td>
                      <td>{book.quantity}</td>
                      <td>
                        <span className={`badge ${book.available > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {book.available}
                        </span>
                      </td>
                      {(hasPermission(PERMISSIONS.BOOK_UPDATE) || hasPermission(PERMISSIONS.BOOK_DELETE)) && (
                        <td>
                          <div className="d-flex gap-2">
                            {/* View page not implemented yet
                            <Link to={`/books/${book._id}`} className="btn btn-outline-info" title="View">
                              <i className="bi bi-eye"></i>
                            </Link>
                            */}
                            {hasPermission(PERMISSIONS.BOOK_UPDATE) && (
                              <Link to={`/books/edit/${book._id}`} className="btn btn-outline-primary" title="Edit">
                                <i className="bi bi-pencil"></i>
                              </Link>
                            )}
                            {hasPermission(PERMISSIONS.BOOK_DELETE) && (
                              <button className="btn btn-outline-danger" onClick={() => handleDelete(book._id)} title="Delete">
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      )}
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
};

export default Books;
