const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authMiddleware');
const fetchStudentsBySession = require('../controllers/teacherController')





router.get('/fetchstudentAtt', authenticateUser, fetchStudentsBySession);







module.exports = router;
