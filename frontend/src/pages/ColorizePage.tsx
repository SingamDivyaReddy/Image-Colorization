import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { ColorizationControls } from '../components/ColorizationControls';
import { FileUpload } from '../components/FileUpload';
import { ImageDisplay } from '../components/ImageDisplay';
import { colorizeImageApi, ColorizeErrorResponse } from '../services/api';
import { Wand2, AlertTriangle, RotateCcw, Info as InfoIcon } from 'lucide-react';

export const ColorizePage: React.FC = () => {
  const defaultControls = {
    modelChoice: 'standard',
    detailEnhancement: 0.25,
    intensity: 1.0,
    hueShift: 0,
    saturationScale: 1.0,
    autoColorCorrect: true,
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modelChoice, setModelChoice] = useState<string>(defaultControls.modelChoice);
  const [detailEnhancement, setDetailEnhancement] = useState<number>(defaultControls.detailEnhancement);
  const [intensity, setIntensity] = useState<number>(defaultControls.intensity);
  const [hueShift, setHueShift] = useState<number>(defaultControls.hueShift);
  const [saturationScale, setSaturationScale] = useState<number>(defaultControls.saturationScale);
  const [autoColorCorrect, setAutoColorCorrect] = useState<boolean>(defaultControls.autoColorCorrect);

  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [colorizedImageUrl, setColorizedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiWarning, setApiWarning] = useState<string | null>(null);
  const [fileUploadResetTrigger, setFileUploadResetTrigger] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleFileSelect = useCallback((file: File | null) => {
    setSelectedFile(file); // Update selected file state

    // If a new file is selected or file is removed, clear previous results and errors
    // Manage local object URL for preview
    if (originalImageUrl && originalImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(originalImageUrl); // Revoke previous blob URL if it exists
    }

    if (file) {
      setOriginalImageUrl(URL.createObjectURL(file)); // Create new blob URL for preview
    } else {
      setOriginalImageUrl(null); // Clear preview if no file
    }

    // Clear other states when file changes
    setColorizedImageUrl(null);
    setError(null);
    setApiWarning(null);
  }, [originalImageUrl]); // Depend on originalImageUrl to manage its revocation


  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select an image file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setApiWarning(null);
    setColorizedImageUrl(null); // Clear previous colorized image before new request

    const formData = new FormData();
    formData.append('image_file', selectedFile);
    formData.append('model_choice', modelChoice);
    formData.append('detail_enhancement', detailEnhancement.toString());
    formData.append('intensity', intensity.toString());
    formData.append('hue_shift', hueShift.toString());
    formData.append('saturation_scale', saturationScale.toString());
    formData.append('auto_color_correct', autoColorCorrect.toString());

    try {
      const result = await colorizeImageApi(formData);
      // The originalImageUrl from the server will replace the local blob URL for the original image display
      // The local blob URL (originalImageUrl state) for preview is still useful if server fails
      // but on success, we might prefer the server's canonical URL for consistency.
      // For now, let ImageDisplay handle the originalImageUrl prop, which could be blob or server URL.
      // If the server returns an originalImageUrl, we might want to update our state:
      // setOriginalImageUrl(result.originalImageUrl); // This would replace blob with server URL
      
      setColorizedImageUrl(result.colorizedImageUrl); // This is the main result
      
      // If the server sends back its own URL for the original, use that
      // otherwise, the local blob URL is already set in originalImageUrl state via handleFileSelect
      if (result.originalImageUrl && result.originalImageUrl !== originalImageUrl) {
        if (originalImageUrl && originalImageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(originalImageUrl); // Clean up old blob
        }
        setOriginalImageUrl(result.originalImageUrl); // Use server's original
      }

      if (result.warning) {
        setApiWarning(result.warning);
      }
    } catch (apiError) {
      const err = apiError as ColorizeErrorResponse;
      console.error("API Error:", err);
      setError(err.error || "An unknown error occurred during colorization.");
      if (err.warning) {
        setApiWarning(err.warning); // Display warning even if it's an error response
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetAllSettings = () => {
    setModelChoice(defaultControls.modelChoice);
    setDetailEnhancement(defaultControls.detailEnhancement);
    setIntensity(defaultControls.intensity);
    setHueShift(defaultControls.hueShift);
    setSaturationScale(defaultControls.saturationScale);
    setAutoColorCorrect(defaultControls.autoColorCorrect);
  };

  const resetPage = () => {
    resetAllSettings();
    setSelectedFile(null); // This will trigger handleFileSelect via its dependency array if structured that way
    if (originalImageUrl && originalImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(originalImageUrl);
    }
    setOriginalImageUrl(null);
    setColorizedImageUrl(null);
    setError(null);
    setApiWarning(null);
    setIsLoading(false);
    setFileUploadResetTrigger(prev => prev + 1); // Increment to trigger reset in FileUpload
  };

  useEffect(() => {
    // Check login status
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);

    // Optional: Listen to storage changes to update login status across tabs
    const handleStorageChange = () => {
      const currentToken = localStorage.getItem('authToken');
      setIsLoggedIn(!!currentToken);
    };
    window.addEventListener('storage', handleStorageChange);

    // Cleanup function for this specific effect
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  // Cleanup blob URL on component unmount
  useEffect(() => {
    return () => {
      if (originalImageUrl && originalImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(originalImageUrl);
      }
    };
  }, [originalImageUrl]);

  return (
    <Container className="py-4 py-md-5">
      <header className="text-center mb-5">
        <h1 className="display-5 fw-bold text-gray-800 mb-3">
          AI Image Colorizer
        </h1>
        <p className="lead text-muted" style={{fontSize: "1.15rem"}}>
          Upload a black and white image, adjust settings, and let our AI bring it to life with vibrant color.
        </p>
      </header>

      <Row className="g-4 mb-4">
        <Col lg={4}>
          {/* FileUpload will call handleFileSelect on new file or removal */}
          <FileUpload 
            onFileSelect={handleFileSelect}
            resetTrigger={fileUploadResetTrigger} 
          />
        </Col>
        <Col lg={8}>
          <ColorizationControls
            modelChoice={modelChoice}
            setModelChoice={setModelChoice}
            detailEnhancement={detailEnhancement}
            setDetailEnhancement={setDetailEnhancement}
            intensity={intensity}
            setIntensity={setIntensity}
            hueShift={hueShift}
            setHueShift={setHueShift}
            saturationScale={saturationScale}
            setSaturationScale={setSaturationScale}
            autoColorCorrect={autoColorCorrect}
            setAutoColorCorrect={setAutoColorCorrect}
          />
        </Col>
      </Row>
      
      {/* Error and Warning Alerts */}
      {error && (
        <Alert variant="danger" className="d-flex align-items-center mb-4 shadow-sm">
          <AlertTriangle size={20} className="me-3 flex-shrink-0" />
          <div>
              <Alert.Heading as="h6" className="mb-1 fw-semibold">Processing Error</Alert.Heading>
              <small>{error}</small>
          </div>
        </Alert>
      )}
      {apiWarning && (
        <Alert variant="warning" className="d-flex align-items-center mb-4 shadow-sm">
          <InfoIcon size={20} className="me-3 flex-shrink-0" />
          <div>
              <Alert.Heading as="h6" className="mb-1 fw-semibold">Notice</Alert.Heading>
              <small>{apiWarning}</small>
          </div>
        </Alert>
      )}

      {/* Action Buttons */}
      <Row className="justify-content-center g-2 mb-5 text-center">
        <Col xs="12" sm="auto">
            <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={!selectedFile || isLoading}
                className="px-sm-5 py-sm-3 px-4 py-2 d-flex align-items-center justify-content-center w-100 w-sm-auto shadow"
            >
                <Wand2 size={20} className="me-2" />
                {isLoading ? 'Colorizing...' : 'Colorize Image'}
            </Button>
        </Col>
        <Col xs="12" sm="auto">
            <Button
                variant="outline-secondary"
                size="lg"
                onClick={resetPage}
                disabled={isLoading}
                className="px-sm-5 py-sm-3 px-4 py-2 d-flex align-items-center justify-content-center w-100 w-sm-auto"
            >
                <RotateCcw size={20} className="me-2" />
                Reset Page
            </Button>
        </Col>
      </Row>

      {/* Image Display Area */}
      <ImageDisplay
        originalImageUrl={originalImageUrl}
        colorizedImageUrl={colorizedImageUrl}
        isLoading={isLoading}
        isError={!!error && !colorizedImageUrl}
        isLoggedIn={isLoggedIn}
      />
    </Container>
  );
};