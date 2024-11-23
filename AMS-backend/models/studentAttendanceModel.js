const mongoose = require('mongoose');

const StudentAttendanceSchema = new mongoose.Schema({
    attendanceSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceSession', required: true },
    studentName: { type: String, required: true },
    studentUSN: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('StudentAttendance', StudentAttendanceSchema);
