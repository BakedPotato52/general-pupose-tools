'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';

interface ImagePreviewProps {
  canvas?: HTMLCanvasElement | null;
  title?: string;
  className?: string;
}

export function ImagePreview({
  canvas: externalCanvas,
  title = 'Image Preview',
  className = '',
}: ImagePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { editedCanvas, backgroundRemovedCanvas, passportCanvas } = useStore();

  // Use provided canvas or fall back to store state
  const displayCanvas = externalCanvas || editedCanvas || backgroundRemovedCanvas || passportCanvas;

  useEffect(() => {
    if (!canvasRef.current || !displayCanvas) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvasRef.current.width = displayCanvas.width;
    canvasRef.current.height = displayCanvas.height;

    // Draw the image
    ctx.drawImage(displayCanvas, 0, 0);
  }, [displayCanvas]);

  if (!displayCanvas) {
    return (
      <div
        className={`bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center ${className}`}
        style={{ aspectRatio: '3/4', minHeight: '400px' }}
      >
        <div className="text-center">
          <p className="text-gray-500 font-medium">{title}</p>
          <p className="text-gray-400 text-sm">No image loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <div className="bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center max-h-96">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full object-contain"
          style={{ maxHeight: '400px' }}
          alt={title}
        />
      </div>
      {displayCanvas && (
        <p className="text-xs text-gray-500">
          Dimensions: {displayCanvas.width} × {displayCanvas.height}px
        </p>
      )}
    </div>
  );
}
