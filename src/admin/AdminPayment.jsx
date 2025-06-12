import React, { useState, useEffect } from 'react';
import '../asserts/AdminPayment.css';

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

const API_BASE_URL = 'http://localhost:8086'; // Update with your actual backend URL

const AdminPayment = () => {
  const [payments, setPayments] = useState([]);
  const [editTransaction, setEditTransaction] = useState(null);
  const [editedUsername, setEditedUsername] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedEvent, setEditedEvent] = useState('');
  const [newTransaction, setNewTransaction] = useState('');

  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEvent, setNewEvent] = useState('');
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);

  const [searchField, setSearchField] = useState('username');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    const filtered = payments.filter(payment => {
      const fieldValue = payment[searchField] ? payment[searchField].toLowerCase() : '';
      return fieldValue.includes(searchQuery.toLowerCase());
    });
    setFilteredPayments(filtered);
  }, [searchField, searchQuery, payments]);

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/getall`);
      const data = await response.json();
      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleEdit = (payment) => {
    setEditTransaction(payment.transaction);
    setEditedUsername(payment.username);
    setEditedEmail(payment.email);
    setEditedPhone(payment.phone);
    setEditedEvent(payment.event);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedPayment = {
        transaction: editTransaction,
        username: editedUsername,
        email: editedEmail,
        phone: editedPhone,
        event: editedEvent,
        amount: eventAmounts[editedEvent],
      };
      await fetch(`${API_BASE_URL}/payment/${editTransaction}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayment),
      });
      fetchPayments();
      setEditTransaction(null);
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const handleDelete = async (transaction) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this payment?");
    if (!isConfirmed) return;
  
    try {
      await fetch(`${API_BASE_URL}/adminuser/adminpayment/${transaction}`, {
        method: 'DELETE',
      });
      fetchPayments();
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    try {
      const newPayment = {
        username: newUsername,
        email: newEmail,
        phone: newPhone,
        event: newEvent,
        amount: eventAmounts[newEvent],
        transaction: newTransaction,
      };
      await fetch(`${API_BASE_URL}/payment/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayment),
      });
      fetchPayments();
      setNewUsername('');
      setNewEmail('');
      setNewPhone('');
      setNewEvent('');
      setNewTransaction('');
      setShowAddPaymentForm(false);
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  return (
    <div className="admin-payment-page">
      <h1 className="admin-payment-title">Manage Payments</h1>
      <div className="search-bar">
        <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
          <option value="username">Username</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="transaction">Transaction</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchField}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <table className="admin-payment-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Event</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map(payment => (
            <tr key={payment.transaction}>
              <td>{payment.transaction}</td>
              <td>{payment.username}</td>
              <td>{payment.email}</td>
              <td>{payment.phone}</td>
              <td>{payment.event}</td>
              <td>{payment.amount}</td>
              <td>
                <button className="admin-button" onClick={() => handleDelete(payment.transaction)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPayment;
