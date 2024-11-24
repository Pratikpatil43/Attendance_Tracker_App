const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    teacherName:{ type:String ,required:true },
    emailid:{ type:String ,required:true },
    username:{ type:String ,required:true },
    password:{ type:String ,required:true }
});

module.exports = mongoose.model('Teacher',teacherSchema);
