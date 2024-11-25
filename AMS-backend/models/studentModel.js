const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    emailid: { type: String, required: true, unique: true },
    studentUSN: { type: String, required: true, unique: true },
    branch: { type: String, required: true }, // New field
    class: { type: String, required: true },  // New field
    password: { type: String, required: true },
});

module.exports = mongoose.model('Student', studentSchema);
