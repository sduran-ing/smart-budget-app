// Import necessary modules from React and other packages
import React, { useState } from 'react';
import axios from 'axios'; // For making HTTP requests to the backend
import { Form, Button, Alert, Container } from 'react-bootstrap'; // Bootstrap UI components

// Functional component for the registration form
const Register = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
  });

  // State to manage error and success messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to handle input field changes
  const handleChange = (e) => {
    // Use event name and value to update the matching field in state
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser reload on submit
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success message

    // Destructure values from formData
    const { firstName, lastName, email, password, repeatPassword } = formData;

    // Basic client-side validation
    if (!firstName || !lastName || !email || !password || !repeatPassword) {
      return setError('All fields are required');
    }

    if (password !== repeatPassword) {
      return setError('Passwords do not match');
    }

    try {
      // Make POST request to backend API with user data
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, formData, {
        withCredentials: true, // Allow cookies to be sent/received
      });

      // Show success message from backend
      setSuccess(response.data.message);

      // Clear form after successful registration
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repeatPassword: '',
      });
    } catch (err) {
      // Handle and display error message from server
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
    }
  };

  // Return the JSX for the registration form
  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Register</h2>

      {/* Display error or success alerts if any */}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Form component with controlled inputs */}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter a password"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Repeat Password</Form.Label>
          <Form.Control
            type="password"
            name="repeatPassword"
            value={formData.repeatPassword}
            onChange={handleChange}
            placeholder="Repeat the password"
          />
        </Form.Group>

        {/* Submit button */}
        <Button variant="primary" type="submit" className="w-100">
          Register
        </Button>
      </Form>
    </Container>
  );
};

// Export the component for use in routing
export default Register;
