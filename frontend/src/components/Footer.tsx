import React from 'react';
import { Heart, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <Container>
        <Row className="gy-4">
          <Col md={6} lg={5}>
            <h3 className="h4 mb-3 text-white">Chroma AI</h3>
            <p className="text-secondary"> {/* Changed to text-secondary for better contrast on dark bg */}
              Breathe life into black and white photos with our AI-powered
              colorization technology. Transform your memories with just a few clicks.
            </p>
            <div className="mt-3">
              <a
                href="https://github.com" // Replace with your actual GitHub link
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary me-3 hover-text-white"
                aria-label="GitHub"
              >
                <Github size={22} />
              </a>
              {/* Add other social links here */}
            </div>
          </Col>

          <Col md={3} lg={{ span: 2, offset: 1 }}>
            <h5 className="mb-3 text-white">Navigation</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-secondary hover-text-white text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/colorize" className="text-secondary hover-text-white text-decoration-none">Colorize Image</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-secondary hover-text-white text-decoration-none">About</Link>
              </li>
            </ul>
          </Col>

          <Col md={3} lg={2}>
            <h5 className="mb-3 text-white">Resources</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-secondary hover-text-white text-decoration-none">API</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-secondary hover-text-white text-decoration-none">Documentation</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-secondary hover-text-white text-decoration-none">Privacy Policy</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-secondary hover-text-white text-decoration-none">Terms of Service</a>
              </li>
            </ul>
          </Col>
        </Row>

        <div className="mt-5 pt-4 border-top border-secondary-subtle text-center text-md-start">
          <Row>
            <Col md={6} className="text-secondary mb-2 mb-md-0"> {/* Changed to text-secondary */}
              © {currentYear} Chroma AI. All rights reserved.
            </Col>
            <Col md={6} className="text-md-end text-secondary"> {/* Changed to text-secondary */}
              Made with <Heart className="h-4 w-4 mx-1 text-danger" /> for a colorful world
            </Col>
          </Row>
        </div>
      </Container>
      {/* hover-text-white class is defined in index.css */}
    </footer>
  );
};