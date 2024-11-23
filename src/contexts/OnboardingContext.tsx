import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { PersonalInfo, BusinessInfo, Shareholder, Documents, RequestStatus } from '../types/onboarding';
import { onboardingService } from '../api/services/onboarding.service';
import toast from 'react-hot-toast';

interface OnboardingState {
  personalInfo?: PersonalInfo;
  businessInfo?: BusinessInfo;
  shareholders: Shareholder[];
  documents: Documents;
  currentStep: number;
  status: RequestStatus;
  requestId?: string;
  isSubmitting: boolean;
  isLoading: boolean;
  error: string | null;
  lastSaved?: Date;
}

interface OnboardingContextType {
  state: OnboardingState;
  updatePersonalInfo: (info: PersonalInfo) => Promise<void>;
  updateBusinessInfo: (info: BusinessInfo) => Promise<void>;
  updateShareholders: (shareholders: Shareholder[]) => Promise<void>;
  updateDocuments: (documents: Documents) => Promise<void>;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  goToStep: (step: number) => void;
  submitRequest: () => Promise<void>;
  resetError: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const INITIAL_STATE: OnboardingState = {
  shareholders: [],
  documents: {
    proofOfResidence: [],
    identityDocument: [],
    signature: [],
    bankDetails: []
  },
  currentStep: 0,
  status: RequestStatus.DRAFT,
  isSubmitting: false,
  isLoading: false,
  error: null
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);

  const saveProgress = async (data: Partial<OnboardingState>) => {
    try {
      setState(prev => ({ ...prev, isSubmitting: true }));
      
      const requestData = {
        ...data,
        status: RequestStatus.DRAFT
      };

      if (state.requestId) {
        await onboardingService.updateRequest(state.requestId, requestData);
      } else {
        const response = await onboardingService.createRequest(requestData);
        setState(prev => ({ ...prev, requestId: response.id }));
      }

      setState(prev => ({ 
        ...prev, 
        ...data,
        lastSaved: new Date(),
        error: null 
      }));

      return true;
    } catch (error) {
      console.error('Failed to save progress:', error);
      toast.error('Failed to save progress');
      return false;
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const updatePersonalInfo = async (info: PersonalInfo) => {
    await saveProgress({ personalInfo: info });
  };

  const updateBusinessInfo = async (info: BusinessInfo) => {
    await saveProgress({ businessInfo: info });
  };

  const updateShareholders = async (shareholders: Shareholder[]) => {
    await saveProgress({ shareholders });
  };

  const updateDocuments = async (documents: Documents) => {
    await saveProgress({ documents });
  };

  const nextStep = async () => {
    setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const prevStep = () => {
    setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
  };

  const goToStep = (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const submitRequest = async () => {
    if (!state.requestId) {
      toast.error('No request ID found');
      return;
    }

    try {
      setState(prev => ({ ...prev, isSubmitting: true }));
      await onboardingService.submitForReview(state.requestId);
      setState(prev => ({ 
        ...prev, 
        status: RequestStatus.SUBMITTED,
        error: null
      }));
      toast.success('Request submitted successfully');
    } catch (error) {
      console.error('Failed to submit request:', error);
      toast.error('Failed to submit request');
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const resetError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <OnboardingContext.Provider
      value={{
        state,
        updatePersonalInfo,
        updateBusinessInfo,
        updateShareholders,
        updateDocuments,
        nextStep,
        prevStep,
        goToStep,
        submitRequest,
        resetError
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}