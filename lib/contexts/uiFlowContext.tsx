/**
 * UI Flow context - handles overall app flow, steps, and global UI state
 */
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { StepType, STEPS } from '../constants';
import { AppError } from '../errors';

export interface UIFlowState {
  currentStep: StepType;
  setCurrentStep: (step: StepType) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: AppError | null;
  setError: (error: AppError | null) => void;
  resetFlow: () => void;
}

const UIFlowContext = createContext<UIFlowState | undefined>(undefined);

const INITIAL_FLOW_STATE: Omit<
  UIFlowState,
  'setCurrentStep' | 'goToNextStep' | 'goToPreviousStep' | 'setLoading' | 'setError' | 'resetFlow'
> = {
  currentStep: STEPS.UPLOAD as StepType,
  loading: false,
  error: null,
};

export const UIFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(INITIAL_FLOW_STATE);

  const setCurrentStep = useCallback((step: StepType) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const goToNextStep = useCallback(() => {
    setState((prev) => {
      const steps = Object.values(STEPS);
      const currentIndex = steps.indexOf(prev.currentStep);
      if (currentIndex < steps.length - 1) {
        return { ...prev, currentStep: steps[currentIndex + 1] as StepType };
      }
      return prev;
    });
  }, []);

  const goToPreviousStep = useCallback(() => {
    setState((prev) => {
      const steps = Object.values(STEPS);
      const currentIndex = steps.indexOf(prev.currentStep);
      if (currentIndex > 0) {
        return { ...prev, currentStep: steps[currentIndex - 1] as StepType };
      }
      return prev;
    });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: AppError | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const resetFlow = useCallback(() => {
    setState(INITIAL_FLOW_STATE);
  }, []);

  const value: UIFlowState = {
    ...state,
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    setLoading,
    setError,
    resetFlow,
  };

  return (
    <UIFlowContext.Provider value={value}>{children}</UIFlowContext.Provider>
  );
};

export const useUIFlowStore = (): UIFlowState => {
  const context = useContext(UIFlowContext);
  if (!context) {
    throw new Error('useUIFlowStore must be used within UIFlowProvider');
  }
  return context;
};
