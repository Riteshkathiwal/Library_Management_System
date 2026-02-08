import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios';
import API_URLS from '../../config/ApiUrl';

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        address: '',
        role_id: '',
        is_active: true
    });

    const fetchUser = useCallback(async () => {
        try {
            const response = await axiosInstance.get(API_URLS.USER_BY_ID(id));
            const user = response.data.data;
            setFormData({
                name: user.name,
                email: user.email,
                mobile: user.mobile || '',
                address: user.address || '',
                role_id: user.role_id?._id || user.role_id,
                is_active: user.is_active
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user:', error);
            toast.error('Failed to load user data');
            navigate('/users');
        }
    }, [id, navigate]);

    const fetchRoles = useCallback(async () => {
        try {
            const response = await axiosInstance.get(API_URLS.ROLES);
            setRoles(response.data.data || []);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    }, []);

    useEffect(() => {
        fetchUser();
        fetchRoles();
    }, [fetchUser, fetchRoles]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(API_URLS.USER_BY_ID(id), formData);
            toast.success('User updated successfully');
            navigate('/users');
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container mt-4">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                    <h4 className="mb-0 fw-bold">Edit User</h4>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    disabled
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Role</label>
                                <select
                                    className="form-select"
                                    value={formData.role_id}
                                    onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Role</option>
                                    {roles.map(role => (
                                        <option key={role._id} value={role._id}>{role.role_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Status</label>
                                <div className="form-check form-switch mt-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    />
                                    <label className="form-check-label">
                                        {formData.is_active ? 'Active' : 'Inactive'}
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Mobile</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Address</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="col-12 mt-4 d-flex gap-2">
                                <button type="submit" className="btn btn-primary">
                                    <i className="bi bi-save me-2"></i>Update User
                                </button>
                                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/users')}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditUser;