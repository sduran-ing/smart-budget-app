// Import necessary modules
import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // React state to track form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    stayLoggedIn: false,
  });

  // State for showing error or welcome message
  const [error, setError] = useState('');
  const [welcome, setWelcome] = useState('');

  // React Router hook to redirect users
  const navigate = useNavigate();

  // Update form data as user types or clicks
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle login form submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setError('');
    setWelcome('');

    try {
      // Send login request to backend
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, formData, {
        withCredentials: true, // Enable cookie exchange
      });

      // Show welcome message returned from server
      setWelcome(response.data.message);

      // Redirect to home/dashboard after a short delay
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Login</h2>

      {/* Show alert messages if any */}
      {error && <Alert variant="danger">{error}</Alert>}
      {welcome && <Alert variant="success">{welcome}</Alert>}

      {/* Login Form */}
      <Form onSubmit={handleSubmit}>
        {/* Email field */}
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </Form.Group>

        {/* Password field */}
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </Form.Group>

        {/* Stay Logged In checkbox */}
        <Form.Group className="mb-4">
          <Form.Check
            type="checkbox"
            name="stayLoggedIn"
            checked={formData.stayLoggedIn}
            onChange={handleChange}
            label="Stay logged in"
          />
        </Form.Group>

        {/* Submit button */}
        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>
      </Form>

      {/* Message and button to redirect to Register page */}
      <div className="text-center mt-4">
        <p>Don't have an account?</p>
        <Button variant="outline-secondary" onClick={() => navigate('/register')}>
          Register Here
        </Button>
      </div>
    </Container>
  );
};

export default Login;
