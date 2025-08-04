import React from 'react';
import { Container, Row, Col, Card, ListGroup, Accordion } from 'react-bootstrap';
import { Info, Cpu, Users, Layers, Settings, Code } from 'lucide-react'; // Added Settings, Code icons

export const AboutPage: React.FC = () => {
  return (
    <Container className="py-4 py-md-5">
      <Row className="justify-content-center">
        <Col lg={10} xl={9}>
          <Card className="shadow-lg border-0 overflow-hidden">
            <Card.Header className="bg-primary text-white p-4">
              <div className="d-flex align-items-center">
                <Info size={38} className="me-3" />
                <h1 className="h2 fw-bold mb-0">About Chroma AI</h1>
              </div>
            </Card.Header>
            <Card.Body className="p-4 p-md-5">
              <p className="lead text-muted mb-5" style={{fontSize: "1.15rem"}}>
                Chroma AI is a sophisticated web application designed to breathe new life into
                monochrome photographs using state-of-the-art artificial intelligence. We are passionate
                about preserving history and memories, believing color can unlock a deeper
                connection to the past.
              </p>

              <Accordion defaultActiveKey="0" flush className="mb-5">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <Cpu size={22} className="text-primary me-2" /> Our Technology
                  </Accordion.Header>
                  <Accordion.Body className="text-muted small">
                    <p>
                      Our colorization engine is powered by deep learning models, specifically Convolutional
                      Neural Networks (CNNs), meticulously trained on vast datasets of image pairs (black & white and their color
                      originals). These models learn complex patterns and contextual information to intelligently
                      predict and apply realistic colors.
                    </p>
                    <p className="mt-2">
                      We offer a choice between different model architectures and post-processing options,
                      allowing users to achieve results ranging from historically accurate tones to more
                      vibrant and artistic interpretations. You can fine-tune parameters like detail enhancement,
                      color intensity, hue, and saturation to customize the final output.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    <Layers size={22} className="text-primary me-2" /> Core Features
                  </Accordion.Header>
                  <Accordion.Body>
                    <ListGroup variant="flush" className="small">
                      <ListGroup.Item className="border-0 px-0 py-1">AI-powered automatic image colorization.</ListGroup.Item>
                      <ListGroup.Item className="border-0 px-0 py-1">Choice of 'Standard' and 'Artistic' colorization models.</ListGroup.Item>
                      <ListGroup.Item className="border-0 px-0 py-1">Fine-grained controls for detail, intensity, hue, and saturation.</ListGroup.Item>
                      <ListGroup.Item className="border-0 px-0 py-1">Optional automatic color correction for balanced results.</ListGroup.Item>
                      <ListGroup.Item className="border-0 px-0 py-1">Secure image uploading (HTTPS) and server-side processing.</ListGroup.Item>
                      <ListGroup.Item className="border-0 px-0 py-1">Responsive and user-friendly interface for easy operation.</ListGroup.Item>
                       <ListGroup.Item className="border-0 px-0 py-1">Direct download of colorized images.</ListGroup.Item>
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    <Users size={22} className="text-primary me-2" /> Our Mission
                  </Accordion.Header>
                  <Accordion.Body className="text-muted small">
                    <p>
                      Our mission is to make advanced image colorization technology accessible and easy to use
                      for everyone. Whether you are a historian, genealogist, photographer, archivist, or
                      simply curious about seeing old family photos in a new light, Chroma AI provides
                      the tools to unlock the color hidden within your grayscale images.
                    </p>
                     <p className="mt-2">
                        We believe in the power of technology to connect us with our past and enhance our appreciation for historical moments.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              
              <p className="text-muted mt-4">
                This project serves as a demonstration of the capabilities of modern AI in creative
                image processing. We are committed to ongoing research and development to further
                enhance our models and introduce new features.
              </p>
              
              <hr className="my-4" />
              
              <h5 className="mb-3 d-flex align-items-center">
                <Code size={22} className="text-primary me-2" /> Technical Stack
              </h5>
              <Row className="small text-muted">
                <Col md={6} className="mb-2 mb-md-0">
                    <Settings size={16} className="text-secondary me-1"/> <strong>Backend:</strong> Flask (Python), OpenCV, NumPy, Pillow
                </Col>
                <Col md={6}>
                    <Settings size={16} className="text-secondary me-1"/> <strong>Frontend:</strong> React, TypeScript, Bootstrap 5, Axios
                </Col>
                 <Col md={12} className="mt-2">
                    <Cpu size={16} className="text-secondary me-1"/> <strong>AI Models:</strong> Caffe-based deep learning colorization networks
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};