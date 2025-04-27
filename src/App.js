// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Events from './pages/Events';
import Blogs from './pages/Blogs';
import Contact from './pages/Contact';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Admin from './admin/Admin';
import Modal from './components/Model';
import Payment from './pages/Payment';
import SettingsPage from './components/SettingsPage';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);

    if (!loggedInStatus) {
      const hasSeenPopup = sessionStorage.getItem('hasSeenPopup');
      if (!hasSeenPopup) {
        const timer = setTimeout(() => {
          setIsModalOpen(true);
          sessionStorage.setItem('hasSeenPopup', 'true');
        }, 10000);

        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/events" element={<Events />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/adminuser/*" element={<Admin />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
