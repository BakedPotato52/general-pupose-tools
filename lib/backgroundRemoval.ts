/**
 * Background removal module using edge detection and color analysis
 * This provides multiple strategies for removing backgrounds from passport photos
 */

let modelLoaded = false;

/**
 * Check if model is loaded
 */
export function isModelLoaded(): boolean {
  return modelLoaded;
}

/**
 * Fallback: Simple automatic white background removal using color thresholding
 * This is used if the ML model fails or is not available
 */
export async function removeWhiteBackground(canvas: HTMLCanvasElement): Promise<ImageData> {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Define white threshold (adjust based on needs)
  const threshold = 240;

  // Iterate through pixels
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Check if pixel is white (all channels above threshold)
    const isWhite = r > threshold && g > threshold && b > threshold;

    if (isWhite) {
      // Make it transparent
      data[i + 3] = 0;
    } else {
      // Make it opaque
      data[i + 3] = 255;
    }
  }

  return imageData;
}

/**
 * Advanced background removal using edge detection and color space analysis
 */
export async function removeBackgroundAdvanced(canvas: HTMLCanvasElement): Promise<ImageData> {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  // Step 1: Convert to grayscale and apply edge detection
  const edges = detectEdges(data, width, height);

  // Step 2: Use edges to create initial mask
  const mask = new Uint8Array(width * height);
  for (let i = 0; i < edges.length; i++) {
    mask[i] = edges[i] > 50 ? 255 : 0;
  }

  // Step 3: Apply morphological operations to clean up mask
  dilateMask(mask, width, height, 2);
  erodeMask(mask, width, height, 1);

  // Step 4: Apply mask to image
  for (let i = 0; i < mask.length; i++) {
    data[i * 4 + 3] = mask[i];
  }

  return imageData;
}

/**
 * Detect edges using Sobel operator
 */
function detectEdges(data: Uint8ClampedArray, width: number, height: number): Uint8Array {
  const edges = new Uint8Array(width * height);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      // Sobel operator
      const gx =
        -data[(y - 1) * width * 4 + (x - 1) * 4] -
        2 * data[(y) * width * 4 + (x - 1) * 4] -
        data[(y + 1) * width * 4 + (x - 1) * 4] +
        data[(y - 1) * width * 4 + (x + 1) * 4] +
        2 * data[(y) * width * 4 + (x + 1) * 4] +
        data[(y + 1) * width * 4 + (x + 1) * 4];

      const gy =
        -data[(y - 1) * width * 4 + (x - 1) * 4] -
        2 * data[(y - 1) * width * 4 + (x) * 4] -
        data[(y - 1) * width * 4 + (x + 1) * 4] +
        data[(y + 1) * width * 4 + (x - 1) * 4] +
        2 * data[(y + 1) * width * 4 + (x) * 4] +
        data[(y + 1) * width * 4 + (x + 1) * 4];

      edges[y * width + x] = Math.sqrt(gx * gx + gy * gy);
    }
  }

  return edges;
}

/**
 * Dilate mask (expand white areas)
 */
function dilateMask(mask: Uint8Array, width: number, height: number, iterations: number): void {
  for (let iter = 0; iter < iterations; iter++) {
    const temp = new Uint8Array(mask);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (
          temp[(y - 1) * width + (x - 1)] === 255 ||
          temp[(y - 1) * width + x] === 255 ||
          temp[(y - 1) * width + (x + 1)] === 255 ||
          temp[y * width + (x - 1)] === 255 ||
          temp[y * width + x] === 255 ||
          temp[y * width + (x + 1)] === 255 ||
          temp[(y + 1) * width + (x - 1)] === 255 ||
          temp[(y + 1) * width + x] === 255 ||
          temp[(y + 1) * width + (x + 1)] === 255
        ) {
          mask[idx] = 255;
        }
      }
    }
  }
}

/**
 * Erode mask (shrink white areas)
 */
function erodeMask(mask: Uint8Array, width: number, height: number, iterations: number): void {
  for (let iter = 0; iter < iterations; iter++) {
    const temp = new Uint8Array(mask);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (
          temp[(y - 1) * width + (x - 1)] === 255 &&
          temp[(y - 1) * width + x] === 255 &&
          temp[(y - 1) * width + (x + 1)] === 255 &&
          temp[y * width + (x - 1)] === 255 &&
          temp[y * width + x] === 255 &&
          temp[y * width + (x + 1)] === 255 &&
          temp[(y + 1) * width + (x - 1)] === 255 &&
          temp[(y + 1) * width + x] === 255 &&
          temp[(y + 1) * width + (x + 1)] === 255
        ) {
          mask[idx] = 255;
        } else {
          mask[idx] = 0;
        }
      }
    }
  }
}
