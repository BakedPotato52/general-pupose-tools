/**
 * Custom hooks for better code organization and reusable logic
 */

import { useCallback } from 'react';
import { useUploadStore } from '@/lib/contexts/uploadContext';
import { useEditStore } from '@/lib/contexts/editContext';
import { useBackgroundRemovalStore } from '@/lib/contexts/backgroundRemovalContext';
import { useUIFlowStore } from '@/lib/contexts/uiFlowContext';
import { createError, AppError } from '@/lib/errors';

/**
 * Combined hook for image upload and editing workflow
 */
export function useImageEditing() {
  const uploadStore = useUploadStore();
  const editStore = useEditStore();
  const bgStore = useBackgroundRemovalStore();
  const uiStore = useUIFlowStore();

  return {
    // Upload
    uploadedImageCanvas: uploadStore.uploadedImageCanvas,
    uploadedImageBlob: uploadStore.uploadedImageBlob,
    setUploadedImage: uploadStore.setUploadedImage,

    // Edit
    editedCanvas: editStore.editedCanvas,
    canUndo: editStore.canUndo,
    canRedo: editStore.canRedo,
    applyEdit: editStore.applyEdit,
    undoEdit: editStore.undoEdit,
    redoEdit: editStore.redoEdit,

    // Background Removal
    backgroundRemovedCanvas: bgStore.backgroundRemovedCanvas,
    passportCanvas: bgStore.passportCanvas,
    bgRemovalInProgress: bgStore.bgRemovalInProgress,
    bgRemovalError: bgStore.bgRemovalError,

    // UI
    loading: uiStore.loading,
    error: uiStore.error,
    setError: uiStore.setError,
    setLoading: uiStore.setLoading,
  };
}

/**
 * Hook for safely handling async operations with error handling
 */
export function useAsyncOperation() {
  const { setLoading, setError } = useUIFlowStore();

  const execute = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      errorCode: string = 'UNKNOWN_ERROR'
    ): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await operation();
        return result;
      } catch (error) {
        const appError = error instanceof Error
          ? createError(errorCode as any, error.message, error)
          : createError('UNKNOWN_ERROR', 'An unexpected error occurred');
        setError(appError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  return { execute };
}

/**
 * Hook for canvas validation
 */
export  function useCanvasValidation() {
  const validateCanvas = useCallback((canvas: HTMLCanvasElement | null): AppError | null => {
    if (!canvas) {
      return createError('IMAGE_PROCESSING_FAILED', 'No image canvas available');
    }
    if (canvas.width <= 0 || canvas.height <= 0) {
      return createError('IMAGE_PROCESSING_FAILED', 'Invalid canvas dimensions');
    }
    return null;
  }, []);

  return { validateCanvas };
}
