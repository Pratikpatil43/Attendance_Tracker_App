const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env.config');

// Middleware to verify the token
const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from "Bearer <token>"
    
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach decoded payload to the request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err.message);
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};



module.exports = authenticateUser;