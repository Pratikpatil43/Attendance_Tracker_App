const mongoose = require('mongoose');


const addStudentSchema = new mongoose.Schema({
    attendanceSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'AttendanceSession',
    },
    studentName: { type: String, required: true },
    studentUSN: { type: String, required: true },

})

module.exports = mongoose.model('addStudent',addStudentSchema);
