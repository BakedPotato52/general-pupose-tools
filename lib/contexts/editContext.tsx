/**
 * Edit context - handles image editing with undo/redo history
 */
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface EditOperation {
  canvas: HTMLCanvasElement;
  edits: {
    crop?: { x: number; y: number; width: number; height: number };
    rotate?: number;
    brightness?: number;
    contrast?: number;
  };
}

export interface EditState {
  editedCanvas: HTMLCanvasElement | null;
  editHistory: EditOperation[];
  editHistoryIndex: number;
  applyEdit: (canvas: HTMLCanvasElement, operation: EditOperation['edits']) => void;
  undoEdit: () => void;
  redoEdit: () => void;
  canUndo: boolean;
  canRedo: boolean;
  setEditedCanvas: (canvas: HTMLCanvasElement | null) => void;
  clearEditHistory: () => void;
}

const EditContext = createContext<EditState | undefined>(undefined);

const INITIAL_EDIT_STATE: Omit<
  EditState,
  'applyEdit' | 'undoEdit' | 'redoEdit' | 'canUndo' | 'canRedo' | 'setEditedCanvas' | 'clearEditHistory'
> = {
  editedCanvas: null,
  editHistory: [],
  editHistoryIndex: -1,
};

export const EditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(INITIAL_EDIT_STATE);

  const applyEdit = useCallback((canvas: HTMLCanvasElement, operation: EditOperation['edits']) => {
    setState((prev) => {
      const newHistory = prev.editHistory.slice(0, prev.editHistoryIndex + 1);
      newHistory.push({ canvas, edits: operation });
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

  const setEditedCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    setState((prev) => ({
      ...prev,
      editedCanvas: canvas,
    }));
  }, []);

  const clearEditHistory = useCallback(() => {
    setState((prev) => ({
      ...prev,
      editHistory: [],
      editHistoryIndex: -1,
      editedCanvas: null,
    }));
  }, []);

  const canUndo = state.editHistoryIndex > 0;
  const canRedo = state.editHistoryIndex < state.editHistory.length - 1;

  const value: EditState = {
    ...state,
    canUndo,
    canRedo,
    applyEdit,
    undoEdit,
    redoEdit,
    setEditedCanvas,
    clearEditHistory,
  };

  return (
    <EditContext.Provider value={value}>{children}</EditContext.Provider>
  );
};

export const useEditStore = (): EditState => {
  const context = useContext(EditContext);
  if (!context) {
    throw new Error('useEditStore must be used within EditProvider');
  }
  return context;
};
