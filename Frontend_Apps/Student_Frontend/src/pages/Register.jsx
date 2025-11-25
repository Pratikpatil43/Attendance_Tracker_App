import React, { useState } from 'react';
import { Button, Form, Spinner, Toast } from 'react-bootstrap';
import { useNavigate,Link } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [studentUSN, setStudentUSN] = useState('');
  const [email, setEmail] = useState('');
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
      const response = await fetch('https://attendancetracker-backend1.onrender.com/api/student/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, studentUSN, email, password }),
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        navigate('/');
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
        <h3 className="text-center mb-4">Register</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label><FaUser /> Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control-lg"
            />
          </Form.Group>

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
            <Form.Label><FaEnvelope /> Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              'Register'
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

        {/* Links for login */}
        <div className="mt-3 text-center">
          <Link to="/" className="d-block">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
