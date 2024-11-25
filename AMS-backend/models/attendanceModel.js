const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    attendanceSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'AttendanceSession',
    },
    subject: { type:String, ref:'AttendanceSession', required:true },
    branch: { type:String, ref:'AttendanceSession', required:true },
    class: { type:String, ref:'AttendanceSession', required:true },
    status: { type:String, ref:'AttendanceRecord',enum:['Present','Absent'],required:true },

});

module.exports = mongoose.model('Attendance',attendanceSchema);
