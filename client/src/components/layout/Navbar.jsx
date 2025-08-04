import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/navbar.css'; // Custom styles for nav

const AppNavbar = () => {
  const navigate = useNavigate();

  // Handles logout by calling backend and redirecting
  const handleLogout = async () => {
    try {
      // Call the logout API route
      await axios.post(`${process.env.REACT_APP_API_URL}/logout`, {}, {
        withCredentials: true, // Required to clear the token cookie
      });
      navigate('/login'); // Redirect to login
    } catch (err) {
      console.error('Logout failed:', err.message);
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        {/* App Logo / Name */}
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Smart Budget
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Navigation Links */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
          </Nav>

          {/* Logout Button */}
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
