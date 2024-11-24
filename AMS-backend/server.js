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

app.use('/api/attendance', attendanceRoutes);
app.use('/api/auth', authRoutes);

// Routes
// app.use('/api/student', studentRoutes); // All student-related routes
// app.use('/api/teacher', teacherRoutes); // All teacher-related routes
// app.use('/api/teacher/register', teacherRoutes); // Specific teacher registration routes
// app.use('/api/teacher/password', teacherRoutes); // Teacher password-related routes
// app.use('/api/attendance', attendanceRoutes); // General attendance routes
// app.use('/api/mark-attendance', attendanceRoutes); // Routes for marking attendance
// app.use('/api/fetch-attendance', attendanceRoutes); // Routes for fetching attendance
// app.use('/api/teacher-attendance', teacherRoutes); // Teacher-specific attendance routes








// Error handling
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).send('Server Error');
});



// Connect Database
connectDB();



// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
