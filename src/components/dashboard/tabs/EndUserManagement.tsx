import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { EndUserRequest } from '../../../types/auth';
import { OnboardingWizard } from '../../onboarding/OnboardingWizard';
import { RequestList } from './RequestList';
import { RequestDetails } from './RequestDetails';
import { RequestEdit } from './RequestEdit';
import { ValidationFeedbackDisplay } from '../ValidationFeedbackDisplay';
import { requestService } from '../../../api/services/request.service';
import { ValidationFeedback } from '../../../types/onboarding';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

export function EndUserManagement() {
  const { user } = useAuth();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<EndUserRequest | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [validationFeedback, setValidationFeedback] = useState<ValidationFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedRequest?.id) {
      fetchValidationFeedback(selectedRequest.id.toString());
    }
  }, [selectedRequest]);

  const fetchValidationFeedback = async (requestId: string) => {
    try {
      setIsLoading(true);
      const feedback = await requestService.getValidationFeedback(requestId);
      setValidationFeedback(feedback);
    } catch (error) {
      console.error('Failed to fetch validation feedback:', error);
      toast.error('Failed to load validation feedback');
    } finally {
      setIsLoading(false);
    }
  };

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
    setValidationFeedback([]);
  };

  const handleSave = () => {
    setIsEditing(false);
    setIsViewing(true);
  };

  const canCreateRequest = user?.role === 'agent_staff';

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
      <div className="space-y-6">
        <RequestEdit
          request={selectedRequest}
          onBack={() => setIsEditing(false)}
          onSave={handleSave}
        />
        {!isLoading && validationFeedback.length > 0 && (
          <ValidationFeedbackDisplay 
            feedback={validationFeedback}
            isAgentView={user?.role === 'agent_staff'}
          />
        )}
      </div>
    );
  }

  if (isViewing && selectedRequest) {
    return (
      <div className="space-y-6">
        <RequestDetails
          request={selectedRequest}
          onBack={handleBack}
          onEdit={() => handleEditRequest(selectedRequest)}
        />
        {!isLoading && validationFeedback.length > 0 && (
          <ValidationFeedbackDisplay 
            feedback={validationFeedback}
            isAgentView={user?.role === 'agent_staff'}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {canCreateRequest && (
        <div className="flex justify-end">
          <button
            onClick={handleNewRequest}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Request
          </button>
        </div>
      )}

      <RequestList
        onEdit={handleEditRequest}
        onView={handleViewRequest}
      />
    </div>
  );
}