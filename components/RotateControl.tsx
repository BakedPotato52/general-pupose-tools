'use client';

import { Button } from './ui/button';
import { RotateCw } from 'lucide-react';

interface RotateControlProps {
  onRotate: (degrees: number) => void;
}

export function RotateControl({ onRotate }: RotateControlProps) {
  const rotationOptions = [
    { label: '90°', degrees: 90 },
    { label: '180°', degrees: 180 },
    { label: '270°', degrees: 270 },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        <RotateCw className="inline w-4 h-4 mr-1" />
        Rotate
      </label>
      <div className="flex flex-wrap gap-2">
        {rotationOptions.map((option) => (
          <Button
            key={option.degrees}
            onClick={() => onRotate(option.degrees)}
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
