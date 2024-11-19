const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    studentName:{ type:String, required:true },
    studentUSN:{ type:String, ref:'Student', required:true },
    subject: { type:String, required:true },
    branch: { type:String, required:true },
    class: { type:String, required:true },
    date: { type:Date, required:true },
    status: { type:String, enum:['Present','Absent'],required:true },

});

module.exports = mongoose.model('Attendance',attendanceSchema);
