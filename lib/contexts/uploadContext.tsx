/**
 * Upload context - handles file upload and initial image processing
 */
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AppError } from './errors';

export interface UploadState {
  uploadedImageBlob: Blob | null;
  uploadedImageCanvas: HTMLCanvasElement | null;
  setUploadedImage: (blob: Blob, canvas: HTMLCanvasElement) => void;
  clearUploadedImage: () => void;
}

const UploadContext = createContext<UploadState | undefined>(undefined);

const INITIAL_UPLOAD_STATE: Omit<UploadState, 'setUploadedImage' | 'clearUploadedImage'> = {
  uploadedImageBlob: null,
  uploadedImageCanvas: null,
};

export const UploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(INITIAL_UPLOAD_STATE);

  const setUploadedImage = useCallback((blob: Blob, canvas: HTMLCanvasElement) => {
    setState(() => ({
      uploadedImageBlob: blob,
      uploadedImageCanvas: canvas,
    }));
  }, []);

  const clearUploadedImage = useCallback(() => {
    setState(() => ({
      uploadedImageBlob: null,
      uploadedImageCanvas: null,
    }));
  }, []);

  const value: UploadState = {
    ...state,
    setUploadedImage,
    clearUploadedImage,
  };

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
};

export const useUploadStore = (): UploadState => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUploadStore must be used within UploadProvider');
  }
  return context;
};
