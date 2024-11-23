const express = require('express');
const router = express.Router();
const AttendanceSession = require('../models/attendanceSessionModel'); // Attendance session model
const StudentAttendance = require('../models/studentAttendanceModel'); // Student attendance model


// Add Student Attendance
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

const addStudentToSession = async  (req, res) => {
    const { attendanceSessionId, studentName, studentUSN } = req.body;

    try {
        // Check if the attendance session exists
        const attendanceSession = await AttendanceSession.findById(attendanceSessionId);

        if (!attendanceSession) {
            return res.status(404).json({ message: 'Attendance session not found. Please create a session first.' });
        }

        // Add the student to the session
        const studentAttendance = new StudentAttendance({
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


const fetchstudentAtt = async (req, res) => {
    const { attendanceSessionId } = req.query; // Use query parameters to fetch data for a specific session

    try {
        // Validate that the attendance session exists
        const attendanceSession = await AttendanceSession.findById(attendanceSessionId);
        if (!attendanceSession) {
            return res.status(404).json({ message: 'Attendance session not found.' });
        }

        // Fetch all students linked to this session
        const fetchStudent = await StudentAttendance.find({ attendanceSessionId });

        return res.status(200).json({ 
            message: 'Data fetched successfully!', 
            session: attendanceSession, 
            students: fetchStudent 
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error. Could not fetch data.' });
    }
};



module.exports = {addAttendanceSession,addStudentToSession,fetchstudentAtt};
