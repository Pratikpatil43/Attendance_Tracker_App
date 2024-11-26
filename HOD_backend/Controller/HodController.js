const Request = require('../models/RequestModel'); // Request model
const Faculty = require('../models/FacultyModel'); // Faculty model
const jwt = require('jsonwebtoken');
const axios = require('axios');


// HOD creates a request for CRUD action (add/update/delete) on a faculty
exports.createRequest = async (req, res) => {
  const { facultyUsername, action } = req.body;

  try {
    // Check if faculty exists
    const faculty = await Faculty.findOne({ username: facultyUsername });
    if (!faculty && action !== 'add') {
      return res.status(404).json({ message: 'Faculty not found for this action.' });
    }

    // Create a new request for MasterAdmin
    const newRequest = new Request({
      hodUsername: req.user.username, // HOD username from authenticated token
      facultyUsername,
      action,
      status: 'pending', // Initial status is 'pending'
      masterAdminId: 'masterAdminId', // Add your logic to fetch the MasterAdmin ID
    });

    await newRequest.save();
    res.status(200).json({ message: 'Request sent to MasterAdmin', request: newRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error });
  }
};

// Get all requests made by the HOD
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find({ hodUsername: req.user.username });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error });
  }
};




exports.getAllFaculties = async (req, res) => {
  try {
    // Replace :masterAdminId with the actual ID you want to send in the request
    const masterAdminId = req.params.masterAdminId; // Get the ID from the request parameters
    
    const response = await axios.get(`http://localhost:5000/api/hod/getHOD/${masterAdminId}`);
    
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching faculties', error: error.message });
  }
};






