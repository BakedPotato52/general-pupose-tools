/**
 * Application Error Types
 */

export type ErrorCode =
  | 'FILE_TOO_LARGE'
  | 'INVALID_FILE_TYPE'
  | 'CANVAS_CONTEXT_FAILED'
  | 'IMAGE_LOAD_FAILED'
  | 'FILE_READ_FAILED'
  | 'BG_REMOVAL_FAILED'
  | 'IMAGE_PROCESSING_FAILED'
  | 'PDF_GENERATION_FAILED'
  | 'UNKNOWN_ERROR';

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: string;
}

export class ApplicationError extends Error implements AppError {
  code: ErrorCode;
  details?: string;

  constructor(code: ErrorCode, message: string, details?: string) {
    super(message);
    this.name = 'ApplicationError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Error handling utilities
 */

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApplicationError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

export function createError(
  code: ErrorCode,
  message: string,
  details?: unknown
): ApplicationError {
  const detailsStr = details instanceof Error ? details.message : String(details);
  return new ApplicationError(code, message, detailsStr);
}

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds the allowed limit',
  INVALID_FILE_TYPE: 'Please upload a valid image file',
  CANVAS_CONTEXT_FAILED: 'Canvas rendering failed',
  IMAGE_LOAD_FAILED: 'Failed to load the image',
  FILE_READ_FAILED: 'Failed to read the file',
  BG_REMOVAL_FAILED: 'Background removal failed. Please try again.',
  IMAGE_PROCESSING_FAILED: 'Image processing failed',
  PDF_GENERATION_FAILED: 'PDF generation failed',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const;
