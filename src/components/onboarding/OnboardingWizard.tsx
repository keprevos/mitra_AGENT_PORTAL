import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { OnboardingProvider } from './OnboardingContext';
import { PersonalInfo } from './steps/PersonalInfo';
import { BusinessActivity } from './steps/BusinessActivity';
import { Shareholders } from './steps/Shareholders';
import { Documents } from './steps/Documents';
import { Review } from './steps/Review';

const steps = [
  { id: 'personal', name: 'Vos Informations', component: PersonalInfo },
  { id: 'activity', name: 'Votre Activité', component: BusinessActivity },
  { id: 'shareholders', name: 'Actionnaires', component: Shareholders },
  { id: 'documents', name: 'Pièces Justificatives', component: Documents },
  { id: 'review', name: 'Confirmation', component: Review },
] as const;

interface OnboardingWizardProps {
  onClose: () => void;
}

export function OnboardingWizard({ onClose }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    // Here you would typically submit the data to your backend
    onClose();
  };

  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">New End-User Onboarding</h1>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Progress Steps */}
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between mb-12">
              {steps.map((step, index) => (
                <li key={step.id} className="relative">
                  <div className="flex items-center">
                    <div
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        ${index < currentStep
                          ? 'bg-indigo-600'
                          : index === currentStep
                          ? 'border-2 border-indigo-600 bg-white'
                          : 'border-2 border-gray-300 bg-white'
                        }
                      `}
                    >
                      {index < currentStep ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <span
                          className={`text-sm font-medium ${
                            index === currentStep ? 'text-indigo-600' : 'text-gray-500'
                          }`}
                        >
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <div
                      className={`
                        hidden sm:block text-sm font-medium ml-2
                        ${index <= currentStep ? 'text-indigo-600' : 'text-gray-500'}
                      `}
                    >
                      {step.name}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden sm:block absolute top-4 left-full w-full">
                      <div
                        className={`h-0.5 ${
                          index < currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Current Step Form */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-8 py-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {steps[currentStep].name}
              </h2>
              <CurrentStepComponent
                onNext={handleNext}
                onBack={handleBack}
                onSubmit={handleSubmit}
                isFirstStep={currentStep === 0}
                isLastStep={currentStep === steps.length - 1}
              />
            </div>
          </div>
        </div>
      </div>
    </OnboardingProvider>
  );
}