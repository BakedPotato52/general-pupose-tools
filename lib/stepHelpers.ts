/**
 * Helper functions for managing multi-step workflow
 */

import { STEPS, StepType, LayoutType } from './constants';

/**
 * Get all available steps in order
 */
export function getAllSteps(): StepType[] {
  return Object.values(STEPS);
}

/**
 * Get the next step after the current step
 */
export function getNextStep(currentStep: StepType): StepType | null {
  const steps = getAllSteps();
  const currentIndex = steps.indexOf(currentStep);
  
  if (currentIndex < steps.length - 1) {
    return steps[currentIndex + 1];
  }
  
  return null;
}

/**
 * Get the previous step before the current step
 */
export function getPreviousStep(currentStep: StepType): StepType | null {
  const steps = getAllSteps();
  const currentIndex = steps.indexOf(currentStep);
  
  if (currentIndex > 0) {
    return steps[currentIndex - 1];
  }
  
  return null;
}

/**
 * Check if a step is valid based on current state
 */
export function isStepValid(
  step: StepType,
  hasUploadedImage: boolean,
  hasEditedImage: boolean,
  hasRemovedBackground: boolean,
  hasLayout: boolean
): boolean {
  switch (step) {
    case STEPS.UPLOAD:
      return true; // Always valid
    case STEPS.EDIT:
      return hasUploadedImage;
    case STEPS.REMOVE_BG:
      return hasEditedImage;
    case STEPS.LAYOUT:
      return hasRemovedBackground;
    case STEPS.EXPORT:
      return hasLayout;
    default:
      return false;
  }
}

/**
 * Get step progress percentage
 */
export function getStepProgress(currentStep: StepType): number {
  const steps = getAllSteps();
  const currentIndex = steps.indexOf(currentStep);
  const totalSteps = steps.length;
  
  return Math.round(((currentIndex + 1) / totalSteps) * 100);
}

/**
 * Get readable step name
 */
export function getStepName(step: StepType): string {
  const stepNames: Record<StepType, string> = {
    [STEPS.UPLOAD]: 'Upload Photo',
    [STEPS.EDIT]: 'Edit Image',
    [STEPS.REMOVE_BG]: 'Remove Background',
    [STEPS.LAYOUT]: 'Select Layout',
    [STEPS.EXPORT]: 'Export PDF',
  };
  
  return stepNames[step];
}

/**
 * Get step description
 */
export function getStepDescription(step: StepType): string {
  const descriptions: Record<StepType, string> = {
    [STEPS.UPLOAD]: 'Upload your photo from your device or take one with your camera',
    [STEPS.EDIT]: 'Crop, rotate, and adjust brightness/contrast of your image',
    [STEPS.REMOVE_BG]: 'Automatically remove the background and resize to passport dimensions',
    [STEPS.LAYOUT]: 'Choose how many copies you want on the A4 sheet',
    [STEPS.EXPORT]: 'Download your passport photos as a PDF file',
  };
  
  return descriptions[step];
}
