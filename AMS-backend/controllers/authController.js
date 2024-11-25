const bcrypt = require('bcryptjs');
const Student = require('../models/studentModel'); // Ensure the correct path
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/env.config');
const Teacher = require('../models/teacherModel');
const attendanceSession = require('../models/attendanceSessionModel')
const StudentAttendance = require('../models/studentAttendanceModel')

// Register User (Student)
const register = async (req, res) => {
    const { studentName, emailid, password, studentUSN, branch, class: studentClass } = req.body;  // Extract branch and class from req.body

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if the student already exists
        const existingStudent = await Student.findOne({ emailid });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already exists!' });
        }

        // Find the attendance session that corresponds to the provided USN
        const studentAttendance = await StudentAttendance.findOne({ studentUSN }).populate('attendanceSessionId');

        // If no attendance session is found for the provided studentUSN
        if (!studentAttendance || !studentAttendance.attendanceSessionId) {
            return res.status(400).json({
                message: 'No attendance session found for the provided USN. Please ensure the USN is valid.',
            });
        }

        // Extract the branch and class from the populated AttendanceSession
        const { branch: attendanceBranch, class: attendanceClass } = studentAttendance.attendanceSessionId;

        // Check if the provided branch and class match the ones in the attendance session
        if (attendanceBranch !== branch || attendanceClass !== studentClass) {
            return res.status(400).json({
                message: 'The branch and class do not match the attendance session records.',
            });
        }

        // Save the new student with branch and class
        const newStudent = new Student({
            studentName,
            emailid,
            studentUSN,
            branch, // Use the branch from the request body
            class: studentClass, // Use the class from the request body
            password: hashedPassword,
        });

        // Save the new student to the database
        await newStudent.save();

        return res.status(201).json({ message: 'Student registered successfully!' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};





const registerTeacher = async (req, res) => {
    const { teacherName, emailid, password, username } = req.body;

    try {
        // Check if the teacher already exists
        const existingTeacher = await Teacher.findOne({ emailid });
        if (existingTeacher) {
            return res.status(400).json({ message: 'Teacher already exists!' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the new teacher
        const newTeacher = new Teacher({
            username,
            teacherName,
            emailid,
            password: hashedPassword,
        });
        await newTeacher.save();

        return res.status(201).json({ message: 'Teacher registered successfully!' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};



// Login User (Student/Teacher)
const login = async (req, res) => {
    const { studentUSN, password } = req.body;

    try {
        // Find student by USN
        const student = await Student.findOne({ studentUSN });

        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, student.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Create JWT token
        const token = jwt.sign({ studentUSN: student.studentUSN }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error during login.' });
    }
};





//Login for teacher
const loginTeacher = async (req, res) => {
    const { username, password } = req.body; // Accept username and password
    const predefinedUsername = 'VSM@123$'; // Developer-defined constant username

    try {
        // Check if the username matches the predefined username
        if (username !== predefinedUsername) {
            return res.status(400).json({ message: 'Invalid username. Only the developer-defined username is allowed.' });
        }

        // Find the teacher by username
        const teacher = await Teacher.findOne({ username: predefinedUsername });
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found. Please contact the developer for registration.' });
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        // Generate a JWT token
        const payload = { id: teacher._id, username: teacher.username };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).json({
            message: 'Login successful!',
            token,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};




//update password of teacher
const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const predefinedUsername = 'VSM@123$'; // Developer-defined constant username

    try {
        // Find the teacher by username
        const teacher = await Teacher.findOne({ username: predefinedUsername });
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found!' });
        }

        // Verify the old password
        const isMatch = await bcrypt.compare(oldPassword, teacher.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Old password is incorrect!' });
        }

        // Hash the new password and update it
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        teacher.password = hashedPassword;
        await teacher.save();

        return res.status(200).json({ message: 'Password updated successfully!' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = { register,login,loginTeacher,updatePassword,registerTeacher }; // Exporting register as an object