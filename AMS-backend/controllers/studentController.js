const express = require('express');
const router = express.Router();
const StudentAttendance = require('../models/studentAttendanceModel');
const Student = require('../models/studentModel');

const fetchStudentAttendance = async (req, res) => {
    const { studentUSN } = req.user; // Get the logged-in student's USN
    const { type, startDate: inputStartDate, endDate: inputEndDate } = req.body;

    try {
        let startDate, endDate;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to the start of the day

        // Determine date range
        if (type === "weekly") {
            // Last 7 days (including today)
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 7);
            endDate = new Date(today);
        } else if (type === "monthly") {
            // Last 30 days (including today)
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 30);
            endDate = new Date(today);
        } else if (inputStartDate && inputEndDate) {
            // Custom date range
            startDate = new Date(inputStartDate);
            endDate = new Date(inputEndDate);
            endDate.setHours(23, 59, 59, 999); // Include the full day

            // Validate input dates
            if (isNaN(startDate) || isNaN(endDate)) {
                return res.status(400).json({ message: "Invalid startDate or endDate format." });
            }
            if (startDate > endDate) {
                return res.status(400).json({ message: "startDate cannot be after endDate." });
            }
        } else {
            return res.status(400).json({
                message: "Invalid type or missing date range. Use 'weekly', 'monthly', or provide 'startDate' and 'endDate'.",
            });
        }

        // Fetch attendance records from the database
        const attendanceRecords = await StudentAttendance.find({
            studentUSN,
            date: { $gte: startDate, $lte: endDate },
        });

        if (!attendanceRecords.length) {
            return res.status(200).json({
                message: "No attendance records found.",
                summary: [],
            });
        }

        // Aggregate attendance data by subject
        const summary = attendanceRecords.reduce((acc, record) => {
            const { subject, attendanceStatus, date } = record;

            if (!acc[subject]) {
                acc[subject] = { present: 0, absent: 0, presentDates: [], absentDates: [] };
            }

            const formattedDate = new Date(date).toLocaleDateString("en-GB"); // Format to DD/MM/YYYY

            if (attendanceStatus === "present") {
                acc[subject].present += 1;
                acc[subject].presentDates.push(formattedDate);
            } else if (attendanceStatus === "absent") {
                acc[subject].absent += 1;
                acc[subject].absentDates.push(formattedDate);
            }

            return acc;
        }, {});

        // Format the summary for the response
        const responseSummary = Object.entries(summary).map(([subject, data]) => ({
            studentUSN,
            subject,
            present: data.present,
            absent: data.absent,
            presentDates: data.presentDates,
            absentDates: data.absentDates,
        }));

        return res.status(200).json({
            message: "Attendance records fetched successfully.",
            summary: responseSummary,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
};



module.exports = fetchStudentAttendance;




