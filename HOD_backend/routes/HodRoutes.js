const express = require('express');
const router = express.Router();
const {getAllRequests,createRequest} = require('../Controller/HodController');
const { authenticateHod } = require('../middleware/auth');
const {HodLogin} = require('../Controller/authController');
const {getAllFaculties} = require('../Controller/HodController');

// Create a request to perform an action on a faculty member
router.post('/request', authenticateHod, createRequest);

// View all requests made by the HOD
router.get('/requests', authenticateHod, getAllRequests);

router.post('/login', authenticateHod, HodLogin);
router.get('/getall',  getAllFaculties);         


module.exports = router;
