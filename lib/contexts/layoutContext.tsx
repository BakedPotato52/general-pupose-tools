/**
 * Layout context - handles layout selection and PDF generation
 */
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { LayoutType } from '../constants';

export interface LayoutState {
  selectedLayout: LayoutType;
  duplicateCount: number;
  layoutCanvas: HTMLCanvasElement | null;
  setSelectedLayout: (layout: LayoutType) => void;
  setDuplicateCount: (count: number) => void;
  setLayoutCanvas: (canvas: HTMLCanvasElement | null) => void;
  resetLayout: () => void;
}

const LayoutContext = createContext<LayoutState | undefined>(undefined);

const INITIAL_LAYOUT_STATE: Omit<
  LayoutState,
  'setSelectedLayout' | 'setDuplicateCount' | 'setLayoutCanvas' | 'resetLayout'
> = {
  selectedLayout: '4-up' as LayoutType,
  duplicateCount: 4,
  layoutCanvas: null,
};

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(INITIAL_LAYOUT_STATE);

  const setSelectedLayout = useCallback((layout: LayoutType) => {
    setState((prev) => ({ ...prev, selectedLayout: layout }));
  }, []);

  const setDuplicateCount = useCallback((count: number) => {
    setState((prev) => ({ ...prev, duplicateCount: count }));
  }, []);

  const setLayoutCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    setState((prev) => ({ ...prev, layoutCanvas: canvas }));
  }, []);

  const resetLayout = useCallback(() => {
    setState(INITIAL_LAYOUT_STATE);
  }, []);

  const value: LayoutState = {
    ...state,
    setSelectedLayout,
    setDuplicateCount,
    setLayoutCanvas,
    resetLayout,
  };

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export const useLayoutStore = (): LayoutState => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutStore must be used within LayoutProvider');
  }
  return context;
};
