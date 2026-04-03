'use client';

import { useRef, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useEditStore } from '@/lib/contexts/editContext';
import { cropCanvas } from '@/lib/imageProcessing';

interface CropToolProps {
  onClose: () => void;
  onApply: (croppedCanvas: HTMLCanvasElement) => void;
}

export function CropTool({ onClose, onApply }: CropToolProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selection, setSelection] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const { editedCanvas } = useEditStore();

  useEffect(() => {
    if (!canvasRef.current || !editedCanvas) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvasRef.current.width = editedCanvas.width;
    canvasRef.current.height = editedCanvas.height;

    // Draw original image
    ctx.drawImage(editedCanvas, 0, 0);

    // Draw selection rectangle
    if (selection.width > 0 && selection.height > 0) {
      // Darken unselected areas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, selection.x, editedCanvas.height);
      ctx.fillRect(
        selection.x + selection.width,
        0,
        editedCanvas.width - (selection.x + selection.width),
        editedCanvas.height
      );
      ctx.fillRect(selection.x, 0, selection.width, selection.y);
      ctx.fillRect(
        selection.x,
        selection.y + selection.height,
        selection.width,
        editedCanvas.height - (selection.y + selection.height)
      );

      // Draw selection border
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(selection.x, selection.y, selection.width, selection.height);
    }
  }, [editedCanvas, selection]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPos({ x, y });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = Math.max(0, x - startPos.x);
    const height = Math.max(0, y - startPos.y);

    setSelection({
      x: Math.min(startPos.x, x),
      y: Math.min(startPos.y, y),
      width,
      height,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleApply = () => {
    if (!editedCanvas || selection.width === 0 || selection.height === 0) return;

    const croppedCanvas = cropCanvas(
      editedCanvas,
      selection.x,
      selection.y,
      selection.width,
      selection.height
    );

    onApply(croppedCanvas);
  };

  const handleReset = () => {
    setSelection({ x: 0, y: 0, width: 0, height: 0 });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-hidden shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Crop Image</h2>
          <p className="text-gray-600 text-sm mt-1">
            Drag to select the area you want to keep
          </p>
        </div>

        <div className="overflow-auto flex items-center justify-center bg-gray-100 p-4" style={{ maxHeight: '300px' }}>
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="cursor-crosshair max-w-full max-h-full"
          />
        </div>

        <div className="p-4 border-t border-gray-200 flex gap-3 justify-end">
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={selection.width === 0 || selection.height === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Apply Crop
          </Button>
        </div>
      </div>
    </div>
  );
}
