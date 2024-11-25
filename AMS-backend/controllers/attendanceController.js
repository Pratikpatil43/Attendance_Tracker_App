const express = require('express');
const router = express.Router();
const AttendanceSession = require('../models/attendanceSessionModel'); // Attendance session model
const addStudent = require('../models/addStudentModel'); // Student attendance model
const AttendanceRecord = require('../models/AttendanceRecord');
const studentAttendanceModel = require('../models/studentAttendanceModel');

// Add Attendance Session
const addAttendanceSession = async (req, res) => {
    const { subject, branch, class: className, date } = req.body;

    try {
        // Check if the session already exists
        const existingSession = await AttendanceSession.findOne({ subject, branch, class: className, date });

        if (existingSession) {
            return res.status(400).json({ message: 'Attendance session already exists for this subject, branch, class, and date.' });
        }

        // Create a new attendance session
        const attendanceSession = new AttendanceSession({ subject, branch, class: className, date });
        await attendanceSession.save();

        return res.status(201).json({ message: 'Attendance session created successfully!', session: attendanceSession });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error. Could not create attendance session.' });
    }
};

// Add Student to Session
const addStudentToSession = async (req, res) => {
    const { attendanceSessionId, studentName, studentUSN } = req.body;

    try {
        // Check if the attendance session exists
        const attendanceSession = await AttendanceSession.findById(attendanceSessionId);

        if (!attendanceSession) {
            return res.status(404).json({ message: 'Attendance session not found. Please create a session first.' });
        }

        // Check if the student is already added to the session
        const existingStudent = await addStudent.findOne({ attendanceSessionId, studentUSN });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already added to this session.' });
        }

        // Add the student to the session
        const studentAttendance = new addStudent({
            attendanceSessionId: attendanceSession._id,
            studentName,
            studentUSN,
        });
        await studentAttendance.save();

        return res.status(201).json({ message: 'Student added to session successfully!', student: studentAttendance });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error. Could not add student to session.' });
    }
};



// Fetch Students by Session and Sort by Last Two Digits of studentUSN
const fetchstudentAtt = async (req, res) => {
    const { subject, branch, class: className } = req.body; // Use query parameters for session filtering

    try {
        // Build the query object
        const query = { subject, branch, class: className };

        // Find the attendance session based on the provided details
        const attendanceSession = await AttendanceSession.findOne(query);

        if (!attendanceSession) {
            return res.status(404).json({ message: 'Attendance session not found for the given criteria.' });
        }

        // Fetch all students linked to this session
        const fetchStudent = await studentAttendanceModel.find({ attendanceSessionId: attendanceSession._id });

        // Sort students by the last two digits of studentUSN
        const sortedStudents = fetchStudent.sort((a, b) => {
            const lastTwoDigitsA = a.studentUSN.slice(-2);
            const lastTwoDigitsB = b.studentUSN.slice(-2);
            return parseInt(lastTwoDigitsA) - parseInt(lastTwoDigitsB);
        });

        return res.status(200).json({
            message: 'Data fetched successfully!',
            session: attendanceSession,
            students: sortedStudents,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error. Could not fetch data.' });
    }
};


const markStudentAttendance = async (req, res) => {
    const { attendanceSessionId, studentUSN, date, attendanceStatus, subject } = req.body;

    try {
        // Validate attendance status
        if (!['present', 'absent'].includes(attendanceStatus.toLowerCase())) {
            return res.status(400).json({ message: 'Invalid attendance status.' });
        }

        // Validate date format (DD/MM/YYYY)
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({ message: 'Invalid date format. Use DD/MM/YYYY.' });
        }

        // Convert date from DD/MM/YYYY to a UTC-normalized Date object
        const [day, month, year] = date.split('/').map(Number);
        const normalizedDate = new Date(Date.UTC(year, month - 1, day)); // Use Date.UTC to normalize to UTC

        // Check if the attendance session exists
        const attendanceSession = await AttendanceSession.findById(attendanceSessionId);
        if (!attendanceSession) {
            return res.status(404).json({ message: 'Attendance session not found.' });
        }

        // Ensure the subject matches the session subject
        if (attendanceSession.subject !== subject) {
            return res.status(400).json({ message: 'Subject does not match the session subject.' });
        }

        // Check if the student is enrolled in the session
        const student = await addStudent.findOne({ attendanceSessionId, studentUSN });
        if (!student) {
            return res.status(404).json({ message: 'Student not found in the specified session.' });
        }

        // Check if attendance for this student on this date already exists
        const existingRecord = await studentAttendanceModel.findOne({
            attendanceSessionId,
            studentUSN,
            date: normalizedDate, // Use normalized Date object for comparison
        });

        if (existingRecord) {
            // Update existing record
            existingRecord.attendanceStatus = attendanceStatus.toLowerCase();
            await existingRecord.save();

            return res.status(200).json({
                message: 'Attendance updated successfully!',
                record: existingRecord,
            });
        }

        // Create a new attendance record
        const attendanceRecord = new studentAttendanceModel({
            attendanceSessionId,
            studentUSN,
            date: normalizedDate, // Save as a UTC-normalized Date object
            attendanceStatus: attendanceStatus.toLowerCase(),
            subject,
        });

        await attendanceRecord.save();

        return res.status(201).json({
            message: 'Attendance marked successfully!',
            record: attendanceRecord,
        });
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({ message: 'Server error. Could not mark attendance.' });
    }
};









module.exports = { addAttendanceSession, addStudentToSession, fetchstudentAtt, markStudentAttendance };
