const express = require('express');
const mongoose = require('mongoose');
const HodRoutes = require('./routes/HodRoutes');
const connectDB = require('../shared/database/db')

const app = express();
app.use(express.json());

// Route setup
app.use('/api/hod', HodRoutes);


// MongoDB connection
connectDB();

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
