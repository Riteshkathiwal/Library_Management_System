import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import authorService from '../../services/authorService';
import { confirmDelete } from '../../utils/sweetAlert';
import { formValidator } from '../../utils/validation';
import { MODULES, PERMISSIONS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    biography: '',
    country: '',
  });
  const [errors, setErrors] = useState({});
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await authorService.getAll();
      setAuthors(response.data || []);
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
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
    
    const validationErrors = formValidator.author(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editingAuthor) {
        await authorService.update(editingAuthor._id, formData);
        toast.success('Author updated successfully!');
      } else {
        await authorService.create(formData);
        toast.success('Author created successfully!');
      }
      
      setShowModal(false);
      resetForm();
      fetchAuthors();
    } catch (error) {
      console.error('Error saving author:', error);
    }
  };

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      biography: author.biography || '',
      country: author.country || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete('Delete Author?', 'This action cannot be undone!');
    if (confirmed) {
      try {
        await authorService.delete(id);
        toast.success('Author deleted successfully!');
        fetchAuthors();
      } catch (error) {
        console.error('Error deleting author:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', biography: '', country: '' });
    setEditingAuthor(null);
    setErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
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
            <i className="bi bi-person-lines-fill me-2"></i>
            {MODULES.AUTHORS}
          </h2>
        </div>
        <div className="col-auto">
          {hasPermission(PERMISSIONS.AUTHOR_CREATE) && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-circle me-2"></i>
              Add Author
            </button>
          )}
        </div>
      </div>

      <div className="row g-4">
        {authors.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">No authors found</div>
          </div>
        ) : (
          authors.map((author) => (
            <div key={author._id} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{author.name}</h5>
                  <p className="text-muted small mb-2">
                    <i className="bi bi-geo-alt me-1"></i>
                    {author.country || 'N/A'}
                  </p>
                  <p className="card-text small">{author.biography || 'No biography available'}</p>
                </div>
                {(hasPermission(PERMISSIONS.AUTHOR_UPDATE) || hasPermission(PERMISSIONS.AUTHOR_DELETE)) && (
                  <div className="card-footer bg-white border-0">
                    <div className="d-flex gap-2 w-100">
                      {hasPermission(PERMISSIONS.AUTHOR_UPDATE) && (
                        <button className="btn btn-outline-primary flex-grow-1" onClick={() => handleEdit(author)}>
                          <i className="bi bi-pencil me-1"></i> Edit
                        </button>
                      )}
                      {hasPermission(PERMISSIONS.AUTHOR_DELETE) && (
                        <button className="btn btn-outline-danger flex-grow-1" onClick={() => handleDelete(author._id)}>
                          <i className="bi bi-trash me-1"></i> Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingAuthor ? 'Edit Author' : 'Add Author'}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Biography</label>
                    <textarea
                      className="form-control"
                      name="biography"
                      rows="4"
                      value={formData.biography}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingAuthor ? 'Update' : 'Create'}
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

export default Authors;
