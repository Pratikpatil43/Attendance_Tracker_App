const express = require('express');
const router = express.Router();
const {
  register,
  login,
  loginTeacher,
  updatePassword,
  registerTeacher} = require('../controllers/authController');

// Authentication Routes

// Student registration and login routes
router.post('/register', register); // Register a student
router.post('/login', login); // Login a student

// Teacher registration and login routes
router.post('/registerTeacher', registerTeacher); // Register a teacher
router.post('/loginTeacher', loginTeacher); // Login a teacher

// Route to update a teacher's password
router.put('/updatePassword', updatePassword); // Update password for a teacher

module.exports = router;
