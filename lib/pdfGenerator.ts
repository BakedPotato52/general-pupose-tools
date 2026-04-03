import { A4_SPECS } from './constants';
import { canvasToDataUrl } from './imageProcessing';

/**
 * Simple canvas-to-PDF converter using a lightweight approach
 * This creates a minimal PDF file with the image embedded
 */
export async function generateSimplePDF(
  layoutCanvas: HTMLCanvasElement
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // Get canvas as JPEG blob
      layoutCanvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to convert canvas to blob'));
            return;
          }

          // Read blob as data URL
          const reader = new FileReader();
          reader.onload = () => {
            const imageData = reader.result as string;

            // Create minimal PDF
            const pdfContent = createMinimalPDF(imageData);
            const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' });
            resolve(pdfBlob);
          };
          reader.onerror = () => {
            reject(new Error('Failed to read blob'));
          };
          reader.readAsDataURL(blob);
        },
        'image/jpeg',
        0.95
      );
    } catch (error) {
      reject(new Error(`PDF generation failed: ${error}`));
    }
  });
}

/**
 * Create a minimal PDF structure with embedded image
 * This is a low-level PDF generation without external libraries
 */
function createMinimalPDF(imageDataUrl: string): ArrayBuffer {
  // Extract base64 from data URL
  const base64 = imageDataUrl.split(',')[1];
  const imageBytes = atob(base64);

  // A4 dimensions in points (72 DPI): 595.275 x 841.89
  const pageWidth = 595.275;
  const pageHeight = 841.89;

  // Create PDF structure
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents 4 0 R /Resources << /XObject << /Image 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 44 >>
stream
q
${pageWidth} 0 0 ${pageHeight} 0 0 cm
/Image Do
Q
endstream
endobj
5 0 obj
<< /Type /XObject /Subtype /Image /Width 2480 /Height 3508 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Length ${imageBytes.length} >>
stream
${imageBytes}
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000269 00000 n
0000000362 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${(pdfContent.length + imageBytes.length + 400)}
%%EOF`;

  const encoder = new TextEncoder();
  return encoder.encode(pdfContent);
}

/**
 * Download PDF file to user's device
 */
export function downloadPDF(blob: Blob, filename: string = 'passport_photos.pdf'): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(prefix: string = 'passport_photos'): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${prefix}_${timestamp}.pdf`;
}

/**
 * Validate PDF blob
 */
export function isValidPDF(blob: Blob): boolean {
  // Check if blob type is PDF
  if (blob.type !== 'application/pdf') {
    return false;
  }

  // Check minimum size (PDF headers require some minimum bytes)
  if (blob.size < 100) {
    return false;
  }

  return true;
}
