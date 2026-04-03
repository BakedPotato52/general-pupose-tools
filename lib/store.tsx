'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { LayoutType, StepType, STEPS } from './constants';

export interface EditState {
  crop?: { x: number; y: number; width: number; height: number };
  rotate?: number;
  brightness?: number;
  contrast?: number;
}

export interface AppState {
  // Upload state
  uploadedImageBlob: Blob | null;
  uploadedImageCanvas: HTMLCanvasElement | null;
  setUploadedImage: (blob: Blob, canvas: HTMLCanvasElement) => void;

  // Edit state
  editedCanvas: HTMLCanvasElement | null;
  editHistory: Array<{ canvas: HTMLCanvasElement; edits: EditState }>;
  editHistoryIndex: number;
  applyEdit: (canvas: HTMLCanvasElement, edits: EditState) => void;
  undoEdit: () => void;
  redoEdit: () => void;

  // Background removal state
  backgroundRemovedCanvas: HTMLCanvasElement | null;
  bgRemovalInProgress: boolean;
  bgRemovalError: string | null;
  setBgRemovalInProgress: (inProgress: boolean) => void;
  setBgRemovedCanvas: (canvas: HTMLCanvasElement | null) => void;
  setBgRemovalError: (error: string | null) => void;

  // Sizing state
  passportCanvas: HTMLCanvasElement | null;
  setPassportCanvas: (canvas: HTMLCanvasElement | null) => void;

  // Layout state
  selectedLayout: LayoutType;
  duplicateCount: number;
  layoutCanvas: HTMLCanvasElement | null;
  setSelectedLayout: (layout: LayoutType) => void;
  setDuplicateCount: (count: number) => void;
  setLayoutCanvas: (canvas: HTMLCanvasElement | null) => void;

  // UI state
  currentStep: StepType;
  setCurrentStep: (step: StepType) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Reset
  resetState: () => void;
}

interface StoreState {
  uploadedImageBlob: Blob | null;
  uploadedImageCanvas: HTMLCanvasElement | null;
  editedCanvas: HTMLCanvasElement | null;
  editHistory: Array<{ canvas: HTMLCanvasElement; edits: EditState }>;
  editHistoryIndex: number;
  backgroundRemovedCanvas: HTMLCanvasElement | null;
  bgRemovalInProgress: boolean;
  bgRemovalError: string | null;
  passportCanvas: HTMLCanvasElement | null;
  selectedLayout: LayoutType;
  duplicateCount: number;
  layoutCanvas: HTMLCanvasElement | null;
  currentStep: StepType;
  loading: boolean;
  error: string | null;
}

const INITIAL_STATE: StoreState = {
  uploadedImageBlob: null,
  uploadedImageCanvas: null,
  editedCanvas: null,
  editHistory: [] as Array<{ canvas: HTMLCanvasElement; edits: EditState }>,
  editHistoryIndex: -1,
  backgroundRemovedCanvas: null,
  bgRemovalInProgress: false,
  bgRemovalError: null,
  passportCanvas: null,
  selectedLayout: '4-up' as LayoutType,
  duplicateCount: 4,
  layoutCanvas: null,
  currentStep: STEPS.UPLOAD as StepType,
  loading: false,
  error: null,
};

const StoreContext = createContext<AppState | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StoreState>(INITIAL_STATE);

  const setUploadedImage = useCallback((blob: Blob, canvas: HTMLCanvasElement) => {
    setState((prev) => ({
      ...prev,
      uploadedImageBlob: blob,
      uploadedImageCanvas: canvas,
      editedCanvas: canvas,
      editHistory: [{ canvas, edits: {} }],
      editHistoryIndex: 0,
      error: null,
    }));
  }, []);

  const applyEdit = useCallback((canvas: HTMLCanvasElement, edits: EditState) => {
    setState((prev) => {
      const newHistory = prev.editHistory.slice(0, prev.editHistoryIndex + 1);
      newHistory.push({ canvas, edits });
      return {
        ...prev,
        editedCanvas: canvas,
        editHistory: newHistory,
        editHistoryIndex: newHistory.length - 1,
      };
    });
  }, []);

  const undoEdit = useCallback(() => {
    setState((prev) => {
      if (prev.editHistoryIndex > 0) {
        const newIndex = prev.editHistoryIndex - 1;
        return {
          ...prev,
          editHistoryIndex: newIndex,
          editedCanvas: prev.editHistory[newIndex].canvas,
        };
      }
      return prev;
    });
  }, []);

  const redoEdit = useCallback(() => {
    setState((prev) => {
      if (prev.editHistoryIndex < prev.editHistory.length - 1) {
        const newIndex = prev.editHistoryIndex + 1;
        return {
          ...prev,
          editHistoryIndex: newIndex,
          editedCanvas: prev.editHistory[newIndex].canvas,
        };
      }
      return prev;
    });
  }, []);

  const setBgRemovalInProgress = useCallback((inProgress: boolean) => {
    setState((prev) => ({ ...prev, bgRemovalInProgress: inProgress }));
  }, []);

  const setBgRemovedCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    setState((prev) => ({
      ...prev,
      backgroundRemovedCanvas: canvas,
      bgRemovalError: null,
    }));
  }, []);

  const setBgRemovalError = useCallback((error: string | null) => {
    setState((prev) => ({
      ...prev,
      bgRemovalError: error,
      bgRemovalInProgress: false,
    }));
  }, []);

  const setPassportCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    setState((prev) => ({ ...prev, passportCanvas: canvas }));
  }, []);

  const setSelectedLayout = useCallback((layout: LayoutType) => {
    setState((prev) => ({ ...prev, selectedLayout: layout }));
  }, []);

  const setDuplicateCount = useCallback((count: number) => {
    setState((prev) => ({ ...prev, duplicateCount: count }));
  }, []);

  const setLayoutCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    setState((prev) => ({ ...prev, layoutCanvas: canvas }));
  }, []);

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

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const resetState = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const value: AppState = {
    ...state,
    setUploadedImage,
    applyEdit,
    undoEdit,
    redoEdit,
    setBgRemovalInProgress,
    setBgRemovedCanvas,
    setBgRemovalError,
    setPassportCanvas,
    setSelectedLayout,
    setDuplicateCount,
    setLayoutCanvas,
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    setLoading,
    setError,
    resetState,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = (): AppState => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
