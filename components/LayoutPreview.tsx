'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useStore } from '@/lib/store';
import { generateLayoutCanvas } from '@/lib/layoutGenerator';
import { canvasToDataUrl } from '@/lib/imageProcessing';
import { STEPS } from '@/lib/constants';
import { Loader2 } from 'lucide-react';

export function LayoutPreview() {
  const {
    backgroundRemovedCanvas,
    selectedLayout,
    duplicateCount,
    setLayoutCanvas,
    setCurrentStep,
    setLoading,
    loading,
  } = useStore();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!backgroundRemovedCanvas) return;

    try {
      setLoading(true);

      // Generate layout canvas
      const layoutCanvas = generateLayoutCanvas(
        backgroundRemovedCanvas,
        selectedLayout,
        duplicateCount
      );

      // Convert to data URL for preview
      const url = canvasToDataUrl(layoutCanvas);
      setPreviewUrl(url);

      // Store layout canvas
      setLayoutCanvas(layoutCanvas);

      setLoading(false);
    } catch (error) {
      console.error('Layout generation failed:', error);
      setLoading(false);
    }
  }, [backgroundRemovedCanvas, selectedLayout, duplicateCount, setLayoutCanvas, setLoading]);

  if (!backgroundRemovedCanvas) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">A4 Layout Preview</h2>

      {loading ? (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg border-2 border-gray-300">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Generating layout...</p>
          </div>
        </div>
      ) : previewUrl ? (
        <div>
          <div className="bg-gray-100 rounded-lg border-2 border-gray-300 overflow-auto flex items-center justify-center max-h-96">
            <img
              src={previewUrl}
              alt="A4 Layout Preview"
              className="max-w-full max-h-full"
              style={{ aspectRatio: '210/297' }}
            />
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Layout:</span> {selectedLayout} ({duplicateCount} copies)
            </p>
            <p className="text-sm text-blue-800 mt-1">
              <span className="font-semibold">Paper Size:</span> A4 (210 × 297 mm)
            </p>
            <p className="text-sm text-blue-800 mt-1">
              <span className="font-semibold">Resolution:</span> 300 DPI (professional print quality)
            </p>
          </div>

          <Button
            onClick={() => setCurrentStep(STEPS.EXPORT)}
            className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold h-12"
          >
            Proceed to Export
          </Button>
        </div>
      ) : null}
    </div>
  );
}
