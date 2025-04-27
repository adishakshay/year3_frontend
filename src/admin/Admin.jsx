import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Dashboard from './Dashboard';
import Users from './Users';
import Register from './Register'; // Import Register
import Settings from './Settings';
import AdminPayment from './AdminPayment';
import '../asserts/Admin.css';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if authKey is present in session storage
    const authKey = sessionStorage.getItem('authKey');
    if (!authKey) {
      // Redirect to login if authKey is not found
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('authKey'); // Clear authKey from session storage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="admin-container">
      <AdminSidebar onLogout={handleLogout} />
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="register" element={<Register />} /> 
          <Route path="settings" element={<Settings />} />
          <Route path="adminpayment" element={<AdminPayment />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
