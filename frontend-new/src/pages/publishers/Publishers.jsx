import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios';
import API_URLS from '../../config/ApiUrl';
import { formValidator } from '../../utils/validation';
import { confirmDelete } from '../../utils/sweetAlert';
import { MODULES, PERMISSIONS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const Publishers = () => {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [formData, setFormData] = useState({ name: '', address: '', website: '' });
  const [errors, setErrors] = useState({});
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchPublishers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_URLS.PUBLISHERS);
      setPublishers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching publishers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = formValidator.publisher(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editingPublisher) {
        await axiosInstance.put(API_URLS.PUBLISHER_BY_ID(editingPublisher._id), formData);
        toast.success('Publisher updated successfully');
      } else {
        await axiosInstance.post(API_URLS.PUBLISHERS, formData);
        toast.success('Publisher created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchPublishers();
    } catch (error) {
      console.error('Error saving publisher:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete('Delete Publisher?', 'This action cannot be undone.');
    if (confirmed) {
      try {
        await axiosInstance.delete(API_URLS.PUBLISHER_BY_ID(id));
        toast.success('Publisher deleted successfully');
        fetchPublishers();
      } catch (error) {
        console.error('Error deleting publisher:', error);
      }
    }
  };

  const openModal = (publisher = null) => {
    if (publisher) {
      setEditingPublisher(publisher);
      setFormData({
        name: publisher.name,
        address: publisher.address || '',
        website: publisher.website || ''
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingPublisher(null);
    setFormData({ name: '', address: '', website: '' });
    setErrors({});
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold"><i className="bi bi-building me-2"></i>{MODULES.PUBLISHERS}</h2>
        </div>
        <div className="col-auto">
          {hasPermission(PERMISSIONS.PUBLISHER_CREATE) && (
            <button className="btn btn-primary" onClick={() => openModal()}>
              <i className="bi bi-plus-circle me-2"></i>Add Publisher
            </button>
          )}
        </div>
      </div>

      <div className="row">
        {publishers.length === 0 ? (
          <div className="col-12 text-center py-4">No publishers found</div>
        ) : (
          publishers.map((publisher) => (
            <div key={publisher._id} className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title fw-bold text-primary">{publisher.name}</h5>
                  </div>
                  <p className="card-text mb-1"><i className="bi bi-geo-alt me-2 text-muted"></i>{publisher.address || 'No address'}</p>
                  <p className="card-text"><i className="bi bi-globe me-2 text-muted"></i>
                    {publisher.website ? <a href={publisher.website} target="_blank" rel="noopener noreferrer">{publisher.website}</a> : 'No website'}
                  </p>
                </div>
                {(hasPermission(PERMISSIONS.PUBLISHER_UPDATE) || hasPermission(PERMISSIONS.PUBLISHER_DELETE)) && (
                  <div className="card-footer bg-white border-0">
                    <div className="d-flex gap-2 w-100">
                      {hasPermission(PERMISSIONS.PUBLISHER_UPDATE) && (
                        <button className="btn btn-outline-primary flex-grow-1" onClick={() => openModal(publisher)}>
                          <i className="bi bi-pencil me-1"></i> Edit
                        </button>
                      )}
                      {hasPermission(PERMISSIONS.PUBLISHER_DELETE) && (
                        <button className="btn btn-outline-danger flex-grow-1" onClick={() => handleDelete(publisher._id)}>
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
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingPublisher ? 'Edit Publisher' : 'Add Publisher'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      value={formData.name}
                      name="name"
                      onChange={handleInputChange}
                      required
                    />
                     {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.address}
                      name="address"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Website</label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.website}
                      name="website"
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingPublisher ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Publishers;
