import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios';
import API_URLS from '../../config/ApiUrl';

import { formValidator } from '../../utils/validation';

const CreateUser = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role_name: '', // We send role_name for registration
        mobile: '',
        address: ''
    });

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await axiosInstance.get(API_URLS.ROLES);
            setRoles(response.data.data || []);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = formValidator.user(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            // Use the register endpoint for creating new users
            await axiosInstance.post('/auth/register', formData);
            toast.success('User created successfully');
            navigate('/users');
        } catch (error) {
            console.error('Error creating user:', error);
            // Error handling is done by interceptor, but we can add specific handling here if needed
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                    <h4 className="mb-0 fw-bold">Create New User</h4>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.name && <small className="text-danger">{errors.name}</small>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.email && <small className="text-danger">{errors.email}</small>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.password && <small className="text-danger">{errors.password}</small>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Role</label>
                                <select
                                    className={`form-select ${errors.role_name ? 'is-invalid' : ''}`}
                                    name="role_name"
                                    value={formData.role_name}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Role</option>
                                    {roles.map(role => (
                                        <option key={role._id} value={role.role_name}>{role.role_name}</option>
                                    ))}
                                </select>
                                {errors.role_name && <small className="text-danger ps-2">{errors.role_name}</small>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Mobile</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                />
                                {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
                            </div>
                            <div className="col-12">
                                <label className="form-label">Address</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <div className="col-12 mt-4 d-flex gap-2">
                                <button type="submit" className="btn btn-primary">
                                    <i className="bi bi-person-plus me-2"></i>Create User
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

export default CreateUser;
