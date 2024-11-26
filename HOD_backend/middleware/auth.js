const jwt = require('jsonwebtoken');
const Faculty = require('../models/FacultyModel');

// Middleware for authenticating HOD
exports.authenticateHod = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hod = await Faculty.findOne({ _id: decoded._id, role: 'HOD' }); // Ensure user is HOD
    if (!hod) {
      return res.status(401).json({ message: 'Unauthorized access as HOD' });
    }
    req.user = hod;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};
