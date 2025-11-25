import React,{ useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Alert, Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { BsPencil, BsTrash } from "react-icons/bs";

const FetchFaculty = () => {
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageVariant, setMessageVariant] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    subject: ''
  });
  const [isRequestPending, setIsRequestPending] = useState(false);

  // Fetch faculties
  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await axios.get("https://attendancetracker-backend1.onrender.com/api/hod/getFaculty", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFacultyMembers(response.data.facultyMembers);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to fetch faculty');
      setMessageVariant('danger');
    } finally {
      setLoading(false);
    }
  };

  // Handle faculty update modal
  const handleUpdate = (faculty) => {
    setSelectedFaculty(faculty);
    setFormData({
      name: faculty.name,
      branch: faculty.branch,
      subject: faculty.subject
    });
    setShowModal(true);
  };

  // Submit update form
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (isRequestPending) {
      setMessage("Update request is already in progress.");
      setMessageVariant('danger');
      return;
    }

    setIsRequestPending(true);

    const token = sessionStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to update faculty');
      setMessageVariant('danger');
      setIsRequestPending(false);
      return;
    }

    const updatedFacultyData = {
      name: formData.name,
      facultyUsername: selectedFaculty.username,
      branch: formData.branch,
      subject: formData.subject,
      action: 'update'
    };

    try {
      const response = await axios.put(`https://attendancetracker-backend1.onrender.com/api/hod/update/${selectedFaculty.id}`, updatedFacultyData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message);
      setMessageVariant('success');
      setShowModal(false);
      fetchFaculties();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update faculty');
      setMessageVariant('danger');
    } finally {
      setIsRequestPending(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle delete request
  const handleDelete = async (facultyId) => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      setMessage('You must be logged in to delete faculty');
      setMessageVariant('danger');
      return;
    }

    try {
      await axios.delete(`https://attendancetracker-backend1.onrender.com/api/hod/remove/${facultyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Faculty removal request has been sent  successfully');
      setMessageVariant('success');
      fetchFaculties();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete faculty');
      setMessageVariant('danger');
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  return (
    <Container>
      {message && (
        <Alert variant={messageVariant}>
          {message}
        </Alert>
      )}
      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <Row>
          {facultyMembers.map(faculty => (
            <Col key={faculty.id} sm={12} md={6} lg={4}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>{faculty.name}</Card.Title>
                  <Card.Text>Branch: {faculty.branch}</Card.Text>
                  <Card.Text>Subject: {faculty.subject}</Card.Text>
                  <Button variant="primary" onClick={() => handleUpdate(faculty)}>
                    <BsPencil /> Update
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(faculty.id)}>
                    <BsTrash /> Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Update Faculty Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Faculty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitUpdate}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Branch</Form.Label>
              <Form.Control
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isRequestPending}>
              {isRequestPending ? 'Updating...' : 'Update Faculty'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default FetchFaculty;
