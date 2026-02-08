import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../config/axios';
import API_URLS from '../../config/ApiUrl';
import { MODULES, PERMISSIONS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const Fines = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_URLS.FINES);
      setFines(response.data.data || []);
    } catch (error) {
      console.error('Error fetching fines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (id) => {
    try {
      await axiosInstance.post(`${API_URLS.FINES}/${id}/pay`);
      toast.success('Fine paid successfully');
      fetchFines();
    } catch (error) {
      console.error('Error paying fine:', error);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold"><i className="bi bi-cash-coin me-2"></i>{MODULES.FINES}</h2>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Issue ID</th>
                  <th>Amount</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fines.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-4">No fines found</td></tr>
                ) : (
                  fines.map((fine) => (
                    <tr key={fine._id}>
                      <td>
                        <div className="fw-bold">{fine.member_id?.user_id?.name || 'Unknown'}</div>
                        <div className="small text-muted">{fine.member_id?.member_id}</div>
                      </td>
                      <td>{fine.issue_id?._id?.substring(0, 8)}...</td>
                      <td className="fw-bold text-danger">₹{fine.amount}</td>
                      <td>{fine.reason}</td>
                      <td>
                        <span className={`badge bg-${fine.status === 'paid' ? 'success' : 'danger'}`}>
                          {fine.status}
                        </span>
                      </td>
                      <td>
                        {fine.status === 'unpaid' && hasPermission(PERMISSIONS.FINE_PAY) && (
                          <button className="btn btn-sm btn-success" onClick={() => handlePayment(fine._id)}>
                            <i className="bi bi-check-circle me-1"></i>Mark Paid
                          </button>
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

export default Fines;
