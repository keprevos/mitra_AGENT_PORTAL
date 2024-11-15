import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingData {
  personal?: {
    title?: string;
    surname?: string;
    firstName?: string;
    maidenName?: string;
    email?: string;
    mobile?: string;
    address?: {
      street?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    };
    birthDate?: string;
    birthPlace?: string;
    birthCountry?: string;
    nationality?: string;
    taxResidence?: string;
    isUsCitizen?: boolean;
  };
  activity?: {
    legalForm?: string;
    siret?: string;
    companyName?: string;
    industryCode?: string;
    brandName?: string;
    address?: {
      street?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    };
    activityDescription?: string;
    clientLocation?: string;
    clientTypes?: string;
    lastTurnover?: string;
  };
  shareholders?: Array<{
    type: 'individual' | 'company';
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    nationality?: string;
    companyName?: string;
    registrationNumber?: string;
    ownershipPercentage: string;
  }>;
  documents?: {
    proofOfResidence?: FileList;
    identityDocument?: FileList;
    signature?: FileList;
    bankDetails?: FileList;
  };
}

interface OnboardingContextType {
  data: OnboardingData;
  updatePersonalInfo: (info: OnboardingData['personal']) => void;
  updateActivity: (info: OnboardingData['activity']) => void;
  updateShareholders: (info: OnboardingData['shareholders']) => void;
  updateDocuments: (info: OnboardingData['documents']) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>({});

  const updatePersonalInfo = (info: OnboardingData['personal']) => {
    setData(prev => ({ ...prev, personal: info }));
  };

  const updateActivity = (info: OnboardingData['activity']) => {
    setData(prev => ({ ...prev, activity: info }));
  };

  const updateShareholders = (info: OnboardingData['shareholders']) => {
    setData(prev => ({ ...prev, shareholders: info }));
  };

  const updateDocuments = (info: OnboardingData['documents']) => {
    setData(prev => ({ ...prev, documents: info }));
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updatePersonalInfo,
        updateActivity,
        updateShareholders,
        updateDocuments,
      }}
    >
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