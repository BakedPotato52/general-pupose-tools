// Passport Photo Specifications
export const PASSPORT_SPECS = {
  // Standard 35mm x 45mm passport photo
  WIDTH_MM: 35,
  HEIGHT_MM: 45,
  DPI: 300,
  // Calculated pixel dimensions at 300 DPI
  // 35mm = 1.378 inches = 413.4 pixels, 45mm = 1.772 inches = 531.6 pixels
  WIDTH_PX: 413,
  HEIGHT_PX: 531,
} as const;

// A4 Paper Specifications
export const A4_SPECS = {
  WIDTH_MM: 210,
  HEIGHT_MM: 297,
  DPI: 300,
  // Calculated pixel dimensions at 300 DPI
  // 210mm = 8.268 inches = 2480.4 pixels
  // 297mm = 11.693 inches = 3507.9 pixels
  WIDTH_PX: 2480,
  HEIGHT_PX: 3508,
} as const;

// Layout Configuration for Multiple Copies
export const LAYOUT_CONFIGS = {
  '4-up': {
    name: '4 Copies (2x2)',
    rows: 2,
    cols: 2,
    totalPhotos: 4,
    marginTop: 50,
    marginBottom: 50,
    marginLeft: 50,
    marginRight: 50,
    gapX: 30,
    gapY: 30,
  },
  '6-up': {
    name: '6 Copies (2x3)',
    rows: 3,
    cols: 2,
    totalPhotos: 6,
    marginTop: 40,
    marginBottom: 40,
    marginLeft: 40,
    marginRight: 40,
    gapX: 25,
    gapY: 25,
  },
  '8-up': {
    name: '8 Copies (2x4)',
    rows: 4,
    cols: 2,
    totalPhotos: 8,
    marginTop: 40,
    marginBottom: 40,
    marginLeft: 40,
    marginRight: 40,
    gapX: 20,
    gapY: 20,
  },
  '12-up': {
    name: '12 Copies (3x4)',
    rows: 4,
    cols: 3,
    totalPhotos: 12,
    marginTop: 35,
    marginBottom: 35,
    marginLeft: 35,
    marginRight: 35,
    gapX: 15,
    gapY: 15,
  },
} as const;

export type LayoutType = keyof typeof LAYOUT_CONFIGS;

// Image Processing Constants
export const IMAGE_PROCESSING = {
  MAX_UPLOAD_SIZE_MB: 10,
  MAX_PREVIEW_WIDTH: 2000,
  MAX_PREVIEW_HEIGHT: 2000,
  COMPRESSION_QUALITY: 0.95,
} as const;

// UI Step Names
export const STEPS = {
  UPLOAD: 'upload',
  EDIT: 'edit',
  REMOVE_BG: 'remove-bg',
  LAYOUT: 'layout',
  EXPORT: 'export',
} as const;

export type StepType = typeof STEPS[keyof typeof STEPS];
