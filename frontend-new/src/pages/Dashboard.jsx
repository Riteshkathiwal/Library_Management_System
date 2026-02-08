import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MODULES } from '../constants';
import axiosInstance from '../config/axios';

const Dashboard = () => {
  const { user } = useAuth();

  const [statsData, setStatsData] = useState({
    totalBooks: 0,
    totalMembers: 0,
    activeIssues: 0,
    totalPendingFines: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/dashboard/stats');
      if (response.data.success) {
        setStatsData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const stats = [
    { title: 'Total Books', value: statsData.totalBooks, icon: 'book-half', color: 'primary' },
    { title: 'Active Issues', value: statsData.activeIssues, icon: 'arrow-left-right', color: 'info' },
    { title: 'Pending Fines', value: `₹${statsData.totalPendingFines}`, icon: 'cash', color: 'warning' },
    { title: 'Total Members', value: statsData.totalMembers, icon: 'people', color: 'success' },
  ];

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold">
            <i className="bi bi-speedometer2 me-2"></i>
            {MODULES.DASHBOARD}
          </h2>
          <p className="text-muted">Welcome back, {user?.name}!</p>
        </div>
      </div>

      <div className="row g-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">{stat.title}</p>
                    <h3 className="fw-bold mb-0">{stat.value}</h3>
                  </div>
                  <div className={`bg-${stat.color} bg-opacity-10 p-3 rounded`}>
                    <i className={`bi bi-${stat.icon} text-${stat.color} fs-2`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Recent Activities</h5>
            </div>
            <div className="card-body">
              <p className="text-muted">Activity logs will appear here...</p>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  Issue Book
                </button>
                <button className="btn btn-outline-success">
                  <i className="bi bi-arrow-return-left me-2"></i>
                  Return Book
                </button>
                <button className="btn btn-outline-info">
                  <i className="bi bi-book me-2"></i>
                  Add New Book
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
