import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Paintbrush } from 'lucide-react';

export const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    // Optional: Add an event listener for storage changes to update login status across tabs
    const handleStorageChange = () => {
      const currentToken = localStorage.getItem('authToken');
      setIsLoggedIn(!!currentToken);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]);

  // Function to handle logout, which might be triggered by a child component or event
  // For now, navigation to /logout will handle clearing the token via Logout.tsx
  // If you wanted the header itself to clear the token, you could add a function here:
  // const handleLogout = () => {
  //   localStorage.removeItem('authToken');
  //   setIsLoggedIn(false);
  //   // navigate('/login'); // or let the NavLink to /logout handle it
  // };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm sticky-top py-2">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center text-primary fw-bold fs-4">
          <Paintbrush size={28} className="me-2" />
          Chroma AI
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" className="mx-1">Home</Nav.Link>
            {isLoggedIn && (
              <Nav.Link as={NavLink} to="/colorize" className="mx-1">Colorize</Nav.Link>
            )}
            <Nav.Link as={NavLink} to="/about" className="mx-1">About</Nav.Link>
            {isLoggedIn ? (
              <Nav.Link as={NavLink} to="/logout" className="mx-1">Logout</Nav.Link>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" className="mx-1">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/signup" className="mx-1">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};