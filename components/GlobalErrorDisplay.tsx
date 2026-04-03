'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useUIFlowStore } from '@/lib/contexts/uiFlowContext';
import { Button } from './ui/button';

export function GlobalErrorDisplay() {
  const { error, setError } = useUIFlowStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
    }
  }, [error]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setError(null);
    }, 300);
  };

  if (!error || !isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 max-w-md z-50 animate-in fade-in slide-in-from-top-5">
      <div className="bg-white rounded-lg shadow-lg border border-red-200 p-4 flex gap-4">
              <div className="shrink-0 pt-0.5">
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm">Error</h3>
                  <p className="text-sm text-gray-700 mt-1 wrap-break-words">{error.message}</p>
          {error.details && (
                      <p className="text-xs text-gray-600 mt-2 font-mono bg-gray-50 p-2 rounded wrap-break-words">
              {error.details}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
                  className="shrink-0 h-6 w-6 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
