const mongoose = require('mongoose');

const AttendanceSessionSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    branch: { type: String, required: true },
    class: { type: String, required: true },
    date: { type: Date, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('AttendanceSession', AttendanceSessionSchema);
