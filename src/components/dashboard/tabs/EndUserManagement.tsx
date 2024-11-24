import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { EndUserRequest } from '../../../types/auth';
import { OnboardingWizard } from '../../onboarding/OnboardingWizard';
import { RequestList } from './RequestList';
import { RequestDetails } from './RequestDetails';
import { RequestEdit } from './RequestEdit';

export function EndUserManagement() {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<EndUserRequest | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const handleNewRequest = () => {
    setSelectedRequest(null);
    setIsEditing(false);
    setShowWizard(true);
  };

  const handleEditRequest = (request: EndUserRequest) => {
    setSelectedRequest(request);
    setIsEditing(true);
    setIsViewing(false);
    setShowWizard(false);
  };

  const handleViewRequest = (request: EndUserRequest) => {
    setSelectedRequest(request);
    setIsViewing(true);
    setIsEditing(false);
    setShowWizard(false);
  };

  const handleBack = () => {
    setSelectedRequest(null);
    setIsViewing(false);
    setIsEditing(false);
    setShowWizard(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    setIsViewing(true);
  };

  if (showWizard) {
    return (
      <OnboardingWizard 
        onClose={handleBack}
        initialData={selectedRequest?.data}
        requestId={selectedRequest?.id?.toString()}
      />
    );
  }

  if (isEditing && selectedRequest) {
    return (
      <RequestEdit
        request={selectedRequest}
        onBack={() => setIsEditing(false)}
        onSave={handleSave}
      />
    );
  }

  if (isViewing && selectedRequest) {
    return (
      <RequestDetails
        request={selectedRequest}
        onBack={handleBack}
        onEdit={() => handleEditRequest(selectedRequest)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleNewRequest}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Request
        </button>
      </div>

      <RequestList
        onEdit={handleEditRequest}
        onView={handleViewRequest}
      />
    </div>
  );
}