import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; 
import '../asserts/Contact.css';
import contactImage from '../asserts/Image/miles-burke-idhx-MOCDSk-unsplash.jpg';

const Contact = () => {
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (contactNumber.length !== 10 || isNaN(contactNumber)) {
      setError('Phone number must be exactly 10 digits long.');
      return;
    }

    const formData = {
      contactName,
      contactNumber,
      contactEmail: contactEmail.toLowerCase(),
      contactMessage,
    };

    try {
      const response = await axios.post('http://localhost:8080/contact/add', formData);
      
      if (response.status === 201) {
        alert('We will connect you soon!');
        setContactName('');
        setContactNumber('');
        setContactEmail('');
        setContactMessage('');
        setError('');
      }
    } catch (error) {
      console.error('There was an error sending the form data:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="contact-page-content">
        <div className="contact-image-container">
          <img src={contactImage} alt="Contact" />
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <h1>Contact Us</h1>
          {error && <p className="contact-error-message">{error}</p>}
          <div className="contact-form-group">
            <label>Name:</label>
            <input
              type="text"
              name="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
          </div>
          <div className="contact-form-group">
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
              maxLength="10"
            />
          </div>
          <div className="contact-form-group">
            <label>Email:</label>
            <input
              type="email"
              name="contactEmail"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
          </div>
          <div className="contact-form-group">
            <label>Message:</label>
            <textarea
              name="contactMessage"
              rows="5"
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit">Send Message</button>
        </form>
      </div>
      <Footer /> 
    </div>
  );
};

export default Contact;
