'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { useStore } from '@/lib/store';
import { generateSimplePDF, downloadPDF, generateFilename } from '@/lib/pdfGenerator';
import { Download, AlertCircle, CheckCircle } from 'lucide-react';

export function ExportButton() {
  const { layoutCanvas } = useStore();
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = async () => {
    if (!layoutCanvas) return;

    try {
      setExporting(true);
      setExportError(null);
      setExportSuccess(false);

      // Generate PDF
      const pdfBlob = await generateSimplePDF(layoutCanvas);

      // Download PDF
      const filename = generateFilename('passport_photos');
      downloadPDF(pdfBlob, filename);

      setExportSuccess(true);
      setExporting(false);

      // Reset success message after 3 seconds
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to export PDF';
      setExportError(message);
      setExporting(false);
      console.error('Export error:', error);
    }
  };

  if (!layoutCanvas) {
    return null;
  }

  return (
    <div className="space-y-4">
      {exportError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900">
              Export failed
            </p>
            <p className="text-sm text-red-700 mt-1">{exportError}</p>
          </div>
        </div>
      )}

      {exportSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-900">
              PDF downloaded successfully!
            </p>
            <p className="text-sm text-green-700 mt-1">
              Ready to print on A4 paper
            </p>
          </div>
        </div>
      )}

      <Button
        onClick={handleExport}
        disabled={exporting}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold h-12"
      >
        {exporting ? (
          <>
            <Spinner className="w-4 h-4 mr-2" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </>
        )}
      </Button>

      <div className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded p-4 space-y-2">
        <p className="font-semibold text-blue-900">Print Instructions:</p>
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li>Use A4 paper (210 × 297 mm)</li>
          <li>Set printer to 100% scaling (no fitting/shrinking)</li>
          <li>Ensure margins are set to 0 or minimal</li>
          <li>Use best quality/highest resolution setting</li>
          <li>Print in color for best results</li>
        </ul>
      </div>
    </div>
  );
}
