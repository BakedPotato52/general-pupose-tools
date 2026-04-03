'use client';

import { useState } from 'react';
import { Sun, Contrast } from 'lucide-react';

interface BrightnessContrastSlidersProps {
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
}

export function BrightnessContrastSliders({
  onBrightnessChange,
  onContrastChange,
}: BrightnessContrastSlidersProps) {
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    onBrightnessChange(value);
  };

  const handleContrastChange = (value: number) => {
    setContrast(value);
    onContrastChange(value);
  };

  return (
    <div className="space-y-6">
      {/* Brightness */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Sun className="inline w-4 h-4 mr-2" />
            Brightness
          </label>
          <span className="text-sm text-gray-600">{brightness}</span>
        </div>
        <input
          type="range"
          min="-100"
          max="100"
          value={brightness}
          onChange={(e) => handleBrightnessChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #e5e7eb 0%, #3b82f6 ${
              ((brightness + 100) / 200) * 100
            }%, #e5e7eb 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>-100</span>
          <span>0</span>
          <span>+100</span>
        </div>
      </div>

      {/* Contrast */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Contrast className="inline w-4 h-4 mr-2" />
            Contrast
          </label>
          <span className="text-sm text-gray-600">{contrast}</span>
        </div>
        <input
          type="range"
          min="-100"
          max="100"
          value={contrast}
          onChange={(e) => handleContrastChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #e5e7eb 0%, #3b82f6 ${
              ((contrast + 100) / 200) * 100
            }%, #e5e7eb 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>-100</span>
          <span>0</span>
          <span>+100</span>
        </div>
      </div>
    </div>
  );
}
