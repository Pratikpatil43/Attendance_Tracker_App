const express = require('express');
const router = express.Router();
const fetchStudentAttendance = require('../controllers/studentController')
const authenticateUser = require('../middlewares/authMiddleware')







router.get('/fetchattendance',authenticateUser,fetchStudentAttendance)




module.exports = router;
