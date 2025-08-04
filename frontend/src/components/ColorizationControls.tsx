import React from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Sliders, RefreshCw } from 'lucide-react';

interface ColorizationControlsProps {
  modelChoice: string;
  setModelChoice: (value: string) => void;
  detailEnhancement: number;
  setDetailEnhancement: (value: number) => void;
  intensity: number;
  setIntensity: (value: number) => void;
  hueShift: number;
  setHueShift: (value: number) => void;
  saturationScale: number;
  setSaturationScale: (value: number) => void;
  autoColorCorrect: boolean;
  setAutoColorCorrect: (value: boolean) => void;
}

export const ColorizationControls: React.FC<ColorizationControlsProps> = ({
  modelChoice,
  setModelChoice,
  detailEnhancement,
  setDetailEnhancement,
  intensity,
  setIntensity,
  hueShift,
  setHueShift,
  saturationScale,
  setSaturationScale,
  autoColorCorrect,
  setAutoColorCorrect,
}) => {
  const resetControls = () => {
    setModelChoice('standard');
    setDetailEnhancement(0.25);
    setIntensity(1.0);
    setHueShift(0);
    setSaturationScale(1.0);
    setAutoColorCorrect(true);
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex align-items-center mb-4">
          <Sliders className="h-5 w-5 text-primary me-2" />
          <h3 className="h5 mb-0">Colorization Controls</h3>
        </div>

        <Form.Group as={Row} className="mb-3" controlId="modelChoice">
          <Form.Label column sm={12} className="mb-1">
            Colorization Model
          </Form.Label>
          <Col sm={12}>
            <div className="d-grid gap-2 d-sm-flex">
              <Button
                variant={modelChoice === 'standard' ? 'primary' : 'outline-secondary'}
                onClick={() => setModelChoice('standard')}
                className="flex-fill"
              >
                Standard
              </Button>
              <Button
                variant={modelChoice === 'artistic' ? 'primary' : 'outline-secondary'}
                onClick={() => setModelChoice('artistic')}
                className="flex-fill"
              >
                Artistic
              </Button>
            </div>
            <Form.Text className="text-muted mt-1 d-block">
              Standard for realistic, Artistic for vibrant.
            </Form.Text>
          </Col>
        </Form.Group>

        <Form.Group className="mb-3" controlId="detailEnhancement">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <Form.Label className="mb-0">Detail Enhancement</Form.Label>
            <small className="text-muted">{detailEnhancement.toFixed(2)}</small>
          </div>
          <Form.Range
            min="0"
            max="1"
            step="0.01"
            value={detailEnhancement}
            onChange={(e) => setDetailEnhancement(parseFloat(e.target.value))}
          />
           <div className="d-flex justify-content-between text-muted small mt-1">
            <span>None</span>
            <span>Maximum</span>
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="intensity">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <Form.Label className="mb-0">Color Intensity</Form.Label>
            <small className="text-muted">{intensity.toFixed(2)}</small>
          </div>
          <Form.Range
            min="0.1"
            max="2"
            step="0.05"
            value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
          />
          <div className="d-flex justify-content-between text-muted small mt-1">
            <span>Subtle</span>
            <span>Vivid</span>
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="hueShift">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <Form.Label className="mb-0">Hue Shift</Form.Label>
            <small className="text-muted">{hueShift}°</small>
          </div>
          <Form.Range
            min="-180"
            max="180"
            step="5"
            value={hueShift}
            onChange={(e) => setHueShift(parseInt(e.target.value))}
          />
          <div className="d-flex justify-content-between text-muted small mt-1">
            <span>-180°</span>
            <span>+180°</span>
          </div>
        </Form.Group>

        <Form.Group className="mb-4" controlId="saturationScale">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <Form.Label className="mb-0">Saturation</Form.Label>
            <small className="text-muted">{saturationScale.toFixed(2)}</small>
          </div>
          <Form.Range
            min="0"
            max="2"
            step="0.05"
            value={saturationScale}
            onChange={(e) => setSaturationScale(parseFloat(e.target.value))}
          />
          <div className="d-flex justify-content-between text-muted small mt-1">
            <span>Grayscale</span>
            <span>Saturated</span>
          </div>
        </Form.Group>
        
        <Form.Check
          type="checkbox"
          id="autoColorCorrectBootstrap" // Changed ID to avoid conflict if other component used old id
          label="Auto Color Correction"
          checked={autoColorCorrect}
          onChange={(e) => setAutoColorCorrect(e.target.checked)}
          className="mb-1"
        />
        <p className="text-muted small ps-4 mb-4"> {/* Bootstrap padding start class */}
            Automatically adjusts color balance for optimal results.
        </p>

        <div className="d-grid">
          <Button
            variant="outline-secondary"
            onClick={resetControls}
            className="mt-3"
          >
            <RefreshCw className="h-4 w-4 me-2" />
            Reset to Defaults
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};