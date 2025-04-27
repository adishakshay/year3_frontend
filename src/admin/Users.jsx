import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../asserts/Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPassword, setEditedPassword] = useState('');
  const [editedConfirmPassword, setEditedConfirmPassword] = useState('');
  const [editedRole, setEditedRole] = useState('');

  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const [newRole, setNewRole] = useState('');
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  const [searchField, setSearchField] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    // Fetch users from the backend
    axios.get('http://localhost:8080/signup/getall')
      .then(response => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  useEffect(() => {
    // Filter users based on search query and field
    const filtered = users.filter(user => {
      const fieldValue = searchField === 'name'
        ? `${user.firstName} ${user.lastName}`
        : user[searchField];
      return fieldValue.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredUsers(filtered);
  }, [searchField, searchQuery, users]);

  const handleEdit = (user) => {
    setEditUser(user.email);
    setEditedFirstName(user.firstName);
    setEditedLastName(user.lastName);
    setEditedEmail(user.email);
    setEditedPassword(user.Password);
    setEditedConfirmPassword(user.confirmPassword);
    setEditedRole(user.role); 
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
        firstName: editedFirstName,
        lastName: editedLastName,
        password: editedPassword,
        confirmPassword: editedConfirmPassword,
        role: editedRole
    };

    axios.put(`http://localhost:8080/adminuser/users/${editedEmail.toLowerCase()}`, updatedUser)
        .then(response => {
            const updatedUsers = users.map(user =>
                user.email.toLowerCase() === editedEmail.toLowerCase() ? { ...user, ...updatedUser } : user
            );
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers);
            setEditUser(null);
            alert('User updated successfully');
        })
        .catch(error => {
            console.error('Error updating user:', error);
            alert('Error updating user');
        });
    };

  const handleDelete = (email) => {

    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (!isConfirmed) return;

    axios.delete(`http://localhost:8080/adminuser/user/${email}`)
      .then(response => {
        if (response.data) {
          const updatedUsers = users.filter(user => user.email !== email);
          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers);
        } else {
          console.error('Failed to delete user');
        }
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };
  

  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = {
      firstName: newFirstName,
      lastName: newLastName,
      email: newEmail,
      password: newPassword,
      confirmPassword: newConfirmPassword,
      role: newRole 
    };

    axios.post('http://localhost:8080/signup/add', newUser)
      .then(response => {
        const updatedUsers = [...users, response.data];
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setNewFirstName('');
        setNewLastName('');
        setNewEmail('');
        setNewPassword('');
        setNewConfirmPassword('');
        setNewRole(''); 
        setShowAddUserForm(false);
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  };

  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="users-container">
      <h1 className="users-title">Manage Users</h1>
      <div className="search-bar">
        <select value={searchField} onChange={handleSearchFieldChange}>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="role">Role</option> 
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchField}`}
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
      </div>
      <div className="add-user-button-container">
        <button className="users-button" onClick={() => setShowAddUserForm(!showAddUserForm)}>
          {showAddUserForm ? 'Cancel' : 'Add User'}
        </button>
      </div>
      {showAddUserForm && (
        <div className="add-user-form-container">
          <h2>Add User</h2>
          <form onSubmit={handleAddUser}>
            <label htmlFor="newFirstName">First Name</label>
            <input
              type="text"
              id="newFirstName"
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
              required
            />

            <label htmlFor="newLastName">Last Name</label>
            <input
              type="text"
              id="newLastName"
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
              required
            />

            <label htmlFor="newEmail">Email</label>
            <input
              type="email"
              id="newEmail"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />

            <label htmlFor="newPassword">Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <label htmlFor="newConfirmPassword">Confirm Password</label>
            <input
              type="confirmPassword"
              id="newConfirmPassword"
              value={newConfirmPassword}
              onChange={(e) => setNewConfirmPassword(e.target.value)}
              required
            />

            <label htmlFor="newRole">Role</label>
            <input
              type="text"
              id="newRole"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              required
            />

            <button type="submit">Add User</button>
          </form>
        </div>
      )}
      {editUser && (
        <div className="edit-form-container">
          <h2>Edit User</h2>
          <form onSubmit={handleEditSubmit}>
            <label htmlFor="editedFirstName">First Name</label>
            <input
              type="text"
              id="editedFirstName"
              value={editedFirstName}
              onChange={(e) => setEditedFirstName(e.target.value)}
              required
            />

            <label htmlFor="editedLastName">Last Name</label>
            <input
              type="text"
              id="editedLastName"
              value={editedLastName}
              onChange={(e) => setEditedLastName(e.target.value)}
              required
            />

            <label htmlFor="editedEmail">Email</label>
            <input
              type="email"
              id="editedEmail"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              readOnly
            />

            <label htmlFor="editedPassword">Password</label>
            <input
              type="password"
              id="editedPassword"
              value={editedPassword}
              onChange={(e) => setEditedPassword(e.target.value)}
              required
            />

            <label htmlFor="editedConfirmPassword">ConfirmPassword</label>
            <input
              type="confirmPassword"
              id="editedConfirmPassword"
              value={editedConfirmPassword}
              onChange={(e) => setEditedConfirmPassword(e.target.value)}
              required
            />

            <label htmlFor="editedRole">Role</label>
            <input
              type="text"
              id="editedRole"
              value={editedRole}
              onChange={(e) => setEditedRole(e.target.value)}
              required
            />

            <button type="submit">Save Changes</button>
          </form>
        </div>
      )}
      <table className="users-table">
        <thead>
          <tr>
            <th className="users-table-header">First Name</th>
            <th className="users-table-header">Last Name</th>
            <th className="users-table-header">Email</th>
            <th className="users-table-header">Password</th>
            <th className="users-table-header">Role</th>
            <th className="users-table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.email}>
              <td className="users-table-cell">{user.firstName}</td>
              <td className="users-table-cell">{user.lastName}</td>
              <td className="users-table-cell">{user.email}</td>
              <td className="users-table-cell">{user.confirmPassword}</td>
              <td className="users-table-cell">{user.role}</td> 
              <td className="users-table-cell">
                <button className="users-button" onClick={() => handleEdit(user)}>Edit</button>
                <button className="users-button" onClick={() => handleDelete(user.email)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
