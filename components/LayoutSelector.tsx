'use client';

import { useLayoutStore } from '@/lib/contexts/layoutContext';
import { getAvailableLayouts, validateDuplicateCount } from '@/lib/layoutGenerator';
import { LayoutType } from '@/lib/constants';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function LayoutSelector() {
  const {
    selectedLayout,
    duplicateCount,
    setSelectedLayout,
    setDuplicateCount,
  } = useLayoutStore();

  const layouts = getAvailableLayouts();
  const validation = validateDuplicateCount(selectedLayout, duplicateCount);

  const handleLayoutChange = (layoutId: LayoutType) => {
    setSelectedLayout(layoutId);
    // Adjust count if it exceeds the new layout's maximum
    const validation = validateDuplicateCount(layoutId, duplicateCount);
    if (!validation.valid) {
      setDuplicateCount(validation.max);
    }
  };

  const handleDuplicateCountChange = (value: number) => {
    const validation = validateDuplicateCount(selectedLayout, value);
    if (validation.valid) {
      setDuplicateCount(value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Layout Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Choose Layout</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {layouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => handleLayoutChange(layout.id)}
              className={`p-4 rounded-lg border-2 transition-colors text-left ${
                selectedLayout === layout.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Grid Visualization */}
                <div className="flex-shrink-0 w-12 h-12 border border-gray-300 rounded flex items-center justify-center bg-gray-100">
                  <div
                    className="grid gap-0.5"
                    style={{
                      gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                      width: '100%',
                      height: '100%',
                      padding: '2px',
                    }}
                  >
                    {Array.from({ length: layout.cols * layout.rows }).map(
                      (_, i) => (
                        <div
                          key={i}
                          className="bg-blue-300 rounded-sm"
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Layout Info */}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {layout.name}
                  </p>
                  <p className="text-sm text-gray-600">{layout.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Duplicate Count Selection */}
      <div className="space-y-3">
        <label className="block text-lg font-semibold text-gray-900">
          Number of Copies
        </label>

        {/* Quick Select Buttons */}
        <div className="flex flex-wrap gap-2">
          {[4, 6, 8, 12].map((count) => {
            const isValid = validateDuplicateCount(selectedLayout, count).valid;
            return (
              <Button
                key={count}
                onClick={() => handleDuplicateCountChange(count)}
                disabled={!isValid}
                variant={duplicateCount === count ? 'default' : 'outline'}
                className={
                  duplicateCount === count && isValid
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'border-gray-300'
                }
              >
                {count}
              </Button>
            );
          })}
        </div>

        {/* Custom Input */}
        <div className="flex gap-2">
          <Input
            type="number"
            min="1"
            max={validateDuplicateCount(selectedLayout, 999).max}
            value={duplicateCount}
            onChange={(e) =>
              handleDuplicateCountChange(parseInt(e.target.value, 10))
            }
            placeholder="Custom count"
            className="flex-1"
          />
          <Button
            disabled={!validation.valid}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Apply
          </Button>
        </div>

        {!validation.valid && (
          <p className="text-sm text-red-600">
            Maximum {validation.max} copies for {selectedLayout} layout
          </p>
        )}

        <p className="text-sm text-gray-600">
          Total: {duplicateCount} photo{duplicateCount !== 1 ? 's' : ''} on A4 sheet
        </p>
      </div>
    </div>
  );
}
