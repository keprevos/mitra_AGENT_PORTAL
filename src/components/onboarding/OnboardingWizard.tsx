import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { OnboardingProvider, useOnboarding } from './OnboardingContext';
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

function OnboardingWizardContent() {
  const { 
    state: { currentStep, isSubmitting },
    nextStep,
    prevStep,
    saveProgress
  } = useOnboarding();

  const navigate = useNavigate();

  useEffect(() => {
    // Auto-save progress when changing steps
    if (currentStep > 0) {
      saveProgress();
    }
  }, [currentStep]);

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

        {/* Current Step */}
        <div className="bg-white shadow rounded-lg p-8">
          <CurrentStepComponent />
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={currentStep === 0 ? () => navigate(-1) : prevStep}
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
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function OnboardingWizard() {
  return (
    <OnboardingProvider>
      <OnboardingWizardContent />
    </OnboardingProvider>
  );
}