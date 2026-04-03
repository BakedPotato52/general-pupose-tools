'use client';

import { useUIFlowStore } from '@/lib/contexts/uiFlowContext';
import { STEPS } from '@/lib/constants';
import { Check, Camera, Palette, Wind, Layout, Download } from 'lucide-react';

const STEP_LABELS = {
  [STEPS.UPLOAD]: { label: 'Upload', icon: Camera },
  [STEPS.EDIT]: { label: 'Edit', icon: Palette },
  [STEPS.REMOVE_BG]: { label: 'Remove BG', icon: Wind },
  [STEPS.LAYOUT]: { label: 'Layout', icon: Layout },
  [STEPS.EXPORT]: { label: 'Export', icon: Download },
};

export function ProgressIndicator() {
  const { currentStep } = useUIFlowStore();
  const steps = Object.values(STEPS);
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = STEP_LABELS[step as keyof typeof STEP_LABELS]?.icon;
            const label = STEP_LABELS[step as keyof typeof STEP_LABELS]?.label;
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            const isUpcoming = index > currentStepIndex;

            return (
              <div key={step} className="flex items-center flex-1">
                {/* Step Circle */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    isCompleted
                      ? 'bg-green-500 border-green-500'
                      : isActive
                        ? 'bg-blue-500 border-blue-500'
                        : 'bg-gray-200 border-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    StepIcon && (
                      <StepIcon
                        className={`w-5 h-5 ${
                          isActive
                            ? 'text-white'
                            : isUpcoming
                              ? 'text-gray-400'
                              : 'text-white'
                        }`}
                      />
                    )
                  )}
                </div>

                {/* Step Label */}
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600'
                        : isCompleted
                          ? 'text-green-600'
                          : 'text-gray-500'
                    }`}
                  >
                    {label}
                  </p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-colors ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
