import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import '../asserts/SettingsPage.css';
import axios from 'axios';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '' });
  const [password, setPassword] = useState({ current: '', new: '' });
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    if (loggedInEmail) {
      axios.get(`http://localhost:8080/signup/getByEmail/${loggedInEmail}`)
        .then(response => {
          if (response.status === 200) {
            const userData = response.data;
            setProfile({ 
              firstName: userData.firstName, 
              lastName: userData.lastName, 
              email: userData.email 
            });
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    if (loggedInEmail) {
      // Handle profile update logic (add your backend API call here)
      console.log('Profile updated:', profile);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    if (loggedInEmail) {
      try {
        const response = await axios.put(`http://localhost:8080/settings/${loggedInEmail}`, {
          currentPassword: password.current,
          newPassword: password.new
        });

        if (response.status === 200) {
          setUpdateMessage('Password updated successfully!');
          setPassword({ current: '', new: '' });
          
        } else {
          setUpdateMessage('Failed to update password.');
        }
      } catch (error) {
        console.error('Password update error:', error);
        setUpdateMessage('An error occurred while updating the password.');
      }
    }
  };

  return (
    <div className={`settings-page ${theme}`}>
      <Navbar />
      <header className="settings-header">
        <h1>Welcome, {profile.firstName} {profile.lastName}!</h1>
      </header>
      <button onClick={toggleTheme} className="theme-toggle">
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
      </button>

      <div className="profile-section">
        <h2>Edit Profile</h2>
        <form onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profile.firstName}
              onChange={handleProfileChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profile.lastName}
              onChange={handleProfileChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              disabled
            />
          </div>
          <button type="submit" className="save-button">Save</button>
        </form>
      </div>

      <div className="password-section">
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="current-password">Current Password:</label>
            <input
              type="password"
              id="current-password"
              name="current"
              value={password.current}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password">New Password:</label>
            <input
              type="password"
              id="new-password"
              name="new"
              value={password.new}
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit" className="save-button">Save</button>
        </form>
        {updateMessage && <p className="update-message">{updateMessage}</p>}
      </div>
    </div>
  );
};

export default SettingsPage;
