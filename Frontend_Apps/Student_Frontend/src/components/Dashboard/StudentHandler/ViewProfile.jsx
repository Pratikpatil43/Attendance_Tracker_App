import React, { useEffect, useState } from 'react';
import { Button, Spinner, Toast } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/'); // If no token, redirect to login
        return;
      }

      try {
        const response = await axios.get('https://attendancetracker-backend1.onrender.com/api/student/viewprofile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (err) {
        setError('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-gradient">
      <div className="card p-5 shadow-lg rounded-3" style={{ width: '350px', backgroundColor: '#fff' }}>
        <h3 className="text-center mb-4">Profile</h3>

        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Toast
            onClose={() => setError('')}
            show={error !== ''}
            delay={3000}
            autohide
            className="mt-3 text-white bg-danger"
          >
            <Toast.Body>{error}</Toast.Body>
          </Toast>
        ) : (
          user && (
            <div>
              <h5 className="text-center mb-3">{user.name}</h5>
              <p><strong>Student USN:</strong> {user.studentUSN}</p>
              <p><strong>Branch:</strong> {user.branch}</p>
              <p><strong>Class:</strong> {user.className}</p>
              <p><strong>Email id:</strong> {user.email}</p>


              <div className="mt-3 text-center">
                <Button variant="secondary" onClick={() => navigate('/dashboard')} className="w-100">
                  Back to Dashboard
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ViewProfile;
