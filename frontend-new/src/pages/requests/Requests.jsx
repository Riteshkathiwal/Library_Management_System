import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios';
import API_URLS from '../../config/ApiUrl';
import { MODULES, PERMISSIONS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_URLS.REQUESTS);
      setRequests(response.data.data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axiosInstance.put(API_URLS.REQUEST_BY_ID(id), { status });
      toast.success(`Request ${status} successfully`);
      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold"><i className="bi bi-bookmark-plus me-2"></i>{MODULES.REQUESTS}</h2>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Book</th>
                  <th>Request Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-4">No book requests found</td></tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar bg-light rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                            {request.user_id?.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="fw-bold">{request.user_id?.name}</div>
                            <div className="small text-muted">{request.user_id?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{request.book_id?.title}</td>
                      <td>{new Date(request.request_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge bg-${request.status === 'approved' ? 'success' : request.status === 'rejected' ? 'danger' : 'warning'}`}>
                          {request.status}
                        </span>
                      </td>
                      <td>
                        {request.status === 'pending' && hasPermission(PERMISSIONS.REQUEST_MANAGE) && (
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-success" onClick={() => handleStatusUpdate(request._id, 'approved')} title="Approve">
                              <i className="bi bi-check-lg"></i>
                            </button>
                            <button className="btn btn-danger" onClick={() => handleStatusUpdate(request._id, 'rejected')} title="Reject">
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                        )}
                      </td>
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

export default Requests;
