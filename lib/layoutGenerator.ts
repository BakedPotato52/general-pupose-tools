import { A4_SPECS, LAYOUT_CONFIGS, LayoutType } from './constants';
import { createBlankCanvas, drawImageOnCanvas } from './imageProcessing';

export interface LayoutDimensions {
  photoWidth: number;
  photoHeight: number;
  gridRows: number;
  gridCols: number;
  positions: Array<{ x: number; y: number }>;
}

/**
 * Calculate layout dimensions for a given layout type
 */
export function calculateLayoutDimensions(
  layoutType: LayoutType,
  duplicateCount: number
): LayoutDimensions {
  const config = LAYOUT_CONFIGS[layoutType];

  const availableWidth = A4_SPECS.WIDTH_PX - config.marginLeft - config.marginRight;
  const availableHeight = A4_SPECS.HEIGHT_PX - config.marginTop - config.marginBottom;

  const photoWidth = Math.floor(
    (availableWidth - (config.cols - 1) * config.gapX) / config.cols
  );
  const photoHeight = Math.floor(
    (availableHeight - (config.rows - 1) * config.gapY) / config.rows
  );

  const positions: Array<{ x: number; y: number }> = [];

  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
      const x = config.marginLeft + col * (photoWidth + config.gapX);
      const y = config.marginTop + row * (photoHeight + config.gapY);
      positions.push({ x, y });

      if (positions.length >= duplicateCount) {
        break;
      }
    }
    if (positions.length >= duplicateCount) {
      break;
    }
  }

  return {
    photoWidth,
    photoHeight,
    gridRows: config.rows,
    gridCols: config.cols,
    positions,
  };
}

/**
 * Generate a layout canvas with duplicated photos arranged for A4 printing
 */
export function generateLayoutCanvas(
  photoCanvas: HTMLCanvasElement,
  layoutType: LayoutType,
  duplicateCount: number
): HTMLCanvasElement {
  const dimensions = calculateLayoutDimensions(layoutType, duplicateCount);

  // Create A4-sized canvas
  const layoutCanvas = createBlankCanvas(
    A4_SPECS.WIDTH_PX,
    A4_SPECS.HEIGHT_PX,
    '#ffffff'
  );

  // Draw duplicate photos
  for (let i = 0; i < duplicateCount && i < dimensions.positions.length; i++) {
    const position = dimensions.positions[i];
    drawImageOnCanvas(
      layoutCanvas,
      photoCanvas,
      position.x,
      position.y,
      dimensions.photoWidth,
      dimensions.photoHeight
    );
  }

  return layoutCanvas;
}

/**
 * Get available layout options with their descriptions
 */
export function getAvailableLayouts(): Array<{
  id: LayoutType;
  name: string;
  rows: number;
  cols: number;
  description: string;
}> {
  return Object.entries(LAYOUT_CONFIGS).map(([key, config]) => ({
    id: key as LayoutType,
    name: config.name,
    rows: config.rows,
    cols: config.cols,
    description: `${config.rows}x${config.cols} grid layout`,
  }));
}

/**
 * Get default layout configuration
 */
export function getDefaultLayout(): LayoutType {
  return '4-up';
}

/**
 * Validate duplicate count for a layout
 */
export function validateDuplicateCount(
  layoutType: LayoutType,
  count: number
): { valid: boolean; max: number } {
  const config = LAYOUT_CONFIGS[layoutType];
  const max = config.totalPhotos;

  return {
    valid: count > 0 && count <= max,
    max,
  };
}

/**
 * Calculate optimal layout based on duplicate count
 */
export function getOptimalLayout(duplicateCount: number): LayoutType {
  const layouts = Object.entries(LAYOUT_CONFIGS);

  // Find layout that fits the duplicate count with minimal waste
  for (const [key, config] of layouts) {
    if (duplicateCount <= config.totalPhotos) {
      return key as LayoutType;
    }
  }

  // If more than max, return largest layout
  return '12-up';
}

/**
 * Calculate spacing information for layout preview
 */
export function getLayoutSpacingInfo(layoutType: LayoutType): {
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  gapX: number;
  gapY: number;
} {
  const config = LAYOUT_CONFIGS[layoutType];
  return {
    marginTop: config.marginTop,
    marginRight: config.marginRight,
    marginBottom: config.marginBottom,
    marginLeft: config.marginLeft,
    gapX: config.gapX,
    gapY: config.gapY,
  };
}
