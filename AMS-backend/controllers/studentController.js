const express = require('express');
const router = express.Router();
const StudentAttendance = require('../models/studentAttendanceModel');
const Student = require('../models/studentModel');

const fetchStudentAttendance = async (req, res) => {
    const { studentUSN } = req.user;
    const { type } = req.body; // `type` can be 'weekly' or 'monthly'

    try {
        let startDate, endDate;

        // Calculate the date range based on the type
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of the day

        if (type === "weekly") {
            // Last 7 days (including today)
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 7); // Go back 6 days
            endDate = today;
        } else if (type === "monthly") {
            // Last 30 days (including today)
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 30); // Go back 29 days
            endDate = today;
        } else {
            return res.status(400).json({ message: "Invalid type. Use 'weekly' or 'monthly'." });
        }

        // MongoDB query
        const attendanceRecords = await StudentAttendance.find({
            studentUSN,
            date: { $gte: startDate, $lte: endDate },
        });

        // Format dates to 'DD/MM/YYYY' for the response
        const formattedRecords = attendanceRecords.map(record => ({
            ...record._doc, // Include all other fields
            date: record.date.toLocaleDateString('en-GB'), // Format to 'DD/MM/YYYY'
        }));

        return res.status(200).json({
            message: 'Attendance records fetched successfully.',
            attendanceRecords: formattedRecords,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = fetchStudentAttendance;



