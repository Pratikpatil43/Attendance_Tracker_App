const Faculty = require('../models/FacultyModel'); // Faculty model
const jwt = require('jsonwebtoken');
const HOD = require('../../MasterAdmin_backend/MasterAdmin_models/HodModel')


exports.HodLogin = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find HOD by username
      const hod = await HOD.find({ username});
      if (!hod) return res.status(404).json({ message: 'HOD not found' });
  
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, hod.password);
      if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });
  
      // Generate JWT token
      const token = jwt.sign({ _id: hod._id, username: hod.username, role: hod.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Error during login', error });
    }
  };
  