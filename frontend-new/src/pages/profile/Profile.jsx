import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios';

import { useAuth } from '../../context/AuthContext';
import { PERMISSIONS } from '../../constants';

const Profile = () => {
  const { hasPermission } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      setProfileData(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      await axiosInstance.put('/auth/updatepassword', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password updated successfully');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error updating password:', error);
      // specific error handled by interceptor or show generic
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const getRandomColor = (name) => {
    const colors = ['#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#dc3545', '#fd7e14', '#ffc107', '#198754', '#20c997', '#0dcaf0'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
  if (!profileData) return <div className="text-center mt-5">Error loading profile</div>;

  const { user: userData, member } = profileData;
  const avatarColor = getRandomColor(userData.name);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 overflow-hidden">
            <div className="card-header bg-primary text-white py-4 position-relative">
               <div className="d-flex justify-content-between align-items-center position-relative z-1">
                 <h4 className="mb-0 fw-bold"><i className="bi bi-person-badge me-2"></i>My Profile</h4>
                 {hasPermission(PERMISSIONS.USER_CHANGE_PASSWORD) && (
                   <button className="btn btn-light btn-sm fw-bold" onClick={() => setShowPasswordModal(true)}>
                     <i className="bi bi-key me-2"></i>Change Password
                   </button>
                 )}
               </div>
               {/* Abstract decorative circles */}
               <div className="position-absolute top-0 end-0 p-3 opacity-25">
                 <i className="bi bi-person-circle" style={{fontSize: '10rem', transform: 'translate(30%, -30%)'}}></i>
               </div>
            </div>
            
            <div className="card-body p-5">
              <div className="text-center mb-5">
                <div 
                  className="rounded-circle d-inline-flex align-items-center justify-content-center shadow-lg mb-3" 
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    backgroundColor: avatarColor,
                    color: '#fff',
                    fontSize: '3.5rem',
                    border: '5px solid #fff',
                    marginTop: '-50px'
                  }}
                >
                  {getInitials(userData.name)}
                </div>
                <h2 className="fw-bold mb-1">{userData.name}</h2>
                <span className="badge bg-secondary px-3 py-2 rounded-pill text-uppercase">{userData.role_id?.role_name || 'User'}</span>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card h-100 border-0 bg-light">
                    <div className="card-body">
                      <h6 className="text-muted text-uppercase small fw-bold mb-3 border-bottom pb-2">Contact Details</h6>
                      <div className="mb-3 d-flex align-items-center">
                        <div className="bg-white p-2 rounded-circle me-3 shadow-sm text-primary"><i className="bi bi-envelope"></i></div>
                        <div>
                          <small className="d-block text-muted">Email</small>
                          <span className="fw-medium text-break">{userData.email}</span>
                        </div>
                      </div>
                      <div className="mb-3 d-flex align-items-center">
                        <div className="bg-white p-2 rounded-circle me-3 shadow-sm text-primary"><i className="bi bi-phone"></i></div>
                        <div>
                          <small className="d-block text-muted">Mobile</small>
                          <span className="fw-medium">{userData.mobile || 'Not provided'}</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="bg-white p-2 rounded-circle me-3 shadow-sm text-primary"><i className="bi bi-geo-alt"></i></div>
                        <div>
                          <small className="d-block text-muted">Address</small>
                          <span className="fw-medium">{userData.address || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {member && (
                  <div className="col-md-6">
                    <div className="card h-100 border-0 bg-light">
                      <div className="card-body">
                        <h6 className="text-muted text-uppercase small fw-bold mb-3 border-bottom pb-2">Membership Info</h6>
                         <div className="mb-3 d-flex align-items-center">
                          <div className="bg-white p-2 rounded-circle me-3 shadow-sm text-success"><i className="bi bi-card-heading"></i></div>
                          <div>
                            <small className="d-block text-muted">Member ID</small>
                            <span className="fw-medium">{member.member_id}</span>
                          </div>
                        </div>
                        <div className="mb-3 d-flex align-items-center">
                          <div className="bg-white p-2 rounded-circle me-3 shadow-sm text-success"><i className="bi bi-person-vcard"></i></div>
                          <div>
                            <small className="d-block text-muted">Type</small>
                            <span className="fw-medium text-capitalize">{member.membership_type}</span>
                          </div>
                        </div>
                         <div className="mb-3 d-flex align-items-center">
                          <div className="bg-white p-2 rounded-circle me-3 shadow-sm text-success"><i className="bi bi-check-circle"></i></div>
                          <div>
                            <small className="d-block text-muted">Status</small>
                            <span className={`badge ${member.membership_status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                              {member.membership_status}
                            </span>
                          </div>
                        </div>
                         <div className="d-flex align-items-center">
                          <div className="bg-white p-2 rounded-circle me-3 shadow-sm text-success"><i className="bi bi-calendar-event"></i></div>
                          <div>
                            <small className="d-block text-muted">Expiry</small>
                            <span className="fw-medium">{new Date(member.membership_expiry).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold">Change Password</h5>
                <button type="button" className="btn-close" onClick={() => setShowPasswordModal(false)}></button>
              </div>
              <form onSubmit={handlePasswordChange}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock"></i></span>
                      <input
                        type="password"
                        className="form-control border-start-0 ps-0"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                        placeholder="Enter current password"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                   <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><i className="bi bi-key"></i></span>
                      <input
                        type="password"
                        className="form-control border-start-0 ps-0"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                         placeholder="Enter new password"
                         minLength="6"
                      />
                    </div>
                    <div className="form-text">Minimum 6 characters</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><i className="bi bi-key-fill"></i></span>
                      <input
                        type="password"
                        className="form-control border-start-0 ps-0"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                         placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Update Password</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
