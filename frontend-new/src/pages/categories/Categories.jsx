import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios';
import API_URLS from '../../config/ApiUrl';
import { formValidator } from '../../utils/validation';
import { confirmDelete } from '../../utils/sweetAlert';
import { MODULES, PERMISSIONS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_URLS.CATEGORIES);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
    
    const validationErrors = formValidator.category(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editingCategory) {
        await axiosInstance.put(API_URLS.CATEGORY_BY_ID(editingCategory._id), formData);
        toast.success('Category updated successfully');
      } else {
        await axiosInstance.post(API_URLS.CATEGORIES, formData);
        toast.success('Category created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete('Delete Category?', 'This action cannot be undone.');
    if (confirmed) {
      try {
        await axiosInstance.delete(API_URLS.CATEGORY_BY_ID(id));
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description || '' });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setErrors({});
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold"><i className="bi bi-tags me-2"></i>{MODULES.CATEGORIES}</h2>
        </div>
        <div className="col-auto">
          {hasPermission(PERMISSIONS.CATEGORY_CREATE) && (
            <button className="btn btn-primary" onClick={() => openModal()}>
              <i className="bi bi-plus-circle me-2"></i>Add Category
            </button>
          )}
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
                <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  {(hasPermission(PERMISSIONS.CATEGORY_UPDATE) || hasPermission(PERMISSIONS.CATEGORY_DELETE)) && (
                    <th>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan={(hasPermission(PERMISSIONS.CATEGORY_UPDATE) || hasPermission(PERMISSIONS.CATEGORY_DELETE)) ? "3" : "2"} className="text-center py-4">No categories found</td></tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category._id}>
                      <td className="fw-bold">{category.name}</td>
                      <td>{category.description || '-'}</td>
                      {(hasPermission(PERMISSIONS.CATEGORY_UPDATE) || hasPermission(PERMISSIONS.CATEGORY_DELETE)) && (
                        <td>
                          <div className="d-flex gap-2">
                            {hasPermission(PERMISSIONS.CATEGORY_UPDATE) && (
                              <button className="btn btn-outline-primary" onClick={() => openModal(category)}>
                                <i className="bi bi-pencil"></i>
                              </button>
                            )}
                            {hasPermission(PERMISSIONS.CATEGORY_DELETE) && (
                              <button className="btn btn-outline-danger" onClick={() => handleDelete(category._id)}>
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

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingCategory ? 'Edit Category' : 'Add Category'}</h5>
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
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      name="description"
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingCategory ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
