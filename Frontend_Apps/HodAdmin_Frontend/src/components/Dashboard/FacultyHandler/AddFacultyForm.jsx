import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, MenuItem, Alert } from '@mui/material';

const AddFaculty = () => {
  const [formData, setFormData] = useState({
    name: '',
    facultyUsername: '',
    password: '',
    branch: '',
    subject: '',
    type: '',
    action: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handles input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setMessage('');
    setError('');

    try {
      const token = sessionStorage.getItem('token'); // Get the token from session storage

      const response = await axios.post('https://attendancetracker-backend1.onrender.com/api/hod/addfaculty', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage(response.data.message);
      setFormData({
        name: '',
        facultyUsername: '',
        password: '',
        branch: '',
        subject: '',
        type: '',
        action: ''
      });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Something went wrong. Please try again later.'
      );
    }
  };

  return (
    <div className="add-faculty-container" style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Add Faculty Request
      </Typography>

      {message && <Alert severity="success" style={{ marginBottom: '20px' }}>{message}</Alert>}
      {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

      <form className="add-faculty-form" onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
          sx={{ width: '100%' }}
        />
        <TextField
          label="Faculty Username"
          name="facultyUsername"
          value={formData.facultyUsername}
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
          sx={{ width: '100%' }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
          sx={{ width: '100%' }}
        />
        <TextField
          label="Branch"
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
          sx={{ width: '100%' }}
        />
        <TextField
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
          sx={{ width: '100%' }}
        />
        <TextField
          label="Type"
          name="type"
          select
          value={formData.type}
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
          sx={{ width: '100%' }}
        >
          <MenuItem value="create">Create</MenuItem>
          {/* <MenuItem value="update">Update</MenuItem> */}
        </TextField>
        <TextField
          label="Action"
          name="action"
          select
          value={formData.action}
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
          sx={{ width: '100%' }}
        >
          <MenuItem value="create">Create</MenuItem>
          {/* <MenuItem value="update">Update</MenuItem> */}
        </TextField>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: '20px', width: '100%' }}
        >
          Submit Request
        </Button>
      </form>
    </div>
  );
};

export default AddFaculty;
