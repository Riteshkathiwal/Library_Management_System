import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import issueService from '../../services/issueService';
import bookService from '../../services/bookService';
import userService from '../../services/userService';
import { confirmAction } from '../../utils/sweetAlert';
import { formValidator } from '../../utils/validation';
import { MODULES, PERMISSIONS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    member_id: '',
    book_id: '',
  });
  const [errors, setErrors] = useState({});
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchIssues();
    fetchBooks();
    fetchMembers();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await issueService.getAll();
      setIssues(response.data || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await bookService.getAll();
      setBooks(response.data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await userService.getAll();
      setMembers(response.data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = formValidator.issue(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await issueService.issueBook(formData);
      toast.success('Book issued successfully!');
      setShowModal(false);
      resetForm();
      fetchIssues();
    } catch (error) {
      console.error('Error issuing book:', error);
    }
  };

  const handleReturn = async (id) => {
    const confirmed = await confirmAction(
      'Return Book?',
      'This will mark the book as returned and calculate any fines.',
      'Yes, return it!'
    );

    if (confirmed) {
      try {
        await issueService.returnBook(id);
        toast.success('Book returned successfully!');
        fetchIssues();
      } catch (error) {
        console.error('Error returning book:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ member_id: '', book_id: '' });
    setErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN');
  };

  const isOverdue = (dueDate, returnDate) => {
    if (returnDate) return false;
    return new Date(dueDate) < new Date();
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
            <i className="bi bi-arrow-left-right me-2"></i>
            {MODULES.ISSUES}
          </h2>
        </div>
        <div className="col-auto">
          {hasPermission(PERMISSIONS.ISSUE_CREATE) && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-circle me-2"></i>
              Issue Book
            </button>
          )}
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Member</th>
                  <th>Book</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  {hasPermission(PERMISSIONS.ISSUE_RETURN) && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {issues.length === 0 ? (
                  <tr>
                    <td colSpan={hasPermission(PERMISSIONS.ISSUE_RETURN) ? "8" : "7"} className="text-center text-muted py-4">
                      No issues found
                    </td>
                  </tr>
                ) : (
                  issues.map((issue, index) => (
                    <tr key={issue._id}>
                      <td>{index + 1}</td>
                      <td>{issue.member_id?.name || 'N/A'}</td>
                      <td><strong>{issue.book_id?.title || 'N/A'}</strong></td>
                      <td>{formatDate(issue.issue_date)}</td>
                      <td>{formatDate(issue.due_date)}</td>
                      <td>{issue.return_date ? formatDate(issue.return_date) : '-'}</td>
                      <td>
                        {issue.return_date ? (
                          <span className="badge bg-success">Returned</span>
                        ) : isOverdue(issue.due_date) ? (
                          <span className="badge bg-danger">Overdue</span>
                        ) : (
                          <span className="badge bg-warning">Active</span>
                        )}
                      </td>
                      {hasPermission(PERMISSIONS.ISSUE_RETURN) && (
                        <td>
                          {!issue.return_date && (
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleReturn(issue._id)}
                            >
                              <i className="bi bi-arrow-return-left me-1"></i>
                              Return
                            </button>
                          )}
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

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Issue Book</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Member *</label>
                    <select
                      className={`form-select ${errors.member_id ? 'is-invalid' : ''}`}
                      name="member_id"
                      value={formData.member_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Member</option>
                      {members.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name} ({member.email})
                        </option>
                      ))}
                    </select>
                    {errors.member_id && <div className="invalid-feedback">{errors.member_id}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Book *</label>
                    <select
                      className={`form-select ${errors.book_id ? 'is-invalid' : ''}`}
                      name="book_id"
                      value={formData.book_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Book</option>
                      {books.filter(b => b.available > 0).map((book) => (
                        <option key={book._id} value={book._id}>
                          {book.title} (Available: {book.available})
                        </option>
                      ))}
                    </select>
                    {errors.book_id && <div className="invalid-feedback">{errors.book_id}</div>}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Issue Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Issues;
