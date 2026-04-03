'use client';

import { FileUpload } from '@/components/FileUpload';
import { ImagePreview } from '@/components/ImagePreview';
import { EditingToolbar } from '@/components/EditingToolbar';
import { BackgroundRemovalButton } from '@/components/BackgroundRemovalButton';
import { LayoutSelector } from '@/components/LayoutSelector';
import { LayoutPreview } from '@/components/LayoutPreview';
import { ExportButton } from '@/components/ExportButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { STEPS } from '@/lib/constants';
import { ChevronLeft, RotateCcw } from 'lucide-react';

export default function Home() {
  const {
    currentStep,
    goToPreviousStep,
    resetState,
    error,
    setError,
  } = useStore();

  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.UPLOAD:
        return (
          <div className="space-y-8">
            <FileUpload />
          </div>
        );

      case STEPS.EDIT:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ImagePreview title="Original Image" />
            </div>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Editing Tools</h3>
              <EditingToolbar />
              <div className="space-y-3">
                <p className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded p-3">
                  When ready, click the "Remove Background" button to proceed to the next step.
                </p>

                <BackgroundRemovalButton/>
                <Button
                  onClick={goToPreviousStep}
                  variant="outline"
                  className="w-full"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Upload
                </Button>
              </div>
            </div>
          </div>
        );

      case STEPS.REMOVE_BG:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ImagePreview title="Edited Image" />
            </div>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Background Removal</h3>
              <BackgroundRemovalButton />
              <Button
                onClick={goToPreviousStep}
                variant="outline"
                className="w-full"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Editing
              </Button>
            </div>
          </div>
        );

      case STEPS.LAYOUT:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <LayoutSelector />
            </div>
            <div className="space-y-6">
              <LayoutPreview />
              <Button
                onClick={goToPreviousStep}
                variant="outline"
                className="w-full"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Editing
              </Button>
            </div>
          </div>
        );

      case STEPS.EXPORT:
        return (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
              <h2 className="text-3xl font-bold text-green-900 mb-4">
                Ready to Export
              </h2>
              <p className="text-green-700 mb-6">
                Your passport photos are ready! Download the PDF file below and
                print it on A4 paper using your preferred printer.
              </p>
              <ExportButton />
            </div>

            <Button
              onClick={goToPreviousStep}
              variant="outline"
              className="w-full"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Layout
            </Button>
          </div>
        );

      default:
        return <FileUpload />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Progress Indicator */}
      <ProgressIndicator />

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <p className="text-red-800 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Passport Photo Generator
            </h1>
            <p className="text-gray-600 mt-2">
              Create professional passport photos with automatic background removal
            </p>
          </div>
          {currentStep !== STEPS.UPLOAD && (
            <Button
              onClick={resetState}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          )}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {renderStepContent()}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            All image processing happens locally on your device. No images are sent to external servers.
          </p>
        </div>
      </div>
    </main>
  );
}
