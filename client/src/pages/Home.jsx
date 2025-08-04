import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/dashboard/Dashboard'; // Import the main dashboard

const Home = () => {
  // State for user data and loading status
  const [user, setUser] = useState(null); // Logged-in user info
  const [error, setError] = useState(''); // Error if user isn't authorized
  const navigate = useNavigate();

  // Fetch user data when the page loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Call the protected backend route
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile`, {
          withCredentials: true, // send token cookie
        });

        // Set the user from response
        setUser(response.data.user);
      } catch (err) {
        // If unauthorized or error, redirect to login
        const msg = err.response?.data?.message || 'Unable to fetch user';
        setError(msg);

        // Delay and then redirect
        setTimeout(() => navigate('/login'), 1500);
      }
    };

    fetchProfile();
  }, [navigate]);


  // Show error if user not authorized
  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;

  // Show loading spinner while fetching user
  if (!user) return <Spinner animation="border" className="m-4" />;

  // Main home view
  return (
    <Container className="mt-5 text-center">

      <Dashboard />

    </Container>
    
  );
};

export default Home;