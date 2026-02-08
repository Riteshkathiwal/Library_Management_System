import React, { useState, useEffect } from 'react';
import axiosInstance from '../../config/axios';
import API_URLS from '../../config/ApiUrl';
import { MODULES } from '../../constants';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_URLS.ACTIVITY_LOGS);
      const logsData = response.data.data;
      setLogs(Array.isArray(logsData) ? logsData : []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold"><i className="bi bi-clock-history me-2"></i>{MODULES.ACTIVITY_LOGS}</h2>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Module</th>
                  <th>Details</th>
                  <th>IP Address</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-4">No activity logs found</td></tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id}>
                      <td>{log.user_id?.name || 'System'}</td>
                      <td>
                        <span className="badge bg-secondary">{log.action}</span>
                      </td>
                      <td>{log.module}</td>
                      <td>{log.details || '-'}</td>
                      <td>{log.ip_address || '-'}</td>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
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

export default ActivityLogs;
