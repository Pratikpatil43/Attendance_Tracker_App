import React, { useState, useEffect } from "react";
import { Container, Table, Card, Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { BsTrash } from "react-icons/bs";

const FetchFaculty = () => {
  const [faculties, setFaculties] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found.");
        }

        const response = await axios.get(
          "http://localhost:5000/api/masterAdmin/faculty/getAll",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFaculties(response.data.faculties || []);
      } catch (err) {
        setError("Failed to fetch faculties: " + err.message);
      }
    };

    fetchFaculties();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      await axios.delete(`http://localhost:5000/api/masterAdmin/faculty/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFaculties((prev) => prev.filter((faculty) => faculty._id !== id));
    } catch (err) {
      setError("Failed to delete faculty: " + err.message);
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center">List of Faculties</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Desktop View (Table) */}
      <div className="d-none d-md-block">
        <Table bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Department</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faculties.map((faculty) => (
              <tr key={faculty._id}>
                <td>{faculty.name}</td>
                <td>{faculty.username}</td>
                <td>{faculty.department}</td>
                <td>{faculty.role}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(faculty._id)}
                  >
                    <BsTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Mobile View (Cards) */}
      <div className="d-block d-md-none">
        <Row>
          {faculties.map((faculty) => (
            <Col key={faculty._id} xs={12} md={6} className="mb-3">
              <Card className="shadow">
                <Card.Body>
                  <Card.Title>{faculty.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {faculty.username}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Department:</strong> {faculty.department}
                    <br />
                    <strong>Role:</strong> {faculty.role}
                  </Card.Text>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(faculty._id)}
                  >
                    <BsTrash />
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default FetchFaculty;
