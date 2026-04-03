import { PASSPORT_SPECS, IMAGE_PROCESSING } from './constants';
import { createError } from './errors';
import { getCanvasContext } from './canvasUtils';

/**
 * Load an image from a Blob and return as a Canvas element
 */
export async function loadImageFromBlob(blob: Blob): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = getCanvasContext(canvas);
          ctx.drawImage(img, 0, 0);
          resolve(canvas);
        } catch (error) {
          reject(createError('IMAGE_LOAD_FAILED', 'Failed to create canvas from image', error));
        }
      };
      img.onerror = () => reject(createError('IMAGE_LOAD_FAILED', 'Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(createError('FILE_READ_FAILED', 'Failed to read file'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Create a canvas from an ImageData object
 */
export function createCanvasFromImageData(imageData: ImageData): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = getCanvasContext(canvas);
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Get ImageData from a canvas
 */
export function getImageDataFromCanvas(canvas: HTMLCanvasElement): ImageData {
  const ctx = getCanvasContext(canvas);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Crop a canvas to a rectangle
 */
export function cropCanvas(
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number
): HTMLCanvasElement {
  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = width;
  croppedCanvas.height = height;
  const ctx = getCanvasContext(croppedCanvas);
  ctx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
  return croppedCanvas;
}

/**
 * Rotate a canvas by the specified degrees
 */
export function rotateCanvas(canvas: HTMLCanvasElement, degrees: number): HTMLCanvasElement {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));

  const newWidth = canvas.height * sin + canvas.width * cos;
  const newHeight = canvas.height * cos + canvas.width * sin;

  const rotatedCanvas = document.createElement('canvas');
  rotatedCanvas.width = newWidth;
  rotatedCanvas.height = newHeight;

  const ctx = getCanvasContext(rotatedCanvas);

  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

  return rotatedCanvas;
}

/**
 * Adjust brightness and contrast of a canvas
 */
export function adjustBrightnessContrast(
  canvas: HTMLCanvasElement,
  brightness: number = 0,
  contrast: number = 0
): HTMLCanvasElement {
  // brightness range: -100 to 100
  // contrast range: -100 to 100
  const brightnessMultiplier = 1 + brightness / 100;
  const contrastMultiplier = 1 + contrast / 100;

  const adjustedCanvas = document.createElement('canvas');
  adjustedCanvas.width = canvas.width;
  adjustedCanvas.height = canvas.height;

  const adjustedCtx = getCanvasContext(adjustedCanvas);

  // Apply filter using canvas filter property
  adjustedCtx.filter = `brightness(${brightnessMultiplier}) contrast(${contrastMultiplier})`;
  adjustedCtx.drawImage(canvas, 0, 0);

  return adjustedCanvas;
}

/**
 * Resize a canvas to specific dimensions, maintaining aspect ratio with padding
 */
export function resizeCanvasWithPadding(
  canvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number,
  backgroundColor: string = '#ffffff'
): HTMLCanvasElement {
  const sourceAspect = canvas.width / canvas.height;
  const targetAspect = targetWidth / targetHeight;

  let scaledWidth: number;
  let scaledHeight: number;
  let offsetX: number;
  let offsetY: number;

  if (sourceAspect > targetAspect) {
    // Source is wider, fit to width
    scaledWidth = targetWidth;
    scaledHeight = targetWidth / sourceAspect;
    offsetX = 0;
    offsetY = (targetHeight - scaledHeight) / 2;
  } else {
    // Source is taller, fit to height
    scaledHeight = targetHeight;
    scaledWidth = targetHeight * sourceAspect;
    offsetX = (targetWidth - scaledWidth) / 2;
    offsetY = 0;
  }

  const resizedCanvas = document.createElement('canvas');
  resizedCanvas.width = targetWidth;
  resizedCanvas.height = targetHeight;

  const ctx = getCanvasContext(resizedCanvas);

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  // Draw scaled image
  ctx.drawImage(canvas, offsetX, offsetY, scaledWidth, scaledHeight);

  return resizedCanvas;
}

/**
 * Resize canvas to passport dimensions
 */
export function resizeToPassportDimensions(canvas: HTMLCanvasElement): HTMLCanvasElement {
  return resizeCanvasWithPadding(
    canvas,
    PASSPORT_SPECS.WIDTH_PX,
    PASSPORT_SPECS.HEIGHT_PX,
    '#ffffff'
  );
}

/**
 * Apply a mask to a canvas with transparency
 */
export function applyMask(
  canvas: HTMLCanvasElement,
  maskImageData: ImageData
): HTMLCanvasElement {
  const ctx = getCanvasContext(canvas);

  // Get current image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const maskData = maskImageData.data;

  // Apply mask as alpha channel
  for (let i = 0; i < data.length; i += 4) {
    // maskData contains grayscale values (R = G = B)
    // Use it as alpha channel
    const maskAlpha = maskData[i]; // Red channel of mask
    data[i + 3] = maskAlpha; // Alpha channel
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Convert canvas to blob
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string = 'image/png',
  quality: number = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(createError('IMAGE_PROCESSING_FAILED', 'Failed to convert canvas to blob'));
        }
      },
      type,
      quality
    );
  });
}

/**
 * Convert canvas to data URL
 */
export function canvasToDataUrl(
  canvas: HTMLCanvasElement,
  type: string = 'image/png',
  quality: number = 0.95
): string {
  return canvas.toDataURL(type, quality);
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
 * Create a blank canvas with specified dimensions
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
 * Draw an image on a canvas at specified position and size
 */
export function drawImageOnCanvas(
  targetCanvas: HTMLCanvasElement,
  sourceCanvas: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const ctx = getCanvasContext(targetCanvas);
  ctx.drawImage(sourceCanvas, x, y, width, height);
}

/**
 * Compress and optimize image before processing
 */
export async function compressImage(blob: Blob): Promise<Blob> {
  const canvas = await loadImageFromBlob(blob);

  // Resize if too large
  if (canvas.width > IMAGE_PROCESSING.MAX_PREVIEW_WIDTH || canvas.height > IMAGE_PROCESSING.MAX_PREVIEW_HEIGHT) {
    const ratio = Math.min(
      IMAGE_PROCESSING.MAX_PREVIEW_WIDTH / canvas.width,
      IMAGE_PROCESSING.MAX_PREVIEW_HEIGHT / canvas.height
    );

    const newWidth = Math.floor(canvas.width * ratio);
    const newHeight = Math.floor(canvas.height * ratio);

    const newCanvas = document.createElement('canvas');
    newCanvas.width = newWidth;
    newCanvas.height = newHeight;
    const newCtx = getCanvasContext(newCanvas);

    newCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
    return canvasToBlob(newCanvas, 'image/jpeg', IMAGE_PROCESSING.COMPRESSION_QUALITY);
  }

  return canvasToBlob(canvas, 'image/jpeg', IMAGE_PROCESSING.COMPRESSION_QUALITY);
}
