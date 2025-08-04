// Import React core
import React from 'react';

// Import routing components for navigating between pages
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import the page components
import Register from './pages/Register';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Profile from './pages/Profile';

// Import common elements of all pages
import AppNavbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Import Bootstrap CSS once so it's applied globally
import 'bootstrap/dist/css/bootstrap.min.css';

// App component is the root of our React frontend
function App() {
  return (
    // Router enables page navigation without refreshing the page
    <Router>

      <AppNavbar /> {/* Nav on every page */}

      {/* Routes is a wrapper that holds all route definitions */}
      <Routes>

        {/* Home is the default route (landing page) thanks to path="/" */}
        <Route path="/" element={<Home />} />

        {/* Route for the login page */}
        <Route path="/login" element={<Login />} />

        {/* Route for the registration page */}
        <Route path="/register" element={<Register />} />

        {/* Profile page*/}
        <Route path="/profile" element={<Profile />} />

      </Routes>

      <Footer /> {/* Footer on every page */}

    </Router>
  );
}

// Export App component so it can be rendered in index.js
export default App;
