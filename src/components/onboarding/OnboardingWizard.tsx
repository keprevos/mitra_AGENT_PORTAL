import React, { useState } from 'react';
import { Check, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { OnboardingProvider, useOnboarding } from './OnboardingContext';
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
  initialData?: any;
  requestId?: number;
}

function OnboardingWizardContent({ onClose, initialData, requestId }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { data, updatePersonalInfo, updateActivity, updateShareholders, updateDocuments } = useOnboarding();

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = (stepData: any) => {
    switch (currentStep) {
      case 0:
        updatePersonalInfo(stepData);
        break;
      case 1:
        updateActivity(stepData);
        break;
      case 2:
        updateShareholders(stepData);
        break;
      case 3:
        updateDocuments(stepData);
        break;
    }
    
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
    console.log('Submitting data:', requestId ? { ...data, id: requestId } : data);
    onClose();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              {requestId ? 'Modifier la demande' : 'Nouvelle demande'}
            </h1>
            <p className="text-indigo-100 text-sm">
              Complétez les informations suivantes pour créer votre dossier
            </p>

            {/* Progress Steps */}
            <div className="mt-8">
              <nav aria-label="Progress" className="w-full">
                <div className="relative">
                  {/* Progress Bar Background */}
                  <div className="absolute top-5 left-0 w-full h-1 bg-white/20 rounded-full" />
                  
                  {/* Active Progress Bar */}
                  <div 
                    className="absolute top-5 left-0 h-1 bg-white rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                  />

                  {/* Steps */}
                  <ol className="relative flex justify-between">
                    {steps.map((step, index) => {
                      const isCompleted = index < currentStep;
                      const isCurrent = index === currentStep;
                      
                      return (
                        <li key={step.id} className="relative flex flex-col items-center">
                          {/* Step Circle */}
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center
                            transition-all duration-300
                            ${isCompleted ? 'bg-white' : 
                              isCurrent ? 'bg-white/90 ring-4 ring-white/30' : 
                              'bg-white/20'}
                          `}>
                            {isCompleted ? (
                              <Check className={`w-6 h-6 text-indigo-600`} />
                            ) : (
                              <span className={`
                                text-sm font-semibold
                                ${isCurrent ? 'text-indigo-600' : 'text-white'}
                              `}>
                                {index + 1}
                              </span>
                            )}
                          </div>

                          {/* Step Label */}
                          <span className={`
                            absolute -bottom-6 text-xs font-medium text-center w-24
                            ${isCompleted || isCurrent ? 'text-white' : 'text-indigo-100/70'}
                          `}>
                            {step.name}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </nav>
            </div>
          </div>

          {/* Current Step Form */}
          <div className="px-8 py-10">
            <div className="max-w-3xl mx-auto">
              <CurrentStepComponent
                data={data}
                onNext={handleNext}
                onBack={handleBack}
                onSubmit={handleSubmit}
                isFirstStep={currentStep === 0}
                isLastStep={currentStep === steps.length - 1}
              />
            </div>
          </div>
        </div>

        {/* Navigation Hint */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Tab</kbd>
            <span>pour naviguer</span>
            {currentStep < steps.length - 1 && (
              <>
                <span>•</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd>
                <span>pour continuer</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OnboardingWizard(props: OnboardingWizardProps) {
  return (
    <OnboardingProvider initialData={props.initialData}>
      <OnboardingWizardContent {...props} />
    </OnboardingProvider>
  );
}