const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    emailid: { type:String, required:true },
    studentName: { type:String, required:true },
    studentUSN: { type:String, unique:true, required:true },
    password: { type:String, required:true }

});

module.exports = mongoose.model('Student',studentSchema);
