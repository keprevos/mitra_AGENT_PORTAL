import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  PersonalInfo, 
  BusinessInfo, 
  Shareholder, 
  Documents,
  RequestStatus
} from '../types/onboarding';
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
  validationErrors: Record<string, string[]>;
}

interface OnboardingContextType {
  state: OnboardingState;
  updatePersonalInfo: (info: PersonalInfo) => void;
  updateBusinessInfo: (info: BusinessInfo) => void;
  updateShareholders: (shareholders: Shareholder[]) => void;
  updateDocuments: (documents: Documents) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  submitRequest: () => Promise<void>;
  saveProgress: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>({
    shareholders: [],
    documents: {},
    currentStep: 0,
    status: RequestStatus.DRAFT,
    isSubmitting: false,
    validationErrors: {}
  });

  const updatePersonalInfo = (info: PersonalInfo) => {
    setState(prev => ({ ...prev, personalInfo: info }));
  };

  const updateBusinessInfo = (info: BusinessInfo) => {
    setState(prev => ({ ...prev, businessInfo: info }));
  };

  const updateShareholders = (shareholders: Shareholder[]) => {
    setState(prev => ({ ...prev, shareholders }));
  };

  const updateDocuments = (documents: Documents) => {
    setState(prev => ({ ...prev, documents }));
  };

  const nextStep = () => {
    setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const prevStep = () => {
    setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
  };

  const goToStep = (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const saveProgress = async () => {
    try {
      setState(prev => ({ ...prev, isSubmitting: true }));
      
      const data = {
        personalInfo: state.personalInfo,
        businessInfo: state.businessInfo,
        shareholders: state.shareholders,
        documents: state.documents
      };

      if (state.requestId) {
        await onboardingService.updateRequest(state.requestId, data);
      } else {
        const response = await onboardingService.createRequest(data);
        setState(prev => ({ ...prev, requestId: response.id }));
      }

      toast.success('Progress saved successfully');
    } catch (error) {
      console.error('Failed to save progress:', error);
      toast.error('Failed to save progress');
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const submitRequest = async () => {
    try {
      setState(prev => ({ ...prev, isSubmitting: true }));
      
      if (!state.requestId) {
        throw new Error('No request ID found');
      }

      await onboardingService.submitForReview(state.requestId);
      setState(prev => ({ ...prev, status: RequestStatus.SUBMITTED }));
      toast.success('Request submitted successfully');
    } catch (error) {
      console.error('Failed to submit request:', error);
      toast.error('Failed to submit request');
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
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
        saveProgress
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