// authMiddleware.js
const jwt = require('jsonwebtoken');
const Student = require('../models/studentModel'); // Adjust the model path as needed

// Middleware to authenticate the user
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            studentUSN: decoded.studentUSN,
            branch: decoded.branch,
            class: decoded.class,
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }
};


module.exports = authenticateUser;
