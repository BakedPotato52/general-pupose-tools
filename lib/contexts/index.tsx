/**
 * Composite provider - combines all store providers
 */
'use client';

import React from 'react';
import { UploadProvider } from './uploadContext';
import { EditProvider } from './editContext';
import { BackgroundRemovalProvider } from './backgroundRemovalContext';
import { LayoutProvider } from './layoutContext';
import { UIFlowProvider } from './uiFlowContext';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <UIFlowProvider>
      <UploadProvider>
        <EditProvider>
          <BackgroundRemovalProvider>
            <LayoutProvider>
              {children}
            </LayoutProvider>
          </BackgroundRemovalProvider>
        </EditProvider>
      </UploadProvider>
    </UIFlowProvider>
  );
};

// Re-export all hooks for convenience
export { useUploadStore } from './uploadContext';
export { useEditStore } from './editContext';
export { useBackgroundRemovalStore } from './backgroundRemovalContext';
export { useLayoutStore } from './layoutContext';
export { useUIFlowStore } from './uiFlowContext';

// Re-export types
export type { UploadState } from './uploadContext';
export type { EditState } from './editContext';
export type { BackgroundRemovalState } from './backgroundRemovalContext';
export type { LayoutState } from './layoutContext';
export type { UIFlowState } from './uiFlowContext';
