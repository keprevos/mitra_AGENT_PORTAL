import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  PersonalInfo, 
  BusinessInfo, 
  Shareholder, 
  Documents,
  RequestStatus,
  OnboardingRequest
} from '../types/onboarding';
import { onboardingService } from '../api/services/onboarding.service';
import toast from 'react-hot-toast';

interface OnboardingState {
  personalInfo?: PersonalInfo;
  businessInfo?: BusinessInfo;
  shareholders: Shareholder[];
  documents: {
    proofOfResidence: string[];
    identityDocument: string[];
    signature: string[];
    bankDetails: string[];
  };
  currentStep: number;
  status: RequestStatus;
  requestId?: string;
  isSubmitting: boolean;
  validationErrors: Record<string, string[]>;
  lastSaved?: Date;
}

interface OnboardingContextType {
  state: OnboardingState;
  updatePersonalInfo: (info: PersonalInfo) => void;
  updateBusinessInfo: (info: BusinessInfo) => void;
  updateShareholders: (shareholders: Shareholder[]) => void;
  updateDocuments: (documents: any) => void;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  goToStep: (step: number) => void;
  submitRequest: () => Promise<void>;
  saveProgress: () => Promise<void>;
  isStepValid: (step: number) => boolean;
  getStepErrors: (step: number) => string[];
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
  initialData?: Partial<OnboardingRequest>;
  requestId?: string;
}

const TOTAL_STEPS = 5;

export function OnboardingProvider({ children, initialData, requestId }: OnboardingProviderProps) {
  const [state, setState] = useState<OnboardingState>({
    personalInfo: initialData?.personalInfo,
    businessInfo: initialData?.businessInfo,
    shareholders: initialData?.shareholders || [],
    documents: initialData?.documents || {
      proofOfResidence: [],
      identityDocument: [],
      signature: [],
      bankDetails: []
    },
    currentStep: 0,
    status: initialData?.status || RequestStatus.DRAFT,
    requestId: requestId || initialData?.id,
    isSubmitting: false,
    validationErrors: {},
    lastSaved: initialData ? new Date() : undefined
  });

  const validateStep = useCallback((step: number): string[] => {
    const errors: string[] = [];

    switch (step) {
      case 0: // Personal Info
        if (!state.personalInfo) {
          errors.push('Personal information is required');
        } else {
          // Add specific validations for personal info fields
          if (!state.personalInfo.firstName) errors.push('First name is required');
          if (!state.personalInfo.surname) errors.push('Last name is required');
          if (!state.personalInfo.email) errors.push('Email is required');
        }
        break;

      case 1: // Business Info
        if (!state.businessInfo) {
          errors.push('Business information is required');
        } else {
          // Add specific validations for business info fields
          if (!state.businessInfo.companyName) errors.push('Company name is required');
          if (!state.businessInfo.siret) errors.push('SIRET is required');
        }
        break;

      case 2: // Shareholders
        if (!state.shareholders.length) {
          errors.push('At least one shareholder is required');
        } else {
          const totalPercentage = state.shareholders.reduce(
            (sum, s) => sum + s.ownershipPercentage, 
            0
          );
          if (Math.abs(totalPercentage - 100) > 0.01) {
            errors.push('Total ownership percentage must equal 100%');
          }
        }
        break;

      case 3: // Documents
        const requiredDocs = ['proofOfResidence', 'identityDocument', 'signature', 'bankDetails'];
        requiredDocs.forEach(docType => {
          if (!state.documents[docType]?.length) {
            errors.push(`${docType.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
          }
        });
        break;

      case 4: // Review
        // Validate all previous steps
        const allErrors = [
          ...validateStep(0),
          ...validateStep(1),
          ...validateStep(2),
          ...validateStep(3)
        ];
        errors.push(...allErrors);
        break;
    }

    return errors;
  }, [state]);

  const isStepValid = useCallback((step: number): boolean => {
    return validateStep(step).length === 0;
  }, [validateStep]);

  const getStepErrors = useCallback((step: number): string[] => {
    return validateStep(step);
  }, [validateStep]);

  const updatePersonalInfo = useCallback((info: PersonalInfo) => {
    setState(prev => ({ ...prev, personalInfo: info }));
  }, []);

  const updateBusinessInfo = useCallback((info: BusinessInfo) => {
    setState(prev => ({ ...prev, businessInfo: info }));
  }, []);

  const updateShareholders = useCallback((shareholders: Shareholder[]) => {
    setState(prev => ({ ...prev, shareholders }));
  }, []);

  const updateDocuments = useCallback((documents: any) => {
    setState(prev => ({ ...prev, documents }));
  }, []);

  const saveProgress = useCallback(async () => {
    if (state.status !== RequestStatus.DRAFT) {
      return;
    }

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
        setState(prev => ({ 
          ...prev, 
          requestId: response.id,
          lastSaved: new Date()
        }));
      }

      toast.success('Progress saved successfully');
    } catch (error) {
      console.error('Failed to save progress:', error);
      toast.error('Failed to save progress');
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [state]);

  const nextStep = useCallback(async () => {
    const errors = validateStep(state.currentStep);
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    if (state.currentStep < TOTAL_STEPS - 1) {
      // Auto-save when moving to next step
      if (state.status === RequestStatus.DRAFT) {
        await saveProgress();
      }
      setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  }, [state.currentStep, state.status, validateStep, saveProgress]);

  const prevStep = useCallback(() => {
    if (state.currentStep > 0) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  }, [state.currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < TOTAL_STEPS) {
      setState(prev => ({ ...prev, currentStep: step }));
    }
  }, []);

  const submitRequest = useCallback(async () => {
    const errors = validateStep(TOTAL_STEPS - 1);
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    try {
      setState(prev => ({ ...prev, isSubmitting: true }));
      
      if (!state.requestId) {
        throw new Error('No request ID found');
      }

      await onboardingService.submitForReview(state.requestId);
      setState(prev => ({ 
        ...prev, 
        status: RequestStatus.SUBMITTED,
        lastSaved: new Date()
      }));
      toast.success('Request submitted successfully');
    } catch (error) {
      console.error('Failed to submit request:', error);
      toast.error('Failed to submit request');
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [state.requestId, validateStep]);

  const value = {
    state,
    updatePersonalInfo,
    updateBusinessInfo,
    updateShareholders,
    updateDocuments,
    nextStep,
    prevStep,
    goToStep,
    submitRequest,
    saveProgress,
    isStepValid,
    getStepErrors
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}