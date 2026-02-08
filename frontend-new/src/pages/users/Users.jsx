import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios';
import { confirmDelete } from '../../utils/sweetAlert';
import { MODULES, PERMISSIONS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete(
      'Delete User?',
      'This action cannot be undone!'
    );

    if (confirmed) {
      try {
        await axiosInstance.delete(`/users/${id}`);
        toast.success('User deleted successfully!');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold">
            <i className="bi bi-people me-2"></i>
            {MODULES.USERS}
          </h2>
        </div>
        <div className="col-auto">
          {hasPermission(PERMISSIONS.USER_CREATE) && (
            <Link to="/users/create" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              Add User
            </Link>
          )}
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
                <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  {(hasPermission(PERMISSIONS.USER_UPDATE) || hasPermission(PERMISSIONS.USER_DELETE)) && (
                    <th>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={(hasPermission(PERMISSIONS.USER_UPDATE) || hasPermission(PERMISSIONS.USER_DELETE)) ? "7" : "6"} className="text-center text-muted py-4">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar bg-primary text-white rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <strong>{user.name}</strong>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className="badge bg-info">
                          {user.role_id?.role_name || 'N/A'}
                        </span>
                      </td>
                      <td>{user.mobile}</td>
                      <td>
                        {user.is_active ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-danger">Inactive</span>
                        )}
                      </td>
                      {(hasPermission(PERMISSIONS.USER_UPDATE) || hasPermission(PERMISSIONS.USER_DELETE)) && (
                        <td>
                          <div className="d-flex gap-2">
                            {hasPermission(PERMISSIONS.USER_UPDATE) && (
                              <Link
                                to={`/users/edit/${user._id}`}
                                className="btn btn-outline-primary"
                                title="Edit"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                            )}
                            {hasPermission(PERMISSIONS.USER_DELETE) && (
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(user._id)}
                                title="Delete"
                              >
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

export default Users;
