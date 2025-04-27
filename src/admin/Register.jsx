import React, { useState, useEffect } from 'react';
import '../asserts/Register.css'; // Fixed the typo in the folder name
import axios from 'axios';

const Register = () => {
  const [events, setEvents] = useState([]);
  const [searchField, setSearchField] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: '',
    phoneNumber: '',
    startDate: '',
    endDate: '',
    eventType: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/event/getAll');
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
  }, []);

  useEffect(() => {
    const filtered = events.filter(event =>
      event[searchField]
        ? event[searchField].toLowerCase().includes(searchQuery.toLowerCase())
        : false
    );
    setFilteredEvents(filtered);
  }, [searchField, searchQuery, events]);

  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (eventId) => {

    const isConfirmed = window.confirm("Are you sure you want to delete this event?");
    if (!isConfirmed) return;

    try {
        const response = await axios.delete(`http://localhost:8080/adminuser/register/${eventId}`);
        if (response.status === 200) {
            setEvents(events.filter(event => event.eventId !== eventId)); // Ensure eventId matches
        } else {
            console.error('Delete failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting event:', error);
    }
  };

  const handleEdit = (event) => {
    setEditEvent(event);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:8080/adminuser/register/${editEvent.eventId}`, {
        ...editEvent,
        phoneNumber: parseInt(editEvent.phoneNumber) // Convert phoneNumber to a number if needed
      });
      setEvents(events.map(event => event.eventId === editEvent.eventId ? editEvent : event));
      setIsEditing(false);
      setEditEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
    if (isEditing) {
      setEditEvent(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddNewEvent = async () => {
    try {
      const response = await axios.post('http://localhost:8080/event/add', newEvent);
      setEvents([...events, response.data]);
      setIsAdding(false);
      setNewEvent({
        name: '',
        phoneNumber: '',
        startDate: '',
        endDate: '',
        eventType: '',
        city: '',
        state: '',
        pincode: ''
      });
    } catch (error) {
      console.error('Error adding new event:', error);
    }
  };

  return (
    <div className="register-container">
      <h1>Registered Events</h1>
      {isAdding ? (
        <div className="register-add-form">
          <h2>Add New Event</h2>
          <input
            type="text"
            name="name"
            value={newEvent.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            type="text"
            name="phone"
            value={newEvent.phoneNumber}
            onChange={handleChange}
            placeholder="Phone"
            required
          />
          <input
            type="datetime-local"
            name="startDate"
            value={newEvent.startDate}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, -8)}
            required
          />
          <input
            type="datetime-local"
            name="endDate"
            value={newEvent.endDate}
            onChange={handleChange}
            min={newEvent.startDate || new Date().toISOString().slice(0, -8)}
            required
          />
          <select className="register-add-form-b"
            name="eventType"
            value={newEvent.eventType}
            onChange={handleChange}
            required
          >
            <option value="">Select an Event</option>
            <option value="Corporate Event">Corporate Event</option>
            <option value="Wedding">Wedding</option>
            <option value="Birthday Party">Birthday Party</option>
            <option value="Christmas Event">Christmas Event</option>
            <option value="Diwali Celebration">Diwali Celebration</option>
            <option value="Food Fest">Food Fest</option>
            <option value="Concert">Concert</option>
            <option value="Exhibition">Exhibition</option>
            <option value="Fashion Show">Fashion Show</option>
            <option value="Product Launch">Product Launch</option>
            <option value="Tech Conference">Tech Conference</option>
            <option value="Charity Gala">Charity Gala</option>
          </select>
          <input
            type="text"
            name="city"
            value={newEvent.city}
            onChange={handleChange}
            placeholder="City"
            required
          />
          <select className="register-add-form-b"
            name="state"
            value={newEvent.state}
            onChange={handleChange}
            required
          >
            <option value="">Select State</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Odisha">Odisha</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Delhi">Delhi</option>
          </select>
          <input
            type="text"
            name="pincode"
            value={newEvent.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            required
          />
          <div className="add-register-button-container">
            <button className="register-add-btn" onClick={handleAddNewEvent}>Add Event</button>
            <button className="register-add-btn" onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        </div>
      ) : isEditing ? (
        <div className="register-edit-form">
          <h2>Edit Event</h2>
          <input
            type="text"
            name="name"
            value={editEvent.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            type="text"
            name="phone"
            value={editEvent.phoneNumber}
            onChange={handleChange}
            placeholder="Phone"
          />
          <input
            type="datetime-local"
            name="startDate"
            value={editEvent.startDate}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, -8)}
            required
          />
          <input
            type="datetime-local"
            name="endDate"
            value={editEvent.endDate}
            onChange={handleChange}
            min={editEvent.startDate || new Date().toISOString().slice(0, -8)}
            required
          />
          <select className="register-add-form-b"
            name="eventType"
            value={editEvent.eventType}
            onChange={handleChange}
          >
            <option value="">Select an Event</option>
            <option value="Corporate Event">Corporate Event</option>
            <option value="Wedding">Wedding</option>
            <option value="Birthday Party">Birthday Party</option>
            <option value="Christmas Event">Christmas Event</option>
            <option value="Diwali Celebration">Diwali Celebration</option>
            <option value="Food Fest">Food Fest</option>
            <option value="Concert">Concert</option>
            <option value="Exhibition">Exhibition</option>
            <option value="Fashion Show">Fashion Show</option>
            <option value="Product Launch">Product Launch</option>
            <option value="Tech Conference">Tech Conference</option>
            <option value="Charity Gala">Charity Gala</option>
          </select>
          <input
            type="text"
            name="city"
            value={editEvent.city}
            onChange={handleChange}
            placeholder="City"
          />
          <select className="register-add-form-b"
            name="state"
            value={editEvent.state}
            onChange={handleChange}
          >
            <option value="">Select State</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Odisha">Odisha</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Delhi">Delhi</option>
          </select>
          <input
            type="text"
            name="pincode"
            value={editEvent.pincode}
            onChange={handleChange}
            placeholder="Pincode"
          />
          <div className="edit-register-button-container">
            <button className="register-edit-btn" onClick={handleSaveEdit}>Save</button>
            <button className="register-edit-btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
        <div className="register-search-bar">
          <select  value={searchField} onChange={handleSearchFieldChange}>
          <option value="name">Name</option>
              <option value="startDate">Start Date</option>
              <option value="endDate">End Date</option>
              <option value="eventType">Event Type</option>
              <option value="city">City</option>
              <option value="state">State</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            placeholder={`Search by ${searchField}`}
          />
        </div>
          <button className="register-add-btn" onClick={() => setIsAdding(true)}>Add Event</button>
          {filteredEvents.length === 0 ? (
            <p>No events registered yet.</p>
          ) : (
          <table className="register-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Event Type</th>
                <th>City</th>
                <th>State</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <tr key={event.eventId}>
                  <td>{event.eventId}</td>
                  <td>{event.name}</td>
                  <td>{event.startDate}</td>
                  <td>{event.endDate}</td>
                  <td>{event.eventType}</td>
                  <td>{event.city}</td>
                  <td>{event.state}</td>
                  <td>
                    {/* <button onClick={() => handleEdit(event)}>Edit</button> */}
                    <button onClick={() => handleDelete(event.eventId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </>
      )}
    </div>
  );
};

export default Register;
