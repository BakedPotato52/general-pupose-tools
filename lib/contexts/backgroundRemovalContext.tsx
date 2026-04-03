/**
 * Background Removal context - handles background removal and passport sizing
 */
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AppError } from '../errors';

export interface BackgroundRemovalState {
  backgroundRemovedCanvas: HTMLCanvasElement | null;
  passportCanvas: HTMLCanvasElement | null;
  bgRemovalInProgress: boolean;
  bgRemovalError: AppError | null;
  setBgRemovalInProgress: (inProgress: boolean) => void;
  setBgRemovedCanvas: (canvas: HTMLCanvasElement | null) => void;
  setPassportCanvas: (canvas: HTMLCanvasElement | null) => void;
  setBgRemovalError: (error: AppError | null) => void;
  clearBackgroundRemovalState: () => void;
}

const BackgroundRemovalContext = createContext<BackgroundRemovalState | undefined>(undefined);

const INITIAL_BG_STATE: Omit<
  BackgroundRemovalState,
  | 'setBgRemovalInProgress'
  | 'setBgRemovedCanvas'
  | 'setPassportCanvas'
  | 'setBgRemovalError'
  | 'clearBackgroundRemovalState'
> = {
  backgroundRemovedCanvas: null,
  passportCanvas: null,
  bgRemovalInProgress: false,
  bgRemovalError: null,
};

export const BackgroundRemovalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState(INITIAL_BG_STATE);

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

  const setPassportCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    setState((prev) => ({
      ...prev,
      passportCanvas: canvas,
    }));
  }, []);

  const setBgRemovalError = useCallback((error: AppError | null) => {
    setState((prev) => ({
      ...prev,
      bgRemovalError: error,
      bgRemovalInProgress: false,
    }));
  }, []);

  const clearBackgroundRemovalState = useCallback(() => {
    setState(INITIAL_BG_STATE);
  }, []);

  const value: BackgroundRemovalState = {
    ...state,
    setBgRemovalInProgress,
    setBgRemovedCanvas,
    setPassportCanvas,
    setBgRemovalError,
    clearBackgroundRemovalState,
  };

  return (
    <BackgroundRemovalContext.Provider value={value}>
      {children}
    </BackgroundRemovalContext.Provider>
  );
};

export const useBackgroundRemovalStore = (): BackgroundRemovalState => {
  const context = useContext(BackgroundRemovalContext);
  if (!context) {
    throw new Error('useBackgroundRemovalStore must be used within BackgroundRemovalProvider');
  }
  return context;
};
