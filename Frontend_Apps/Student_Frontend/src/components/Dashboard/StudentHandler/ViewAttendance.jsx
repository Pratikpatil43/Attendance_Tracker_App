import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa'; // Importing calendar icon
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Styles for the date picker
import { FaHandRock } from 'react-icons/fa'; // Importing a hand wave icon for animation

const ViewAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [totalClasses, setTotalClasses] = useState(0);
  const [attendedClasses, setAttendedClasses] = useState(0);
  const [overallAttendancePercentage, setOverallAttendancePercentage] = useState(0);
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const [name, setName] = useState(''); // State for user name

  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('Unauthorized: Please login to check Attendance');
        return;
      }

      try {
        const response = await axios.get('https://attendancetracker-backend1.onrender.com/api/student/viewprofile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setName(response.data.user.name); // Assuming the response contains the user's name
      } catch (err) {
        setError('Failed to fetch user data');
      }
    };

    fetchUser();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token'); // Retrieve the token from sessionStorage

      if (!token) {
        setError('Unauthorized: Please login to check Attendance');
        setLoading(false);
        return;
      }

      const response = await axios.get('https://attendancetracker-backend1.onrender.com/api/student/getAttendance', {
        params: { startDate, endDate },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { detailedAttendance, totalClasses, attendedClasses, overallAttendancePercentage, message } = response.data;

      setAttendanceData(detailedAttendance || []);
      setTotalClasses(totalClasses);
      setAttendedClasses(attendedClasses);
      setOverallAttendancePercentage(overallAttendancePercentage);
      setMessage(message);
    } catch (err) {
      setError('Attendance Record not found for selected Date');
      setTimeout(() => setError(''), 3000); // Clears the error message after 3 seconds
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [startDate, endDate]);

  // Handlers for date picker dialogs
  const handleStartDateChange = (date) => {
    setStartDate(date);
    setIsStartDateOpen(false); // Close the date picker after selection
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setIsEndDateOpen(false); // Close the date picker after selection
  };

  return (
    <div className="container my-5">
      {/* Greeting with animated hand */}
      <p style={{ color: 'blue', fontSize: '20px' }}>
  Hello, {name} {' Track your Attendance'}
</p>


      {/* Date Filters with icons */}
      <div className="mb-3">
        <label htmlFor="startDate" className="form-label">Start Date:</label>
        <div className="input-group">
          <Button
            variant="outline-secondary"
            onClick={() => setIsStartDateOpen(true)}
            disabled={loading}
          >
            <FaCalendarAlt /> Select Start Date
          </Button>
          {isStartDateOpen && (
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="yyyy-MM-dd"
              open={isStartDateOpen}
              onClickOutside={() => setIsStartDateOpen(false)} // Close when clicked outside
            />
          )}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="endDate" className="form-label">End Date:</label>
        <div className="input-group">
          <Button
            variant="outline-secondary"
            onClick={() => setIsEndDateOpen(true)}
            disabled={loading}
          >
            <FaCalendarAlt /> Select End Date
          </Button>
          {isEndDateOpen && (
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              dateFormat="yyyy-MM-dd"
              open={isEndDateOpen}
              onClickOutside={() => setIsEndDateOpen(false)} // Close when clicked outside
            />
          )}
        </div>
      </div>

      <Button variant="primary" onClick={fetchAttendance} disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Fetch Attendance'}
      </Button>

      {/* Error Message */}
      {error && <Alert variant="danger" className="mt-3" style={{ backgroundColor: '#f8d7da' }}>{error}</Alert>}

      {/* Success or Warning Message */}
      {message && (
        <Alert variant={overallAttendancePercentage < 75 ? 'warning' : 'success'} className="mt-3">
          {message}
        </Alert>
      )}

      {/* Attendance Data Table */}
      {attendanceData && Array.isArray(attendanceData) && attendanceData.length > 0 ? (
        <div className="mt-4">
          <Table responsive>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Total Classes</th>
                <th>Attended Classes</th>
                <th>Attendance Percentage</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((attendance, index) => (
                <tr key={index}>
                  <td>{attendance.subject}</td>
                  <td>{attendance.totalClasses}</td>
                  <td>{attendance.attendedClasses}</td>
                  <td>{attendance.attendancePercentage}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div>
            <h5>Total Classes: {totalClasses}</h5>
            <h5>Attended Classes: {attendedClasses}</h5>
            {/* <h5>Overall Attendance Percentage: {overallAttendancePercentage}%</h5> */}
          </div>
        </div>
      ) : (
        <Alert variant="info" className="mt-3">No attendance records found.</Alert>
      )}
    </div>
  );
};

export default ViewAttendance;
