import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import { Zap, Image as ImageIcon, Palette, CheckCircle } from 'lucide-react';

// Define FeatureCard before HomePage or in a separate file if preferred
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <Col md={6} lg={4}> {/* Adjusted for better spacing on medium screens */}
    {/* Apply the hover effect class directly if defined in index.css */}
    <Card className="h-100 shadow-sm border-0 text-center p-4 feature-card-hover">
      <div 
        className="mb-3 d-inline-flex align-items-center justify-content-center p-3 bg-primary-subtle text-primary rounded-circle" 
        style={{width: '60px', height: '60px'}}
      >
        {icon}
      </div>
      <Card.Body className="p-0">
        <Card.Title as="h5" className="fw-semibold mb-2">{title}</Card.Title>
        <Card.Text className="text-muted small">
          {description}
        </Card.Text>
      </Card.Body>
    </Card>
  </Col>
);


export const HomePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);

    const handleStorageChange = () => {
      const currentToken = localStorage.getItem('authToken');
      setIsLoggedIn(!!currentToken);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleStartColorizingClick = () => {
    if (isLoggedIn) {
      navigate('/colorize');
    } else {
      setShowLoginAlert(true);
      // Optionally, hide alert after a few seconds
      setTimeout(() => setShowLoginAlert(false), 5000);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div
        className="text-white text-center py-5 position-relative overflow-hidden"
        style={{
          minHeight: 'calc(70vh - 56px)', // Adjust 56px based on your header height
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)' // Bootstrap primary to indigo-like
        }}
      >
        <Container className="py-lg-5">
          <Row className="justify-content-center">
            <Col lg={9} xl={8}>
              <Palette size={60} className="mx-auto mb-4 text-light opacity-75" />
              <h1 className="display-4 fw-bold mb-3">
                Bring Your Photos to Life with AI
              </h1>
              <p className="lead mb-4 opacity-90" style={{fontSize: '1.15rem'}}>
                Chroma AI uses advanced deep learning to automatically colorize your black and white images.
                Rediscover your memories in vibrant, authentic color.
              </p>
              {showLoginAlert && (
                <Alert variant="warning" onClose={() => setShowLoginAlert(false)} dismissible className="mb-3">
                  You need to log in to start colorizing. <Link to="/login" className="alert-link">Login here</Link>.
                </Alert>
              )}
              <Button
                onClick={handleStartColorizingClick}
                variant="light"
                size="lg"
                className="text-primary fw-semibold px-sm-5 py-sm-3 px-4 py-2 mt-2 shadow"
              >
                <Zap size={20} className="me-2" />
                Start Colorizing Now
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="fw-bold h1">How It Works</h2>
              <p className="text-muted lead" style={{fontSize: '1.1rem'}}>Simple steps to vibrant, colorful memories.</p>
            </Col>
          </Row>
          <Row className="g-4 justify-content-center">
            <FeatureCard
              icon={<ImageIcon size={30} className="text-primary" />}
              title="Easy Image Upload"
              description="Simply drag & drop or select your black and white photo. We support common formats like JPG, PNG, and JPEG."
            />
            <FeatureCard
              icon={<Palette size={30} className="text-primary" />}
              title="Advanced Controls"
              description="Choose models, adjust color intensity, hue, saturation, and enhance details for the perfect result."
            />
            <FeatureCard
              icon={<CheckCircle size={30} className="text-primary" />}
              title="High-Quality Results"
              description="Our AI models produce natural and appealing colorizations, giving your old photos a fresh, new look."
            />
          </Row>
        </Container>
      </section>

      {/* Call to Action or More Info Section (Optional) */}
      <section className="py-5">
        <Container className="text-center">
            <Row className="justify-content-center">
                <Col md={8}>
                    <h2 className="fw-bold mb-3">Ready to See the Magic?</h2>
                    <p className="text-muted mb-4 lead">
                        Transform your cherished black and white photographs into colorful masterpieces today.
                        It's quick, easy, and the results can be breathtaking.
                    </p>
                    {showLoginAlert && (
                         <Alert variant="warning" onClose={() => setShowLoginAlert(false)} dismissible className="mb-3">
                            You need to log in to start colorizing. <Link to="/login" className="alert-link">Login here</Link>.
                        </Alert>
                    )}
                    <Button onClick={handleStartColorizingClick} variant="primary" size="lg" className="px-sm-5 py-sm-3 px-4 py-2 shadow-lg">
                        Colorize Your First Image
                    </Button>
                </Col>
            </Row>
        </Container>
      </section>
    </>
  );
};