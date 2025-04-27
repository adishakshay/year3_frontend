import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Modal from '../components/Model';
import axios from 'axios'; 
import '../asserts/Payment.css';

const eventAmounts = {
  'Corporate Event': 50000,
  'Wedding': 300000,
  'Birthday Party': 3000,
  'Christmas Event': 4000,
  'Diwali Celebration': 3000,
  'Food Fest': 10000,
  'Concert': 60000,
  'Exhibition': 40000,
  'Fashion Show': 100000,
  'Product Launch': 20000,
  'Tech Conference': 7000,
  'Charity Gala': 200000,
};

const Payment = () => {
  const [amount, setAmount] = useState('');
  const [event, setSelectedEvent] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);

    if (!loggedInStatus) {
      setShowModal(true);
    }
  }, []);

  const handleEventChange = (e) => {
    const selectedEvent = e.target.value;
    setSelectedEvent(selectedEvent);
    setAmount(eventAmounts[selectedEvent] || '');
  };

  const validateEmail = () => {
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    return loggedInEmail === email.toLowerCase();
  };

  const savePaymentDetails = async (transactionId, event, amount, username, email, phone) => {
    const paymentData = {
      transaction: transactionId,
      username,
      email,
      phone,
      event,
      amount,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post('http://localhost:8080/payment/add', paymentData);
      console.log('Payment details saved successfully.');
    } catch (error) {
      console.error('Error saving payment details:', error);
    }
  };

  const handlePayment = async () => {
    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }

    if (!validateEmail()) {
      setErrorMessage('This email is not registered. Please use a registered email.');
      return;
    }

    setErrorMessage('');

    try {
      // Verify event details
      const response = await axios.post('http://localhost:8080/event/verify', {
        name: username,
        phoneNumber: phone,
        eventType: event,
      });

      if (response.data) {
        // Proceed with Razorpay payment if verification is successful
        const options = {
          key: 'rzp_test_OVdQrBXo4sL1ct', // Your Razorpay key
          amount: amount * 100,
          currency: 'INR',
          name: 'EcoFy',
          description: 'Event Booking Payment',
          handler: async function (response) {
            alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
            await savePaymentDetails(response.razorpay_payment_id, event, amount, username, email, phone);

            setAmount('');
            setSelectedEvent('');
            setUsername('');
            setEmail('');
            setPhone('');
          },
          prefill: {
            name: username,
            email: email,
            contact: phone,
          },
          theme: {
            color: '#3399cc',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        setErrorMessage('Invalid event details. Please check and try again.');
      }
    } catch (error) {
      console.error('Error verifying event details:', error);
      setErrorMessage('An error occurred while verifying event details. Please try again later.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/login'); 
  };

  return (
    <div>
      <Navbar />
      <div className="payment-page">
        <h1>Advance Payment</h1>
        <p>Handle your payments securely with Razorpay.</p>
        <div className="payment-form">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <label htmlFor="event">Select Event:</label>
          <select
            id="event"
            value={event}
            onChange={handleEventChange}
          >
            <option value="">Select an Event</option>
            {Object.keys(eventAmounts).map((event) => (
              <option key={event} value={event}>
                {event}
              </option>
            ))}
          </select>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
          <button onClick={handlePayment} className="payment-button">Pay Now</button>
        </div>
      </div>
      {showModal && <Modal isOpen={showModal} onClose={handleCloseModal} />}
    </div>
  );
};

export default Payment;
