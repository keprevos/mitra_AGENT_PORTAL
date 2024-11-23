import React from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { BusinessInfoStep } from './steps/BusinessInfoStep';
import { ShareholdersStep } from './steps/ShareholdersStep';
import { DocumentsStep } from './steps/DocumentsStep';
import { ReviewStep } from './steps/ReviewStep';

const steps = [
  { id: 'personal', title: 'Personal Information', component: PersonalInfoStep },
  { id: 'business', title: 'Business Information', component: BusinessInfoStep },
  { id: 'shareholders', title: 'Shareholders', component: ShareholdersStep },
  { id: 'documents', title: 'Documents', component: DocumentsStep },
  { id: 'review', title: 'Review', component: ReviewStep }
];

interface OnboardingWizardContentProps {
  onClose: () => void;
}

export function OnboardingWizardContent({ onClose }: OnboardingWizardContentProps) {
  const { 
    state: { currentStep, isSubmitting, isLoading, error, lastSaved },
    nextStep,
    prevStep,
    resetError
  } = useOnboarding();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Loading your request...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            <p>{error}</p>
            <button
              onClick={resetError}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between mb-12">
            {steps.map((step, index) => (
              <li key={step.id} className="relative">
                <div className="flex items-center">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${index < currentStep ? 'bg-indigo-600' :
                        index === currentStep ? 'bg-indigo-600' : 'bg-gray-300'}
                    `}
                  >
                    {index < currentStep ? (
                      <span className="text-white">✓</span>
                    ) : (
                      <span className={`text-${index === currentStep ? 'white' : 'gray-500'}`}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div
                    className={`
                      ml-4 text-sm font-medium
                      ${index <= currentStep ? 'text-indigo-600' : 'text-gray-500'}
                    `}
                  >
                    {step.title}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        {/* Last Saved Indicator */}
        {lastSaved && (
          <div className="mb-4 text-sm text-gray-500 text-right">
            Last saved: {new Date(lastSaved).toLocaleTimeString()}
          </div>
        )}

        {/* Current Step */}
        <div className="bg-white shadow rounded-lg p-8">
          <CurrentStepComponent />
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={currentStep === 0 ? onClose : prevStep}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 0 ? 'Cancel' : 'Previous'}
          </button>

          {currentStep < steps.length - 1 && (
            <button
              type="button"
              onClick={nextStep}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}