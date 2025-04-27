import React from 'react';
import { Link } from 'react-router-dom';
import '../asserts/AdminSidebar.css';

const AdminSidebar = ({ onLogout }) => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li><Link to="/adminuser/dashboard">Dashboard</Link></li>
        <li><Link to="/adminuser/users">Manage Users</Link></li>
        <li><Link to="/adminuser/register">Registered Events</Link></li>
        <li><Link to="/adminuser/adminpayment">Payments</Link></li>
        <li><Link to="/adminuser/settings">Settings</Link></li>
      </ul>
      <button className="sidebar-logout-button" onClick={onLogout}>Logout</button>
    </div>
  );
};

export default AdminSidebar;
