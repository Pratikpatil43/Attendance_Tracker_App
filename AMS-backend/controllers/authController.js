const bcrypt = require('bcryptjs');
const Student = require('../models/studentModel'); // Ensure the correct path
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/env.config');
const Teacher = require('../models/teacherModel');

// Register User (Student)
const register = async (req, res) => {
    const { studentName, emailid, password, studentUSN } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if the student already exists
        const existingStudent = await Student.findOne({ emailid });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already exists!' });
        }


        // Save the new student
        const newStudent = new Student({ studentName, emailid, studentUSN, password: hashedPassword });
        await newStudent.save();

        return res.status(201).json({ message: 'Student registered successfully!' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


// Login User (Student/Teacher)
const login = async (req, res) => {
    const { emailid, password } = req.body;

    try {
        const user =  await Student.findOne({ emailid });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

        const payload = { id: user._id, studentName: user.studentName };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ emailid, token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
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


module.exports = { register,login,loginTeacher,updatePassword }; // Exporting register as an object
