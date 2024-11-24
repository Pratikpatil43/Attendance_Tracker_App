const express = require('express');
const router = express.Router();
const {addAttendanceSession, addStudentToSession,fetchstudentAtt,markStudentAttendance} = require('../controllers/attendanceController');
const authenticateUser = require('../middlewares/authMiddleware');




// Route to create a new attendance session
router.post('/createAttendanceSession', authenticateUser, addAttendanceSession);

// Route to add a student to an existing attendance session
router.post('/addStudentToSession', authenticateUser, addStudentToSession);

// Route to fetch all attendance details for a student
router.get('/getStudentAttendance', authenticateUser, fetchstudentAtt);


// Route to mark attendance for a student
router.post('/markStudentAttendance', authenticateUser, markStudentAttendance);









module.exports = router;
