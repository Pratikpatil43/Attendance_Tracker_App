const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { PORT } = require('./config/env.config');

const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes')


const app = express();

// Middleware
app.use(bodyParser.json());
app.use(helmet());
app.use(express.json());


// Routes
app.use('/api/student', authRoutes)
app.use('/api/teacher', authRoutes)
app.use('/api/teacherPassword', authRoutes)
app.use('/api', attendanceRoutes)
app.use('/api', attendanceRoutes)
app.use('/api/fetch', attendanceRoutes)







// Error handling
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).send('Server Error');
});



// Connect Database
connectDB();



// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
