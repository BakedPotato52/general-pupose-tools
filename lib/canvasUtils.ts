/**
 * Safe canvas utilities with proper error handling
 */

import { createError } from './errors';

/**
 * Safely get 2D context from canvas with error handling
 */
export function getCanvasContext(
  canvas: HTMLCanvasElement,
  contextType: '2d' = '2d'
): CanvasRenderingContext2D {
  const ctx = canvas.getContext(contextType);
  if (!ctx) {
    throw createError('CANVAS_CONTEXT_FAILED', 'Failed to get canvas rendering context');
  }
  return ctx as CanvasRenderingContext2D;
}

/**
 * Clone a canvas safely
 */
export function cloneCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const cloned = document.createElement('canvas');
  cloned.width = canvas.width;
  cloned.height = canvas.height;

  const ctx = getCanvasContext(cloned);
  ctx.drawImage(canvas, 0, 0);

  return cloned;
}

/**
 * Create an empty canvas with specified dimensions
 */
export function createBlankCanvas(
  width: number,
  height: number,
  backgroundColor: string = '#ffffff'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = getCanvasContext(canvas);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  return canvas;
}

/**
 * Check if canvas is valid and accessible
 */
export function isCanvasValid(canvas: HTMLCanvasElement | null): canvas is HTMLCanvasElement {
  return canvas instanceof HTMLCanvasElement && canvas.width > 0 && canvas.height > 0;
}

/**
 * Get canvas dimensions
 */
export function getCanvasDimensions(canvas: HTMLCanvasElement): { width: number; height: number } {
  return {
    width: canvas.width,
    height: canvas.height,
  };
}

/**
 * Resize canvas with validation
 */
export function resizeCanvas(
  canvas: HTMLCanvasElement,
  newWidth: number,
  newHeight: number
): HTMLCanvasElement {
  if (newWidth <= 0 || newHeight <= 0) {
    throw createError('IMAGE_PROCESSING_FAILED', 'Invalid canvas dimensions');
  }

  const resized = document.createElement('canvas');
  resized.width = newWidth;
  resized.height = newHeight;

  const ctx = getCanvasContext(resized);
  ctx.drawImage(canvas, 0, 0, newWidth, newHeight);

  return resized;
}
