import React from 'react';
import { OnboardingProvider } from '../../contexts/OnboardingContext';
import { OnboardingWizardContent } from './OnboardingWizardContent';
import { OnboardingRequest } from '../../types/onboarding';

interface OnboardingWizardProps {
  onClose: () => void;
  initialData?: Partial<OnboardingRequest>;
  requestId?: string;
}

export function OnboardingWizard({ onClose, initialData, requestId }: OnboardingWizardProps) {
  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto">
      <OnboardingProvider initialData={initialData} requestId={requestId}>
        <OnboardingWizardContent onClose={onClose} />
      </OnboardingProvider>
    </div>
  );
}