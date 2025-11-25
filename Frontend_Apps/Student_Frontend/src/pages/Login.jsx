import React, { useState } from 'react';
import { Button, Form, Spinner, Toast } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
  const [studentUSN, setStudentUSN] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://attendancetracker-backend1.onrender.com/api/student/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentUSN, password }),
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        // Store the token in sessionStorage (or localStorage for persistence)
        sessionStorage.setItem('token', data.token);

        // Optionally, you can set the token in the Authorization header for future requests
        // Example:
        // const token = sessionStorage.getItem('authToken');
        // fetch('http://localhost:5000/api/protected', {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // });

        navigate('/dashboard');
      } else {
        setError(data.message);
        setShowToast(true);
      }
    } catch (error) {
      setLoading(false);
      setError('An error occurred. Please try again.');
      setShowToast(true);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-gradient">
      <div className="card p-5 shadow-lg rounded-3" style={{ width: '350px', backgroundColor: '#fff' }}>
        <h3 className="text-center mb-4">Login</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label><FaUser /> Student USN</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your student USN"
              value={studentUSN}
              onChange={(e) => setStudentUSN(e.target.value)}
              className="form-control-lg"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><FaLock /> Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control-lg"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 py-2" disabled={loading}>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Login'
            )}
          </Button>
        </Form>

        {error && (
          <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={3000}
            autohide
            className="mt-3 text-white bg-danger"
          >
            <Toast.Body>{error}</Toast.Body>
          </Toast>
        )}

        {/* Links for register and forget password */}
        <div className="mt-3 text-center">
          <Link to="/register" className="d-block">Don't have an account? Create one</Link>
          <Link to="/forgotpassword" className="d-block">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
