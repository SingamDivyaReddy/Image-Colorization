import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap'; // Removed ProgressBar as it wasn't used
import { UploadCloud, XCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in bytes
  resetTrigger?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedFileTypes = "image/png, image/jpeg, image/jpg",
  maxFileSize = 50 * 1024 * 1024, // 50MB
  resetTrigger,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if resetTrigger is a number and greater than 0 to avoid initial trigger
    if (typeof resetTrigger === 'number' && resetTrigger > 0) { 
      removeFile(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTrigger]); // Only re-run if resetTrigger changes

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    validateAndSetFile(file || null);
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    validateAndSetFile(file || null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // No dependencies needed if validateAndSetFile doesn't change

  const validateAndSetFile = (file: File | null) => {
    setError(null);
    if (!file) {
      removeFile();
      return;
    }

    const allowedTypesArray = acceptedFileTypes.split(',').map(t => t.trim());
    if (!allowedTypesArray.includes(file.type)) {
      setError(`Invalid file type. Please upload: ${allowedTypesArray.join(', ')}.`);
      removeFile();
      return;
    }

    if (file.size > maxFileSize) {
      setError(`File is too large. Max size is ${maxFileSize / (1024 * 1024)}MB.`);
      removeFile();
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    onFileSelect(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
    event.dataTransfer.dropEffect = 'copy';
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const removeFile = (propagate: boolean = true) => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
    if (propagate) {
      onFileSelect(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className={`shadow-sm ${error ? 'border-danger' : ''}`}>
      <Card.Body>
        <div
          className={`d-flex flex-column align-items-center justify-content-center p-4 border-2 border-dashed rounded 
                      ${isDragOver ? 'border-primary bg-primary-subtle' : 'border-secondary-subtle'} 
                      ${previewUrl ? '' : 'hover-bg-light'}`}
          style={{ minHeight: '200px', cursor: previewUrl ? 'default' : 'pointer', transition: 'background-color 0.2s ease, border-color 0.2s ease' }}
          onClick={!previewUrl ? triggerFileInput : undefined}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' && !previewUrl) triggerFileInput(); }}
        >
          {previewUrl ? (
            <div className="position-relative text-center w-100">
              <img src={previewUrl} alt="Preview" className="img-fluid rounded" style={{ maxHeight: '250px', objectFit: 'contain' }} />
              <Button
                variant="danger"
                size="sm"
                className="position-absolute top-0 end-0 m-2 rounded-circle p-0 lh-1 d-flex align-items-center justify-content-center"
                style={{ width: '30px', height: '30px' }}
                onClick={(e) => { e.stopPropagation(); removeFile(); }}
                aria-label="Remove image"
              >
                <XCircle size={18} />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <UploadCloud className={`mb-3 ${error ? 'text-danger' : 'text-muted'}`} size={40} />
              <p className={`mb-2 ${error ? 'text-danger' : 'text-muted'}`}>
                <span className="fw-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="small text-muted">PNG, JPG, JPEG (MAX. {maxFileSize / (1024 * 1024)}MB)</p>
            </div>
          )}
          <Form.Control
            ref={fileInputRef}
            type="file"
            className="d-none" // Bootstrap class to hide
            onChange={handleFileChange}
            accept={acceptedFileTypes}
            id="file-upload-input-bootstrap"
          />
        </div>
        {error && <p className="mt-2 small text-danger">{error}</p>}
        {!error && selectedFile && !previewUrl && ( // Fallback if preview fails but file is selected
          <p className="mt-2 small text-muted text-truncate">Selected: {selectedFile.name}</p>
        )}
      </Card.Body>
      {/* hover-bg-light, border-dashed, border-2 classes are defined in index.css */}
    </Card>
  );
};