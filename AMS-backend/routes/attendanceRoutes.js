const express = require('express');
const router = express.Router();
const {addAttendanceSession, addStudentToSession,fetchstudentAtt} = require('../controllers/attendanceController');
const authenticateUser = require('../middlewares/authMiddleware');



router.post('/addStudentAtt',authenticateUser, addAttendanceSession);
router.post('/studentdata', authenticateUser,addStudentToSession);  // Route to add student to session


router.get('/fetchstudent', authenticateUser,fetchstudentAtt);  // Route to add student to session








module.exports = router;
