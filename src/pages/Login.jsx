import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../asserts/Login.css';
import loginImage from '../asserts/Image/brooke-lark-YwSy97_Rk1o-unsplash.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Set default role as 'user'
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const loginData = {
      email: email.toLowerCase(),
      password,
      role,
    };

    console.log('Submitted Role:', role); // Debugging log to check role value before submission

    try {
      const response = await axios.post('http://localhost:8080/signup/login', loginData);
      
      if (response.status === 201) {
        const { key } = response.data; 
        console.log('Generated Key:', key); 

        const expirationTime = new Date().getTime() + 12 * 60 * 60 * 1000;
        sessionStorage.setItem('authKey', JSON.stringify({ key, expirationTime }));

        localStorage.setItem('loggedInEmail', email.toLowerCase());
        
        if (role === 'admin') {
          alert('Admin login successful!');
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('role', 'admin');
          window.location.href = '/adminuser';
        } else {
          alert('Login successful!');
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('role', 'user');
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.status === 404) {
        setError('Email not found');
      } else if (error.response && error.response.status === 401) {
        setError('Incorrect password');
      } else if (error.response && error.response.status === 403) {
        setError('Incorrect role selected');
      } else {
        setError('An error occurred. Please try again later.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      {isLoading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className={`login-page-content ${isLoading ? 'blur' : ''}`}>
        <div className="login-image-container">
          <img src={loginImage} alt="Login" />
        </div>
        <div className="login-form-container">
          <h1>Login</h1>
          {error && <p className="login-error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <label htmlFor="password">Password</label>
            <div className="password-container-login">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <span className="password-toggle-login" onClick={() => setShowPassword(!showPassword)}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>

            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                console.log('Role selected:', e.target.value); // Debugging log to check role selection
              }}
              required
              disabled={isLoading}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit" disabled={isLoading}>
              Login
            </button>
            <div className="login-form-footer">
              <p>Don't have an account? <a href="/signup">Signup here</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
