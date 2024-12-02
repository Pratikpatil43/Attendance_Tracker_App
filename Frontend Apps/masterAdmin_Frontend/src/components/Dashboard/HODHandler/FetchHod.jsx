import React, { useState, useEffect } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

// Manually decode JWT
const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
};

const FetchHod = () => {
  const [hods, setHods] = useState([]); // State for storing HODs
  const [error, setError] = useState(null); // State for handling errors

  // Fetch HODs data
  const fetchHods = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      const response = await axios.get("http://localhost:5000/api/masterAdmin/hod/getHod", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && Array.isArray(response.data.hods)) {
        setHods(response.data.hods);
      } else {
        throw new Error("Invalid HODs data format.");
      }
    } catch (err) {
      setError("Failed to fetch HODs: " + err.message);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      const decodedToken = decodeJWT(token);
      if (!decodedToken || !decodedToken.masterAdminId) {
        throw new Error("Invalid token: masterAdminId missing.");
      }

      await axios.delete(`http://localhost:5000/api/masterAdmin/hod/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHods((prevHods) => prevHods.filter((hod) => hod._id !== id)); // Update HODs list
    } catch (err) {
      setError("Failed to delete HOD: " + err.message);
    }
  };

  // Handle update (placeholder)
  const handleUpdate = (id) => {
    console.log("Updating HOD with ID:", id);
  };

  // Use useEffect to fetch HODs on component mount
  useEffect(() => {
    fetchHods();
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <Container className="mt-5">
      <h1 className="text-center">List of HODs</h1>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Display message if no HODs */}
      {hods.length === 0 && !error && (
        <div className="alert alert-info" role="alert">
          Currently, no HODs are available.
        </div>
      )}

      {/* Desktop View (Table) */}
      <div className="d-none d-md-block">
        <table className="table table-bordered mt-3">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Branch</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hods.map((hod) => (
              <tr key={hod._id}>
                <td>{hod.name}</td>
                <td>{hod.username}</td>
                <td>{hod.branch}</td>
                <td>{hod.role}</td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleUpdate(hod._id)}
                  >
                    <BsPencil />
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(hod._id)}
                  >
                    <BsTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View (Cards) */}
      <div className="d-block d-md-none">
        <Row>
          {hods.map((hod) => (
            <Col key={hod._id} xs={12} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{hod.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{hod.username}</Card.Subtitle>
                  <Card.Text>
                    <strong>Branch:</strong> {hod.branch}
                    <br />
                    <strong>Role:</strong> {hod.role}
                  </Card.Text>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleUpdate(hod._id)}
                  >
                    <BsPencil />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(hod._id)}
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

export default FetchHod;
