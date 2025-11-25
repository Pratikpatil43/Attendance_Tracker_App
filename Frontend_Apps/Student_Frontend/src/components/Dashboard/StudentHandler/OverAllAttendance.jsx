import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const OverAllAttendance = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // Retrieve the token from sessionStorage
        const token = sessionStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Include the token in the headers of the request
        const response = await axios.get('https://attendancetracker-backend1.onrender.com/api/student/getAttendance', {
          headers: {
            Authorization: `Bearer ${token}`, // Set the token in the Authorization header
          },
        });
        
        setAttendanceData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error fetching attendance data');
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
  if (!attendanceData) return null;

  const { attendedClasses, totalClasses, overallAttendancePercentage, message, detailedAttendance } = attendanceData;

  const chartData = {
    labels: ['Attended', 'Missed'],
    datasets: [
      {
        data: [attendedClasses, totalClasses - attendedClasses],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Overall Attendance</h2>
      <div className="row">
        <div className="col-md-6">
          <div style={{ height: '300px' }}>
            <Pie data={chartData} options={options} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Attendance Summary</h5>
              <p className="card-text">Total Classes: {totalClasses}</p>
              <p className="card-text">Attended Classes: {attendedClasses}</p>
              <p className="card-text">Overall Attendance: {overallAttendancePercentage}</p>
              <p className={`card-text ${parseFloat(overallAttendancePercentage) < 75 ? 'text-danger' : 'text-success'}`}>
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <h3 className="mb-3">Subject-wise Attendance</h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Total Classes</th>
              <th>Attended Classes</th>
              <th>Attendance Percentage</th>
            </tr>
          </thead>
          <tbody>
            {detailedAttendance.map((subject, index) => (
              <tr key={index}>
                <td>{subject.subject}</td>
                <td>{subject.totalClasses}</td>
                <td>{subject.attendedClasses}</td>
                <td>{subject.attendancePercentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverAllAttendance;
