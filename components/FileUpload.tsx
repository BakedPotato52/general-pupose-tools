'use client';

import { useRef, useState } from 'react';
import { Upload, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { useStore } from '@/lib/store';
import { loadImageFromBlob, compressImage } from '@/lib/imageProcessing';
import { STEPS, IMAGE_PROCESSING } from '@/lib/constants';

export function FileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { setUploadedImage, setCurrentStep, setError } = useStore();

  const handleFileSelected = async (file: File) => {
    try {
      setUploading(true);
      setUploadError(null);

      // Validate file size
      if (file.size > IMAGE_PROCESSING.MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
        throw new Error(
          `File size exceeds ${IMAGE_PROCESSING.MAX_UPLOAD_SIZE_MB}MB limit`
        );
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload a valid image file');
      }

      // Compress image
      const compressedBlob = await compressImage(file);

      // Load image to canvas
      const canvas = await loadImageFromBlob(compressedBlob);

      // Store in state
      setUploadedImage(compressedBlob, canvas);
      setCurrentStep(STEPS.EDIT);
      setError(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to upload image';
      setUploadError(message);
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-200 p-12 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upload Your Photo
          </h2>
          <p className="text-gray-600">
            Start by selecting a photo from your device or taking one with your
            camera
          </p>
        </div>

        {uploadError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{uploadError}</p>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            onClick={handleUploadClick}
            disabled={uploading}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="w-5 h-5 mr-2" />
            {uploading ? 'Uploading...' : 'Choose from Device'}
          </Button>

          <Button
            onClick={handleCameraClick}
            disabled={uploading}
            variant="outline"
            size="lg"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Camera className="w-5 h-5 mr-2" />
            Take with Camera
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Supported formats: JPG, PNG, WebP. Max size: {IMAGE_PROCESSING.MAX_UPLOAD_SIZE_MB}MB
        </p>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="Upload image file"
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="Capture image with camera"
      />
    </div>
  );
}
