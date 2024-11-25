const mongoose = require('mongoose');

const StudentAttendanceSchema = new mongoose.Schema({
    attendanceSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'AttendanceSession',
    },
    // studentName: { type: String, required: true },
    studentUSN: { type: String, required: true },
    date: {
        type: Date,
        required: true,
    },
    attendanceStatus: {
        type: String,
        enum: ['present', 'absent'],
        required: true,
    },
    subject: {
        type: String,  // Make sure this is String and required
        required: true,
    },
});

module.exports = mongoose.model('StudentAttendance', StudentAttendanceSchema);
