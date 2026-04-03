'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { CropTool } from './CropTool';
import { RotateControl } from './RotateControl';
import { BrightnessContrastSliders } from './BrightnessContrastSliders';
import { useStore } from '@/lib/store';
import {
  cropCanvas,
  rotateCanvas,
  adjustBrightnessContrast,
} from '@/lib/imageProcessing';
import { Undo2, Redo2, X } from 'lucide-react';

export function EditingToolbar() {
  const [showCropTool, setShowCropTool] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);

  const {
    editedCanvas,
    applyEdit,
    undoEdit,
    redoEdit,
    editHistoryIndex,
    editHistory,
  } = useStore();

  const canUndo = editHistoryIndex > 0;
  const canRedo = editHistoryIndex < editHistory.length - 1;

  const handleCropApply = (croppedCanvas: HTMLCanvasElement) => {
    if (editedCanvas) {
      applyEdit(croppedCanvas, {
        crop: { x: 0, y: 0, width: croppedCanvas.width, height: croppedCanvas.height },
      });
    }
    setShowCropTool(false);
  };

  const handleRotate = (degrees: number) => {
    if (!editedCanvas) return;
    try {
      const rotated = rotateCanvas(editedCanvas, degrees);
      applyEdit(rotated, { rotate: degrees });
    } catch (error) {
      console.error('Rotation failed:', error);
    }
  };

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    applyAdjustments(value, contrast);
  };

  const handleContrastChange = (value: number) => {
    setContrast(value);
    applyAdjustments(brightness, value);
  };

  const applyAdjustments = (brightnessValue: number, contrastValue: number) => {
    if (!editedCanvas) return;
    try {
      const adjusted = adjustBrightnessContrast(
        editedCanvas,
        brightnessValue,
        contrastValue
      );
      applyEdit(adjusted, {
        brightness: brightnessValue,
        contrast: contrastValue,
      });
    } catch (error) {
      console.error('Adjustment failed:', error);
    }
  };

  const handleResetAdjustments = () => {
    setBrightness(0);
    setContrast(0);
    applyAdjustments(0, 0);
  };

  if (!editedCanvas) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Undo/Redo Controls */}
      <div className="flex gap-2">
        <Button
          onClick={undoEdit}
          disabled={!canUndo}
          variant="outline"
          size="sm"
          title="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          onClick={redoEdit}
          disabled={!canRedo}
          variant="outline"
          size="sm"
          title="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Editing Controls */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-gray-900">Edit Tools</h3>

        {/* Crop Tool */}
        <div className="space-y-2">
          <Button
            onClick={() => setShowCropTool(true)}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Crop Image
          </Button>
        </div>

        {/* Rotate Controls */}
        <RotateControl onRotate={handleRotate} />

        {/* Brightness and Contrast */}
        <BrightnessContrastSliders
          onBrightnessChange={handleBrightnessChange}
          onContrastChange={handleContrastChange}
        />

        {/* Reset Button */}
        {(brightness !== 0 || contrast !== 0) && (
          <Button
            onClick={handleResetAdjustments}
            variant="outline"
            size="sm"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <X className="w-4 h-4 mr-2" />
            Reset Adjustments
          </Button>
        )}
      </div>

      {/* Crop Tool Modal */}
      {showCropTool && (
        <CropTool
          onClose={() => setShowCropTool(false)}
          onApply={handleCropApply}
        />
      )}
    </div>
  );
}
