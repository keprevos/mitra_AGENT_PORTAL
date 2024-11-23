import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { OnboardingWizard } from '../../onboarding/OnboardingWizard';
import { RequestList } from './RequestList';

export function EndUserManagement() {
  const [showWizard, setShowWizard] = useState(false);

  if (showWizard) {
    return <OnboardingWizard onClose={() => setShowWizard(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowWizard(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Request
        </button>
      </div>

      <RequestList />
    </div>
  );
}