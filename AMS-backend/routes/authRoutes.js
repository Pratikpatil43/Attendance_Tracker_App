const express = require('express');
const router = express.Router();
const { register,login,loginTeacher,updatePassword } = require('../controllers/authController'); // Import register controller

// Route to register a student
router.post('/register', register);
router.post('/login', login);

//Route to register Teacher
router.post('/loginTeacher',loginTeacher)


// Update password route for teacher
router.put('/updatePassword', updatePassword);

module.exports = router;
