import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import roleService from '../../services/roleService';
import { confirmDelete } from '../../utils/sweetAlert';
import { formValidator } from '../../utils/validation';
import { MODULES, PERMISSIONS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    role_name: '',
    description: '',
    permissions: [],
  });
  const [errors, setErrors] = useState({});
  const { hasPermission } = useAuth();

  const availablePermissions = Object.values(PERMISSIONS);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await roleService.getAll();
      setRoles(response.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
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

  const handlePermissionChange = (permission) => {
    const updatedPermissions = formData.permissions.includes(permission)
      ? formData.permissions.filter((p) => p !== permission)
      : [...formData.permissions, permission];
    
    setFormData({ ...formData, permissions: updatedPermissions });
    if (errors.permissions) {
      setErrors({ ...errors, permissions: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = formValidator.role(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editingRole) {
        await roleService.update(editingRole._id, formData);
        toast.success('Role updated successfully!');
      } else {
        await roleService.create(formData);
        toast.success('Role created successfully!');
      }
      
      setShowModal(false);
      resetForm();
      fetchRoles();
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      role_name: role.role_name,
      description: role.description || '',
      permissions: role.permissions || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete('Delete Role?', 'This action cannot be undone!');
    if (confirmed) {
      try {
        await roleService.delete(id);
        toast.success('Role deleted successfully!');
        fetchRoles();
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ role_name: '', description: '', permissions: [] });
    setEditingRole(null);
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
            <i className="bi bi-shield-check me-2"></i>
            {MODULES.ROLES}
          </h2>
        </div>
        <div className="col-auto">
          {hasPermission(PERMISSIONS.ROLE_CREATE) && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-circle me-2"></i>
              Add Role
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
                    <th style={{ width: '5%' }}>S.No</th>
                    <th style={{ width: '20%' }}>Role Name</th>
                    <th style={{ width: '30%' }}>Description</th>
                    <th style={{ width: '25%' }}>Permissions</th>
                    <th style={{ width: '20%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role, index) => (
                    <tr key={role._id}>
                      <td>{index + 1}</td>
                      <td><strong>{role.role_name}</strong></td>
                      <td>{role.description}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {role.permissions?.length || 0} permissions
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                        {hasPermission(PERMISSIONS.ROLE_UPDATE) && (
                          <button className="btn btn-outline-primary" onClick={() => handleEdit(role)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                        )}
                        {hasPermission(PERMISSIONS.ROLE_DELETE) && (
                          <button className="btn btn-outline-danger" onClick={() => handleDelete(role._id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingRole ? 'Edit Role' : 'Add Role'}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Role Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.role_name ? 'is-invalid' : ''}`}
                      name="role_name"
                      value={formData.role_name}
                      onChange={handleInputChange}
                      disabled={editingRole}
                    />
                    {errors.role_name && <div className="invalid-feedback">{errors.role_name}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="2"
                      value={formData.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Permissions *</label>
                    <div className="border rounded p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {availablePermissions.map((permission) => (
                        <div key={permission} className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={permission}
                            checked={formData.permissions.includes(permission)}
                            onChange={() => handlePermissionChange(permission)}
                          />
                          <label className="form-check-label" htmlFor={permission}>
                            {permission}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.permissions && <div className="text-danger small mt-1">{errors.permissions}</div>}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingRole ? 'Update' : 'Create'}
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

export default Roles;
