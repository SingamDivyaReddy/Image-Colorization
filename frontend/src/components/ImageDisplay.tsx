import React from 'react';
import { Card, Button, Row, Col, Placeholder, Spinner } from 'react-bootstrap';
import { Download, ImageOff } from 'lucide-react';

interface ImageDisplayProps {
  originalImageUrl: string | null;
  colorizedImageUrl: string | null;
  isLoading?: boolean;
  isError?: boolean;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  originalImageUrl,
  colorizedImageUrl,
  isLoading = false,
  isError = false,
}) => {
  if (isLoading) {
    return (
      <Card className="mt-4 shadow-sm">
        <Card.Body className="text-center p-4">
            <Spinner animation="border" variant="primary" className="mb-3" style={{ width: '3rem', height: '3rem' }}/>
            <Card.Title as="h5" className="text-primary mb-2">Colorizing your image...</Card.Title>
            <Card.Text className="text-muted small">
                Please wait, this may take a few moments.
            </Card.Text>
            <Row className="mt-4 g-3">
                <Col md={6}>
                    <Placeholder as={Card.Text} animation="glow">
                        <Placeholder xs={6} bg="secondary" className="mb-2 rounded" />
                        <Placeholder style={{width: '100%', height: '200px'}} bg="secondary" className="rounded"/>
                    </Placeholder>
                </Col>
                 <Col md={6}>
                    <Placeholder as={Card.Text} animation="glow">
                        <Placeholder xs={6} bg="secondary" className="mb-2 rounded" />
                        <Placeholder style={{width: '100%', height: '200px'}} bg="secondary" className="rounded"/>
                    </Placeholder>
                </Col>
            </Row>
        </Card.Body>
      </Card>
    );
  }

  if (isError && !originalImageUrl && !colorizedImageUrl) { // Only show this big error if nothing else is shown
    return (
      <Card className="mt-4 shadow-sm text-center">
        <Card.Body className="p-5">
          <ImageOff size={48} className="text-danger mb-3" />
          <Card.Title as="h5" className="text-danger">Image Processing Failed</Card.Title>
          <Card.Text className="text-muted">
            Could not display images due to an error. Please check the console for details or try again.
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  // If not loading and neither image URL is present, don't render anything (or a placeholder message)
  if (!isLoading && !originalImageUrl && !colorizedImageUrl && !isError) {
    return (
        <Card className="mt-4 shadow-sm text-center">
            <Card.Body className="p-5 text-muted">
                <ImageOff size={48} className="mb-3" />
                <p>Upload an image and apply settings to see the results here.</p>
            </Card.Body>
        </Card>
    );
  }

  return (
    <Row className="mt-4 g-4"> {/* g-4 for gutter spacing */}
      {originalImageUrl && (
        <Col md={colorizedImageUrl ? 6 : 12}>
          <Card className="shadow-sm h-100">
            <Card.Header as="h5" className="text-center text-muted small py-2">Original Image</Card.Header>
            <Card.Body className="d-flex align-items-center justify-content-center p-2 bg-light" style={{minHeight: '250px'}}>
              <img
                src={originalImageUrl}
                alt="Original"
                className="img-fluid rounded"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
                onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    // Optionally display a fallback message or icon within this card
                    const parent = target.parentElement;
                    if (parent) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'text-danger small p-3';
                        errorMsg.innerHTML = '<p>Could not load original image.</p>';
                        parent.appendChild(errorMsg);
                    }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      )}
      {colorizedImageUrl && (
        <Col md={originalImageUrl ? 6 : 12}>
          <Card className="shadow-sm h-100 border-primary">
            <Card.Header className="d-flex justify-content-between align-items-center bg-primary-subtle py-2">
              <h5 className="mb-0 text-primary small">Colorized Image</h5>
              <Button
                variant="primary"
                size="sm"
                href={colorizedImageUrl}
                download={`colorized_${originalImageUrl?.split('/').pop()?.split('.')[0] || 'image'}.jpg`}
              >
                <Download size={14} className="me-1" />
                Download
              </Button>
            </Card.Header>
            <Card.Body className="d-flex align-items-center justify-content-center p-2 bg-light" style={{minHeight: '250px'}}>
              <img
                src={colorizedImageUrl}
                alt="Colorized"
                className="img-fluid rounded"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
                onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'text-danger small p-3';
                        errorMsg.innerHTML = '<p>Could not load colorized image.</p>';
                        parent.appendChild(errorMsg);
                    }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      )}
    </Row>
  );
};