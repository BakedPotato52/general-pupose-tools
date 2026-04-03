'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { useEditStore } from '@/lib/contexts/editContext';
import { useBackgroundRemovalStore } from '@/lib/contexts/backgroundRemovalContext';
import { useUIFlowStore } from '@/lib/contexts/uiFlowContext';
import { createCanvasFromImageData, applyMask, resizeToPassportDimensions } from '@/lib/imageProcessing';
import { removeBackgroundAdvanced } from '@/lib/backgroundRemoval';
import { STEPS } from '@/lib/constants';
import { createError, ERROR_MESSAGES } from '@/lib/errors';
import { Wind, AlertCircle } from 'lucide-react';

export function BackgroundRemovalButton() {
  const { editedCanvas } = useEditStore();
  const {
    bgRemovalInProgress,
    bgRemovalError,
    setBgRemovalInProgress,
    setBgRemovedCanvas,
    setBgRemovalError,
  } = useBackgroundRemovalStore();
  const { setCurrentStep, setError } = useUIFlowStore();

  const [retrying, setRetrying] = useState(false);

  const handleRemoveBackground = async () => {
    if (!editedCanvas) return;

    try {
      setBgRemovalInProgress(true);
      setBgRemovalError(null);

      // Use the advanced background removal with edge detection
      const maskImageData = await removeBackgroundAdvanced(editedCanvas);

      // Apply mask to create transparent background
      const resultCanvas = editedCanvas.cloneNode() as HTMLCanvasElement;
      const ctx = resultCanvas.getContext('2d');
      if (!ctx) {
        throw createError('CANVAS_CONTEXT_FAILED', ERROR_MESSAGES.CANVAS_CONTEXT_FAILED);
      }

      // Draw original image on new canvas
      ctx.drawImage(editedCanvas, 0, 0);

      // Apply the mask
      const resultImageData = ctx.getImageData(0, 0, resultCanvas.width, resultCanvas.height);
      const data = resultImageData.data;
      const maskData = maskImageData.data;

      // Apply mask as alpha channel
      for (let i = 0; i < data.length; i += 4) {
        data[i + 3] = maskData[i]; // Use mask red channel as alpha
      }

      ctx.putImageData(resultImageData, 0, 0);

      // Now resize to passport dimensions
      const passportCanvas = resizeToPassportDimensions(resultCanvas);

      setBgRemovedCanvas(passportCanvas);
      setBgRemovalInProgress(false);
      setCurrentStep(STEPS.LAYOUT);
    } catch (error) {
      const appError = error instanceof Error && 'code' in error
        ? error as any
        : createError('BG_REMOVAL_FAILED', ERROR_MESSAGES.BG_REMOVAL_FAILED, error);
      setBgRemovalError(appError);
      setError(appError);
      setBgRemovalInProgress(false);
      console.error('Background removal error:', appError);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    await handleRemoveBackground();
    setRetrying(false);
  };

  if (!editedCanvas) {
    return null;
  }

  return (
    <div className="space-y-4">
      {bgRemovalError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900">
              Background removal failed
            </p>
            <p className="text-sm text-red-700 mt-1">{bgRemovalError.message}</p>
          </div>
        </div>
      )}

      <Button
        onClick={bgRemovalError && !retrying ? handleRetry : handleRemoveBackground}
        disabled={bgRemovalInProgress || retrying}
        className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold h-12"
      >
        {bgRemovalInProgress || retrying ? (
          <>
            <Spinner className="w-4 h-4 mr-2" />
            Removing Background...
          </>
        ) : bgRemovalError ? (
          <>
            <Wind className="w-5 h-5 mr-2" />
            Retry Background Removal
          </>
        ) : (
          <>
            <Wind className="w-5 h-5 mr-2" />
            Remove Background
          </>
        )}
      </Button>

      <div className="text-xs text-gray-600 bg-blue-50 border border-blue-100 rounded p-3">
        <p className="font-medium text-blue-900 mb-1">How it works:</p>
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li>Automatically detects your subject</li>
          <li>Removes the background</li>
          <li>Resizes to passport dimensions</li>
        </ul>
      </div>
    </div>
  );
}
