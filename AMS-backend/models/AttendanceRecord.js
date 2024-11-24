const mongoose = require('mongoose');

const AttendanceRecordSchema = new mongoose.Schema({
    attendanceSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'AttendanceSession',
    },
    studentUSN: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    attendanceStatus: {
        type: String,
        enum: ['present', 'absent'],
        required: true,
    },
});

// Ensure uniqueness for the combination of session, student, and date
AttendanceRecordSchema.index({ attendanceSessionId: 1, studentUSN: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('AttendanceRecord', AttendanceRecordSchema);
