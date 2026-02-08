import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/profile/Profile';
import Users from './pages/users/Users';
import EditUser from './pages/users/EditUser';
import Roles from './pages/roles/Roles';
import Books from './pages/books/Books';
import CreateBook from './pages/books/CreateBook';
import Authors from './pages/authors/Authors';
import Categories from './pages/categories/Categories';
import Publishers from './pages/publishers/Publishers';
import Issues from './pages/issues/Issues';
import CreateUser from './pages/users/CreateUser';
import Fines from './pages/fines/Fines';
import Requests from './pages/requests/Requests';
import ActivityLogs from './pages/activity-logs/ActivityLogs';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />

            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="main-content">
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/users/create" element={<CreateUser />} />
                        <Route path="/users/edit/:id" element={<EditUser />} />
                        <Route path="/roles" element={<Roles />} />
                        <Route path="/books" element={<Books />} />
                        <Route path="/books/create" element={<CreateBook />} />
                        <Route path="/books/edit/:id" element={<CreateBook />} />
                        <Route path="/authors" element={<Authors />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/publishers" element={<Publishers />} />
                        <Route path="/issues" element={<Issues />} />
                        <Route path="/fines" element={<Fines />} />
                        <Route path="/requests" element={<Requests />} />
                        <Route path="/activity-logs" element={<ActivityLogs />} />
                        <Route path="/issues" element={<Issues />} />
                      </Routes>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
